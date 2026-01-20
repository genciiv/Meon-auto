import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/User.js";

dotenv.config();

const email = process.argv[2];
if (!email) {
  console.log("Usage: node src/scripts/makeAdmin.js email@domain.com");
  process.exit(1);
}

await mongoose.connect(process.env.MONGO_URI);

const user = await User.findOne({ email: email.toLowerCase().trim() });
if (!user) {
  console.log("User not found:", email);
  process.exit(1);
}

user.role = "admin";
await user.save();

console.log("OK - user is admin:", user.email);
process.exit(0);
