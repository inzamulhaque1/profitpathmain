import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { PlannerInputs, TitlesResponse } from "@/lib/viral-planner-types";
import { VISUAL_STYLES, TONES, CLIP_COUNTS, CLIP_DURATIONS, LANGUAGES, SPEEDS } from "@/lib/viral-planner-types";
import { buildTitleSuggestionsPrompt } from "@/lib/viral-planner-prompts";

export async function POST(request: Request) {
  try {
    const { inputs } = (await request.json()) as { inputs: PlannerInputs };

    if (!inputs?.topic || typeof inputs.topic !== "string" || inputs.topic.trim().length < 3) {
      return NextResponse.json(
        { success: false, error: "Topic must be at least 3 characters" } satisfies TitlesResponse,
        { status: 400 }
      );
    }
    if (!VISUAL_STYLES.includes(inputs.visualStyle)) {
      return NextResponse.json({ success: false, error: "Invalid visual style" } satisfies TitlesResponse, { status: 400 });
    }
    if (!TONES.includes(inputs.tone)) {
      return NextResponse.json({ success: false, error: "Invalid tone" } satisfies TitlesResponse, { status: 400 });
    }
    if (!CLIP_COUNTS.includes(inputs.clipCount)) {
      return NextResponse.json({ success: false, error: "Invalid clip count" } satisfies TitlesResponse, { status: 400 });
    }
    if (!CLIP_DURATIONS.includes(inputs.clipDuration)) {
      return NextResponse.json({ success: false, error: "Invalid clip duration" } satisfies TitlesResponse, { status: 400 });
    }
    if (!LANGUAGES.includes(inputs.narrationLanguage)) {
      return NextResponse.json({ success: false, error: "Invalid language" } satisfies TitlesResponse, { status: 400 });
    }
    if (!SPEEDS.includes(inputs.narrationSpeed)) {
      return NextResponse.json({ success: false, error: "Invalid speed" } satisfies TitlesResponse, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "Server configuration error: missing GEMINI_API_KEY" } satisfies TitlesResponse,
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = buildTitleSuggestionsPrompt(inputs);
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const cleaned = responseText.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    let titles: string[];
    try {
      titles = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { success: false, error: "AI returned an invalid response. Please try again." } satisfies TitlesResponse,
        { status: 500 }
      );
    }

    if (!Array.isArray(titles) || titles.length !== 5 || !titles.every((t) => typeof t === "string")) {
      return NextResponse.json(
        { success: false, error: "AI response was incomplete. Please try again." } satisfies TitlesResponse,
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, titles } satisfies TitlesResponse);
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    console.error("Viral planner titles error:", message);

    if (message.includes("429") || message.includes("quota") || message.includes("Too Many Requests")) {
      return NextResponse.json(
        { success: false, error: "API rate limit reached. Please wait a minute and try again." } satisfies TitlesResponse,
        { status: 429 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." } satisfies TitlesResponse,
      { status: 500 }
    );
  }
}
