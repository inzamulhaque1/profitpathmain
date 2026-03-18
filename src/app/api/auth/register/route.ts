import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, referralCode } = await request.json();

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json({ error: "Name must be at least 2 characters" }, { status: 400 });
    }
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }
    if (!password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    // Get registering user's IP
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    await dbConnect();

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Process referral — with anti-fraud checks
    let referrerName = "";
    let validReferral = false;

    if (referralCode && typeof referralCode === "string") {
      const referrer = await User.findOne({ referralCode: referralCode.trim() });
      if (referrer) {
        // Anti-fraud: block same IP referrals
        const sameIP = referrer.lastLoginIP && referrer.lastLoginIP === ip && ip !== "unknown";
        // Anti-fraud: block disposable email domains
        const disposableDomains = ["mailinator.com", "tempmail.com", "guerrillamail.com", "throwaway.email", "yopmail.com", "sharklasers.com", "grr.la", "guerrillamailblock.com", "temp-mail.org"];
        const emailDomain = email.toLowerCase().trim().split("@")[1];
        const isDisposable = disposableDomains.includes(emailDomain);

        if (!sameIP && !isDisposable) {
          referrerName = referrer.name;
          validReferral = true;
        }
      }
    }

    await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      referredBy: referrerName,
      lastLoginIP: ip,
    });

    // Grant referrer bonus only if referral is valid
    if (validReferral && referralCode) {
      const referrer = await User.findOne({ referralCode: referralCode.trim() });
      if (referrer) {
        const unlimitedUntil = new Date();
        if (referrer.unlimitedUntil && new Date(referrer.unlimitedUntil) > new Date()) {
          unlimitedUntil.setTime(new Date(referrer.unlimitedUntil).getTime());
        }
        unlimitedUntil.setDate(unlimitedUntil.getDate() + 1);
        referrer.unlimitedUntil = unlimitedUntil;
        referrer.referralCount = (referrer.referralCount || 0) + 1;
        await referrer.save();
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
