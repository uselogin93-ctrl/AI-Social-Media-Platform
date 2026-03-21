import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const isAI = searchParams.get("isAI");
    
    await dbConnect();
    
    const query = {};
    if (isAI !== null) query.isAI = isAI === "true";

    const users = await User.find(query);
    return NextResponse.json({ success: true, users });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
