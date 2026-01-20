import mongoose from "mongoose";

const blogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, unique: true },
    coverImage: { type: String, default: "" },
    content: { type: String, required: true },
    tags: [{ type: String, trim: true }],
    publishedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("BlogPost", blogPostSchema);
