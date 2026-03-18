import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import SiteSettings from "@/models/SiteSettings";

function getTodayString() {
  return new Date().toISOString().split("T")[0];
}

async function getSettings() {
  await connectDB();
  let settings = await SiteSettings.findOne({ key: "main" });
  if (!settings) {
    settings = await SiteSettings.create({ key: "main" });
  }
  return settings;
}

// GET: Check current generation status
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id;
    const settings = await getSettings();
    const today = getTodayString();

    if (!userId) {
      return NextResponse.json({
        isGuest: true,
        used: 0,
        limit: settings.guestLimit,
        taskBonus: settings.taskBonus,
        taskCompleted: false,
        canGenerate: true,
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isToday = user.lastGenerationDate === today;
    const used = isToday ? user.dailyGenerations : 0;

    // Check if user has unlimited access from referrals
    const hasUnlimited = user.unlimitedUntil && new Date(user.unlimitedUntil) > new Date();

    // Tasks completed today
    const isTaskToday = user.lastTaskDate === today;
    const tasksToday = isTaskToday ? user.tasksCompletedToday : 0;

    // Limit = base + (bonus * number of tasks completed today)
    const limit = hasUnlimited ? 999999 : settings.userLimit + (settings.taskBonus * tasksToday);

    return NextResponse.json({
      isGuest: false,
      used,
      limit,
      baseLimit: settings.userLimit,
      taskBonus: settings.taskBonus,
      tasksCompletedToday: tasksToday,
      canGenerate: hasUnlimited || used < limit,
      hasUnlimited,
      unlimitedUntil: user.unlimitedUntil,
    });
  } catch (error) {
    console.error("Generation status error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST: Increment generation count
export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id;
    const today = getTodayString();

    if (!userId) {
      return NextResponse.json({ success: true, isGuest: true });
    }

    await connectDB();
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isToday = user.lastGenerationDate === today;
    user.dailyGenerations = isToday ? user.dailyGenerations + 1 : 1;
    user.lastGenerationDate = today;
    await user.save();

    const settings = await getSettings();
    const hasUnlimited = user.unlimitedUntil && new Date(user.unlimitedUntil) > new Date();
    const isTaskToday = user.lastTaskDate === today;
    const tasksToday = isTaskToday ? user.tasksCompletedToday : 0;
    const limit = hasUnlimited ? 999999 : settings.userLimit + (settings.taskBonus * tasksToday);

    return NextResponse.json({
      success: true,
      used: user.dailyGenerations,
      limit,
      canGenerate: hasUnlimited || user.dailyGenerations < limit,
      hasUnlimited,
    });
  } catch (error) {
    console.error("Generation increment error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
