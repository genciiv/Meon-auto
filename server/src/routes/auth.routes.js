import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

function signToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
}

// POST /api/auth/register
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Plotëso të gjitha fushat." });
  }

  const exists = await User.findOne({ email: String(email).toLowerCase() });
  if (exists) return res.status(400).json({ message: "Email ekziston." });

  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email: String(email).toLowerCase(),
    passwordHash: hash,
    role: "user",
    favourites: [],
    viewed: [],
  });

  const token = signToken(user);
  res.json({
    token,
    user: { _id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ message: "Email/Password të detyrueshme." });
  }

  const user = await User.findOne({ email: String(email).toLowerCase() });
  if (!user) return res.status(400).json({ message: "Email ose password gabim." });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(400).json({ message: "Email ose password gabim." });

  const token = signToken(user);
  res.json({
    token,
    user: { _id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

// ✅ GET /api/auth/me
router.get("/me", requireAuth, async (req, res) => {
  const user = req.user; // nga middleware
  res.json({
    user: { _id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

export default router;
