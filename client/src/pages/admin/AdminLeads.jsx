import { useEffect, useState } from "react";
import api from "../../lib/api.js";

export default function AdminLeads() {
  const [items, setItems] = useState([]);

  async function load() {
    const { data } = await api.get("/admin/leads");
    setItems(data.items || []);
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>Kontaktet (Leads)</h2>
      <div className="muted" style={{ marginTop: -6, marginBottom: 12 }}>
        Këtu shfaqen mesazhet që userat dërgojnë.
      </div>

      {items.length === 0 ? (
        <div className="muted">S’ka kontakte ende.</div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {items.map((l) => (
            <div key={l._id} className="card" style={{ boxShadow: "none" }}>
              <div style={{ fontWeight: 900 }}>
                {l.userId?.name || "User"} ({l.userId?.email || "-"})
              </div>
              <div className="muted">
                Mjeti: <b>{l.vehicleId?.title || "-"}</b> • {l.vehicleId?.price ? `${l.vehicleId.price}€` : "-"} • {l.vehicleId?.city || "-"}
              </div>
              <div style={{ marginTop: 8 }}>{l.message}</div>
              <div className="muted" style={{ marginTop: 8 }}>
                Tel: {l.phone || "-"} • Kanal: {l.channel} • {new Date(l.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
