import React from "react";
import { Button, Spinner } from "react-bootstrap";

function LoadingButton({
  loading = false,
  loadingText = "Loading...",
  children,
  disabled,
  variant = "primary",
  onClick,
  type = "button",
  className = "",
  style = {},
  ...rest
}) {
  return (
    <Button
      type={type}
      variant={variant}
      onClick={onClick}
      disabled={disabled || loading}
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        minWidth: "120px",
        ...style,
      }}
      {...rest}
    >
      {loading && (
        <Spinner
          as="span"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
          style={{ width: "16px", height: "16px", borderWidth: "2px" }}
        />
      )}
      <span>{loading ? loadingText : children}</span>
    </Button>
  );
}

export default LoadingButton;
