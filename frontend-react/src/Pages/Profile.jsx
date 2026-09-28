import React, { useState, useEffect, useRef } from "react";
import "./Profile.css";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { getProfile, updateProfileName, updateProfileAvatar } from "../services/userService";
import EditInterestsModal from "../components/EditInterestsModal";
import AvatarCropper from "../components/AvatarCropper";
import { toast } from "react-toastify";

import { IoPersonSharp } from "react-icons/io5";
import { MdMail } from "react-icons/md";
import { IoLanguageOutline } from "react-icons/io5";
import { FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { BsHeart, BsStarFill, BsCameraFill } from "react-icons/bs";

function formatCooldown(lastUpdated) {
  if (!lastUpdated) return null;
  const nextUpdate = new Date(lastUpdated);
  nextUpdate.setDate(nextUpdate.getDate() + 7);
  const diff = nextUpdate - new Date();
  if (diff <= 0) return null;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  if (days > 0) return `${days}d ${hours}h`;
  return `${hours}h`;
}

function Profile() {
  const navigate = useNavigate();
  const { user, interests, setInterests, favorites, updateUser } = useUser();

  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [profileInterests, setProfileInterests] = useState([]);
  const [totalFavorites, setTotalFavorites] = useState(0);
  const [reviewsCount, setReviewsCount] = useState(0);
  const [showEditModal, setShowEditModal] = useState(false);

  const [avatarUrl, setAvatarUrl] = useState(null);
  const [canUpdateName, setCanUpdateName] = useState(true);
  const [nameLastUpdatedAt, setNameLastUpdatedAt] = useState(null);

  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [nameError, setNameError] = useState("");
  const [nameLoading, setNameLoading] = useState(false);

  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarError, setAvatarError] = useState("");
  const [cropFile, setCropFile] = useState(null);
  const fileInputRef = useRef(null);

  const displayInterests = interests && interests.length > 0 ? interests : profileInterests;
  const displayFavoritesCount = favorites ? favorites.length : totalFavorites;
  const language = localStorage.getItem("appLanguage") || "en";

  const fetchProfile = async () => {
    if (!user?.id) return;
    try {
      const res = await getProfile(user.id);
      const profile = res.data;
      setProfileName(profile.name || user?.username || "");
      setProfileEmail(profile.email || user?.email || "");
      setProfileInterests(profile.interests || []);
      setTotalFavorites(profile.stats?.favoritesCount || 0);
      setReviewsCount(profile.stats?.reviewsCount || 0);
      setAvatarUrl(profile.avatarUrl || null);
      setCanUpdateName(profile.canUpdateName !== false);
      setNameLastUpdatedAt(profile.nameLastUpdatedAt || null);
      setNameInput(profile.name || user?.username || "");
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const handleInterestsSaved = (savedInterests) => {
    setInterests(savedInterests);
    setProfileInterests(savedInterests);
  };

  const handleSaveName = async () => {
    if (!user?.id) return;
    const trimmed = nameInput.trim();
    if (trimmed.length < 2) {
      setNameError("Name must be at least 2 characters");
      return;
    }
    setNameLoading(true);
    setNameError("");
    try {
      const res = await updateProfileName(user.id, trimmed);
      const profile = res.data;
      setProfileName(profile.name);
      setCanUpdateName(profile.canUpdateName);
      setNameLastUpdatedAt(profile.nameLastUpdatedAt);
      setEditingName(false);
      updateUser({ name: profile.name, username: profile.name });
      toast.success("Name updated successfully!");
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || "Failed to update name";
      setNameError(msg);
      toast.error(msg);
    } finally {
      setNameLoading(false);
    }
  };

  const handleCancelName = () => {
    setNameInput(profileName);
    setNameError("");
    setEditingName(false);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setAvatarError("Image must be under 5MB");
      toast.error("Image must be under 5MB");
      return;
    }
    setAvatarError("");
    setCropFile(file);
    e.target.value = "";
  };

  const handleCroppedAvatar = async (croppedBase64) => {
    setCropFile(null);
    if (!user?.id) return;
    setAvatarLoading(true);
    setAvatarError("");
    try {
      const res = await updateProfileAvatar(user.id, croppedBase64);
      const newAvatarUrl = res.data.avatarUrl;
      setAvatarUrl(newAvatarUrl);
      updateUser({ avatarUrl: newAvatarUrl });
      toast.success("Avatar updated successfully!");
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || "Failed to upload avatar";
      setAvatarError(msg);
      toast.error(msg);
    } finally {
      setAvatarLoading(false);
    }
  };

  const cooldownText = formatCooldown(nameLastUpdatedAt);

  return (
    <main className="layout">
        <aside className="sidebar card">
          <div className="profile-head">
            <div
              className="profile-icon"
              style={{
                position: "relative",
                cursor: "pointer",
                overflow: "hidden",
                padding: 0,
                width: "64px",
                height: "64px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: avatarUrl ? "transparent" : "var(--color-primary)",
              }}
              onClick={handleAvatarClick}
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="avatar"
                  style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
                />
              ) : (
                <span style={{ fontSize: "24px", fontWeight: "bold" }}>
                  {user ? (user.username || user.name || "").charAt(0).toUpperCase() : "U"}
                </span>
              )}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(0,0,0,0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: 0,
                  transition: "opacity 0.2s",
                  borderRadius: "50%",
                }}
                className="avatar-overlay"
              >
                <BsCameraFill color="#fff" size={20} />
              </div>
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileSelect}
            />
            <div className="profile-meta">
              <div className="profile-name">{profileName || (user ? user.username || user.name : "User Name")}</div>
              <div className="profile-email">{profileEmail || (user ? user.email : "user@email.com")}</div>
              {avatarLoading && <span className="text-muted" style={{ fontSize: "12px" }}>Uploading...</span>}
              {avatarError && <span style={{ color: "var(--color-danger)", fontSize: "12px" }}>{avatarError}</span>}
            </div>
          </div>

          <div className="menu">
            <button className="menu-item active">
              <span>Overview</span>
              <span className="chev">›</span>
            </button>
            <button className="menu-item" onClick={() => navigate("/reviews")}>
              <span>My Reviews</span>
            </button>
            <button className="menu-item" onClick={() => navigate("/settings")}>
              <span>Settings</span>
            </button>
          </div>
        </aside>

        <section className="content">
          <div className="card section">
            <div className="section-title">Profile Statistics</div>

            <div className="stats">
              <div className="stat card-mini">
                <div className="stat-icon"><BsHeart size={28} color="var(--color-danger)" /></div>
                <div className="stat-value">{displayFavoritesCount}</div>
                <div className="stat-label">Favorites</div>
              </div>

              <div className="stat card-mini">
                <div className="stat-icon"><BsStarFill size={28} color="gold" /></div>
                <div className="stat-value">{reviewsCount}</div>
                <div className="stat-label">Reviews</div>
              </div>
            </div>
          </div>

          <div className="card section">
            <div className="section-title" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>My Interests</span>
              <button
                className="btn-outline-custom"
                style={{ padding: "6px 14px", fontSize: "var(--font-size-sm)", fontWeight: "var(--font-weight-medium)" }}
                onClick={() => setShowEditModal(true)}
              >
                <FaEdit style={{ marginRight: "6px" }} />
                Edit
              </button>
            </div>
            <div className="chips">
              {displayInterests && displayInterests.length > 0 ? (
                displayInterests.map((interest, index) => (
                  <span className="chip" key={index}>
                    {interest.name || interest.category_name || interest}
                  </span>
                ))
              ) : (
                <span className="no-data">No interests selected</span>
              )}
            </div>
          </div>

          <div className="card section">
            <div className="section-title">Account Information</div>

            <div className="form-grid">
              {/* Name Field — editable with cooldown */}
              <div className="field">
                <label>Name</label>
                {editingName ? (
                  <div>
                    <div
                      className="input-row"
                      style={{
                        border: "1px solid var(--color-border)",
                        borderRadius: "var(--radius-md)",
                        padding: "8px 12px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <IoPersonSharp />
                      <input
                        type="text"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: "var(--font-size-sm)" }}
                        disabled={nameLoading}
                      />
                      {nameLoading ? (
                        <span
                          style={{
                            width: "16px",
                            height: "16px",
                            border: "2px solid var(--color-border)",
                            borderTopColor: "var(--color-success)",
                            borderRadius: "50%",
                            animation: "spin 0.6s linear infinite",
                            display: "inline-block",
                          }}
                        />
                      ) : (
                        <button
                          onClick={handleSaveName}
                          disabled={nameLoading}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-success)" }}
                          title="Save"
                        >
                          <FaSave />
                        </button>
                      )}
                      <button
                        onClick={handleCancelName}
                        disabled={nameLoading}
                        style={{ background: "none", border: "none", cursor: nameLoading ? "not-allowed" : "pointer", color: "var(--color-danger)", opacity: nameLoading ? 0.5 : 1 }}
                        title="Cancel"
                      >
                        <FaTimes />
                      </button>
                    </div>
                    <p
                      style={{
                        color: "var(--color-text-muted)",
                        fontSize: "var(--font-size-xs)",
                        marginTop: "6px",
                        fontStyle: "italic",
                      }}
                    >
                      You can only change your name once every 7 days.
                    </p>
                    {nameError && (
                      <p style={{ color: "var(--color-danger)", fontSize: "var(--font-size-xs)", marginTop: "4px" }}>{nameError}</p>
                    )}
                  </div>
                ) : (
                  <div>
                    <div
                      className="input-row read-only-box"
                      style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span className="ico"><IoPersonSharp /></span>
                        <span>{profileName || (user ? user.username || user.name : "No name available")}</span>
                      </div>
                      <button
                        className="btn-outline-custom"
                        onClick={() => setEditingName(true)}
                        disabled={!canUpdateName}
                        style={{
                          padding: "4px 10px",
                          fontSize: "var(--font-size-xs)",
                          opacity: canUpdateName ? 1 : 0.5,
                          cursor: canUpdateName ? "pointer" : "not-allowed",
                        }}
                        title={canUpdateName ? "Edit name" : `Next update in ${cooldownText}`}
                      >
                        <FaEdit style={{ marginRight: "4px" }} />
                        {canUpdateName ? "Edit" : cooldownText ? `Wait ${cooldownText}` : "Edit"}
                      </button>
                    </div>
                    {!canUpdateName && cooldownText && (
                      <p
                        style={{
                          color: "var(--color-text-muted)",
                          fontSize: "var(--font-size-xs)",
                          marginTop: "6px",
                          fontStyle: "italic",
                        }}
                      >
                        You can only change your name once every 7 days.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Email Field — read-only */}
              <div className="field">
                <label>Email</label>
                <div
                  className="input-row read-only-box"
                  style={{
                    opacity: 0.75,
                    cursor: "not-allowed",
                    background: "var(--color-surface-raised)",
                  }}
                  title="Email cannot be changed"
                >
                  <span className="ico"><MdMail /></span>
                  <span>{profileEmail || (user ? user.email : "No email available")}</span>
                  <span
                    style={{
                      fontSize: "var(--font-size-xs)",
                      color: "var(--color-text-muted)",
                      marginLeft: "auto",
                      padding: "2px 8px",
                      borderRadius: "var(--radius-sm)",
                      background: "var(--color-border-subtle)",
                    }}
                  >
                    Read-only
                  </span>
                </div>
              </div>

              <div className="field">
                <label>Language</label>
                <div className="input-row read-only-box">
                  <span className="ico"><IoLanguageOutline /></span>
                  <span>{language === "ar" ? "Arabic" : "English"}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <EditInterestsModal
          show={showEditModal}
          onClose={() => setShowEditModal(false)}
          currentInterests={displayInterests}
          userId={user?.id}
          onSave={handleInterestsSaved}
        />

        {cropFile && (
          <AvatarCropper
            file={cropFile}
            onCancel={() => setCropFile(null)}
            onSave={handleCroppedAvatar}
          />
        )}
    </main>
  );
}

export default Profile;
