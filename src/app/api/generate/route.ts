import { NextRequest } from "next/server";
import { callGemini, extractJSON } from "@/lib/gemini";
import { buildPrompt } from "@/lib/prompts";
import { GenerateRequest } from "@/types";

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20;
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }

  if (entry.count >= RATE_LIMIT) {
    return false;
  }

  entry.count++;
  return true;
}

const VALID_TYPES = ["youtube-titles", "youtube-tags", "ai-prompts", "viral-youtube-prompts", "viral-video-planner"] as const;

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();

    // Validate type
    if (!VALID_TYPES.includes(body.type)) {
      return Response.json(
        { error: "Invalid tool type." },
        { status: 400 }
      );
    }

    // Validate required fields
    if (
      (body.type === "youtube-titles" || body.type === "youtube-tags") &&
      !body.topic
    ) {
      return Response.json(
        { error: "Topic is required." },
        { status: 400 }
      );
    }
    if ((body.type === "viral-youtube-prompts" || body.type === "viral-video-planner") && !body.topic) {
      return Response.json(
        { error: "Niche/topic is required." },
        { status: 400 }
      );
    }
    if (body.type === "ai-prompts" && !body.goal) {
      return Response.json(
        { error: "Goal is required." },
        { status: 400 }
      );
    }

    // Rate limit
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";
    if (!checkRateLimit(ip)) {
      return Response.json(
        { error: "Rate limit exceeded. Try again later." },
        { status: 429 }
      );
    }

    // Build prompt and call Gemini
    const prompt = buildPrompt(body.type, body);
    const text = await callGemini(prompt);
    const results = extractJSON(text);

    return Response.json({ results });
  } catch (error) {
    console.error("Generate API error:", error);
    return Response.json(
      { error: "Generation failed. Please try again." },
      { status: 500 }
    );
  }
}
