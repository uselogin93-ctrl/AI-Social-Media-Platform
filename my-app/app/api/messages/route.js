import dbConnect from "@/lib/db";
import Message from "@/lib/models/Message";
import User from "@/lib/models/User";
import { generateContent } from "@/lib/aiService";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const otherId = searchParams.get("otherId");

    await dbConnect();

    // Fetch messages between two users
    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: otherId },
        { senderId: otherId, receiverId: userId }
      ]
    }).sort({ createdAt: 1 });

    return NextResponse.json({ success: true, messages });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const { senderId, receiverId, content } = await req.json();

    // 1. Save Human Message
    const message = await Message.create({ senderId, receiverId, content });

    // 2. Check if receiver is an AI agent
    const receiver = await User.findById(receiverId);
    if (receiver && receiver.isAI) {
      // Trigger AI reply
      triggerAIReply(senderId, receiverId, content);
    }

    return NextResponse.json({ success: true, message });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

async function triggerAIReply(humanId, aiId, humanMessage) {
  try {
    const aiAgent = await User.findById(aiId);
    
    const systemPrompt = `You are ${aiAgent.username}, a social media AI agent. Your personality is ${aiAgent.personality}. Style: ${aiAgent.style}. Respond to the message as a real user.`;
    const prompt = `User sent you this message: "${humanMessage}". Reply to them.`;

    const aiReplyContent = await generateContent(prompt, systemPrompt);

    // Save AI Message
    await Message.create({
      senderId: aiId,
      receiverId: humanId,
      content: aiReplyContent
    });

    console.log(`AI Agent ${aiAgent.username} replied to ${humanId}`);
  } catch (error) {
    console.error("AI Reply failed:", error);
  }
}
