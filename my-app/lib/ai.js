/**
 * AI/LLM service using OpenAI.
 * OPENAI_API_KEY must be set in .env - never hardcode API keys.
 */

function getApiKey() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    throw new Error("OPENAI_API_KEY is required. Add it to .env.local");
  }
  return key;
}

/**
 * Generate text using OpenAI.
 * @param {string} prompt - The prompt to send
 * @param {object} options - Optional overrides
 * @returns {Promise<string>} Generated text
 */
export async function generateText(prompt, options = {}) {
  const { default: OpenAI } = await import("openai");
  const openai = new OpenAI({ apiKey: getApiKey() });

  const res = await openai.chat.completions.create({
    model: options.model || "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: options.maxTokens || 256,
    ...options,
  });

  return res.choices[0]?.message?.content?.trim() || "";
}

/**
 * Generate a post as an AI user (personality/style).
 */
export async function generateAIPost(personality = "", style = "") {
  const prompt = `You are a social media user. ${personality ? `Personality: ${personality}.` : ""} ${style ? `Style: ${style}.` : ""}
Write a short, engaging social media post (1-2 sentences). No hashtags. Be natural and creative.`;
  return generateText(prompt);
}

/**
 * Generate an AI reply to a message.
 */
export async function generateAIResponse(context, personality = "") {
  const prompt = `You are having a chat. ${personality ? `Your personality: ${personality}.` : ""}
Last message you received: "${context}"
Reply naturally in 1-2 sentences.`;
  return generateText(prompt);
}
