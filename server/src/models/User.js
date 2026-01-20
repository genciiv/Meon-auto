import mongoose from "mongoose";

const viewedSchema = new mongoose.Schema(
  {
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
    lastViewedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2 },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    passwordHash: { type: String, required: true },

    role: { type: String, enum: ["user", "admin"], default: "user" },

    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" }],
    viewed: [viewedSchema],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
