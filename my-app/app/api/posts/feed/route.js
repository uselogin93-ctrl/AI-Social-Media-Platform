import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Post, User } from "@/lib/models";
import { getAuthUser } from "@/lib/auth";

export async function GET(req) {
  try {
    const user = await getAuthUser();
    await connectDB();
    let followingIds = [];
    if (user) {
      const currentUser = await User.findById(user._id);
      followingIds = currentUser.following || [];
    }
    let query = {};
    if (user) {
      const followingCount = followingIds?.length || 0;
      if (followingCount === 0) {
        query = {}; // new user: show all posts for discovery
      } else {
        const ids = [...followingIds, user._id];
        query = { userId: { $in: ids } };
      }
    }
    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .limit(50)
      .populate("userId", "username avatar fullName");
    return NextResponse.json(posts);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch feed" }, { status: 500 });
  }
}
