import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import PaymentRequest from "@/models/PaymentRequest";
import SiteSettings from "@/models/SiteSettings";

async function getSettings() {
  await connectDB();
  let settings = await SiteSettings.findOne({ key: "main" });
  if (!settings) settings = await SiteSettings.create({ key: "main" });
  return settings;
}

// GET: Get user's payment requests + pro status + settings
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

    const settings = await getSettings();
    const requests = await PaymentRequest.find({ userId }).sort({ createdAt: -1 }).limit(10);
    const isPro = user.isPro && user.proExpiry && new Date(user.proExpiry) > new Date();

    return NextResponse.json({
      isPro,
      proExpiry: user.proExpiry,
      requests,
      proPrice: settings.proPrice || 200,
      bkashNumber: settings.bkashNumber || "01728005274",
      coupons: (settings.coupons || []).filter((c: { enabled: boolean }) => c.enabled).map((c: { code: string; discount: number; firstMonthOnly: boolean }) => ({
        code: c.code,
        discount: c.discount,
        firstMonthOnly: c.firstMonthOnly,
      })),
    });
  } catch (error) {
    console.error("Payment GET error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST: Submit payment request
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id;
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { bkashNumber, transactionId, couponCode } = await req.json();
    if (!bkashNumber || !transactionId) {
      return NextResponse.json({ error: "bKash number and transaction ID required" }, { status: 400 });
    }
    if (transactionId.length < 5) {
      return NextResponse.json({ error: "Invalid transaction ID" }, { status: 400 });
    }

    await connectDB();
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const pendingExists = await PaymentRequest.findOne({ userId, status: "pending" });
    if (pendingExists) {
      return NextResponse.json({ error: "You already have a pending payment request." }, { status: 400 });
    }

    const settings = await getSettings();
    const basePrice = settings.proPrice || 200;
    let amount = basePrice;
    let appliedCoupon = "";

    if (couponCode && typeof couponCode === "string") {
      const coupon = (settings.coupons || []).find(
        (c: { code: string; enabled: boolean }) => c.code.toLowerCase() === couponCode.toLowerCase().trim() && c.enabled
      );
      if (coupon) {
        if (coupon.firstMonthOnly) {
          const previousApproved = await PaymentRequest.findOne({ userId, status: "approved" });
          if (!previousApproved) {
            amount = Math.round(basePrice * (1 - coupon.discount / 100));
            appliedCoupon = coupon.code;
          }
        } else {
          amount = Math.round(basePrice * (1 - coupon.discount / 100));
          appliedCoupon = coupon.code;
        }
      }
    }

    await PaymentRequest.create({
      userId,
      userName: user.name,
      userEmail: user.email,
      bkashNumber: bkashNumber.trim(),
      transactionId: transactionId.trim(),
      amount,
      couponCode: appliedCoupon,
    });

    return NextResponse.json({ success: true, amount, couponApplied: appliedCoupon });
  } catch (error) {
    console.error("Payment POST error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
