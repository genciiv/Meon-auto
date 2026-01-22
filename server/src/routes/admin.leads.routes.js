import { Router } from "express";
import jwt from "jsonwebtoken";
import Lead from "../models/Lead.js";
import User from "../models/User.js";

const router = Router();

async function requireAdmin(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: "Pa autorizim." });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload?.id).select("role");
    if (!user) return res.status(401).json({ message: "Pa autorizim." });
    if (user.role !== "admin") return res.status(403).json({ message: "Vetëm admin." });

    req.user = { id: user._id.toString(), role: user.role };
    next();
  } catch (e) {
    return res.status(401).json({ message: "Token i pavlefshëm." });
  }
}

/**
 * GET /api/admin/leads?status=new|contacted|closed&q=...&page=1&limit=20
 */
router.get("/", requireAdmin, async (req, res) => {
  const { status, q, page = 1, limit = 20 } = req.query;

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(100, Math.max(5, Number(limit)));

  const query = {};
  if (status && ["new", "contacted", "closed"].includes(status)) {
    query.status = status;
  }

  if (q && String(q).trim()) {
    const rx = new RegExp(String(q).trim(), "i");
    query.$or = [{ name: rx }, { phone: rx }, { message: rx }, { pageUrl: rx }];
  }

  const [items, total] = await Promise.all([
    Lead.find(query)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .populate("vehicleId", "title type price city images"),
    Lead.countDocuments(query),
  ]);

  res.json({
    items,
    page: pageNum,
    limit: limitNum,
    total,
    pages: Math.ceil(total / limitNum),
  });
});

/**
 * PATCH /api/admin/leads/:id
 * body: { status, notes }
 */
router.patch("/:id", requireAdmin, async (req, res) => {
  const { status, notes } = req.body || {};

  const upd = {};
  if (status && ["new", "contacted", "closed"].includes(status)) upd.status = status;
  if (typeof notes === "string") upd.notes = notes;

  const lead = await Lead.findByIdAndUpdate(req.params.id, upd, { new: true });
  if (!lead) return res.status(404).json({ message: "Lead nuk u gjet." });

  res.json({ ok: true, item: lead });
});

export default router;
