import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../lib/api";
import Toast from "../components/layout/Toast";
import { setStoredUser, setToken } from "../lib/auth";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState({ type: "info", text: "" });
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setMsg({ type: "info", text: "" });

    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", form);
      setToken(data.token);
      setStoredUser(data.user);
      setMsg({ type: "success", text: "Hyrja u krye me sukses!" });
      navigate("/profili");
      window.location.reload();
    } catch (err) {
      setMsg({ type: "error", text: err?.response?.data?.message || "Gabim në hyrje." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card" style={{ maxWidth: 520, margin: "0 auto" }}>
      <h2 style={{ marginTop: 0 }}>Hyr</h2>
      <p className="muted" style={{ marginTop: -6 }}>Hyr për të përdorur favoritët dhe kontaktin.</p>

      <Toast type={msg.type} message={msg.text} />

      <form onSubmit={onSubmit}>
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
          {loading ? "Duke hyrë..." : "Hyr"}
        </button>

        <div className="muted" style={{ marginTop: 12 }}>
          S’ke llogari?{" "}
          <Link to="/regjistrohu" style={{ color: "#2563eb", fontWeight: 800 }}>
            Regjistrohu
          </Link>
        </div>
      </form>
    </div>
  );
}
