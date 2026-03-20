import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { generateText } from "@/lib/ai";

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

    const { message } = await req.json();
    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const reply = await generateText(
      `You are a helpful AI assistant on a social media platform. A user said: "${message}". Reply in a friendly, helpful way (1-2 sentences).`
    );

    return NextResponse.json({ reply });
  } catch (err) {
    console.error(err);
    if (err.message?.includes("OPENAI_API_KEY")) {
      return NextResponse.json({ error: err.message }, { status: 503 });
    }
    return NextResponse.json({ error: "AI request failed" }, { status: 500 });
  }
}
