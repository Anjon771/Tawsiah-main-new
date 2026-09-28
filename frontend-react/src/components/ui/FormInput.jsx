import React from "react";

function FormInput({
  label,
  icon,
  type = "text",
  value,
  onChange,
  placeholder,
  helper,
  error,
  disabled = false,
  required = false,
  style = {},
  inputStyle = {},
  ...rest
}) {
  const hasError = Boolean(error);
  const isValid = Boolean(value) && !hasError && !disabled;

  const borderColor = hasError
    ? "var(--color-danger)"
    : isValid
    ? "var(--color-success)"
    : "var(--color-border)";

  const shadowColor = hasError
    ? "rgba(230, 57, 70, 0.15)"
    : isValid
    ? "rgba(45, 106, 79, 0.15)"
    : "rgba(45, 106, 79, 0.08)";

  return (
    <div style={{ marginBottom: "var(--space-3)", ...style }} {...rest}>
      {label && (
        <label
          style={{
            display: "block",
            fontWeight: "var(--font-weight-semibold)",
            marginBottom: "var(--space-1)",
            fontSize: "var(--font-size-sm)",
            color: "var(--color-text-primary)",
          }}
        >
          {label}
          {required && (
            <span style={{ color: "var(--color-danger)", marginLeft: "2px" }}>*</span>
          )}
        </label>
      )}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          background: disabled ? "var(--color-surface-raised)" : "var(--color-surface)",
          borderRadius: "var(--radius-md)",
          padding: "10px 14px",
          border: `1.5px solid ${borderColor}`,
          boxShadow: `0 0 0 3px ${shadowColor}`,
          transition: "border-color var(--transition-fast), box-shadow var(--transition-fast)",
          opacity: disabled ? 0.7 : 1,
        }}
      >
        {icon && (
          <span style={{ color: hasError ? "var(--color-danger)" : "var(--color-text-muted)", flexShrink: 0 }}>
            {icon}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            background: "transparent",
            fontSize: "var(--font-size-sm)",
            color: "var(--color-text-primary)",
            width: "100%",
            ...inputStyle,
          }}
        />
      </div>
      {helper && !hasError && (
        <p
          style={{
            margin: "var(--space-1) 0 0 4px",
            fontSize: "var(--font-size-xs)",
            color: "var(--color-text-muted)",
            fontStyle: "italic",
          }}
        >
          {helper}
        </p>
      )}
      {hasError && (
        <p
          style={{
            margin: "var(--space-1) 0 0 4px",
            fontSize: "var(--font-size-xs)",
            color: "var(--color-danger)",
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}

export default FormInput;
