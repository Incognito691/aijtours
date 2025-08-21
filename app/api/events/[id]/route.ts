import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// GET single event
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid event ID" }, { status: 400 });
    }

    const db = await getDatabase();
    const eventData = await db.collection("events").findOne({
      _id: new ObjectId(id),
    });

    if (!eventData) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...eventData,
      _id: eventData._id.toString(), // normalize ObjectId
    });
  } catch (error) {
    console.error("❌ Error fetching event:", error);
    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 }
    );
  }
}

// PUT update event
export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;
    const body = await request.json();

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid event ID" }, { status: 400 });
    }

    const db = await getDatabase();
    const updateData = {
      ...body,
      date: new Date(body.date),
      updatedAt: new Date(),
    };

    const result = await db
      .collection("events")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ _id: id, ...updateData });
  } catch (error) {
    console.error("❌ Error updating event:", error);
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 }
    );
  }
}

// DELETE event
export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid event ID" }, { status: 400 });
    }

    const db = await getDatabase();
    const result = await db.collection("events").deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting event:", error);
    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 }
    );
  }
}
