import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BsGlobe, BsEnvelope, BsPerson, BsBoxArrowRight } from "react-icons/bs";
import { useUser } from "../contexts/UserContext";
import { toast } from "react-toastify";
import "./Settings.css";

function Settings() {
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const emailNotifications = localStorage.getItem("emailNotifications") === "true";

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = 'en';
  }, [user, navigate]);

  const handleEmailToggle = () => {
    const newValue = !emailNotifications;
    localStorage.setItem("emailNotifications", JSON.stringify(newValue));
    toast.success(newValue ? "Email notifications enabled" : "Email notifications disabled");
  };

  const handleLogout = () => {
    logout();
    toast.info("Logged out successfully");
  };

  if (!user) {
    return null;
  }

  return (
    <main className="settings-layout">
      <aside className="settings-sidebar settings-card">
        <div className="settings-user-box">
          <div className="settings-avatar">
            {user.username ? user.username.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="settings-user-name">{user.username}</div>
          <div className="settings-user-email">{user.email}</div>
        </div>

        <div className="settings-menu">
          <button
            className="settings-menu-item"
            onClick={() => navigate("/profile")}
          >
            <span>Overview</span>
          </button>

          <button
            className="settings-menu-item"
            onClick={() => navigate("/reviews")}
          >
            <span>My Reviews</span>
          </button>

          <button className="settings-menu-item active">
            <span>Settings</span>
            <span className="settings-arrow">›</span>
          </button>
        </div>
      </aside>

      <section className="settings-content">
        <div className="settings-card settings-section">
          <h2 className="settings-section-title">General Settings</h2>

          <div className="settings-row">
            <div className="settings-row-left">
              <div className="settings-icon"><BsGlobe size={24} color="var(--color-primary)" /></div>
              <div>
                <div className="settings-label">Language</div>
                <div className="settings-subtitle">Choose your preferred language</div>
              </div>
            </div>

            <div className="settings-row-right">
              <span>English</span>

              <button
                className="switch"
                type="button"
                disabled
              >
                <span className="switch-thumb"></span>
              </button>

              <span>Arabic</span>
            </div>
          </div>

          <div className="settings-row">
            <div className="settings-row-left">
              <div className="settings-icon"><BsEnvelope size={24} color="var(--color-primary)" /></div>
              <div>
                <div className="settings-label">Email Notifications</div>
                <div className="settings-subtitle">Receive updates about new attractions</div>
              </div>
            </div>

            <div className="settings-row-right">
              <button
                className={`switch ${emailNotifications ? "active" : ""}`}
                onClick={handleEmailToggle}
                type="button"
              >
                <span className="switch-thumb"></span>
              </button>
            </div>
          </div>

          <div className="settings-row">
            <div className="settings-row-left">
              <div className="settings-icon"><BsPerson size={24} color="var(--color-primary)" /></div>
              <div>
                <div className="settings-label">Account Type</div>
                <div className="settings-subtitle">Standard User</div>
              </div>
            </div>
          </div>
        </div>

        <div className="settings-card settings-section">
          <h3 className="settings-section-title small">Account Actions</h3>

          <button className="logout-btn" onClick={handleLogout} type="button">
            <BsBoxArrowRight size={18} style={{ marginRight: "8px" }} />
            Log Out
          </button>

          <p className="logout-note">You will be redirected to the login page</p>
        </div>
      </section>
    </main>
  );
}

export default Settings;
