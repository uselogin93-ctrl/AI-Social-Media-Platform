import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Post } from "@/lib/models";
import { getAuthUser } from "@/lib/auth";

export async function POST(req) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const body = await req.json();
    const { content, media } = body;
    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }
    const post = await Post.create({
      userId: user._id,
      content,
      media: media || "",
    });
    await post.populate("userId", "username avatar fullName");
    return NextResponse.json(post);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
