import { Router } from "express";
import mongoose from "mongoose";
import { requireAuth } from "../middleware/auth.js";
import User from "../models/User.js";

const router = Router();

// gjithçka këtu kërkon login
router.use(requireAuth);

// GET /api/users/me  (opsionale nëse e përdor)
router.get("/me", async (req, res) => {
  res.json({ user: req.user });
});

// ✅ GET /api/users/favorites
router.get("/favorites", async (req, res) => {
  const user = await User.findById(req.user._id)
    .select("favorites")
    .populate({ path: "favorites", options: { sort: { createdAt: -1 } } });

  res.json({ items: user?.favorites || [] });
});

// ✅ POST /api/users/favorites/:vehicleId  (toggle)
router.post("/favorites/:vehicleId", async (req, res) => {
  const { vehicleId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(vehicleId)) {
    return res.status(400).json({ message: "ID e pavlefshme." });
  }

  const user = await User.findById(req.user._id).select("favorites");
  const exists = user.favorites.some((id) => String(id) === String(vehicleId));

  if (exists) {
    user.favorites = user.favorites.filter((id) => String(id) !== String(vehicleId));
  } else {
    user.favorites.unshift(vehicleId);
  }

  await user.save();
  res.json({ ok: true, favorites: user.favorites });
});

// ✅ POST /api/users/viewed/:vehicleId  (ruan historikun)
router.post("/viewed/:vehicleId", async (req, res) => {
  const { vehicleId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(vehicleId)) {
    return res.status(400).json({ message: "ID e pavlefshme." });
  }

  await User.updateOne(
    { _id: req.user._id, "viewed.vehicleId": vehicleId },
    { $set: { "viewed.$.lastViewedAt": new Date() } }
  );

  // nëse nuk ekziston, shtoje
  await User.updateOne(
    { _id: req.user._id, "viewed.vehicleId": { $ne: vehicleId } },
    { $push: { viewed: { vehicleId, lastViewedAt: new Date() } } }
  );

  res.json({ ok: true });
});

// GET /api/users/viewed
router.get("/viewed", async (req, res) => {
  const user = await User.findById(req.user._id)
    .select("viewed")
    .populate("viewed.vehicleId");

  res.json({ items: user?.viewed || [] });
});

export default router;
