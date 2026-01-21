import { useEffect, useState } from "react";
import api from "../lib/api.js";
import VehicleCard from "../components/layout/VehicleCard.jsx";

function getId(v) {
  return v?._id || v?.id || "";
}

export default function Cars() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    make: "",
    city: "",
    yearMin: "",
    yearMax: "",
    priceMin: "",
    priceMax: "",
    sort: "new",
  });

  const [favoritesSet, setFavoritesSet] = useState(new Set());

  async function loadFavorites() {
    const token = localStorage.getItem("autoMeon_token");
    if (!token) {
      setFavoritesSet(new Set());
      return;
    }
    const { data } = await api.get("/users/favorites");
    const ids = (data.favorites || []).map((v) => getId(v)).filter(Boolean);
    setFavoritesSet(new Set(ids));
  }

  async function load() {
    setLoading(true);

    const params = { type: "car", ...filters };
    Object.keys(params).forEach((k) => {
      if (params[k] === "") delete params[k];
    });

    const { data } = await api.get("/vehicles", { params });

    const list = (data.items || []).map((v) => ({
      ...v,
      _id: v._id || v.id, // unifikim
    }));

    setItems(list);
    setLoading(false);
  }

  useEffect(() => {
    load();
    loadFavorites();
  }, []);

  return (
    <div className="grid">
      <aside className="card col-4">
        <h3 style={{ marginTop: 0 }}>Filtra</h3>

        <label className="label">Marka</label>
        <input
          className="input"
          value={filters.make}
          onChange={(e) => setFilters({ ...filters, make: e.target.value })}
          placeholder="p.sh. Mercedes"
        />

        <div style={{ height: 10 }} />

        <label className="label">Qyteti</label>
        <input
          className="input"
          value={filters.city}
          onChange={(e) => setFilters({ ...filters, city: e.target.value })}
          placeholder="p.sh. Tiranë"
        />

        <div style={{ height: 10 }} />

        <label className="label">Viti (min/max)</label>
        <div style={{ display: "flex", gap: 10 }}>
          <input
            className="input"
            value={filters.yearMin}
            onChange={(e) => setFilters({ ...filters, yearMin: e.target.value })}
            placeholder="Min"
          />
          <input
            className="input"
            value={filters.yearMax}
            onChange={(e) => setFilters({ ...filters, yearMax: e.target.value })}
            placeholder="Max"
          />
        </div>

        <div style={{ height: 10 }} />

        <label className="label">Çmimi (min/max) €</label>
        <div style={{ display: "flex", gap: 10 }}>
          <input
            className="input"
            value={filters.priceMin}
            onChange={(e) =>
              setFilters({ ...filters, priceMin: e.target.value })
            }
            placeholder="Min"
          />
          <input
            className="input"
            value={filters.priceMax}
            onChange={(e) =>
              setFilters({ ...filters, priceMax: e.target.value })
            }
            placeholder="Max"
          />
        </div>

        <div style={{ height: 10 }} />

        <label className="label">Renditja</label>
        <select
          className="select"
          value={filters.sort}
          onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
        >
          <option value="new">Më të rejat</option>
          <option value="priceAsc">Çmimi në rritje</option>
          <option value="priceDesc">Çmimi në zbritje</option>
        </select>

        <div style={{ height: 14 }} />

        <button
          className="btn btn-primary"
          type="button"
          style={{ width: "100%", justifyContent: "center" }}
          onClick={() => load()}
        >
          Apliko filtrat
        </button>
      </aside>

      <section className="col-8">
        <h2 style={{ marginTop: 0 }}>Makina</h2>
        <div className="muted" style={{ marginTop: -6, marginBottom: 12 }}>
          Shfleto listimet dhe ruaj favoritët në profil.
        </div>

        {loading ? (
          <div className="card">Duke ngarkuar...</div>
        ) : items.length === 0 ? (
          <div className="card">Nuk u gjet asnjë listim.</div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(12, 1fr)",
              gap: 14,
            }}
          >
            {items.map((v) => (
              <div key={v._id} style={{ gridColumn: "span 6" }}>
                <VehicleCard
                  v={v}
                  isFav={favoritesSet.has(v._id)}
                  onFavChanged={loadFavorites}
                />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
