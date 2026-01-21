import { useEffect, useState } from "react";
import api from "../lib/api.js";
import { fetchMe, getStoredUser, setStoredUser } from "../lib/auth.js";
import VehicleCard from "../components/layout/VehicleCard.jsx";

const getId = (v) => v?._id || v?.id || "";

export default function Profile() {
  const [me, setMe] = useState(getStoredUser());
  const [favorites, setFavorites] = useState([]);
  const [viewed, setViewed] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);

    const user = await fetchMe();
    setStoredUser(user);
    setMe(user);

    const favRes = await api.get("/users/favorites");
    const favList = (favRes.data.favorites || []).map((v) => ({
      ...v,
      _id: v._id || v.id,
    }));
    setFavorites(favList);

    const viewedRes = await api.get("/users/viewed");
    setViewed(viewedRes.data.viewed || []);

    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) return <div className="card">Duke ngarkuar profilin…</div>;

  return (
    <div className="grid">
      <aside className="card col-4">
        <h3>Profili</h3>
        <div style={{ fontWeight: 800 }}>{me?.name}</div>
        <div className="muted">{me?.email}</div>
      </aside>

      <section className="col-8">
        <div className="card" style={{ marginBottom: 14 }}>
          <h3>Favoritet</h3>

          {favorites.length === 0 ? (
            <div className="muted">Nuk ke favoritë ende.</div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(12, 1fr)",
                gap: 14,
              }}
            >
              {favorites.map((v) => (
                <div key={getId(v)} style={{ gridColumn: "span 6" }}>
                  <VehicleCard v={v} isFav={true} onFavChanged={load} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h3>Të hapura së fundmi</h3>

          {viewed.length === 0 ? (
            <div className="muted">Nuk ke hapur asnjë mjet ende.</div>
          ) : (
            viewed.map((v, i) => (
              <div key={i} className="muted">
                {new Date(v.lastViewedAt).toLocaleString()}
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
