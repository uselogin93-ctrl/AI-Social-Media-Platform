import { seedAI } from "@/lib/seedAI";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await seedAI();
    return NextResponse.json({ success: true, message: "AI Agents Seeded" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
