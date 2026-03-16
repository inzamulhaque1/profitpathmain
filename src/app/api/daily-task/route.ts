import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Promo from "@/models/DailyTask";
import User from "@/models/User";

function getTodayString() {
  return new Date().toISOString().split("T")[0];
}

// In-memory store for task start times (per user)
const taskStartTimes = new Map<string, number>();

// GET: Get the NEXT promo for this user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id;
    if (!userId) {
      return NextResponse.json({ task: null });
    }

    await connectDB();
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ task: null });
    }

    // Get all enabled promos ordered by position
    const promos = await Promo.find({ enabled: true }).sort({ order: 1 });
    if (promos.length === 0) {
      return NextResponse.json({ task: null });
    }

    // Determine which promo to show
    let promoIndex = user.nextPromoIndex || 0;

    // If user's index is beyond the list, stick to the last one (loop final)
    if (promoIndex >= promos.length) {
      promoIndex = promos.length - 1;
    }

    const promo = promos[promoIndex];
    const isLastPromo = promoIndex >= promos.length - 1;

    return NextResponse.json({
      task: {
        id: promo._id,
        title: promo.title,
        description: promo.description,
        promoUrl: promo.promoUrl,
        promoLabel: promo.promoLabel,
        timerDuration: promo.timerDuration,
        isLoop: isLastPromo,
        position: promoIndex + 1,
        total: promos.length,
      },
    });
  } catch (error) {
    console.error("Daily task error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// PUT: Record task start time
export async function PUT() {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id;
    if (!userId) {
      return NextResponse.json({ error: "Login required" }, { status: 401 });
    }

    taskStartTimes.set(userId, Date.now());
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Task start error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST: Complete task (with server-side time verification)
export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id;
    if (!userId) {
      return NextResponse.json({ error: "Login required" }, { status: 401 });
    }

    await connectDB();
    const today = getTodayString();
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify timer was started
    const startTime = taskStartTimes.get(userId);
    if (!startTime) {
      return NextResponse.json({ error: "Task not started" }, { status: 400 });
    }

    // Get current promo to check timer duration
    const promos = await Promo.find({ enabled: true }).sort({ order: 1 });
    if (promos.length === 0) {
      return NextResponse.json({ error: "No promos configured" }, { status: 400 });
    }

    let promoIndex = user.nextPromoIndex || 0;
    if (promoIndex >= promos.length) {
      promoIndex = promos.length - 1;
    }
    const promo = promos[promoIndex];

    // Verify enough time passed (2s grace)
    const elapsedSeconds = (Date.now() - startTime) / 1000;
    if (elapsedSeconds < promo.timerDuration - 2) {
      return NextResponse.json(
        { error: `Wait ${Math.ceil(promo.timerDuration - elapsedSeconds)} more seconds` },
        { status: 400 }
      );
    }

    // Clean up start time
    taskStartTimes.delete(userId);

    // Reset daily counter if new day
    if (user.lastTaskDate !== today) {
      user.tasksCompletedToday = 0;
      user.lastTaskDate = today;
    }

    // Increment tasks completed today
    user.tasksCompletedToday += 1;

    // Advance promo index (unless on the last/loop promo)
    const isLastPromo = promoIndex >= promos.length - 1;
    if (!isLastPromo) {
      user.nextPromoIndex = promoIndex + 1;
    }
    // If last promo, keep index the same (loop forever)

    await user.save();

    return NextResponse.json({ success: true, tasksCompleted: user.tasksCompletedToday });
  } catch (error) {
    console.error("Task complete error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
