import "../styles/vehicle-details.css";

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
  FaWhatsapp,
} from "react-icons/fa";

const WHATSAPP_NUMBER = "355690000000"; // ✅ vendos numrin tend pa + (p.sh. 35569xxxxxxx)

function buildWhatsAppLink({ phone, vehicle, pageUrl }) {
  const title = vehicle?.title || "Mjet";
  const price =
    vehicle?.price != null ? `${Number(vehicle.price).toLocaleString()} €` : "—";
  const city = vehicle?.city || "—";

  const text = `Pershendetje! Jam i interesuar per: ${title}
Cmimi: ${price}
Qyteti: ${city}
Link: ${pageUrl}`;

  const encoded = encodeURIComponent(text);
  return `https://wa.me/${phone}?text=${encoded}`;
}

export default function VehicleDetails() {
  const { id } = useParams();

  const [vehicle, setVehicle] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

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

        // prano 3 formatet:
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
  const pageUrl = typeof window !== "undefined" ? window.location.href : "";
  const waLink = buildWhatsAppLink({
    phone: WHATSAPP_NUMBER,
    vehicle,
    pageUrl,
  });

  return (
    <div className="page vehicle-details">
      {/* Floating WhatsApp */}
      <a
        className="wa-float"
        href={waLink}
        target="_blank"
        rel="noreferrer"
        title="Kontakto në WhatsApp"
      >
        <FaWhatsapp />
        <span>WhatsApp</span>
      </a>

      <div className="vd-topbar">
        <Link className="vd-back" to={backTo}>
          <FaArrowLeft /> Kthehu
        </Link>
      </div>

      <div className="vd-layout">
        {/* LEFT: Gallery */}
        <div className="gallery">
          <div className="gallery-main">
            {cover ? (
              <img
                src={cover}
                alt={vehicle?.title || "mjet"}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
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
                  <img
                    src={img}
                    alt="thumb"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Info */}
        <div className="vehicle-info">
          <h1 className="vehicle-title">{vehicle.title}</h1>

          {vehicle.price != null && (
            <div className="vehicle-price">
              <FaEuroSign /> {Number(vehicle.price).toLocaleString()} €
            </div>
          )}

          <div className="vehicle-meta">
            <span>
              <FaMapMarkerAlt /> {vehicle.city || "—"}
            </span>
            <span>
              <FaRoad />{" "}
              {vehicle.mileageKm != null
                ? `${Number(vehicle.mileageKm).toLocaleString()} km`
                : "—"}
            </span>
            <span>
              <FaGasPump /> {vehicle.fuel || "—"}
            </span>
            <span>
              <FaCogs /> {vehicle.gearbox || "—"}
            </span>
          </div>

          <div className="vehicle-description">
            {vehicle.description || "Pa përshkrim."}
          </div>

          <div className="vd-actions">
            <a
              className="vd-wa-btn"
              href={waLink}
              target="_blank"
              rel="noreferrer"
            >
              <FaWhatsapp /> Kontakto në WhatsApp
            </a>
          </div>

          <div className="vd-note">
            * Mesazhi në WhatsApp vjen automatikisht me titull, çmim dhe link.
          </div>
        </div>
      </div>
    </div>
  );
}
