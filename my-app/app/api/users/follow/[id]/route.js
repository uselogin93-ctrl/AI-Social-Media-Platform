import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models";
import { getAuthUser } from "@/lib/auth";
import mongoose from "mongoose";

export async function POST(req, { params }) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }
    const targetUser = await User.findById(id);
    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const currentUserDoc = await User.findById(user._id);
    const isFollowing = currentUserDoc.following.some(
      (f) => f.toString() === id
    );
    if (isFollowing) {
      currentUserDoc.following = currentUserDoc.following.filter(
        (f) => f.toString() !== id
      );
      targetUser.followers = targetUser.followers.filter(
        (f) => f.toString() !== user._id.toString()
      );
    } else {
      currentUserDoc.following.push(id);
      targetUser.followers.push(user._id);
    }
    await currentUserDoc.save();
    await targetUser.save();
    return NextResponse.json({ following: !isFollowing });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update follow" }, { status: 500 });
  }
}
