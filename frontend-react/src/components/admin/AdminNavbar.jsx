import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AiOutlineDashboard, AiOutlineSafety } from "react-icons/ai";

function AdminNavbar({ activeKey, onTabChange }) {
  const tabs = [
    { key: "places", label: "Places", icon: AiOutlineDashboard },
    { key: "add", label: "Add", icon: AiOutlineDashboard },
    { key: "featured", label: "Featured", icon: AiOutlineDashboard },
    { key: "other", label: "Users", icon: AiOutlineSafety },
  ];

  return (
    <Navbar
      expand="lg"
      sticky="top"
      style={{
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        backgroundColor: "rgba(255,255,255,0.95)",
        borderBottom: "1px solid var(--color-border-subtle)",
        boxShadow: "var(--shadow-sm)",
        marginBottom: "var(--space-5)",
        zIndex: "var(--z-dropdown)",
        padding: "var(--space-3) 0",
      }}
    >
      <Container fluid className="px-4">
        <Navbar.Brand
          as={Link}
          to="/home"
          style={{
            color: "var(--color-primary)",
            fontWeight: "var(--font-weight-bold)",
            fontSize: "var(--font-size-lg)",
          }}
        >
          <AiOutlineDashboard className="me-2" /> Admin Dashboard
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="adminNavbarNav" />
        <Navbar.Collapse id="adminNavbarNav">
          <Nav className="me-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeKey === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => onTabChange(tab.key)}
                  className={`admin-tab ${isActive ? "active" : ""}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-2)",
                    fontSize: "var(--font-size-sm)",
                  }}
                >
                  <Icon /> {tab.label}
                </button>
              );
            })}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AdminNavbar;
