import { useState, useRef, useEffect } from "react";
import { Nav, Navbar, Container, Badge } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  BsPersonCircle,
  BsCart3,
  BsGear,
  BsBoxArrowRight,
  BsShieldLock,
  BsCompass,
} from "react-icons/bs";
import { useUser } from "../contexts/UserContext";
import { useOrder } from "../contexts/OrderContext";

function Header() {
  const { user, logout } = useUser();
  const { orderItems } = useOrder();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setDropdownOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
  };

  const navItems = [
    { label: "Home", path: "/home" },
    { label: "Explore", path: "/explore" },
    { label: "Recommendations", path: "/recommendations" },
    { label: "Masar", path: "/masar" },
    { label: "favorite", path: "/favorite" },
    { label: "map", path: "/map" },
  ];

  return (
    <>
      <Navbar
        expand="lg"
        sticky="top"
        style={{
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          backgroundColor: "rgba(255,255,255,0.92)",
          borderBottom: "1px solid var(--color-border-subtle)",
          boxShadow: "var(--shadow-sm)",
          padding: "var(--space-3) 0",
          zIndex: "var(--z-dropdown)",
        }}
      >
        <Container>
          <Navbar.Brand
            as={Link}
            to={"/home"}
            style={{
              color: "var(--color-primary)",
              fontWeight: "var(--font-weight-bold)",
              fontSize: "var(--font-size-lg)",
            }}
          >
            Tawsiah
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            {/* nav items */}
            <Nav className="me-auto" variant="underline">
              {navItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Nav.Link
                    key={item.path}
                    as={Link}
                    to={item.path}
                    className="nav-link-custom"
                    style={{
                      color: isActive
                        ? "var(--color-primary)"
                        : "var(--color-text-secondary)",
                      fontWeight: isActive
                        ? "var(--font-weight-semibold)"
                        : "var(--font-weight-medium)",
                      borderBottom: isActive
                        ? "2px solid var(--color-primary)"
                        : "2px solid transparent",
                      paddingBottom: "4px",
                      marginRight: "var(--space-4)",
                      transition: "color var(--transition-fast)",
                    }}
                  >
                    {item.label}
                  </Nav.Link>
                );
              })}
            </Nav>

            <Nav className="align-items-center gap-3">
              {/* Cart Icon */}
              <Nav.Link
                as={Link}
                to="/order"
                className="position-relative"
                style={{ color: "var(--color-text-secondary)" }}
              >
                <BsCart3 size={28} />
                {orderItems.length > 0 && (
                  <Badge
                    bg="success"
                    pill
                    style={{
                      position: "absolute",
                      top: "-6px",
                      right: "-10px",
                      fontSize: "var(--font-size-xs)",
                      minWidth: "20px",
                      height: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "var(--color-primary)",
                    }}
                  >
                    {orderItems.length}
                  </Badge>
                )}
              </Nav.Link>

              {/* User Section */}
              {user ? (
                <div ref={dropdownRef} style={{ position: "relative" }}>
                  {/* Avatar Button */}
                  <button
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      background: dropdownOpen
                        ? "var(--color-primary-subtle)"
                        : "transparent",
                      border: dropdownOpen
                        ? "1.5px solid var(--color-primary)"
                        : "1.5px solid var(--color-border)",
                      borderRadius: "999px",
                      padding: "6px 14px 6px 8px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {user?.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt="avatar"
                        style={{
                          width: "30px",
                          height: "30px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          border: `2px solid ${dropdownOpen ? "var(--color-primary)" : "transparent"}`,
                        }}
                      />
                    ) : (
                      <BsPersonCircle
                        size={30}
                        color={
                          dropdownOpen
                            ? "var(--color-primary)"
                            : "var(--color-text-secondary)"
                        }
                      />
                    )}
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: dropdownOpen
                          ? "var(--color-primary)"
                          : "var(--color-text-primary)",
                        maxWidth: "120px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {user.username || user.name}
                    </span>
                    <span
                      style={{
                        fontSize: "10px",
                        color: "var(--color-text-secondary)",
                        transform: dropdownOpen
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                        transition: "transform 0.2s ease",
                      }}
                    >
                      ▼
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div
                      style={{
                        position: "absolute",
                        top: "calc(100% + 10px)",
                        right: 0,
                        background: "#ffffff",
                        border: "1px solid var(--color-border-subtle)",
                        borderRadius: "14px",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                        minWidth: "200px",
                        zIndex: 2000,
                        overflow: "hidden",
                        animation: "fadeInDown 0.15s ease",
                      }}
                    >
                      {/* User Info Header */}
                      <div
                        style={{
                          padding: "16px",
                          borderBottom: "1px solid var(--color-border-subtle)",
                          background: "var(--color-primary-subtle)",
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                        }}
                      >
                        {user?.avatarUrl ? (
                          <img
                            src={user.avatarUrl}
                            alt="avatar"
                            style={{
                              width: "44px",
                              height: "44px",
                              borderRadius: "50%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <BsPersonCircle
                            size={44}
                            color="var(--color-text-secondary)"
                          />
                        )}
                        <div>
                          <p
                            style={{
                              margin: 0,
                              fontWeight: 600,
                              fontSize: "14px",
                              color: "var(--color-text-primary)",
                            }}
                          >
                            {user.username || user.name}
                          </p>
                          <p
                            style={{
                              margin: 0,
                              fontSize: "12px",
                              color: "var(--color-text-secondary)",
                            }}
                          >
                            {user.email}
                          </p>
                          {user.role === "ADMIN" && (
                            <Badge
                              bg="success"
                              className="mt-1"
                              style={{ fontSize: "10px" }}
                            >
                              Admin
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div style={{ padding: "8px 0" }}>
                        {/* Profile */}
                        <button
                          onClick={() => {
                            navigate("/profile");
                            setDropdownOpen(false);
                          }}
                          style={dropdownItemStyle}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background =
                              "var(--color-primary-subtle)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background = "transparent")
                          }
                        >
                          <BsPersonCircle size={16} />
                          <span>Profile</span>
                        </button>

                        {/* Settings */}
                        <button
                          onClick={() => {
                            navigate("/settings");
                            setDropdownOpen(false);
                          }}
                          style={dropdownItemStyle}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background =
                              "var(--color-primary-subtle)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background = "transparent")
                          }
                        >
                          <BsGear size={16} />
                          <span>Settings</span>
                        </button>

                        {/* Admin Panel — ADMIN only */}
                        {user.role === "ADMIN" && (
                          <button
                            onClick={() => {
                              navigate("/admin");
                              setDropdownOpen(false);
                            }}
                            style={dropdownItemStyle}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.background =
                                "var(--color-primary-subtle)")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.background = "transparent")
                            }
                          >
                            <BsShieldLock size={16} />
                            <span>Admin Panel</span>
                          </button>
                        )}

                        {/* Divider */}
                        <div
                          style={{
                            height: "1px",
                            background: "var(--color-border-subtle)",
                            margin: "6px 0",
                          }}
                        />

                        {/* Logout */}
                        <button
                          onClick={handleLogout}
                          style={{
                            ...dropdownItemStyle,
                            color: "#e63946",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#fff5f5";
                            e.currentTarget.style.color = "#e63946";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.color = "#e63946";
                          }}
                        >
                          <BsBoxArrowRight size={16} />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Nav.Link
                  as={Link}
                  to={"/login"}
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  <BsPersonCircle size={36} />
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Dropdown animation */}
      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}

// Shared dropdown item style
const dropdownItemStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  width: "100%",
  padding: "10px 16px",
  background: "transparent",
  border: "none",
  fontSize: "14px",
  color: "var(--color-text-primary)",
  cursor: "pointer",
  textAlign: "left",
  transition: "background 0.15s ease",
  fontWeight: 400,
};

export default Header;
