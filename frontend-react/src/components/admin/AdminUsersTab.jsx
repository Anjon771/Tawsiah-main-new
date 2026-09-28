import { useEffect, useState } from "react";
import { Table, Spinner, Button, Badge, Modal, Form } from "react-bootstrap";
import { BsExclamationTriangle, BsChatLeftText, BsStarFill, BsStar } from "react-icons/bs";
import { getAllUsers, suspendUser, banUser, unblockUser } from "../../services/userService";
import { getRatingsByEvent, deleteRating } from "../../services/ratingService";
import { usePlaces } from "../../contexts/PlacesContext";
import EmptyState from "../EmptyState";
import { toast } from "react-toastify";

function AdminUsersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [allComments, setAllComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [suspendDays, setSuspendDays] = useState(7);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const { places } = usePlaces();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await getAllUsers();
        setUsers(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to load users:", err);
        setError("Failed to load users from server.");
        toast.error("Failed to load users from server.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchAllComments = async () => {
      if (places.length === 0) return;
      try {
        setCommentsLoading(true);
        const results = await Promise.all(
          places.map((p) =>
            getRatingsByEvent(p.id)
              .then((r) => r.data)
              .catch(() => [])
          )
        );
        const flat = results.flat().filter((r) => r.comment);
        setAllComments(flat);
      } catch (err) {
        console.error("Failed to load comments:", err);
        toast.error("Failed to load comments.");
      } finally {
        setCommentsLoading(false);
      }
    };
    fetchAllComments();
  }, [places]);

  const handleSuspend = async () => {
    try {
      await suspendUser(selectedUser.id, suspendDays);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === selectedUser.id ? { ...u, status: 'SUSPENDED' } : u
        )
      );
      toast.success(`User suspended for ${suspendDays} days`);
      setShowSuspendModal(false);
    } catch (err) {
      toast.error("Failed to suspend user");
    }
  };

  const handleBan = async (userId) => {
    if (!window.confirm("Permanently ban this user?")) return;
    try {
      await banUser(userId);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status: 'BANNED' } : u))
      );
      toast.success("User banned permanently");
    } catch (err) {
      toast.error("Failed to ban user");
    }
  };

  const handleUnblock = async (userId) => {
    try {
      await unblockUser(userId);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status: 'ACTIVE' } : u))
      );
      toast.success("User unblocked");
    } catch (err) {
      toast.error("Failed to unblock user");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await deleteRating(commentId);
      setAllComments((prev) => prev.filter((c) => c.id !== commentId));
      toast.success("Comment deleted");
    } catch (err) {
      toast.error("Failed to delete comment");
      console.error(err);
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      ACTIVE:    { bg: 'success', label: 'Active' },
      SUSPENDED: { bg: 'warning', label: 'Suspended' },
      BANNED:    { bg: 'danger',  label: 'Banned' },
    };
    const s = map[status] || map.ACTIVE;
    return <Badge bg={s.bg}>{s.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="success" />
        <p className="mt-2" style={{ color: "var(--color-text-secondary)", fontSize: "var(--font-size-sm)" }}>
          Loading users...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        icon={<BsExclamationTriangle size={48} color="var(--color-text-muted)" />}
        title="Something went wrong"
        subtitle={error}
        actionLabel="Try Again"
        onAction={() => window.location.reload()}
      />
    );
  }

  return (
    <div>
      <h4 className="mb-4">User Management</h4>

      <Table responsive bordered hover>
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id || user.email}>
              <td>{user.id}</td>
              <td>{user.name || user.username}</td>
              <td>{user.email}</td>
              <td>
                <Badge bg={user.role === 'ADMIN' ? 'primary' : 'secondary'}>
                  {user.role}
                </Badge>
              </td>
              <td>{getStatusBadge(user.status || 'ACTIVE')}</td>
              <td>
                <div className="d-flex gap-2">
                  {user.status !== 'BANNED' && user.role !== 'ADMIN' && (
                    <>
                      <Button
                        variant="outline-warning"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowSuspendModal(true);
                        }}
                      >
                        Suspend
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleBan(user.id)}
                      >
                        Ban
                      </Button>
                    </>
                  )}
                  {(user.status === 'SUSPENDED' || user.status === 'BANNED') && (
                    <Button
                      variant="outline-success"
                      size="sm"
                      onClick={() => handleUnblock(user.id)}
                    >
                      Unblock
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Suspend Modal */}
      <Modal show={showSuspendModal} onHide={() => setShowSuspendModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Suspend User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Suspending: <strong>{selectedUser?.name || selectedUser?.username}</strong></p>
          <Form.Group>
            <Form.Label>Suspension Duration (days)</Form.Label>
            <Form.Select
              value={suspendDays}
              onChange={(e) => setSuspendDays(Number(e.target.value))}
            >
              <option value={1}>1 day</option>
              <option value={3}>3 days</option>
              <option value={7}>7 days</option>
              <option value={14}>14 days</option>
              <option value={30}>30 days</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSuspendModal(false)}>
            Cancel
          </Button>
          <Button variant="warning" onClick={handleSuspend}>
            Confirm Suspend
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Comments Section */}
      <div className="mt-5">
        <h5 style={{ fontSize: "var(--font-size-lg)", fontWeight: "var(--font-weight-bold)", color: "var(--color-text-primary)", marginBottom: "var(--space-4)" }}>
          User Comments
        </h5>

        {commentsLoading && (
          <div className="text-center py-4">
            <Spinner animation="border" size="sm" variant="success" />
            <p className="mt-2" style={{ color: "var(--color-text-secondary)", fontSize: "var(--font-size-sm)" }}>
              Loading comments...
            </p>
          </div>
        )}

        {!commentsLoading && allComments.length === 0 && (
          <EmptyState icon={<BsChatLeftText size={48} color="var(--color-text-muted)" />} title="No comments yet" subtitle="Comments will appear here once users leave reviews." />
        )}

        {!commentsLoading && allComments.length > 0 && (
          <div style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", overflow: "hidden", background: "var(--color-surface)", boxShadow: "var(--shadow-sm)" }}>
            <Table responsive hover className="mb-0">
              <thead style={{ background: "var(--color-surface-raised)" }}>
                <tr>
                  <th style={{ fontSize: "var(--font-size-sm)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-text-secondary)", padding: "var(--space-3) var(--space-4)", borderBottom: "1px solid var(--color-border-subtle)" }}>User</th>
                  <th style={{ fontSize: "var(--font-size-sm)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-text-secondary)", padding: "var(--space-3) var(--space-4)", borderBottom: "1px solid var(--color-border-subtle)" }}>Place</th>
                  <th style={{ fontSize: "var(--font-size-sm)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-text-secondary)", padding: "var(--space-3) var(--space-4)", borderBottom: "1px solid var(--color-border-subtle)" }}>Rating</th>
                  <th style={{ fontSize: "var(--font-size-sm)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-text-secondary)", padding: "var(--space-3) var(--space-4)", borderBottom: "1px solid var(--color-border-subtle)" }}>Comment</th>
                  <th style={{ fontSize: "var(--font-size-sm)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-text-secondary)", padding: "var(--space-3) var(--space-4)", borderBottom: "1px solid var(--color-border-subtle)" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {allComments.map((c, i) => (
                  <tr key={c.id || i}>
                    <td style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-primary)", padding: "var(--space-3) var(--space-4)", borderBottom: "1px solid var(--color-border-subtle)" }}>{c.userName || "Anonymous"}</td>
                    <td style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-primary)", padding: "var(--space-3) var(--space-4)", borderBottom: "1px solid var(--color-border-subtle)" }}>{places.find((p) => p.id === c.eventId)?.name || c.eventId}</td>
                    <td style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-primary)", padding: "var(--space-3) var(--space-4)", borderBottom: "1px solid var(--color-border-subtle)" }}>
                      <span style={{ display: 'inline-flex', gap: '2px', color: '#FFC107' }}>
                        {Array.from({ length: c.rating || 0 }).map((_, i) => (
                          <BsStarFill key={`f-${i}`} />
                        ))}
                        {Array.from({ length: 5 - (c.rating || 0) }).map((_, i) => (
                          <BsStar key={`e-${i}`} />
                        ))}
                      </span>
                    </td>
                    <td style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-primary)", padding: "var(--space-3) var(--space-4)", borderBottom: "1px solid var(--color-border-subtle)", maxWidth: "400px" }}>{c.comment}</td>
                    <td style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-primary)", padding: "var(--space-3) var(--space-4)", borderBottom: "1px solid var(--color-border-subtle)" }}>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteComment(c.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminUsersTab;
