import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import User from "../models/User.js";
import Vehicle from "../models/Vehicle.js";
import Lead from "../models/Lead.js";

const router = Router();

// GET /api/users/me
router.get("/me", requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id).select("name email role favorites viewed");
  if (!user) return res.status(404).json({ message: "User nuk u gjet." });
  res.json({ user });
});

// POST /api/users/favorites/:vehicleId (toggle)
router.post("/favorites/:vehicleId", requireAuth, async (req, res) => {
  const { vehicleId } = req.params;

  const vehicle = await Vehicle.findById(vehicleId).select("_id");
  if (!vehicle) return res.status(404).json({ message: "Mjeti nuk u gjet." });

  const user = await User.findById(req.user.id);
  const exists = user.favorites.some((id) => id.toString() === vehicleId);

  if (exists) {
    user.favorites = user.favorites.filter((id) => id.toString() !== vehicleId);
  } else {
    user.favorites.unshift(vehicle._id);
  }

  await user.save();
  res.json({ favorites: user.favorites });
});

// GET /api/users/favorites
router.get("/favorites", requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id).populate("favorites");
  res.json({ favorites: user?.favorites || [] });
});

// GET /api/users/viewed
router.get("/viewed", requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id).select("viewed");
  res.json({ viewed: user?.viewed || [] });
});

// POST /api/users/contact  (vetem logged-in)
router.post("/contact", requireAuth, async (req, res) => {
  const { vehicleId, message, phone, channel } = req.body || {};
  if (!vehicleId || !message) return res.status(400).json({ message: "Mungon vehicleId ose mesazhi." });

  const vehicle = await Vehicle.findById(vehicleId).select("_id");
  if (!vehicle) return res.status(404).json({ message: "Mjeti nuk u gjet." });

  const lead = await Lead.create({
    userId: req.user.id,
    vehicleId,
    message: String(message).trim(),
    phone: phone ? String(phone).trim() : "",
    channel: channel === "whatsapp" ? "whatsapp" : "form",
  });

  res.status(201).json({ ok: true, leadId: lead._id });
});

export default router;
