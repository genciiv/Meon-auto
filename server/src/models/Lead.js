import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },

    message: { type: String, trim: true, required: true, minlength: 3 },
    phone: { type: String, trim: true }, // opsionale

    channel: { type: String, enum: ["form", "whatsapp"], default: "form" },
  },
  { timestamps: true }
);

export default mongoose.model("Lead", leadSchema);
