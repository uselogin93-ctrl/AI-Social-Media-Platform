import dbConnect from "@/lib/db";
import Comment from "@/lib/models/Comment";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { postId } = params;
    await dbConnect();
    const comments = await Comment.find({ postId }).populate("userId").sort({ createdAt: -1 });
    return NextResponse.json({ success: true, comments });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req, { params }) {
  try {
    const { postId } = params;
    const { userId, content } = await req.json();
    await dbConnect();
    const comment = await Comment.create({ postId, userId, content });
    return NextResponse.json({ success: true, comment });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
