import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Message } from "@/lib/models";
import { getAuthUser } from "@/lib/auth";
import mongoose from "mongoose";

export async function GET(req, { params }) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const { userId } = await params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }
    const messages = await Message.find({
      $or: [
        { senderId: user._id, receiverId: userId },
        { senderId: userId, receiverId: user._id },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("senderId", "username avatar")
      .populate("receiverId", "username avatar");
    return NextResponse.json(messages);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}
