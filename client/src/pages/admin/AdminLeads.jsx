import { useEffect, useState } from "react";
import api from "../../lib/api.js";

const STATUS = ["new", "contacted", "closed"];

export default function AdminLeads() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function load() {
    setLoading(true);
    setMsg("");
    try {
      const params = {};
      if (status) params.status = status;
      if (q.trim()) params.q = q.trim();

      const { data } = await api.get("/admin/leads", { params });
      setItems(data.items || []);
    } catch (e) {
      setMsg(e?.response?.data?.message || "Gabim gjatë ngarkimit.");
    } finally {
      setLoading(false);
    }
  }

  async function setLeadStatus(id, newStatus) {
    try {
      await api.patch(`/admin/leads/${id}`, { status: newStatus });
      await load();
    } catch (e) {
      setMsg(e?.response?.data?.message || "Gabim gjatë përditësimit.");
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="admin-page">
      <section className="admin-card">
        <div className="admin-top">
          <h3 className="admin-title">Leads</h3>
          <button className="admin-reset" type="button" onClick={load}>
            Rifresko
          </button>
        </div>

        <div className="admin-subtitle">
          Këtu shfaqen kontaktet nga WhatsApp dhe forma e kontaktit.
        </div>

        {msg ? <div className="admin-subtitle" style={{ color: "#991b1b", fontWeight: 800 }}>{msg}</div> : null}

        <div className="admin-grid" style={{ marginTop: 12 }}>
          <div>
            <label className="admin-label">Status</label>
            <select className="admin-select" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">Të gjitha</option>
              {STATUS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="admin-label">Kërko</label>
            <input
              className="admin-input"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="emër / tel / mesazh"
            />
          </div>

          <div className="admin-col-full">
            <button className="admin-btn" type="button" onClick={load} disabled={loading}>
              {loading ? "Duke ngarkuar..." : "Filtro"}
            </button>
          </div>
        </div>
      </section>

      <section className="admin-card">
        <div className="admin-top">
          <h3 className="admin-title">Lista</h3>
          <span className="admin-badge">{items.length} total</span>
        </div>

        <div className="admin-subtitle">Kliko statusin për ta ndryshuar.</div>

        <div className="admin-list">
          {items.length === 0 ? (
            <div className="admin-subtitle">S’ka leads.</div>
          ) : (
            items.map((x) => {
              const v = x.vehicleId;
              const cover = v?.images?.[0];

              return (
                <div key={x._id} className="admin-item">
                  <div className="admin-item-top" style={{ alignItems: "flex-start" }}>
                    <div style={{ minWidth: 0 }}>
                      <div className="admin-item-title" style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                        <span>{x.name || "Pa emër"}</span>
                        <span className="admin-badge" style={{ textTransform: "lowercase" }}>
                          {x.source}
                        </span>
                        <span className={`admin-badge ${x.status === "new" ? "featured" : ""}`}>
                          {x.status}
                        </span>
                      </div>

                      <div className="admin-item-meta" style={{ marginTop: 6 }}>
                        Tel: <b>{x.phone || "—"}</b> •{" "}
                        {new Date(x.createdAt).toLocaleString()}
                      </div>

                      <div className="admin-item-meta" style={{ marginTop: 6 }}>
                        {x.message ? x.message : "Pa mesazh."}
                      </div>

                      {v ? (
                        <div className="admin-item-meta" style={{ marginTop: 8 }}>
                          Mjeti: <b>{v.title}</b> • {v.city || "—"} •{" "}
                          {v.price != null ? `${Number(v.price).toLocaleString()}€` : "—"}
                        </div>
                      ) : null}
                    </div>

                    <div className="admin-actions" style={{ flexWrap: "wrap", justifyContent: "flex-end" }}>
                      {STATUS.map((s) => (
                        <button
                          key={s}
                          type="button"
                          className="admin-action-btn"
                          onClick={() => setLeadStatus(x._id, s)}
                          style={{
                            borderColor: x.status === s ? "#2563eb" : undefined,
                            fontWeight: 900,
                          }}
                          title={`Vendos ${s}`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {cover ? (
                    <div style={{ marginTop: 10 }}>
                      <img
                        src={cover}
                        alt="cover"
                        style={{
                          width: "100%",
                          height: 140,
                          objectFit: "cover",
                          borderRadius: 14,
                          border: "1px solid #eef2f7",
                        }}
                      />
                    </div>
                  ) : null}

                  {x.pageUrl ? (
                    <div className="admin-item-meta" style={{ marginTop: 10 }}>
                      Link:{" "}
                      <a href={x.pageUrl} target="_blank" rel="noreferrer">
                        hap
                      </a>
                    </div>
                  ) : null}
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
