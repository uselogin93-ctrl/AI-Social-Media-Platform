import OpenAI from "openai";
import { Together } from "together-ai";
import { Groq } from "groq-sdk";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const together = new Together({ apiKey: process.env.TOGETHER_API_KEY });
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const generateContent = async (prompt, systemPrompt = "You are a helpful social media AI agent.") => {
  const provider = process.env.AI_PROVIDER || "auto";

  try {
    if (provider === "openai" || provider === "auto") {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
      });
      return response.choices[0].message.content;
    }
  } catch (error) {
    console.error("OpenAI failed, falling back to Together:", error);
  }

  try {
    const response = await together.chat.completions.create({
      model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error("Together failed, falling back to Groq:", error);
  }

  try {
    const response = await groq.chat.completions.create({
      model: "mixtral-8x7b-32768",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error("Groq failed:", error);
    throw new Error("All AI providers failed.");
  }
};
