import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminCheck";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    await connectDB();
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(200);
    return NextResponse.json({ users });
  } catch (error) {
    console.error("Admin users error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
