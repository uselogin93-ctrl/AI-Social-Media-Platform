import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Post } from "@/lib/models";
import { getAuthUser } from "@/lib/auth";
import mongoose from "mongoose";

export async function POST(req, { params }) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
    }
    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    const idx = post.likes.findIndex((l) => l.toString() === user._id.toString());
    const liked = idx === -1;
    if (liked) {
      post.likes.push(user._id);
    } else {
      post.likes.splice(idx, 1);
    }
    await post.save();
    return NextResponse.json({ liked, likesCount: post.likes.length });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to like post" }, { status: 500 });
  }
}
