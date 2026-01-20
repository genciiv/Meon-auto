import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["car", "truck"], required: true },

    title: { type: String, required: true, trim: true }, // p.sh. "Mercedes C200 2016"
    make: { type: String, trim: true }, // marka
    model: { type: String, trim: true },
    year: { type: Number },
    price: { type: Number },
    mileageKm: { type: Number },

    fuel: { type: String, trim: true }, // nafte/benzin/gaz/hibrid/elektrike
    gearbox: { type: String, trim: true }, // manual/automat
    city: { type: String, trim: true },

    truckType: { type: String, trim: true }, // p.sh. trailer/bus/agricultural...

    description: { type: String, trim: true },
    images: [{ type: String }], // URL-t e fotove

    featured: { type: Boolean, default: false },
    featuredUntil: { type: Date, default: null },

    status: { type: String, enum: ["active", "sold", "hidden"], default: "active" },
  },
  { timestamps: true }
);

vehicleSchema.index({ type: 1, featured: 1, createdAt: -1 });
vehicleSchema.index({ make: 1, model: 1, year: -1 });

export default mongoose.model("Vehicle", vehicleSchema);
