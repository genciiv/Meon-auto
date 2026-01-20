import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { FaHeart, FaRegHeart, FaWhatsapp, FaPhoneAlt } from "react-icons/fa";
import api from "../lib/api";
import Toast from "../components/layout/Toast";

export default function VehicleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("autoMeon_token");

  const [vehicle, setVehicle] = useState(null);
  const [isFav, setIsFav] = useState(false);
  const [msg, setMsg] = useState({ type: "info", text: "" });
  const [contactForm, setContactForm] = useState({ message: "", phone: "" });

  async function load() {
    // Ky request, nese ka token, regjistron automatikisht "viewed" ne backend
    const { data } = await api.get(`/vehicles/${id}`);
    setVehicle(data.vehicle);

    if (token) {
      const favRes = await api.get("/users/favorites");
      const ids = (favRes.data.favorites || []).map((v) => v._id);
      setIsFav(ids.includes(id));
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function toggleFav() {
    if (!token) {
      navigate("/hyr");
      return;
    }
    await api.post(`/users/favorites/${id}`);
    // refresh status
    const favRes = await api.get("/users/favorites");
    const ids = (favRes.data.favorites || []).map((v) => v._id);
    setIsFav(ids.includes(id));
  }

  async function sendContact(channel = "form") {
    if (!token) {
      navigate("/hyr");
      return;
    }
    setMsg({ type: "info", text: "" });

    try {
      await api.post("/users/contact", {
        vehicleId: id,
        message: contactForm.message || "Jam i interesuar per kete mjet. Me kontaktoni, ju lutem.",
        phone: contactForm.phone,
        channel,
      });
      setMsg({ type: "success", text: "Mesazhi u dërgua! Admini do të të kontaktojë." });
      setContactForm({ message: "", phone: "" });
    } catch (err) {
      setMsg({ type: "error", text: err?.response?.data?.message || "Nuk u dërgua mesazhi." });
    }
  }

  if (!vehicle) return <div className="card">Duke ngarkuar...</div>;

  const img = vehicle.images?.[0] || "https://via.placeholder.com/1200x700?text=Auto+Meon";

  return (
    <div className="grid">
      <section className="card col-8">
        <div
          style={{
            borderRadius: 16,
            overflow: "hidden",
            border: "1px solid rgba(15,23,42,.10)",
            marginBottom: 14,
          }}
        >
          <img src={img} alt={vehicle.title} style={{ width: "100%", height: 340, objectFit: "cover" }} />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", gap: 14, flexWrap: "wrap" }}>
          <div>
            <h2 style={{ margin: 0 }}>{vehicle.title}</h2>
            <div className="muted" style={{ marginTop: 6 }}>
              {vehicle.city || "—"} • {vehicle.year || "—"} • {vehicle.mileageKm ? `${vehicle.mileageKm.toLocaleString()} km` : "—"}
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={{ fontWeight: 900, fontSize: 22, color: "#2563eb" }}>
              {vehicle.price ? `${vehicle.price.toLocaleString()} €` : "Çmimi: -"}
            </div>
            <div className="muted">{vehicle.fuel || "—"} • {vehicle.gearbox || "—"}</div>
          </div>
        </div>

        <hr style={{ borderColor: "rgba(15,23,42,.10)", margin: "14px 0" }} />

        <h3>Pershkrimi</h3>
        <p className="muted">{vehicle.description || "Pa pershkrim."}</p>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
          <button className="btn btn-ghost" type="button" onClick={toggleFav}>
            {isFav ? <FaHeart /> : <FaRegHeart />} {isFav ? "Në favoritë" : "Shto te Favoritet"}
          </button>

          {!token ? (
            <Link className="btn btn-primary" to="/hyr">
              <FaWhatsapp /> Kontakto (Hyr)
            </Link>
          ) : (
            <>
              <button className="btn btn-primary" type="button" onClick={() => sendContact("whatsapp")}>
                <FaWhatsapp /> Kontakto
              </button>
              <button className="btn btn-ghost" type="button" onClick={() => sendContact("form")}>
                <FaPhoneAlt /> Dërgo mesazh
              </button>
            </>
          )}
        </div>
      </section>

      <aside className="card col-4">
        <h3 style={{ marginTop: 0 }}>Kontakti</h3>
        <div className="muted" style={{ marginTop: -6 }}>
          Kontakti është i disponueshëm vetëm për përdorues të regjistruar.
        </div>

        <div style={{ height: 10 }} />
        <Toast type={msg.type} message={msg.text} />

        <label className="label">Telefon (opsionale)</label>
        <input
          className="input"
          value={contactForm.phone}
          onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
          placeholder="p.sh. +355..."
          disabled={!token}
        />

        <div style={{ height: 10 }} />

        <label className="label">Mesazhi</label>
        <textarea
          className="textarea"
          rows={5}
          value={contactForm.message}
          onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
          placeholder="Shkruaj mesazhin..."
          disabled={!token}
        />

        <div style={{ height: 12 }} />

        <button
          className="btn btn-primary"
          type="button"
          style={{ width: "100%", justifyContent: "center" }}
          onClick={() => sendContact("form")}
          disabled={!token}
        >
          Dërgo
        </button>

        {!token && (
          <div className="muted" style={{ marginTop: 12 }}>
            <Link to="/hyr" style={{ color: "#2563eb", fontWeight: 900 }}>Hyr / Regjistrohu</Link> për të kontaktuar.
          </div>
        )}
      </aside>
    </div>
  );
}
