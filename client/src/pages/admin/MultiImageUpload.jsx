import { useRef, useState } from "react";
import api from "../../lib/api.js";
import { FaCloudUploadAlt, FaTrash, FaImage } from "react-icons/fa";

export default function MultiImageUpload({ value = [], onChange }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  async function onPickFiles(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const fd = new FormData();
    files.forEach((f) => fd.append("images", f));

    setUploading(true);
    try {
      const { data } = await api.post("/upload/images", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const urls = (data.items || []).map((x) => x.url);
      onChange([...(value || []), ...urls]);
    } catch (err) {
      alert(err?.response?.data?.message || "Upload dështoi.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function removeAt(idx) {
    const next = value.filter((_, i) => i !== idx);
    onChange(next);
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <button
          type="button"
          className="admin-btn"
          style={{ width: "auto", padding: "10px 14px" }}
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          <FaCloudUploadAlt />
          {uploading ? "Duke uploaduar..." : "Ngarko foto"}
        </button>

        <div className="admin-help">Deri në 12 foto, max 8MB secila.</div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={onPickFiles}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 10,
          marginTop: 12,
        }}
      >
        {(value || []).length === 0 ? (
          <div className="admin-subtitle" style={{ gridColumn: "1 / -1" }}>
            <FaImage /> Asnjë foto ende.
          </div>
        ) : (
          value.map((url, idx) => (
            <div
              key={url + idx}
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: 12,
                overflow: "hidden",
                background: "#fff",
                position: "relative",
              }}
            >
              <img
                src={url}
                alt="foto"
                style={{ width: "100%", height: 110, objectFit: "cover", display: "block" }}
              />
              <button
                type="button"
                onClick={() => removeAt(idx)}
                title="Hiq"
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  border: "1px solid #e2e8f0",
                  background: "#fff",
                  borderRadius: 10,
                  padding: "6px 8px",
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 800,
                }}
              >
                <FaTrash />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
