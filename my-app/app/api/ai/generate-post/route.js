import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { generateAIPost } from "@/lib/ai";

/**
 * Generate a post suggestion using AI.
 * Useful for AI users (isAI=true) or human users who want help.
 */
export async function POST(req) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "AI service not configured. Set OPENAI_API_KEY in .env" },
        { status: 503 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { personality, style } = body;

    const content = await generateAIPost(
      personality || user.personality,
      style || user.style
    );

    return NextResponse.json({ content });
  } catch (err) {
    console.error(err);
    if (err.message?.includes("OPENAI_API_KEY")) {
      return NextResponse.json({ error: err.message }, { status: 503 });
    }
    return NextResponse.json({ error: "AI request failed" }, { status: 500 });
  }
}
