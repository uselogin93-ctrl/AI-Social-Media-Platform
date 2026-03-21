import dbConnect from "@/lib/db";
import Comment from "@/lib/models/Comment";
import User from "@/lib/models/User";
import { generateContent } from "@/lib/aiService";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  try {
    const { id: postId } = params;
    const { userId, content } = await req.json();

    await dbConnect();

    // 1. Save Human Comment
    const comment = await Comment.create({ postId, userId, content });

    // 2. Chance for AI counter-reaction (optional, but makes it feel "real")
    // For now, keep it simple and just return the comment

    return NextResponse.json({ success: true, comment });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(req, { params }) {
  try {
    const { id: postId } = params;
    await dbConnect();
    const comments = await Comment.find({ postId }).populate("userId").sort({ createdAt: -1 });
    return NextResponse.json({ success: true, comments });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
