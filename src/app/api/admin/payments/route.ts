import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminCheck";
import connectDB from "@/lib/mongodb";
import PaymentRequest from "@/models/PaymentRequest";
import User from "@/models/User";

// GET: List all payment requests
export async function GET() {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    await connectDB();
    const requests = await PaymentRequest.find().sort({ createdAt: -1 }).limit(100);
    return NextResponse.json({ requests });
  } catch (error) {
    console.error("Admin payments GET error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST: Approve or reject a payment
export async function POST(req: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { requestId, action, adminNote } = await req.json();
    if (!requestId || !["approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    await connectDB();
    const payment = await PaymentRequest.findById(requestId);
    if (!payment) {
      return NextResponse.json({ error: "Payment request not found" }, { status: 404 });
    }

    if (payment.status !== "pending") {
      return NextResponse.json({ error: "Already processed" }, { status: 400 });
    }

    if (action === "approve") {
      payment.status = "approved";
      payment.adminNote = adminNote || "";
      await payment.save();

      // Grant pro status for 30 days
      const user = await User.findById(payment.userId);
      if (user) {
        const proExpiry = new Date();
        // If already pro, extend from current expiry
        if (user.isPro && user.proExpiry && new Date(user.proExpiry) > new Date()) {
          proExpiry.setTime(new Date(user.proExpiry).getTime());
        }
        proExpiry.setDate(proExpiry.getDate() + 30);
        user.isPro = true;
        user.proExpiry = proExpiry;
        await user.save();
      }
    } else {
      payment.status = "rejected";
      payment.adminNote = adminNote || "";
      await payment.save();
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin payments POST error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
