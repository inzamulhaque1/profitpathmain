import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { PlannerInputs, GenerateResponse, GeneratedVideo } from "@/lib/viral-planner-types";
import { buildVideoPrompt } from "@/lib/viral-planner-prompts";

export async function POST(request: Request) {
  try {
    const { inputs, selectedTitle } = (await request.json()) as {
      inputs: PlannerInputs;
      selectedTitle: string;
    };

    if (!inputs?.topic || inputs.topic.trim().length < 3) {
      return NextResponse.json(
        { success: false, error: "Topic must be at least 3 characters" } satisfies GenerateResponse,
        { status: 400 }
      );
    }
    if (!selectedTitle || typeof selectedTitle !== "string" || selectedTitle.trim().length < 3) {
      return NextResponse.json(
        { success: false, error: "Please select or enter a title" } satisfies GenerateResponse,
        { status: 400 }
      );
    }
    if (typeof inputs.clipCount !== "number" || inputs.clipCount < 2 || inputs.clipCount > 10) {
      return NextResponse.json(
        { success: false, error: "Clip count must be between 2 and 10" } satisfies GenerateResponse,
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "Server configuration error: missing GEMINI_API_KEY" } satisfies GenerateResponse,
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = buildVideoPrompt(inputs, selectedTitle.trim());
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const cleaned = responseText.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    let data: GeneratedVideo;
    try {
      data = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { success: false, error: "AI returned an invalid response. Please try again." } satisfies GenerateResponse,
        { status: 500 }
      );
    }

    if (
      !data.title ||
      !data.clips ||
      data.clips.length !== inputs.clipCount ||
      !data.tags ||
      !data.caption ||
      !data.thumbnailPrompt
    ) {
      return NextResponse.json(
        { success: false, error: "AI response was incomplete. Please try again." } satisfies GenerateResponse,
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data } satisfies GenerateResponse);
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    console.error("Viral planner generate error:", message);

    if (message.includes("429") || message.includes("quota") || message.includes("Too Many Requests")) {
      return NextResponse.json(
        { success: false, error: "API rate limit reached. Please wait a minute and try again." } satisfies GenerateResponse,
        { status: 429 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." } satisfies GenerateResponse,
      { status: 500 }
    );
  }
}
