import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminCheck";
import connectDB from "@/lib/mongodb";
import SiteSettings from "@/models/SiteSettings";

// GET: Get current settings
export async function GET() {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    await connectDB();
    let settings = await SiteSettings.findOne({ key: "main" });
    if (!settings) {
      settings = await SiteSettings.create({ key: "main" });
    }
    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Admin settings GET error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST: Update settings
export async function POST(req: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { guestLimit, userLimit, taskBonus } = body;

    await connectDB();
    const settings = await SiteSettings.findOneAndUpdate(
      { key: "main" },
      {
        guestLimit: guestLimit ?? 2,
        userLimit: userLimit ?? 4,
        taskBonus: taskBonus ?? 11,
        updatedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("Admin settings POST error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
