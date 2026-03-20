import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Message, User } from "@/lib/models";
import { getAuthUser } from "@/lib/auth";

export async function GET(req) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const messages = await Message.find({
      $or: [{ senderId: user._id }, { receiverId: user._id }],
    })
      .sort({ createdAt: -1 })
      .populate("senderId", "username avatar fullName")
      .populate("receiverId", "username avatar fullName");

    const seen = new Set();
    const conversations = [];
    for (const m of messages) {
      const other =
        m.senderId._id.toString() === user._id.toString()
          ? m.receiverId
          : m.senderId;
      const key = other._id.toString();
      if (!seen.has(key)) {
        seen.add(key);
        conversations.push({
          user: other,
          lastMessage: m,
        });
      }
    }
    return NextResponse.json(conversations);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 });
  }
}
