import { Router } from "express";
import { requireAdmin } from "../middleware/auth.js";
import Vehicle from "../models/Vehicle.js";
import Lead from "../models/Lead.js";

const router = Router();

// gjithçka këtu është ADMIN
router.use(requireAdmin);

// GET /api/admin/vehicles
router.get("/vehicles", async (req, res) => {
  const items = await Vehicle.find({}).sort({ createdAt: -1 });
  res.json({ items });
});

// POST /api/admin/vehicles
router.post("/vehicles", async (req, res) => {
  const created = await Vehicle.create(req.body);
  res.json({ item: created });
});

// PUT /api/admin/vehicles/:id
router.put("/vehicles/:id", async (req, res) => {
  const updated = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ item: updated });
});

// DELETE /api/admin/vehicles/:id
router.delete("/vehicles/:id", async (req, res) => {
  await Vehicle.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

// GET /api/admin/leads
router.get("/leads", async (req, res) => {
  const items = await Lead.find({}).sort({ createdAt: -1 });
  res.json({ items });
});

export default router;
