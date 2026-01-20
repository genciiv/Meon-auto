import { Link } from "react-router-dom";
import { FaCarSide, FaInbox, FaArrowRight, FaPlus } from "react-icons/fa";

export default function AdminDashboard() {
  return (
    <div className="admin-dash">
      {/* HERO */}
      <section className="admin-card">
        <div className="admin-hero">
          <div>
            <h1>Admin Panel – Auto Meon</h1>
            <p>Menaxho listimet, promovimet dhe mesazhet e kontaktit nga userat.</p>
          </div>

          <div className="admin-quick">
            <Link to="/admin/mjete" className="admin-pill">
              <FaCarSide /> Menaxho mjete
            </Link>
            <Link to="/admin/leads" className="admin-pill">
              <FaInbox /> Shiko leads
            </Link>
          </div>
        </div>
      </section>

      {/* TILES */}
      <section className="admin-tiles">
        {/* MJETE */}
        <div className="admin-tile">
          <div className="admin-tile-top">
            <h3 className="admin-tile-title">
              <span className="admin-tile-icon">
                <FaCarSide />
              </span>
              Mjete (Makina & Kamionë)
            </h3>
          </div>

          <p className="admin-tile-desc">
            Shto, edito, fshi listimet dhe vendos “Featured” për promovime në faqen kryesore.
          </p>

          <div className="admin-tile-actions">
            <Link to="/admin/mjete" className="admin-link primary">
              <FaArrowRight /> Hap menaxhimin
            </Link>
            <Link to="/admin/mjete" className="admin-link">
              <FaPlus /> Shto mjet
            </Link>
          </div>
        </div>

        {/* LEADS */}
        <div className="admin-tile">
          <div className="admin-tile-top">
            <h3 className="admin-tile-title">
              <span className="admin-tile-icon">
                <FaInbox />
              </span>
              Leads (Kontaktet)
            </h3>
          </div>

          <p className="admin-tile-desc">
            Shiko mesazhet e kontaktit, telefonat dhe mjetet për të cilat janë interesuar userat.
          </p>

          <div className="admin-tile-actions">
            <Link to="/admin/leads" className="admin-link primary">
              <FaArrowRight /> Hap kontaktet
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
