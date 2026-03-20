import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Comment } from "@/lib/models";
import { getAuthUser } from "@/lib/auth";
import mongoose from "mongoose";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { postId } = await params;
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
    }
    const comments = await Comment.find({ postId })
      .sort({ createdAt: 1 })
      .populate("userId", "username avatar fullName");
    return NextResponse.json(comments);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}

export async function POST(req, { params }) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const { postId } = await params;
    const body = await req.json();
    const { content } = body;
    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
    }
    const comment = await Comment.create({
      postId,
      userId: user._id,
      content,
    });
    await comment.populate("userId", "username avatar fullName");
    return NextResponse.json(comment);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to add comment" }, { status: 500 });
  }
}
