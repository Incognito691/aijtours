import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import type { ContactMessage } from "@/lib/models";

// GET all contact messages
export async function GET() {
  try {
    const db = await getDatabase();
    const messages = await db.collection<ContactMessage>("contact_messages").find({}).toArray();
    return NextResponse.json(messages);
  } catch (error) {
    console.error("❌ Error fetching contact messages:", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

// POST new contact message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = await getDatabase();

    const messageData: Omit<ContactMessage, "_id"> = {
      ...body,
      createdAt: new Date(),
      status: "unread",
    };

    const result = await db.collection<ContactMessage>("contact_messages").insertOne(messageData);

    return NextResponse.json({ _id: result.insertedId, ...messageData });
  } catch (error) {
    console.error("❌ Error creating contact message:", error);
    return NextResponse.json({ error: "Failed to create message" }, { status: 500 });
  }
}
