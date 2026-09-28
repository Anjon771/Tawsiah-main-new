import { useState } from "react";
import { Container, Row, Col, Alert } from "react-bootstrap";
import AdminNavbar from "../components/admin/AdminNavbar";
import PlacesList from "../components/admin/PlacesList";
import FeaturedPlacesManager from "../components/admin/FeaturedPlacesManager";
import AddPlaceTab from "../components/admin/AddPlaceTab";
import AddEventModal from "../components/admin/AddEventModal";
import EditPlaceModal from "../components/admin/EditPlaceModal";
import AdminUsersTab from "../components/admin/AdminUsersTab";

function Admin() {
  const [activeTab, setActiveTab] = useState("places");
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPlace, setEditingPlace] = useState(null);

  const handleAddEvent = () => {
    setShowAddEventModal(true);
  };

  const handleEditPlace = (place) => {
    setEditingPlace(place);
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setShowAddEventModal(false);
    setShowEditModal(false);
    setEditingPlace(null);
  };

  return (
    <Container fluid className="mt-4 px-3 px-md-4">
      <AdminNavbar activeKey={activeTab} onTabChange={setActiveTab} />

      <Container fluid className="px-0">
        <Row className="justify-content-center">
          <Col lg={10} xl={8} xs={12} className="px-2 px-md-0">
            <Alert
              variant="info"
              className="mb-4"
              style={{
                background: "var(--color-primary-subtle)",
                color: "var(--color-primary-dark)",
                border: "1px solid var(--color-primary-light)",
                borderRadius: "var(--radius-md)",
                fontSize: "var(--font-size-sm)",
              }}
            >
              <strong>Admin Dashboard:</strong> Manage places from this page. Changes will reflect on the homepage and other sections.
            </Alert>

            {/* Places Tab */}
            {activeTab === "places" && (
              <Row>
                <Col>
                  <h3
                    style={{
                      fontSize: "var(--font-size-xl)",
                      fontWeight: "var(--font-weight-bold)",
                      color: "var(--color-text-primary)",
                      marginBottom: "var(--space-4)",
                    }}
                  >
                    Events & Places
                  </h3>
                  <PlacesList onEdit={handleEditPlace} />
                  <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center mt-4">
                    <button className="btn-outline-custom" onClick={handleAddEvent}>
                      + Add New Event
                    </button>
                  </div>
                </Col>
              </Row>
            )}

            {/* Add Tab */}
            {activeTab === "add" && (
              <Row>
                <Col>
                  <h3
                    style={{
                      fontSize: "var(--font-size-xl)",
                      fontWeight: "var(--font-weight-bold)",
                      color: "var(--color-text-primary)",
                      marginBottom: "var(--space-4)",
                    }}
                  >
                    Add New Place
                  </h3>
                  <AddPlaceTab onSuccess={() => setActiveTab("places")} />
                </Col>
              </Row>
            )}

            {/* Featured Tab */}
            {activeTab === "featured" && (
              <Row>
                <Col>
                  <h3
                    style={{
                      fontSize: "var(--font-size-xl)",
                      fontWeight: "var(--font-weight-bold)",
                      color: "var(--color-text-primary)",
                      marginBottom: "var(--space-4)",
                    }}
                  >
                    Featured Places
                  </h3>
                  <FeaturedPlacesManager />
                </Col>
              </Row>
            )}

            {/* Users Tab */}
            {activeTab === "other" && <AdminUsersTab />}
          </Col>
        </Row>
      </Container>

      <AddEventModal show={showAddEventModal} onClose={handleCloseModal} />
      <EditPlaceModal show={showEditModal} place={editingPlace} onClose={handleCloseModal} />
    </Container>
  );
}

export default Admin;
