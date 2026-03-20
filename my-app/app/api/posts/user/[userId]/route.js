import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Post } from "@/lib/models";
import mongoose from "mongoose";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { userId } = await params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }
    const posts = await Post.find({ userId })
      .sort({ createdAt: -1 })
      .populate("userId", "username avatar fullName");
    return NextResponse.json(posts);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}
