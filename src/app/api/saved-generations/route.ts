import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import SavedGeneration from "@/models/SavedGeneration";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;
  await dbConnect();

  const items = await SavedGeneration.find({ userId })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  return NextResponse.json({ success: true, items });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;

  try {
    const { title, toolSlug, data, inputs } = await request.json();

    if (!title || typeof title !== "string") {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    if (!data || typeof data !== "object") {
      return NextResponse.json({ error: "Data is required" }, { status: 400 });
    }

    await dbConnect();

    const saved = await SavedGeneration.create({
      userId,
      title: title.trim(),
      toolSlug: toolSlug || "viral-youtube-prompt-generator",
      data,
      inputs: inputs || {},
    });

    return NextResponse.json({ success: true, id: saved._id });
  } catch (error) {
    console.error("Save generation error:", error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
