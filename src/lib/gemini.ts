import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function callGemini(prompt: string): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      temperature: 0.8,
      maxOutputTokens: 8192,
      responseMimeType: "application/json",
    },
  });

  const result = await model.generateContent(prompt);
  return result.response.text();
}

export function extractJSON(text: string): unknown {
  // With responseMimeType: "application/json", Gemini should return pure JSON
  // But try direct parse first
  try {
    return JSON.parse(text);
  } catch {
    // Fall through to regex extraction
  }

  // Strip markdown code fences if present
  const stripped = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
  try {
    return JSON.parse(stripped);
  } catch {
    // Fall through
  }

  // Try to find JSON array or object in the response
  const arrayMatch = stripped.match(/\[[\s\S]*\]/);
  if (arrayMatch) {
    try {
      return JSON.parse(arrayMatch[0]);
    } catch {
      // Fall through
    }
  }

  const objectMatch = stripped.match(/\{[\s\S]*\}/);
  if (objectMatch) {
    try {
      return JSON.parse(objectMatch[0]);
    } catch {
      // Fall through
    }
  }

  console.error("Failed to extract JSON from response:", text.substring(0, 500));
  throw new Error("No JSON found in response");
}
