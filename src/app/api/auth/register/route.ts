import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request: Request) {
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

    await dbConnect();

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Find referrer before creating user
    let referrerName = "";
    if (referralCode && typeof referralCode === "string") {
      const referrer = await User.findOne({ referralCode: referralCode.trim() });
      if (referrer) {
        referrerName = referrer.name;
      }
    }

    await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      referredBy: referrerName,
    });

    // Process referral if code provided
    if (referralCode && typeof referralCode === "string") {
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
