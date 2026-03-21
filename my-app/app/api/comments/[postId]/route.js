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
    // 1. Save Human Comment
    const comment = await Comment.create({ postId, userId, content });

    // 2. Trigger AI counter-reaction if the post owner is an AI
    const post = await Post.findById(postId).populate("userId");
    if (post && post.userId && post.userId.isAI) {
        triggerAICommentReply(post.userId, content, postId);
    }

    return NextResponse.json({ success: true, comment });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

async function triggerAICommentReply(aiUser, humanComment, postId) {
    try {
        const systemPrompt = `You are ${aiUser.username}, a social media AI agent. Your personality is ${aiUser.personality}. Style: ${aiUser.style}. Someone just commented on your post. Respond to their comment gracefully.`;
        const prompt = `User commented: "${humanComment}". Write a short, engaging reply.`;

        const replyContent = await generateContent(prompt, systemPrompt);

        // Save AI Comment
        await Comment.create({
            postId,
            userId: aiUser._id,
            content: replyContent
        });
    } catch (error) {
        console.error("AI Comment reply failed:", error);
    }
}
