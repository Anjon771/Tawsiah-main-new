function SkeletonCard() {
  return (
    <div
      style={{
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        background: "var(--color-surface)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div className="skeleton" style={{ height: "200px" }} />
      <div style={{ padding: "var(--space-4)" }}>
        <div
          className="skeleton"
          style={{
            height: "18px",
            width: "70%",
            marginBottom: "8px",
            borderRadius: "4px",
          }}
        />
        <div
          className="skeleton"
          style={{
            height: "14px",
            width: "40%",
            marginBottom: "8px",
            borderRadius: "4px",
          }}
        />
        <div
          className="skeleton"
          style={{ height: "14px", width: "90%", borderRadius: "4px" }}
        />
      </div>
    </div>
  );
}

export default SkeletonCard;
