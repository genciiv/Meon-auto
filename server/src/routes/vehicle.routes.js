import { Router } from "express";
import Vehicle from "../models/Vehicle.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = Router();

function tryGetUserId(req) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return null;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return payload?.id || null;
  } catch {
    return null;
  }
}

// GET /api/vehicles?type=car|truck&make=&yearMin=&yearMax=&priceMin=&priceMax=&truckType=&page=&limit=
router.get("/", async (req, res) => {
  const {
    type,
    make,
    model,
    city,
    truckType,
    yearMin,
    yearMax,
    priceMin,
    priceMax,
    sort = "new",
    page = 1,
    limit = 12,
  } = req.query;

  const q = { status: "active" };

  if (type) q.type = type;
  if (make) q.make = new RegExp(String(make).trim(), "i");
  if (model) q.model = new RegExp(String(model).trim(), "i");
  if (city) q.city = new RegExp(String(city).trim(), "i");
  if (truckType) q.truckType = String(truckType).trim();

  if (yearMin || yearMax) {
    q.year = {};
    if (yearMin) q.year.$gte = Number(yearMin);
    if (yearMax) q.year.$lte = Number(yearMax);
  }

  if (priceMin || priceMax) {
    q.price = {};
    if (priceMin) q.price.$gte = Number(priceMin);
    if (priceMax) q.price.$lte = Number(priceMax);
  }

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(48, Math.max(6, Number(limit)));

  const sortMap = {
    new: { createdAt: -1 },
    priceAsc: { price: 1 },
    priceDesc: { price: -1 },
  };

  const [items, total] = await Promise.all([
    Vehicle.find(q)
      .sort(sortMap[sort] || sortMap.new)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Vehicle.countDocuments(q),
  ]);

  res.json({
    items,
    page: pageNum,
    limit: limitNum,
    total,
    pages: Math.ceil(total / limitNum),
  });
});

// GET /api/vehicles/:id  (kur user e hap -> saved te viewed)
router.get("/:id", async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);
  if (!vehicle) return res.status(404).json({ message: "Mjeti nuk u gjet." });

  const userId = tryGetUserId(req);
  if (userId) {
    // update "viewed" (upsert + lastViewedAt)
    const user = await User.findById(userId).select("viewed");
    if (user) {
      const vid = vehicle._id.toString();
      const idx = user.viewed.findIndex((v) => v.vehicleId.toString() === vid);

      if (idx >= 0) {
        user.viewed[idx].lastViewedAt = new Date();
      } else {
        user.viewed.unshift({ vehicleId: vehicle._id, lastViewedAt: new Date() });
      }

      // mbaj max 50
      user.viewed = user.viewed.slice(0, 50);
      await user.save();
    }
  }

  res.json({ vehicle });
});

export default router;
