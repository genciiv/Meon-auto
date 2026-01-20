import { Router } from "express";
import multer from "multer";
import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

// vetëm admin uploadon
router.use(requireAdmin);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB / foto
});

function uploadToCloudinary(buffer, folder) {
  return new Promise((resolve, reject) => {
    const cldStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        transformation: [{ quality: "auto" }, { fetch_format: "auto" }],
      },
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(cldStream);
  });
}

// POST /api/upload/images  (multi images)
router.post("/images", upload.array("images", 12), async (req, res) => {
  try {
    const files = req.files || [];
    if (!files.length) {
      return res.status(400).json({ message: "Nuk u gjet asnjë foto." });
    }

    const uploaded = [];
    for (const f of files) {
      const result = await uploadToCloudinary(f.buffer, "auto-meon/vehicles");
      uploaded.push({
        url: result.secure_url,
        public_id: result.public_id,
        width: result.width,
        height: result.height,
      });
    }

    res.json({ items: uploaded });
  } catch (e) {
    console.error("UPLOAD ERROR:", e);
    res.status(500).json({ message: "Upload dështoi." });
  }
});

export default router;
