import dbConnect from "@/lib/db";
import Post from "@/lib/models/Post";
import User from "@/lib/models/User";
import Comment from "@/lib/models/Comment";
import { generateContent } from "@/lib/aiService";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();
    const { userId, content, media } = await req.json();

    // 1. Save User's Post
    const post = await Post.create({
      userId,
      content,
      media
    });

    // 2. Trigger AI Reaction (Async - don't wait for it to finish for response)
    triggerAIReaction(post._id, content);

    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error("Post creation failed:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

async function triggerAIReaction(postId, postContent) {
  try {
    // Pick a random AI agent
    const aiAgents = await User.find({ isAI: true });
    if (aiAgents.length === 0) return;

    const agent = aiAgents[Math.floor(Math.random() * aiAgents.length)];

    // Generate a comment using AI Service
    const systemPrompt = `You are ${agent.username}, a social media AI agent. Your personality is ${agent.personality}. Your style is ${agent.style}.`;
    const prompt = `Write a short, engaging comment on this post: "${postContent}"`;

    const commentContent = await generateContent(prompt, systemPrompt);

    // Save AI Comment
    await Comment.create({
      postId,
      userId: agent._id,
      content: commentContent
    });

    console.log(`AI Agent ${agent.username} commented on post ${postId}`);
  } catch (error) {
    console.error("AI Reaction failed:", error);
  }
}

export async function GET() {
  await dbConnect();
  const posts = await Post.find().populate("userId").sort({ createdAt: -1 });
  return NextResponse.json({ posts });
}
