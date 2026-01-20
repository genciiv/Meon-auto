import { Link, useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart, FaMapMarkerAlt } from "react-icons/fa";
import api from "../../lib/api.js";

export default function VehicleCard({ v, isFav = false, onFavChanged }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("autoMeon_token");

  async function toggleFav() {
    if (!token) {
      navigate("/hyr");
      return;
    }
    await api.post(`/users/favorites/${v._id}`);
    onFavChanged && onFavChanged();
  }

  const img =
    v.images?.[0] ||
    "https://via.placeholder.com/800x500?text=Auto+Meon";

  return (
    <div className="card">
      <Link to={`/mjeti/${v._id}`}>
        <img
          src={img}
          alt={v.title}
          style={{
            width: "100%",
            height: 180,
            objectFit: "cover",
            borderRadius: 12,
            marginBottom: 10,
          }}
        />

        <h4 style={{ margin: "6px 0" }}>{v.title}</h4>

        <div className="muted" style={{ display: "flex", gap: 6 }}>
          <FaMapMarkerAlt /> {v.city || "—"}
        </div>

        <div style={{ fontWeight: 800, marginTop: 6 }}>
          {v.price ? `${v.price.toLocaleString()} €` : "Çmimi: -"}
        </div>
      </Link>

      <button
        onClick={toggleFav}
        className="btn btn-ghost"
        style={{ width: "100%", marginTop: 10 }}
      >
        {isFav ? <FaHeart /> : <FaRegHeart />}{" "}
        {isFav ? "Në favoritë" : "Shto favorit"}
      </button>
    </div>
  );
}
