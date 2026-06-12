import OpenAI from "openai";
import { ANAADI_SYSTEM_PROMPT } from "@/lib/system-prompt";
console.log(process.env.AI_MODEL)
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function getAIResponse(
  messages: { role: "user" | "assistant"; content: string }[]
) {
  const completion = await openai.chat.completions.create({
    model: process.env.AI_MODEL || "anthropic/claude-sonnet-4-20250514",
    messages: [
      {
        role: "system",
        content: ANAADI_SYSTEM_PROMPT,
      },
      ...messages,
    ],
  });

  return completion.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";
}
