import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },

    // info nga klienti
    name: { type: String, trim: true, default: "" },
    phone: { type: String, trim: true, default: "" },
    message: { type: String, trim: true, default: "" },

    // nga ku erdhi
    source: { type: String, enum: ["whatsapp", "form"], default: "form" },

    // metadata
    pageUrl: { type: String, trim: true, default: "" },
    userAgent: { type: String, trim: true, default: "" },
    ip: { type: String, trim: true, default: "" },

    // status
    status: { type: String, enum: ["new", "contacted", "closed"], default: "new" },
    notes: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Lead", leadSchema);
