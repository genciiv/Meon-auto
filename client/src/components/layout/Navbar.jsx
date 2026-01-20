import { NavLink, useNavigate } from "react-router-dom";
import { FaCarSide, FaTruckMoving, FaNewspaper, FaUserCircle } from "react-icons/fa";
import { FiLogIn, FiLogOut, FiSettings } from "react-icons/fi";
import { clearToken, getStoredUser } from "../../lib/auth.js";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("autoMeon_token");
  const user = getStoredUser();

  function handleLogout() {
    clearToken();
    navigate("/hyr");
    window.location.reload();
  }

  const activeClass = ({ isActive }) =>
    "nav-link" + (isActive ? " active" : "");

  return (
    <header className="topbar">
      <div className="container topbar-inner">
        <NavLink to="/" className="brand">
          <span className="brand-mark">AM</span>
          <span className="brand-text">
            Auto <b>Meon</b>
          </span>
        </NavLink>

        <nav className="nav">
          <NavLink to="/makina" className={activeClass}>
            <FaCarSide /> Makina
          </NavLink>
          <NavLink to="/kamione" className={activeClass}>
            <FaTruckMoving /> Kamionë
          </NavLink>
          <NavLink to="/blog" className={activeClass}>
            <FaNewspaper /> Blog
          </NavLink>
        </nav>

        <div className="nav-actions">
          {token ? (
            <>
              {user?.role === "admin" && (
                <NavLink to="/admin" className="btn btn-ghost">
                  <FiSettings /> Admin
                </NavLink>
              )}

              <NavLink to="/profili" className="btn btn-ghost">
                <FaUserCircle /> {user?.name ? user.name : "Profili"}
              </NavLink>

              <button onClick={handleLogout} className="btn btn-ghost" type="button">
                <FiLogOut /> Dil
              </button>
            </>
          ) : (
            <NavLink to="/hyr" className="btn btn-primary">
              <FiLogIn /> Hyr / Regjistrohu
            </NavLink>
          )}
        </div>
      </div>
    </header>
  );
}
