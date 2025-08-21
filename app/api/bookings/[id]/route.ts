import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import type { Booking } from "@/lib/models";

// GET single booking
export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = await getDatabase();
    const booking = await db
      .collection<Booking>("bookings")
      .findOne({ _id: new ObjectId(params.id) });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error("❌ Error fetching booking:", error);
    return NextResponse.json({ error: "Failed to fetch booking" }, { status: 500 });
  }
}

// PUT update booking
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = await getDatabase();
    const body = await request.json();

    const result = await db.collection<Booking>("bookings").updateOne(
      { _id: new ObjectId(params.id) },
      { $set: { ...body, updatedAt: new Date() } }
    );

    return NextResponse.json({ success: result.modifiedCount > 0 });
  } catch (error) {
    console.error("❌ Error updating booking:", error);
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}

// DELETE booking
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = await getDatabase();
    const result = await db.collection<Booking>("bookings").deleteOne({
      _id: new ObjectId(params.id),
    });

    return NextResponse.json({ success: result.deletedCount > 0 });
  } catch (error) {
    console.error("❌ Error deleting booking:", error);
    return NextResponse.json({ error: "Failed to delete booking" }, { status: 500 });
  }
}
