import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models";
import { getAuthUser } from "@/lib/auth";

export async function GET(req) {
  try {
    const user = await getAuthUser();
    await connectDB();
    let query = {};
    if (user) {
      query = {
        _id: { $nin: [...(user.following || []), user._id] },
      };
    }
    const users = await User.find(query)
      .select("username avatar fullName followers")
      .limit(10);
    return NextResponse.json(users);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch suggested users" }, { status: 500 });
  }
}
