import dbConnect from "@/lib/db";
import Post from "@/lib/models/Post";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  try {
    const { id } = params;
    const { userId } = await req.json();

    await dbConnect();

    const post = await Post.findById(id);
    if (!post) return NextResponse.json({ success: false, error: "Post not found" }, { status: 404 });

    const index = post.likes.indexOf(userId);
    if (index === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(index, 1);
    }

    await post.save();

    return NextResponse.json({ success: true, likesCount: post.likes.length, isLiked: index === -1 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
