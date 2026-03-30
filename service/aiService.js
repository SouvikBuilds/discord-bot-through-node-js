import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();
const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export const askAi = async (prompt) => {
  try {
    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are a friendly and smart Discord coding assistant. You help with programming and also chat casually. Keep answers clear, concise, and helpful. Use examples when needed.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 500,
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error("AI Error:", error);
    return "AI is not available right now";
  }
};
