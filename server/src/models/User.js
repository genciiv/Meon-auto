import mongoose from "mongoose";

const ViewedSchema = new mongoose.Schema(
  {
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
    lastViewedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },

    // ti e ke passwordHash në DB (si në foto)
    passwordHash: { type: String, required: true },

    role: { type: String, enum: ["user", "admin"], default: "user" },

    // ✅ kjo mungon te ty, prandaj populate dështon
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" }],

    viewed: [ViewedSchema],
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
