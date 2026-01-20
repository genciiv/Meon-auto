import { useEffect, useState } from "react";
import api from "../lib/api.js";
import VehicleCard from "../components/layout/VehicleCard.jsx";

const TRUCK_TYPES = [
  { key: "", label: "Të gjitha" },
  { key: "buses", label: "Autobusë" },
  { key: "trailers", label: "Rimorkio" },
  { key: "constructionMachines", label: "Makineri Ndërtimi" },
  { key: "agricultural", label: "Bujqësore" },
  { key: "semiTrailerTrucks", label: "Kamionë me Gjysmërimorkio" },
];

export default function Trucks() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    truckType: "",
    city: "",
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
    const ids = (data.favorites || []).map((v) => v._id);
    setFavoritesSet(new Set(ids));
  }

  async function load() {
    setLoading(true);

    const params = { type: "truck", ...filters };
    Object.keys(params).forEach((k) => {
      if (params[k] === "") delete params[k];
    });

    const { data } = await api.get("/vehicles", { params });
    setItems(data.items || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    loadFavorites();
  }, []);

  return (
    <div className="grid">
      <aside className="card col-4">
        <h3 style={{ marginTop: 0 }}>Kategoritë</h3>

        <label className="label">Lloji</label>
        <select
          className="select"
          value={filters.truckType}
          onChange={(e) => setFilters({ ...filters, truckType: e.target.value })}
        >
          {TRUCK_TYPES.map((t) => (
            <option key={t.key} value={t.key}>
              {t.label}
            </option>
          ))}
        </select>

        <div style={{ height: 10 }} />

        <label className="label">Qyteti</label>
        <input
          className="input"
          value={filters.city}
          onChange={(e) => setFilters({ ...filters, city: e.target.value })}
          placeholder="p.sh. Durrës"
        />

        <div style={{ height: 10 }} />

        <label className="label">Çmimi (min/max) €</label>
        <div style={{ display: "flex", gap: 10 }}>
          <input
            className="input"
            value={filters.priceMin}
            onChange={(e) => setFilters({ ...filters, priceMin: e.target.value })}
            placeholder="Min"
          />
          <input
            className="input"
            value={filters.priceMax}
            onChange={(e) => setFilters({ ...filters, priceMax: e.target.value })}
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
        <h2 style={{ marginTop: 0 }}>Kamionë</h2>
        <div className="muted" style={{ marginTop: -6, marginBottom: 12 }}>
          Zgjidh kategorinë dhe shfleto listimet.
        </div>

        {loading ? (
          <div className="card">Duke ngarkuar...</div>
        ) : items.length === 0 ? (
          <div className="card">Nuk u gjet asnjë listim.</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 14 }}>
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
