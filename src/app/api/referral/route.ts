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

    // Find all users referred by this user
    const referredUsers = await User.find({ referredBy: user.name })
      .select("name email lastLoginIP createdAt")
      .sort({ createdAt: -1 });

    // Find users who used the referral link but were blocked (referredBy is empty but came from same IP)
    // We track blocked referrals separately — they have no referredBy but share IP
    const blockedUsers = await User.find({
      referredBy: "",
      lastLoginIP: user.lastLoginIP,
      _id: { $ne: user._id },
    })
      .select("name email lastLoginIP createdAt")
      .sort({ createdAt: -1 });

    const referralList = [
      ...referredUsers.map((r) => ({
        name: r.name,
        email: r.email,
        ip: r.lastLoginIP,
        date: r.createdAt,
        status: "accepted" as const,
      })),
      ...blockedUsers.map((r) => ({
        name: r.name,
        email: r.email,
        ip: r.lastLoginIP,
        date: r.createdAt,
        status: "blocked" as const,
      })),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json({
      referralCode: user.referralCode,
      referralCount: user.referralCount || 0,
      rejectedReferrals: user.rejectedReferrals || 0,
      unlimitedUntil: user.unlimitedUntil,
      hasUnlimited: user.unlimitedUntil && new Date(user.unlimitedUntil) > new Date(),
      referralList,
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
