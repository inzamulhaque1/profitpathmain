import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminCheck";
import connectDB from "@/lib/mongodb";
import Promo from "@/models/DailyTask";

// GET: List all promos (ordered)
export async function GET() {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    await connectDB();
    const promos = await Promo.find().sort({ order: 1 });
    return NextResponse.json({ promos });
  } catch (error) {
    console.error("Admin promos GET error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST: Create or update a promo
export async function POST(req: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { id, title, description, promoUrl, promoLabel, timerDuration, enabled } = body;

    if (!title || !description) {
      return NextResponse.json({ error: "Title and description required" }, { status: 400 });
    }

    await connectDB();

    if (id) {
      // Update existing
      const promo = await Promo.findByIdAndUpdate(
        id,
        { title, description, promoUrl: promoUrl || "", promoLabel: promoLabel || "", timerDuration: timerDuration || 15, enabled: enabled !== false },
        { new: true }
      );
      return NextResponse.json({ success: true, promo });
    } else {
      // Create new — add to end of list
      const lastPromo = await Promo.findOne().sort({ order: -1 });
      const nextOrder = lastPromo ? lastPromo.order + 1 : 0;

      const promo = await Promo.create({
        order: nextOrder,
        title,
        description,
        promoUrl: promoUrl || "",
        promoLabel: promoLabel || "",
        timerDuration: timerDuration || 15,
        enabled: enabled !== false,
      });
      return NextResponse.json({ success: true, promo });
    }
  } catch (error) {
    console.error("Admin promos POST error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// DELETE: Remove a promo and reorder
export async function DELETE(req: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    await connectDB();
    const deleted = await Promo.findByIdAndDelete(id);

    if (deleted) {
      // Reorder remaining promos
      const remaining = await Promo.find().sort({ order: 1 });
      for (let i = 0; i < remaining.length; i++) {
        remaining[i].order = i;
        await remaining[i].save();
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin promos DELETE error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// PUT: Reorder promos
export async function PUT(req: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { ids } = await req.json();
    if (!Array.isArray(ids)) {
      return NextResponse.json({ error: "ids array required" }, { status: 400 });
    }

    await connectDB();
    for (let i = 0; i < ids.length; i++) {
      await Promo.findByIdAndUpdate(ids[i], { order: i });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin promos reorder error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
