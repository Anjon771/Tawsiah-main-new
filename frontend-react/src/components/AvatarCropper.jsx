import React, { useState, useRef, useCallback } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

function AvatarCropper({ file, onCancel, onSave }) {
  const [crop, setCrop] = useState({ unit: "%", width: 90, aspect: 1 });
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);

  const onImageLoad = useCallback((e) => {
    const { width, height } = e.currentTarget;
    const cropSize = Math.min(width, height) * 0.9;
    const x = (width - cropSize) / 2;
    const y = (height - cropSize) / 2;
    setCrop({
      unit: "px",
      width: cropSize,
      height: cropSize,
      x,
      y,
    });
  }, []);

  const generateCroppedImage = useCallback(() => {
    if (!imgRef.current || !completedCrop?.width || !completedCrop?.height) {
      return null;
    }
    const image = imgRef.current;
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      256,
      256
    );

    return canvas.toDataURL("image/jpeg", 0.92);
  }, [completedCrop]);

  const handleSave = () => {
    const cropped = generateCroppedImage();
    if (cropped) {
      onSave(cropped);
    }
  };

  const previewUrl = file ? URL.createObjectURL(file) : null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "24px",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          maxWidth: "480px",
          width: "100%",
          padding: "24px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}
      >
        <h3 style={{ margin: "0 0 16px", fontSize: "18px", fontWeight: 600 }}>
          Crop Avatar
        </h3>

        <div
          style={{
            maxHeight: "360px",
            overflow: "auto",
            borderRadius: "12px",
            background: "var(--color-surface-raised)",
            marginBottom: "20px",
          }}
        >
          {previewUrl && (
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={1}
              circularCrop
              keepSelection
            >
              <img
                ref={imgRef}
                src={previewUrl}
                alt="Preview"
                onLoad={onImageLoad}
                style={{ maxWidth: "100%", display: "block" }}
              />
            </ReactCrop>
          )}
        </div>

        <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
          <button
            onClick={onCancel}
            style={{
              padding: "8px 18px",
              borderRadius: "8px",
              border: "1px solid var(--color-border)",
              background: "#fff",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!completedCrop?.width}
            style={{
              padding: "8px 18px",
              borderRadius: "8px",
              border: "none",
              background: "var(--color-primary)",
              color: "#fff",
              cursor: completedCrop?.width ? "pointer" : "not-allowed",
              fontSize: "14px",
              fontWeight: 600,
              opacity: completedCrop?.width ? 1 : 0.5,
            }}
          >
            Save Avatar
          </button>
        </div>
      </div>
    </div>
  );
}

export default AvatarCropper;
