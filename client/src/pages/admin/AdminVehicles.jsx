import { useEffect, useState } from "react";
import api from "../../lib/api.js";
import Toast from "../../components/layout/Toast.jsx";

const empty = {
  type: "car",
  title: "",
  make: "",
  model: "",
  year: "",
  price: "",
  mileageKm: "",
  fuel: "",
  gearbox: "",
  city: "",
  truckType: "",
  description: "",
  imagesText: "",
  featured: false,
  status: "active",
};

export default function AdminVehicles() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [msg, setMsg] = useState({ type: "info", text: "" });
  const [loading, setLoading] = useState(false);

  async function load() {
    const { data } = await api.get("/admin/vehicles");
    setItems(data.items || []);
  }

  useEffect(() => { load(); }, []);

  function parseImages(text) {
    return String(text || "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  async function createVehicle(e) {
    e.preventDefault();
    setMsg({ type: "info", text: "" });

    if (!form.title.trim()) {
      setMsg({ type: "error", text: "Title është i detyrueshëm." });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        year: form.year ? Number(form.year) : null,
        price: form.price ? Number(form.price) : null,
        mileageKm: form.mileageKm ? Number(form.mileageKm) : null,
        images: parseImages(form.imagesText),
      };
      delete payload.imagesText;

      await api.post("/admin/vehicles", payload);
      setMsg({ type: "success", text: "Mjeti u shtua me sukses!" });
      setForm(empty);
      await load();
    } catch (err) {
      setMsg({ type: "error", text: err?.response?.data?.message || "Gabim në shtim." });
    } finally {
      setLoading(false);
    }
  }

  async function removeVehicle(id) {
    if (!confirm("Ta fshijmë këtë mjet?")) return;
    await api.delete(`/admin/vehicles/${id}`);
    await load();
  }

  async function toggleFeatured(v) {
    await api.put(`/admin/vehicles/${v._id}`, { featured: !v.featured });
    await load();
  }

  return (
    <div className="grid">
      <section className="card col-5">
        <h3 style={{ marginTop: 0 }}>Shto mjet</h3>
        <Toast type={msg.type} message={msg.text} />

        <form onSubmit={createVehicle}>
          <label className="label">Lloji</label>
          <select className="select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <option value="car">Makina</option>
            <option value="truck">Kamion</option>
          </select>

          <div style={{ height: 10 }} />

          <label className="label">Titulli*</label>
          <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="p.sh. Mercedes C200 2016" />

          <div style={{ height: 10 }} />

          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ flex: 1 }}>
              <label className="label">Marka</label>
              <input className="input" value={form.make} onChange={(e) => setForm({ ...form, make: e.target.value })} />
            </div>
            <div style={{ flex: 1 }}>
              <label className="label">Modeli</label>
              <input className="input" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} />
            </div>
          </div>

          <div style={{ height: 10 }} />

          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ flex: 1 }}>
              <label className="label">Viti</label>
              <input className="input" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} />
            </div>
            <div style={{ flex: 1 }}>
              <label className="label">Çmimi (€)</label>
              <input className="input" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            </div>
          </div>

          <div style={{ height: 10 }} />

          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ flex: 1 }}>
              <label className="label">KM</label>
              <input className="input" value={form.mileageKm} onChange={(e) => setForm({ ...form, mileageKm: e.target.value })} />
            </div>
            <div style={{ flex: 1 }}>
              <label className="label">Qyteti</label>
              <input className="input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            </div>
          </div>

          <div style={{ height: 10 }} />

          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ flex: 1 }}>
              <label className="label">Karburanti</label>
              <input className="input" value={form.fuel} onChange={(e) => setForm({ ...form, fuel: e.target.value })} placeholder="Benzinë/Naftë/..." />
            </div>
            <div style={{ flex: 1 }}>
              <label className="label">Transmisioni</label>
              <input className="input" value={form.gearbox} onChange={(e) => setForm({ ...form, gearbox: e.target.value })} placeholder="Manual/Automat" />
            </div>
          </div>

          <div style={{ height: 10 }} />

          {form.type === "truck" && (
            <>
              <label className="label">Truck Type</label>
              <input className="input" value={form.truckType} onChange={(e) => setForm({ ...form, truckType: e.target.value })} placeholder="p.sh. trailers, buses..." />
              <div style={{ height: 10 }} />
            </>
          )}

          <label className="label">Status</label>
          <select className="select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="active">Active</option>
            <option value="sold">Sold</option>
            <option value="hidden">Hidden</option>
          </select>

          <div style={{ height: 10 }} />

          <label className="label">Foto (URL) – 1 për rresht</label>
          <textarea className="textarea" rows={4} value={form.imagesText} onChange={(e) => setForm({ ...form, imagesText: e.target.value })} placeholder="https://...\nhttps://..." />

          <div style={{ height: 10 }} />

          <label className="label">Përshkrimi</label>
          <textarea className="textarea" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />

          <div style={{ height: 10 }} />

          <label style={{ display: "flex", gap: 10, alignItems: "center", fontWeight: 800 }}>
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
            Featured (Promovuar)
          </label>

          <div style={{ height: 14 }} />

          <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }} disabled={loading}>
            {loading ? "Duke shtuar..." : "Shto mjet"}
          </button>
        </form>
      </section>

      <section className="col-7">
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Lista e mjeteve</h3>
          <div className="muted" style={{ marginTop: -6, marginBottom: 12 }}>
            Kliko Featured për promovim, ose Fshi.
          </div>

          {items.length === 0 ? (
            <div className="muted">S’ka mjete ende.</div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 14 }}>
              {items.map((v) => (
                <div key={v._id} style={{ gridColumn: "span 6" }} className="card">
                  <div style={{ fontWeight: 900 }}>{v.title}</div>
                  <div className="muted">{v.type} • {v.city || "—"} • {v.price ? `${v.price}€` : "-"}</div>
                  <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                    <button className="btn btn-ghost" type="button" onClick={() => toggleFeatured(v)} style={{ flex: 1, justifyContent: "center" }}>
                      {v.featured ? "Featured: ON" : "Featured: OFF"}
                    </button>
                    <button className="btn btn-ghost" type="button" onClick={() => removeVehicle(v._id)} style={{ flex: 1, justifyContent: "center" }}>
                      Fshi
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
