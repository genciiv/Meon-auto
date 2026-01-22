import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../lib/api.js";
import {
  FaMapMarkerAlt,
  FaRoad,
  FaGasPump,
  FaCogs,
  FaEuroSign,
  FaArrowLeft,
} from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";

const WA_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || ""; // p.sh. 3556xxxxxxx (pa +)

function buildWaLink({ number, text }) {
  const n = String(number || "").replace(/[^\d]/g, "");
  const t = encodeURIComponent(text || "");
  if (!n) return "";
  return `https://wa.me/${n}?text=${t}`;
}

export default function VehicleDetails() {
  const { id } = useParams();

  const [vehicle, setVehicle] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [lead, setLead] = useState({ name: "", phone: "", message: "" });
  const [leadMsg, setLeadMsg] = useState({ type: "info", text: "" });
  const [sending, setSending] = useState(false);

  const backTo = useMemo(() => {
    if (!vehicle) return "/makina";
    return vehicle?.type === "truck" ? "/kamione" : "/makina";
  }, [vehicle]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setErr("");
      setVehicle(null);
      setActiveImg(0);

      try {
        const { data } = await api.get(`/vehicles/${id}`);
        const item = data?.item || data?.vehicle || data;

        const realId = item?._id || item?.id;
        if (!item || !realId) throw new Error("Mjeti nuk u gjet.");

        if (!cancelled) {
          setVehicle({ ...item, _id: item._id || item.id });
          setActiveImg(0);
        }
      } catch (e) {
        const msg =
          e?.response?.data?.message ||
          e?.message ||
          "Gabim gjatë ngarkimit të mjetit.";
        if (!cancelled) setErr(msg);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function createLead(source) {
    if (!vehicle?._id) return;

    try {
      await api.post("/leads", {
        vehicleId: vehicle._id,
        name: lead.name,
        phone: lead.phone,
        message: lead.message,
        source,
        pageUrl: window.location.href,
      });
    } catch (e) {
      // mos e blloko UI-n për WhatsApp; thjesht log
      console.warn("Lead save failed:", e?.response?.data || e?.message);
    }
  }

  async function onSendForm(e) {
    e.preventDefault();
    setLeadMsg({ type: "info", text: "" });

    if (!String(lead.name).trim()) {
      setLeadMsg({ type: "error", text: "Shkruaj emrin." });
      return;
    }
    if (!String(lead.phone).trim()) {
      setLeadMsg({ type: "error", text: "Shkruaj numrin e telefonit." });
      return;
    }

    setSending(true);
    try {
      await api.post("/leads", {
        vehicleId: vehicle._id,
        name: lead.name,
        phone: lead.phone,
        message: lead.message,
        source: "form",
        pageUrl: window.location.href,
      });

      setLeadMsg({ type: "success", text: "U dërgua! Do të të kontaktojmë sa më shpejt." });
      setLead({ name: "", phone: "", message: "" });
    } catch (e2) {
      setLeadMsg({
        type: "error",
        text: e2?.response?.data?.message || "Gabim gjatë dërgimit.",
      });
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <div className="page">
        <div className="vd-loading">Duke u ngarkuar…</div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="page">
        <div className="vd-error">
          <div className="vd-error-title">Nuk u ngarkua mjeti</div>
          <div className="vd-error-text">{err}</div>

          <div style={{ marginTop: 12 }}>
            <Link className="vd-back" to="/makina">
              <FaArrowLeft /> Kthehu te lista
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const images = Array.isArray(vehicle?.images) ? vehicle.images : [];
  const cover = images[activeImg] || images[0] || "";

  const waText = `Përshëndetje! Jam i interesuar për: ${vehicle?.title || "mjet"} (${vehicle?.price ?? ""}€). Link: ${window.location.href}`;
  const waLink = buildWaLink({ number: WA_NUMBER, text: waText });

  return (
    <div className="page vehicle-details">
      <div className="vd-topbar">
        <Link className="vd-back" to={backTo}>
          <FaArrowLeft /> Kthehu
        </Link>
      </div>

      <div className="vd-layout">
        {/* LEFT: gallery */}
        <div className="gallery">
          <div className="gallery-main">
            {cover ? (
              <img src={cover} alt={vehicle?.title || "mjet"} />
            ) : (
              <div className="gallery-placeholder">Pa foto</div>
            )}
          </div>

          {images.length > 1 && (
            <div className="gallery-thumbs">
              {images.map((img, i) => (
                <button
                  key={`${img}-${i}`}
                  type="button"
                  className={`thumb ${i === activeImg ? "active" : ""}`}
                  onClick={() => setActiveImg(i)}
                  title="Shiko foton"
                >
                  <img src={img} alt="thumb" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: info + actions */}
        <div className="vehicle-info">
          <div>
            <h1 className="vehicle-title">{vehicle.title}</h1>

            {vehicle.price != null && (
              <div className="vehicle-price">
                <FaEuroSign /> {Number(vehicle.price).toLocaleString()} €
              </div>
            )}

            <div className="vehicle-meta">
              <span><FaMapMarkerAlt /> {vehicle.city || "—"}</span>
              <span><FaRoad /> {vehicle.mileageKm != null ? `${Number(vehicle.mileageKm).toLocaleString()} km` : "—"}</span>
              <span><FaGasPump /> {vehicle.fuel || "—"}</span>
              <span><FaCogs /> {vehicle.gearbox || "—"}</span>
            </div>

            <div className="vehicle-description">
              {vehicle.description || "Pa përshkrim."}
            </div>
          </div>

          <div className="vd-actions">
            {waLink ? (
              <a
                className="vd-wa-btn"
                href={waLink}
                target="_blank"
                rel="noreferrer"
                onClick={() => createLead("whatsapp")}
              >
                <FaWhatsapp /> Kontakto në WhatsApp
              </a>
            ) : (
              <div className="vd-note">
                Vendos numrin te <b>VITE_WHATSAPP_NUMBER</b> në .env të client.
              </div>
            )}

            <div className="vd-note">
              * Klikimi i WhatsApp ruan automatikisht lead në admin.
            </div>

            {/* FORM */}
            <form className="vd-form" onSubmit={onSendForm}>
              <div className="vd-form-title">Kontakto me formular</div>

              {leadMsg.text ? (
                <div className={`vd-form-msg ${leadMsg.type}`}>
                  {leadMsg.text}
                </div>
              ) : null}

              <label className="vd-label">Emri</label>
              <input
                className="vd-input"
                value={lead.name}
                onChange={(e) => setLead({ ...lead, name: e.target.value })}
                placeholder="p.sh. Genci"
              />

              <label className="vd-label">Telefoni</label>
              <input
                className="vd-input"
                value={lead.phone}
                onChange={(e) => setLead({ ...lead, phone: e.target.value })}
                placeholder="p.sh. 06xxxxxxx"
              />

              <label className="vd-label">Mesazhi</label>
              <textarea
                className="vd-textarea"
                value={lead.message}
                onChange={(e) => setLead({ ...lead, message: e.target.value })}
                placeholder="Shkruaj pyetjen tënde…"
              />

              <button className="vd-submit" disabled={sending} type="submit">
                {sending ? "Duke dërguar..." : "Dërgo"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp */}
      {waLink ? (
        <a className="wa-float" href={waLink} target="_blank" rel="noreferrer" onClick={() => createLead("whatsapp")}>
          <FaWhatsapp /> WhatsApp
        </a>
      ) : null}
    </div>
  );
}
