import { useEffect, useState } from "react";
import api from "../lib/api.js";
import VehicleCard from "../components/layout/VehicleCard.jsx";

const initialFilters = {
  make: "",
  model: "",
  fuel: "",
  gearbox: "",
  city: "",
  yearMin: "",
  yearMax: "",
  priceMin: "",
  priceMax: "",
  mileageMin: "",
  mileageMax: "",
  sort: "new",
};

export default function Cars() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState(initialFilters);

  const [favoritesSet, setFavoritesSet] = useState(new Set());

  // pagination
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const limit = 12;

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

  function buildParams(extra = {}) {
    const params = {
      type: "car",
      featuredFirst: 1,
      limit,
      ...filters,
      ...extra,
    };

    Object.keys(params).forEach((k) => {
      if (params[k] === "" || params[k] == null) delete params[k];
    });

    return params;
  }

  async function loadFirstPage() {
    setLoading(true);
    const { data } = await api.get("/vehicles", { params: buildParams({ page: 1 }) });
    setItems(data.items || []);
    setPage(data.page || 1);
    setPages(data.pages || 1);
    setLoading(false);
  }

  async function loadMore() {
    const next = page + 1;
    if (next > pages) return;

    const { data } = await api.get("/vehicles", { params: buildParams({ page: next }) });
    setItems((prev) => [...prev, ...(data.items || [])]);
    setPage(data.page || next);
    setPages(data.pages || pages);
  }

  useEffect(() => {
    loadFirstPage();
    loadFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="listings">
      <aside className="filters">
        <div className="filters-head">
          <h3>Filtra (Makina)</h3>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => setFilters(initialFilters)}
            title="Pastro filtrat"
          >
            Reset
          </button>
        </div>

        <div className="filters-grid">
          <div>
            <label className="label">Marka</label>
            <input
              className="input"
              value={filters.make}
              onChange={(e) => setFilters({ ...filters, make: e.target.value })}
              placeholder="p.sh. Mercedes"
            />
          </div>

          <div>
            <label className="label">Modeli</label>
            <input
              className="input"
              value={filters.model}
              onChange={(e) => setFilters({ ...filters, model: e.target.value })}
              placeholder="p.sh. C200"
            />
          </div>

          <div>
            <label className="label">Karburanti</label>
            <input
              className="input"
              value={filters.fuel}
              onChange={(e) => setFilters({ ...filters, fuel: e.target.value })}
              placeholder="p.sh. Benzinë / Naftë"
            />
          </div>

          <div>
            <label className="label">Kambio</label>
            <input
              className="input"
              value={filters.gearbox}
              onChange={(e) => setFilters({ ...filters, gearbox: e.target.value })}
              placeholder="p.sh. Automatik"
            />
          </div>

          <div>
            <label className="label">Qyteti</label>
            <input
              className="input"
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              placeholder="p.sh. Tiranë"
            />
          </div>

          <div className="row2">
            <label className="label">Viti (min/max)</label>
            <div className="two">
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
          </div>

          <div className="row2">
            <label className="label">Çmimi € (min/max)</label>
            <div className="two">
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
          </div>

          <div className="row2">
            <label className="label">Kilometra (min/max)</label>
            <div className="two">
              <input
                className="input"
                value={filters.mileageMin}
                onChange={(e) => setFilters({ ...filters, mileageMin: e.target.value })}
                placeholder="Min"
              />
              <input
                className="input"
                value={filters.mileageMax}
                onChange={(e) => setFilters({ ...filters, mileageMax: e.target.value })}
                placeholder="Max"
              />
            </div>
          </div>

          <div className="row2">
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
          </div>

          <button
            className="btn btn-primary filters-cta"
            type="button"
            onClick={() => loadFirstPage()}
          >
            Apliko filtrat
          </button>

          <div className="filters-note">
            Featured shfaqen të parat automatikisht.
          </div>
        </div>
      </aside>

      <section className="results">
        <div className="results-head">
          <div>
            <h2>Makina</h2>
            <div className="muted">Shfleto listimet dhe ruaj favoritët.</div>
          </div>

          <div className="results-count">
            {loading ? "Duke ngarkuar..." : `${items.length} rezultate`}
          </div>
        </div>

        {loading ? (
          <div className="results-skeleton">Duke ngarkuar…</div>
        ) : items.length === 0 ? (
          <div className="results-empty">Nuk u gjet asnjë listim.</div>
        ) : (
          <>
            <div className="cards-grid">
              {items.map((v) => (
                <VehicleCard
                  key={v._id}
                  v={v}
                  isFav={favoritesSet.has(v._id)}
                  onFavChanged={loadFavorites}
                />
              ))}
            </div>

            <div className="loadmore">
              {page < pages ? (
                <button className="btn btn-ghost" type="button" onClick={loadMore}>
                  Load more
                </button>
              ) : (
                <div className="muted">S’ka më rezultate.</div>
              )}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
