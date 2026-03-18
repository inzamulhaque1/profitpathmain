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
    const { guestLimit, userLimit, taskBonus, proPrice, bkashNumber, coupons } = body;

    await connectDB();

    const update: Record<string, unknown> = { updatedAt: new Date() };
    if (guestLimit !== undefined) update.guestLimit = guestLimit;
    if (userLimit !== undefined) update.userLimit = userLimit;
    if (taskBonus !== undefined) update.taskBonus = taskBonus;
    if (proPrice !== undefined) update.proPrice = proPrice;
    if (bkashNumber !== undefined) update.bkashNumber = bkashNumber;
    if (coupons !== undefined) update.coupons = coupons;

    const settings = await SiteSettings.findOneAndUpdate(
      { key: "main" },
      update,
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("Admin settings POST error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
