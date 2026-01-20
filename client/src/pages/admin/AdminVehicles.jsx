import { useEffect, useState } from "react";
import api from "../../lib/api.js";
import Toast from "../../components/layout/Toast.jsx";
import MultiImageUpload from "./MultiImageUpload.jsx";


import {
  FaCarSide,
  FaTruckMoving,
  FaRegEdit,
  FaTrash,
  FaEuroSign,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaRoad,
  FaGasPump,
  FaCogs,
  FaStar,
  FaTag,
} from "react-icons/fa";

const empty = {
  _id: null,
  type: "car",
  title: "",
  make: "",
  model: "",
  year: "",
  price: "",
  mileageKm: "",
  fuel: "",
  gearbox: "",
  city: "",
  truckType: "",
  description: "",
  images: [],           // ✅ tani është array
  featured: false,
  featuredUntil: "",
  status: "active",
};

function toInputDateTime(dt) {
  if (!dt) return "";
  const d = new Date(dt);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

export default function AdminVehicles() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [msg, setMsg] = useState({ type: "info", text: "" });
  const [loading, setLoading] = useState(false);

  async function load() {
    const { data } = await api.get("/admin/vehicles");
    setItems(data.items || []);
  }

  useEffect(() => {
    load();
  }, []);

  function resetForm() {
    setForm(empty);
    setMsg({ type: "info", text: "" });
  }

  function editItem(v) {
    setMsg({ type: "info", text: "" });
    setForm({
      _id: v._id,
      type: v.type || "car",
      title: v.title || "",
      make: v.make || "",
      model: v.model || "",
      year: v.year ?? "",
      price: v.price ?? "",
      mileageKm: v.mileageKm ?? "",
      fuel: v.fuel || "",
      gearbox: v.gearbox || "",
      city: v.city || "",
      truckType: v.truckType || "",
      description: v.description || "",
      images: v.images || [],                 // ✅
      featured: !!v.featured,
      featuredUntil: toInputDateTime(v.featuredUntil),
      status: v.status || "active",
    });
  }

  async function save(e) {
    e.preventDefault();
    setMsg({ type: "info", text: "" });

    if (!String(form.title).trim()) {
      setMsg({ type: "error", text: "Titulli është i detyrueshëm." });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        type: form.type,
        title: form.title,
        make: form.make,
        model: form.model,
        year: form.year ? Number(form.year) : null,
        price: form.price ? Number(form.price) : null,
        mileageKm: form.mileageKm ? Number(form.mileageKm) : null,
        fuel: form.fuel,
        gearbox: form.gearbox,
        city: form.city,
        truckType: form.truckType,
        description: form.description,
        images: form.images || [],            // ✅
        featured: !!form.featured,
        featuredUntil: form.featuredUntil
          ? new Date(form.featuredUntil).toISOString()
          : null,
        status: form.status,
      };

      if (form._id) {
        await api.put(`/admin/vehicles/${form._id}`, payload);
        setMsg({ type: "success", text: "U përditësua me sukses!" });
      } else {
        await api.post("/admin/vehicles", payload);
        setMsg({ type: "success", text: "U shtua me sukses!" });
      }

      await load();
      resetForm();
    } catch (err) {
      setMsg({
        type: "error",
        text: err?.response?.data?.message || "Gabim gjatë ruajtjes.",
      });
    } finally {
      setLoading(false);
    }
  }

  async function removeVehicle(id) {
    if (!confirm("Ta fshijmë këtë mjet?")) return;
    await api.delete(`/admin/vehicles/${id}`);
    await load();
    if (form._id === id) resetForm();
  }

  return (
    <div className="admin-page">
      {/* FORM */}
      <section className="admin-card">
        <div className="admin-top">
          <h3 className="admin-title">
            {form._id ? "Edito mjet" : "Shto mjet"}
          </h3>
          <button type="button" className="admin-reset" onClick={resetForm}>
            Reset
          </button>
        </div>

        <div className="admin-subtitle">
          Plotëso të dhënat e mjetit. Fotot ngarkohen direkt (Cloudinary).
        </div>

        <Toast type={msg.type} message={msg.text} />

        <form onSubmit={save} className="admin-grid">
          {/* Type */}
          <div>
            <label className="admin-label">Lloji</label>
            <div className="admin-field">
              {form.type === "car" ? <FaCarSide /> : <FaTruckMoving />}
              <select
                className="admin-select"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="car">Makina</option>
                <option value="truck">Kamion</option>
              </select>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="admin-label">Status</label>
            <div className="admin-field">
              <FaTag />
              <select
                className="admin-select"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="active">active</option>
                <option value="sold">sold</option>
                <option value="hidden">hidden</option>
              </select>
            </div>
          </div>

          {/* Title */}
          <div className="admin-col-full">
            <label className="admin-label">Titulli *</label>
            <div className="admin-field">
              <FaCarSide />
              <input
                className="admin-input"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="p.sh. VW Jetta 2012, Automat, 2.0"
              />
            </div>
          </div>

          <div>
            <label className="admin-label">Marka</label>
            <div className="admin-field">
              <FaTag />
              <input
                className="admin-input"
                value={form.make}
                onChange={(e) => setForm({ ...form, make: e.target.value })}
                placeholder="VW"
              />
            </div>
          </div>

          <div>
            <label className="admin-label">Modeli</label>
            <div className="admin-field">
              <FaTag />
              <input
                className="admin-input"
                value={form.model}
                onChange={(e) => setForm({ ...form, model: e.target.value })}
                placeholder="Jetta"
              />
            </div>
          </div>

          <div>
            <label className="admin-label">Viti</label>
            <div className="admin-field">
              <FaCalendarAlt />
              <input
                className="admin-input"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                placeholder="2012"
              />
            </div>
          </div>

          <div>
            <label className="admin-label">Çmimi (€)</label>
            <div className="admin-field">
              <FaEuroSign />
              <input
                className="admin-input"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="6500"
              />
            </div>
          </div>

          <div>
            <label className="admin-label">KM</label>
            <div className="admin-field">
              <FaRoad />
              <input
                className="admin-input"
                value={form.mileageKm}
                onChange={(e) =>
                  setForm({ ...form, mileageKm: e.target.value })
                }
                placeholder="230000"
              />
            </div>
          </div>

          <div>
            <label className="admin-label">Qyteti</label>
            <div className="admin-field">
              <FaMapMarkerAlt />
              <input
                className="admin-input"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="Fier"
              />
            </div>
          </div>

          <div>
            <label className="admin-label">Karburanti</label>
            <div className="admin-field">
              <FaGasPump />
              <input
                className="admin-input"
                value={form.fuel}
                onChange={(e) => setForm({ ...form, fuel: e.target.value })}
                placeholder="Naftë / Benzinë / Hybrid"
              />
            </div>
          </div>

          <div>
            <label className="admin-label">Transmisioni</label>
            <div className="admin-field">
              <FaCogs />
              <input
                className="admin-input"
                value={form.gearbox}
                onChange={(e) =>
                  setForm({ ...form, gearbox: e.target.value })
                }
                placeholder="Manual / Automatik"
              />
            </div>
          </div>

          {form.type === "truck" && (
            <div className="admin-col-full">
              <label className="admin-label">Lloji i kamionit</label>
              <div className="admin-field">
                <FaTruckMoving />
                <input
                  className="admin-input"
                  value={form.truckType}
                  onChange={(e) =>
                    setForm({ ...form, truckType: e.target.value })
                  }
                  placeholder="Trailer / Bus / etc"
                />
              </div>
            </div>
          )}

          <div className="admin-col-full admin-check">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            />
            <FaStar /> Featured (Promovuar)
          </div>

          <div className="admin-col-full">
            <label className="admin-label">Featured deri (opsionale)</label>
            <div className="admin-field">
              <FaCalendarAlt />
              <input
                type="datetime-local"
                className="admin-input"
                value={form.featuredUntil}
                onChange={(e) =>
                  setForm({ ...form, featuredUntil: e.target.value })
                }
              />
            </div>
          </div>

          {/* ✅ UPLOAD FOTO */}
          <div className="admin-col-full">
            <label className="admin-label">Foto (Upload)</label>
            <MultiImageUpload
              value={form.images}
              onChange={(imgs) => setForm({ ...form, images: imgs })}
            />
          </div>

          <div className="admin-col-full">
            <label className="admin-label">Përshkrimi</label>
            <textarea
              className="admin-textarea"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Përshkrim i shkurtër, i qartë, profesional..."
            />
          </div>

          <div className="admin-col-full">
            <button className="admin-btn" disabled={loading}>
              {loading
                ? "Duke ruajtur..."
                : form._id
                ? "Ruaj ndryshimet"
                : "Shto mjet"}
            </button>
          </div>
        </form>
      </section>

      {/* LIST */}
      <section className="admin-card">
        <div className="admin-top">
          <h3 className="admin-title">Lista e mjeteve</h3>
          <span className="admin-badge">{items.length} total</span>
        </div>

        <div className="admin-subtitle">
          “Edito” mbush formën, “Fshi” e heq mjetin.
        </div>

        {items.length === 0 ? (
          <div className="admin-subtitle">S’ka mjete ende.</div>
        ) : (
          <div className="admin-list">
            {items.map((v) => (
              <div key={v._id} className="admin-item">
                <div className="admin-item-top">
                  <div>
                    <div className="admin-item-title">{v.title}</div>
                    <div className="admin-item-meta">
                      {v.type} • {v.city || "—"} •{" "}
                      {v.price ? `${v.price}€` : "-"} • {v.status}{" "}
                      {v.featured ? (
                        <span className="admin-badge featured" style={{ marginLeft: 8 }}>
                          <FaStar /> Featured
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="admin-actions">
                    <button
                      type="button"
                      className="admin-action-btn"
                      onClick={() => editItem(v)}
                      title="Edito"
                    >
                      <FaRegEdit />
                    </button>
                    <button
                      type="button"
                      className="admin-action-btn"
                      onClick={() => removeVehicle(v._id)}
                      title="Fshi"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>

                {v.images?.[0] ? (
                  <div style={{ marginTop: 10 }}>
                    <img
                      src={v.images[0]}
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
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
