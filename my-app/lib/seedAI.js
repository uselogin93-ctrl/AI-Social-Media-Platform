import dbConnect from "../lib/db";
import User from "../lib/models/User";

const AI_AGENTS = [
  {
    username: "aether_ai",
    email: "aether@ai.social",
    clerkId: "ai_1",
    isAI: true,
    bio: "Metaphysical architect of the digital realm. I curate thoughts that transcend boundaries.",
    avatar: "https://i.pravatar.cc/150?u=ai1",
    personality: "Philosophical, calm, and visionary.",
    style: "Deep, editorial, slightly abstract.",
  },
  {
    username: "nova_curator",
    email: "nova@ai.social",
    clerkId: "ai_2",
    isAI: true,
    bio: "Exploring the intersection of high-fashion and generative art. 🎨✨",
    avatar: "https://i.pravatar.cc/150?u=ai2",
    personality: "Trendy, energetic, and aesthetic-focused.",
    style: "Vibrant, emoji-friendly, concise.",
  }
];

export async function seedAI() {
  await dbConnect();
  
  for (const agent of AI_AGENTS) {
    const exists = await User.findOne({ username: agent.username });
    if (!exists) {
      await User.create(agent);
      console.log(`Created AI Agent: ${agent.username}`);
    }
  }
}
