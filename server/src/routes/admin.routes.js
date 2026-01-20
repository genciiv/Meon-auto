import { Router } from "express";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import Vehicle from "../models/Vehicle.js";
import Lead from "../models/Lead.js";
import BlogPost from "../models/BlogPost.js";

const router = Router();

// -------------------- VEHICLES CRUD --------------------

// GET /api/admin/vehicles
router.get("/vehicles", requireAuth, requireAdmin, async (req, res) => {
  const items = await Vehicle.find().sort({ createdAt: -1 }).limit(200);
  res.json({ items });
});

// POST /api/admin/vehicles
router.post("/vehicles", requireAuth, requireAdmin, async (req, res) => {
  const payload = req.body || {};
  if (!payload.type || !payload.title) {
    return res.status(400).json({ message: "type dhe title janë të detyrueshme." });
  }

  const v = await Vehicle.create({
    type: payload.type,
    title: payload.title,
    make: payload.make || "",
    model: payload.model || "",
    year: payload.year || null,
    price: payload.price || null,
    mileageKm: payload.mileageKm || null,
    fuel: payload.fuel || "",
    gearbox: payload.gearbox || "",
    city: payload.city || "",
    truckType: payload.truckType || "",
    description: payload.description || "",
    images: Array.isArray(payload.images) ? payload.images : [],
    featured: !!payload.featured,
    featuredUntil: payload.featuredUntil || null,
    status: payload.status || "active",
  });

  res.status(201).json({ item: v });
});

// PUT /api/admin/vehicles/:id
router.put("/vehicles/:id", requireAuth, requireAdmin, async (req, res) => {
  const payload = req.body || {};
  const updated = await Vehicle.findByIdAndUpdate(req.params.id, payload, { new: true });
  if (!updated) return res.status(404).json({ message: "Mjeti nuk u gjet." });
  res.json({ item: updated });
});

// DELETE /api/admin/vehicles/:id
router.delete("/vehicles/:id", requireAuth, requireAdmin, async (req, res) => {
  const deleted = await Vehicle.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Mjeti nuk u gjet." });
  res.json({ ok: true });
});

// -------------------- LEADS (Kontaktet) --------------------

// GET /api/admin/leads
router.get("/leads", requireAuth, requireAdmin, async (req, res) => {
  const items = await Lead.find()
    .sort({ createdAt: -1 })
    .limit(300)
    .populate("userId", "name email")
    .populate("vehicleId", "title price city");
  res.json({ items });
});

// -------------------- BLOG (minimal CRUD) --------------------

router.get("/blog", requireAuth, requireAdmin, async (req, res) => {
  const items = await BlogPost.find().sort({ createdAt: -1 }).limit(200);
  res.json({ items });
});

router.post("/blog", requireAuth, requireAdmin, async (req, res) => {
  const { title, slug, content, coverImage, tags, publishedAt } = req.body || {};
  if (!title || !slug || !content) return res.status(400).json({ message: "title, slug, content janë të detyrueshme." });

  const post = await BlogPost.create({
    title,
    slug,
    content,
    coverImage: coverImage || "",
    tags: Array.isArray(tags) ? tags : [],
    publishedAt: publishedAt || null,
  });

  res.status(201).json({ item: post });
});

router.put("/blog/:id", requireAuth, requireAdmin, async (req, res) => {
  const updated = await BlogPost.findByIdAndUpdate(req.params.id, req.body || {}, { new: true });
  if (!updated) return res.status(404).json({ message: "Postimi nuk u gjet." });
  res.json({ item: updated });
});

router.delete("/blog/:id", requireAuth, requireAdmin, async (req, res) => {
  const deleted = await BlogPost.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Postimi nuk u gjet." });
  res.json({ ok: true });
});

export default router;
