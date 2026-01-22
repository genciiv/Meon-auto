import { Router } from "express";
import mongoose from "mongoose";
import Lead from "../models/Lead.js";
import Vehicle from "../models/Vehicle.js";

const router = Router();

/**
 * POST /api/leads
 * krijon lead kur klikohet WhatsApp ose dërgohet forma
 */
router.post("/", async (req, res) => {
  try {
    const { vehicleId, name, phone, message, source, pageUrl } = req.body || {};

    if (!vehicleId || !mongoose.Types.ObjectId.isValid(vehicleId)) {
      return res.status(400).json({ message: "vehicleId i pavlefshëm." });
    }

    const vehicle = await Vehicle.findById(vehicleId).select("_id title");
    if (!vehicle) return res.status(404).json({ message: "Mjeti nuk u gjet." });

    const lead = await Lead.create({
      vehicleId: vehicle._id,
      name: String(name || "").trim(),
      phone: String(phone || "").trim(),
      message: String(message || "").trim(),
      source: source === "whatsapp" ? "whatsapp" : "form",
      pageUrl: String(pageUrl || "").trim(),
      userAgent: String(req.headers["user-agent"] || ""),
      ip:
        (req.headers["x-forwarded-for"] || "").toString().split(",")[0].trim() ||
        req.socket?.remoteAddress ||
        "",
      status: "new",
    });

    return res.status(201).json({ ok: true, leadId: lead._id });
  } catch (e) {
    console.error("LEAD CREATE ERROR:", e);
    return res.status(500).json({ message: "Gabim gjatë krijimit të lead." });
  }
});

export default router;
