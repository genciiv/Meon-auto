import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api.js";
import VehicleCard from "../components/layout/VehicleCard.jsx";
import { FaSearch, FaStar, FaClock } from "react-icons/fa";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  const [q, setQ] = useState({ type: "car", make: "", city: "" });

  async function load() {
    setLoading(true);
    const [f, r] = await Promise.all([
      api.get("/vehicles/featured", { params: { type: q.type, limit: 8 } }),
      api.get("/vehicles/recent", { params: { type: q.type, limit: 12 } }),
    ]);
    setFeatured(f.data.items || []);
    setRecent(r.data.items || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q.type]);

  function goSearch() {
    const params = new URLSearchParams();
    if (q.make) params.set("make", q.make);
    if (q.city) params.set("city", q.city);

    if (q.type === "car") window.location.href = `/makina?${params.toString()}`;
    else window.location.href = `/kamione?${params.toString()}`;
  }

  return (
    <div>
      {/* HERO */}
      <div className="card" style={{ padding: 22, marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <h1 style={{ margin: 0 }}>Auto Meon</h1>
            <div className="muted" style={{ marginTop: 6 }}>
              Marketplace profesional për makina & kamionë. Ruaj favoritët, shiko produktet dhe kontakto pasi të regjistrohesh.
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <Link to="/makina" className="btn btn-ghost">Shiko Makina</Link>
            <Link to="/kamione" className="btn btn-ghost">Shiko Kamionë</Link>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 12, marginTop: 16 }}>
          <div style={{ gridColumn: "span 3" }}>
            <label className="label">Lloji</label>
            <select className="select" value={q.type} onChange={(e) => setQ({ ...q, type: e.target.value })}>
              <option value="car">Makina</option>
              <option value="truck">Kamionë</option>
            </select>
          </div>

          <div style={{ gridColumn: "span 4" }}>
            <label className="label">Marka</label>
            <input className="input" value={q.make} onChange={(e) => setQ({ ...q, make: e.target.value })} placeholder="p.sh. Mercedes" />
          </div>

          <div style={{ gridColumn: "span 4" }}>
            <label className="label">Qyteti</label>
            <input className="input" value={q.city} onChange={(e) => setQ({ ...q, city: e.target.value })} placeholder="p.sh. Tiranë" />
          </div>

          <div style={{ gridColumn: "span 1", display: "flex", alignItems: "end" }}>
            <button className="btn btn-primary" type="button" onClick={goSearch} style={{ width: "100%", justifyContent: "center" }}>
              <FaSearch />
            </button>
          </div>
        </div>
      </div>

      {/* FEATURED */}
      <div className="card" style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <h2 style={{ margin: 0 }}><FaStar /> Të promovuara</h2>
          <Link to={q.type === "car" ? "/makina" : "/kamione"} className="btn btn-ghost">Shiko të gjitha</Link>
        </div>

        {loading ? (
          <div className="muted" style={{ marginTop: 10 }}>Duke ngarkuar...</div>
        ) : featured.length === 0 ? (
          <div className="muted" style={{ marginTop: 10 }}>Nuk ka listime të promovuara për momentin.</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 14, marginTop: 12 }}>
            {featured.map((v) => (
              <div key={v._id} style={{ gridColumn: "span 3" }}>
                <VehicleCard v={v} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RECENT */}
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <h2 style={{ margin: 0 }}><FaClock /> Shtuar së fundmi</h2>
          <Link to={q.type === "car" ? "/makina" : "/kamione"} className="btn btn-ghost">Shiko listimet</Link>
        </div>

        {loading ? (
          <div className="muted" style={{ marginTop: 10 }}>Duke ngarkuar...</div>
        ) : recent.length === 0 ? (
          <div className="muted" style={{ marginTop: 10 }}>Nuk ka listime ende.</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 14, marginTop: 12 }}>
            {recent.map((v) => (
              <div key={v._id} style={{ gridColumn: "span 3" }}>
                <VehicleCard v={v} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
