import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";

// Public pages
import Home from "./pages/Home.jsx";
import Cars from "./pages/Cars.jsx";
import Trucks from "./pages/Trucks.jsx";
import VehicleDetails from "./pages/VehicleDetails.jsx";
import Blog from "./pages/Blog.jsx";
import BlogPost from "./pages/BlogPost.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminVehicles from "./pages/admin/AdminVehicles.jsx";
import AdminLeads from "./pages/admin/AdminLeads.jsx";

function RequireAuth({ children }) {
  const token = localStorage.getItem("autoMeon_token");
  if (!token) return <Navigate to="/hyr" replace />;
  return children;
}

function RequireAdmin({ children }) {
  const token = localStorage.getItem("autoMeon_token");
  const userRaw = localStorage.getItem("autoMeon_user");
  const user = userRaw ? JSON.parse(userRaw) : null;

  if (!token) return <Navigate to="/hyr" replace />;
  if (user?.role !== "admin") return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />

      <main className="container">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/makina" element={<Cars />} />
          <Route path="/kamione" element={<Trucks />} />
          <Route path="/mjeti/:id" element={<VehicleDetails />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />

          {/* Auth */}
          <Route path="/hyr" element={<Login />} />
          <Route path="/regjistrohu" element={<Register />} />

          {/* Profile (protected) */}
          <Route
            path="/profili"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />

          {/* Admin (protected) */}
          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <AdminDashboard />
              </RequireAdmin>
            }
          />
          <Route
            path="/admin/mjete"
            element={
              <RequireAdmin>
                <AdminVehicles />
              </RequireAdmin>
            }
          />
          <Route
            path="/admin/leads"
            element={
              <RequireAdmin>
                <AdminLeads />
              </RequireAdmin>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
