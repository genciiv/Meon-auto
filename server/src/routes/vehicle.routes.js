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

// ✅ helper për featured aktive
function featuredActiveMatch() {
  return {
    featured: true,
    $or: [{ featuredUntil: null }, { featuredUntil: { $gt: new Date() } }],
  };
}

// ✅ GET /api/vehicles/featured?type=car|truck&limit=8
router.get("/featured", async (req, res) => {
  const type = req.query.type;
  const limit = Math.min(24, Math.max(1, Number(req.query.limit || 8)));

  const q = { status: "active", ...featuredActiveMatch() };
  if (type) q.type = type;

  const items = await Vehicle.find(q).sort({ updatedAt: -1 }).limit(limit);
  res.json({ items });
});

// ✅ GET /api/vehicles/recent?type=car|truck&limit=12
router.get("/recent", async (req, res) => {
  const type = req.query.type;
  const limit = Math.min(48, Math.max(1, Number(req.query.limit || 12)));

  const q = { status: "active" };
  if (type) q.type = type;

  const items = await Vehicle.find(q).sort({ createdAt: -1 }).limit(limit);
  res.json({ items });
});

// ✅ GET /api/vehicles?...
router.get("/", async (req, res) => {
  const {
    type,
    make,
    model,
    city,
    truckType,

    // NEW filters
    fuel,
    gearbox,
    mileageMin,
    mileageMax,

    yearMin,
    yearMax,
    priceMin,
    priceMax,

    sort = "new",
    featuredFirst = "1",

    page = 1,
    limit = 12,
  } = req.query;

  const q = { status: "active" };

  if (type) q.type = type;
  if (make) q.make = new RegExp(String(make).trim(), "i");
  if (model) q.model = new RegExp(String(model).trim(), "i");
  if (city) q.city = new RegExp(String(city).trim(), "i");
  if (truckType) q.truckType = String(truckType).trim();

  if (fuel) q.fuel = new RegExp(String(fuel).trim(), "i");
  if (gearbox) q.gearbox = new RegExp(String(gearbox).trim(), "i");

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

  if (mileageMin || mileageMax) {
    q.mileageKm = {};
    if (mileageMin) q.mileageKm.$gte = Number(mileageMin);
    if (mileageMax) q.mileageKm.$lte = Number(mileageMax);
  }

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(48, Math.max(6, Number(limit)));

  const sortMap = {
    new: { createdAt: -1 },
    priceAsc: { price: 1, createdAt: -1 },
    priceDesc: { price: -1, createdAt: -1 },
  };

  // ✅ featuredFirst: true -> përdor aggregation për "featured aktive" lart
  const ff = String(featuredFirst) !== "0";

  const pipeline = [
    { $match: q },
    {
      $addFields: {
        featuredActive: {
          $cond: [
            {
              $and: [
                { $eq: ["$featured", true] },
                {
                  $or: [
                    { $eq: ["$featuredUntil", null] },
                    { $gt: ["$featuredUntil", new Date()] },
                  ],
                },
              ],
            },
            1,
            0,
          ],
        },
      },
    },
    {
      $sort: ff
        ? { featuredActive: -1, ...(sortMap[sort] || sortMap.new) }
        : { ...(sortMap[sort] || sortMap.new) },
    },
    {
      $facet: {
        items: [
          { $skip: (pageNum - 1) * limitNum },
          { $limit: limitNum },
          {
            $project: {
              featuredActive: 0, // s’na duhet në response
            },
          },
        ],
        totalCount: [{ $count: "count" }],
      },
    },
  ];

  const result = await Vehicle.aggregate(pipeline);
  const items = result?.[0]?.items || [];
  const total = result?.[0]?.totalCount?.[0]?.count || 0;

  res.json({
    items,
    page: pageNum,
    limit: limitNum,
    total,
    pages: Math.ceil(total / limitNum),
  });
});

// ✅ GET /api/vehicles/:id (ruan viewed nëse ka token)
router.get("/:id", async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);
  if (!vehicle) return res.status(404).json({ message: "Mjeti nuk u gjet." });

  const userId = tryGetUserId(req);
  if (userId) {
    const user = await User.findById(userId).select("viewed");
    if (user) {
      const vid = vehicle._id.toString();
      const idx = user.viewed.findIndex((v) => v.vehicleId.toString() === vid);

      if (idx >= 0) user.viewed[idx].lastViewedAt = new Date();
      else user.viewed.unshift({ vehicleId: vehicle._id, lastViewedAt: new Date() });

      user.viewed = user.viewed.slice(0, 50);
      await user.save();
    }
  }

  // ✅ ruaj formatin që ke tani
  res.json({ vehicle });
});

export default router;
