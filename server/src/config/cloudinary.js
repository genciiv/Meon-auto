import { v2 as cloudinary } from "cloudinary";

const name = process.env.CLOUDINARY_CLOUD_NAME;
const key = process.env.CLOUDINARY_API_KEY;
const secret = process.env.CLOUDINARY_API_SECRET;

// Debug (nuk tregon vlerat, vetëm true/false)
console.log("Cloudinary ENV:", {
  CLOUDINARY_CLOUD_NAME: Boolean(name),
  CLOUDINARY_API_KEY: Boolean(key),
  CLOUDINARY_API_SECRET: Boolean(secret),
});

cloudinary.config({
  cloud_name: name,
  api_key: key,
  api_secret: secret,
});

export default cloudinary;
