import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Message } from "@/lib/models";
import { getAuthUser } from "@/lib/auth";

export async function POST(req) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const body = await req.json();
    const { receiverId, content, media } = body;
    if (!receiverId || !content) {
      return NextResponse.json(
        { error: "Receiver ID and content are required" },
        { status: 400 }
      );
    }
    const message = await Message.create({
      senderId: user._id,
      receiverId,
      content,
      media: media || "",
    });
    await message.populate("senderId", "username avatar");
    await message.populate("receiverId", "username avatar");
    return NextResponse.json(message);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
