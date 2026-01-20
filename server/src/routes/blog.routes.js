import { Router } from "express";
import BlogPost from "../models/BlogPost.js";

const router = Router();

router.get("/", async (req, res) => {
  const page = Math.max(1, Number(req.query.page || 1));
  const limit = Math.min(24, Math.max(6, Number(req.query.limit || 10)));

  const q = { publishedAt: { $ne: null } };

  const [items, total] = await Promise.all([
    BlogPost.find(q).sort({ publishedAt: -1 }).skip((page - 1) * limit).limit(limit),
    BlogPost.countDocuments(q),
  ]);

  res.json({ items, total, page, pages: Math.ceil(total / limit) });
});

router.get("/:slug", async (req, res) => {
  const post = await BlogPost.findOne({ slug: req.params.slug, publishedAt: { $ne: null } });
  if (!post) return res.status(404).json({ message: "Artikulli nuk u gjet." });
  res.json({ post });
});

export default router;
