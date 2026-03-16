import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminCheck";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import SavedGeneration from "@/models/SavedGeneration";

function getTodayString() {
  return new Date().toISOString().split("T")[0];
}

export async function GET() {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await connectDB();
    const today = getTodayString();

    const [totalUsers, newUsersToday, totalSaved, generationsToday, tasksCompletedToday] =
      await Promise.all([
        User.countDocuments(),
        User.countDocuments({ createdAt: { $gte: new Date(today) } }),
        SavedGeneration.countDocuments(),
        User.aggregate([
          { $match: { lastGenerationDate: today } },
          { $group: { _id: null, total: { $sum: "$dailyGenerations" } } },
        ]),
        User.aggregate([
          { $match: { lastTaskDate: today } },
          { $group: { _id: null, total: { $sum: "$tasksCompletedToday" } } },
        ]),
      ]);

    return NextResponse.json({
      totalUsers,
      newUsersToday,
      totalSaved,
      generationsToday: generationsToday[0]?.total || 0,
      tasksCompletedToday: tasksCompletedToday[0]?.total || 0,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
