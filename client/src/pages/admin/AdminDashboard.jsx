import { Link } from "react-router-dom";
import { FaCarSide, FaInbox } from "react-icons/fa";

export default function AdminDashboard() {
  return (
    <div className="grid">
      <div className="card col-12">
        <h2 style={{ marginTop: 0 }}>Admin Panel – Auto Meon</h2>
        <div className="muted">Menaxho listimet dhe mesazhet e kontaktit.</div>
      </div>

      <div className="card col-6">
        <h3 style={{ marginTop: 0, display: "flex", alignItems: "center", gap: 10 }}>
          <FaCarSide /> Mjete
        </h3>
        <div className="muted">Shto / Edito / Fshi makina dhe kamionë.</div>
        <div style={{ height: 12 }} />
        <Link className="btn btn-primary" to="/admin/mjete">
          Hap menaxhimin
        </Link>
      </div>

      <div className="card col-6">
        <h3 style={{ marginTop: 0, display: "flex", alignItems: "center", gap: 10 }}>
          <FaInbox /> Leads
        </h3>
        <div className="muted">Shiko mesazhet e kontaktit nga userat.</div>
        <div style={{ height: 12 }} />
        <Link className="btn btn-primary" to="/admin/leads">
          Hap kontaktet
        </Link>
      </div>
    </div>
  );
}
