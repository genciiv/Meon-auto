import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../lib/api";
import Toast from "../components/layout/Toast";
import { setStoredUser, setToken } from "../lib/auth";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [msg, setMsg] = useState({ type: "info", text: "" });
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setMsg({ type: "info", text: "" });

    if (form.password.length < 6) {
      setMsg({ type: "error", text: "Fjalëkalimi duhet të ketë minimum 6 karaktere." });
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", form);
      setToken(data.token);
      setStoredUser(data.user);
      setMsg({ type: "success", text: "Llogaria u krijua me sukses!" });
      navigate("/profili");
      window.location.reload();
    } catch (err) {
      setMsg({ type: "error", text: err?.response?.data?.message || "Gabim në regjistrim." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card" style={{ maxWidth: 520, margin: "0 auto" }}>
      <h2 style={{ marginTop: 0 }}>Regjistrohu</h2>
      <p className="muted" style={{ marginTop: -6 }}>Krijo llogari për të ruajtur favoritët dhe për të kontaktuar.</p>

      <Toast type={msg.type} message={msg.text} />

      <form onSubmit={onSubmit}>
        <label className="label">Emri</label>
        <input
          className="input"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Emri yt"
        />

        <div style={{ height: 10 }} />

        <label className="label">Email</label>
        <input
          className="input"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="email@..."
        />

        <div style={{ height: 10 }} />

        <label className="label">Fjalëkalimi</label>
        <input
          className="input"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="••••••••"
        />

        <div style={{ height: 14 }} />

        <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }} disabled={loading}>
          {loading ? "Duke krijuar..." : "Krijo llogari"}
        </button>

        <div className="muted" style={{ marginTop: 12 }}>
          Ke llogari? <Link to="/hyr" style={{ color: "#2563eb", fontWeight: 800 }}>Hyr këtu</Link>
        </div>
      </form>
    </div>
  );
}
