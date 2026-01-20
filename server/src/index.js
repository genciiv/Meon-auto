import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectDB } from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import vehicleRoutes from "./routes/vehicle.routes.js";
import userRoutes from "./routes/user.routes.js";
import blogRoutes from "./routes/blog.routes.js";
import adminRoutes from "./routes/admin.routes.js";


dotenv.config();

const app = express();

// Middlewares
app.use(express.json({ limit: "2mb" }));
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Routes
app.get("/api/health", (req, res) => res.json({ ok: true, app: "Auto Meon API" }));

app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/users", userRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/admin", adminRoutes);


// Error fallback
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Gabim i serverit." });
});

const PORT = process.env.PORT || 5000;

connectDB(process.env.MONGO_URI)
  .then(() => app.listen(PORT, () => console.log(`API running on :${PORT}`)))
  .catch((e) => {
    console.error("DB connect error:", e.message);
    process.exit(1);
  });
