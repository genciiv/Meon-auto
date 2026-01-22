import { Link, useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart, FaMapMarkerAlt, FaStar } from "react-icons/fa";
import api from "../../lib/api.js";

export default function VehicleCard({ v, isFav = false, onFavChanged }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("autoMeon_token");

  async function toggleFav(e) {
    e?.preventDefault();
    e?.stopPropagation();

    if (!token) {
      navigate("/hyr");
      return;
    }
    await api.post(`/users/favorites/${v._id}`);
    onFavChanged && onFavChanged();
  }

  const img =
    v.images?.[0] ||
    "https://via.placeholder.com/900x600?text=Auto+Meon";

  const priceText =
    v.price != null ? `${Number(v.price).toLocaleString()} €` : "Çmimi: -";

  return (
    <Link to={`/mjeti/${v._id}`} className="vcard">
      <div className="vcard-media">
        <img src={img} alt={v.title || "mjet"} />
        {v.featured ? (
          <span className="vcard-badge">
            <FaStar /> Featured
          </span>
        ) : null}

        <button
          type="button"
          className="vcard-fav"
          onClick={toggleFav}
          title={isFav ? "Hiq nga favoritët" : "Shto në favoritë"}
        >
          {isFav ? <FaHeart /> : <FaRegHeart />}
        </button>
      </div>

      <div className="vcard-body">
        <div className="vcard-title">{v.title || "Pa titull"}</div>

        <div className="vcard-sub">
          <span className="vcard-city">
            <FaMapMarkerAlt /> {v.city || "—"}
          </span>
          <span className="vcard-make">
            {v.make || "—"} {v.model || ""}
          </span>
        </div>

        <div className="vcard-price">{priceText}</div>

        <div className="vcard-meta">
          <span>{v.year ?? "—"}</span>
          <span>{v.fuel || "—"}</span>
          <span>{v.gearbox || "—"}</span>
          <span>
            {v.mileageKm != null ? `${Number(v.mileageKm).toLocaleString()} km` : "—"}
          </span>
        </div>
      </div>
    </Link>
  );
}
