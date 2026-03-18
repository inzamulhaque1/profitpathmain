import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminCheck";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

// POST: Toggle pro status for a user
export async function POST(req: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { userId, isPro, days } = await req.json();
    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    await connectDB();
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (isPro) {
      const proExpiry = new Date();
      if (user.isPro && user.proExpiry && new Date(user.proExpiry) > new Date()) {
        proExpiry.setTime(new Date(user.proExpiry).getTime());
      }
      proExpiry.setDate(proExpiry.getDate() + (days || 30));
      user.isPro = true;
      user.proExpiry = proExpiry;
    } else {
      user.isPro = false;
      user.proExpiry = null;
    }

    await user.save();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin pro toggle error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
