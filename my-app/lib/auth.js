import { auth, currentUser } from "@clerk/nextjs/server";
import { connectDB } from "./db";
import { User } from "./models";

/**
 * Get current user from Clerk and sync to MongoDB.
 * All secrets (Clerk keys) must be in .env - no hardcoded fallbacks.
 */
export async function getAuthUser() {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) return null;

  await connectDB();
  let user = await User.findOne({ clerkUserId });
  if (user) return user;

  const clerkUser = await currentUser();
  if (!clerkUser) return null;
  return getOrCreateUser(clerkUser);
}

/**
 * Get or create MongoDB user from Clerk user.
 */
export async function getOrCreateUser(clerkUser) {
  if (!clerkUser) return null;
  await connectDB();

  let user = await User.findOne({ clerkUserId: clerkUser.id });
  if (user) return user;

  const email = clerkUser.emailAddresses?.[0]?.emailAddress || "";
  const username =
    clerkUser.username ||
    clerkUser.firstName ||
    email?.split("@")[0] ||
    `user_${clerkUser.id.slice(-8)}`;
  const baseUsername = username.toLowerCase().replace(/\s/g, "_").replace(/[^a-z0-9_]/g, "");
  let uniqueUsername = baseUsername;
  let n = 1;
  while (await User.findOne({ username: uniqueUsername })) {
    uniqueUsername = `${baseUsername}${n}`;
    n++;
  }

  user = await User.create({
    clerkUserId: clerkUser.id,
    username: uniqueUsername,
    email: email || `${clerkUser.id}@clerk.user`,
    password: "", // Clerk users don't use password
    fullName: [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || uniqueUsername,
    avatar: clerkUser.imageUrl || "",
  });

  return user;
}
