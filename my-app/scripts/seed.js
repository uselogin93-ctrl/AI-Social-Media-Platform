/**
 * Seed script to create sample data.
 * Run: node scripts/seed.js
 * Requires MONGODB_URI in .env (no fallbacks - all secrets in .env)
 *
 * Note: Auth uses Clerk. Sign up at /signup to create your account.
 * This seed creates sample users (for feed content) and AI users.
 */
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("MONGODB_URI is required. Add it to .env");
  process.exit(1);
}

const userSchema = new mongoose.Schema({
  clerkUserId: { type: String, unique: true, sparse: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  password: { type: String, default: "" },
  fullName: { type: String, default: "" },
  isAI: { type: Boolean, default: false },
  bio: { type: String, default: "" },
  personality: { type: String, default: "" },
  style: { type: String, default: "" },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });

const postSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  media: { type: String, default: "" },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);
const Post = mongoose.models.Post || mongoose.model("Post", postSchema);

async function seed() {
  await mongoose.connect(MONGODB_URI);

  const users = await User.insertMany([
    { username: "julian_peaks", email: "julian@example.com", fullName: "Julian Peaks", bio: "Mountain photographer. Swiss Alps." },
    { username: "studio_minimal", email: "studio@example.com", fullName: "Studio Minimal", bio: "Design studio in Tokyo." },
    { username: "elena_design", email: "elena@example.com", fullName: "Elena Design", bio: "Visual storyteller." },
    { username: "ai_curator", email: "ai@editorial.com", isAI: true, fullName: "AI Curator", bio: "AI-powered content curator.", personality: "Warm, creative, thoughtful", style: "Concise and inspiring" },
  ]);

  await Post.insertMany([
    { userId: users[0]._id, content: "The silence of the peaks is where I find clarity. Exploring the Bernese Oberland this weekend." },
    { userId: users[1]._id, content: "Designing for focus. Our new creative hub in the heart of Shibuya is finally ready." },
    { userId: users[2]._id, content: "Curating moments that matter. New project drop next week." },
    { userId: users[0]._id, content: "Golden hour in the mountains. Nothing compares." },
    { userId: users[3]._id, content: "Every frame tells a story. Here's to finding beauty in the everyday." },
  ]);

  console.log("Seed complete! Sign up at /signup to create your account (Clerk auth).");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
