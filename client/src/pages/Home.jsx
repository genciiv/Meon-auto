import { FaSearch, FaStar } from "react-icons/fa";

export default function Home() {
  return (
    <div className="grid">
      <section className="card col-12">
       <h1 style={{ margin: 0, fontSize: 30, letterSpacing: ".2px" }}>
  Gjej makinën ideale te <span style={{ color: "#2563eb" }}>Auto Meon</span>
</h1>

        <p className="muted" style={{ marginTop: 8 }}>
          Kërko sipas markës, çmimit, vitit dhe qytetit. Favoritet dhe historiku ruhen në profil.
        </p>

        <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 220 }}>
            <label className="label">Kërko</label>
            <input className="input" placeholder="p.sh. Mercedes, Golf, 2016..." />
          </div>
          <button className="btn btn-primary" style={{ marginTop: 22 }}>
            <FaSearch /> Kërko
          </button>
          <button className="btn btn-ghost" style={{ marginTop: 22 }}>
            <FaStar /> Të promovuara
          </button>
        </div>
      </section>

      <section className="card col-8">
        <h2 style={{ marginTop: 0 }}>Të fundit</h2>
        <p className="muted">Këtu do shfaqen kartat e makinave (nga API).</p>
      </section>

      <aside className="card col-4">
        <h3 style={{ marginTop: 0 }}>Kategoritë</h3>
        <div className="muted">Makina • Kamionë • SUV • Fuoristradë • Transport</div>
      </aside>
    </div>
  );
}
