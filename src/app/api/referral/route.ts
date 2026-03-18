import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import crypto from "crypto";

function generateCode(): string {
  return crypto.randomBytes(4).toString("hex"); // 8-char hex code
}

// GET: Get current user's referral info
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id;
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate referral code if user doesn't have one
    if (!user.referralCode) {
      let code = generateCode();
      // Ensure uniqueness
      while (await User.findOne({ referralCode: code })) {
        code = generateCode();
      }
      user.referralCode = code;
      await user.save();
    }

    return NextResponse.json({
      referralCode: user.referralCode,
      referralCount: user.referralCount || 0,
      unlimitedUntil: user.unlimitedUntil,
      hasUnlimited: user.unlimitedUntil && new Date(user.unlimitedUntil) > new Date(),
    });
  } catch (error) {
    console.error("Referral GET error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST: Process a referral (called when a new user signs up with a referral code)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id;
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { referralCode } = await req.json();
    if (!referralCode) {
      return NextResponse.json({ error: "Referral code required" }, { status: 400 });
    }

    await connectDB();

    // Find referrer
    const referrer = await User.findOne({ referralCode });
    if (!referrer) {
      return NextResponse.json({ error: "Invalid referral code" }, { status: 404 });
    }

    // Can't refer yourself
    if (referrer._id.toString() === userId) {
      return NextResponse.json({ error: "Cannot refer yourself" }, { status: 400 });
    }

    // Grant referrer 1 day unlimited
    const unlimitedUntil = new Date();
    unlimitedUntil.setDate(unlimitedUntil.getDate() + 1);

    // If they already have unlimited, extend by 1 day from their current end date
    if (referrer.unlimitedUntil && new Date(referrer.unlimitedUntil) > new Date()) {
      const currentEnd = new Date(referrer.unlimitedUntil);
      currentEnd.setDate(currentEnd.getDate() + 1);
      referrer.unlimitedUntil = currentEnd;
    } else {
      referrer.unlimitedUntil = unlimitedUntil;
    }

    referrer.referralCount = (referrer.referralCount || 0) + 1;
    await referrer.save();

    return NextResponse.json({ success: true, message: "Referral applied! Your friend gets 1 day unlimited." });
  } catch (error) {
    console.error("Referral POST error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
