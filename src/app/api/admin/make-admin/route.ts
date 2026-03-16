import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

// One-time route to make yourself admin
// Call: POST /api/admin/make-admin with { email: "your@email.com", secret: "profitpath-admin-2026" }
export async function POST(req: NextRequest) {
  try {
    const { email, secret } = await req.json();

    if (secret !== "profitpath-admin-2026") {
      return NextResponse.json({ error: "Invalid secret" }, { status: 403 });
    }

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { role: "admin" },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: `${user.email} is now admin` });
  } catch (error) {
    console.error("Make admin error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
