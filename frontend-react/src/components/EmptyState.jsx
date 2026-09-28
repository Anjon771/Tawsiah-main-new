import { Button } from "react-bootstrap";

function EmptyState({ icon, title, subtitle, actionLabel, onAction }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--space-8)",
        textAlign: "center",
        color: "var(--color-text-muted)",
      }}
    >
      <div style={{ marginBottom: "var(--space-4)", display: "flex", justifyContent: "center" }}>
        {icon}
      </div>
      <h4 style={{ color: "var(--color-text-primary)", marginBottom: "var(--space-2)" }}>
        {title}
      </h4>
      <p style={{ marginBottom: "var(--space-5)", maxWidth: "320px" }}>{subtitle}</p>
      {actionLabel && (
        <Button className="btn-primary-custom" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;
