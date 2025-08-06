import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import type { Event } from "@/lib/models"

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase()
    const events = await db.collection("events").find({}).sort({ date: 1 }).toArray()

    // Convert MongoDB _id to string
    const formattedEvents = events.map((event) => ({
      ...event,
      _id: event._id.toString(),
    }))

    return NextResponse.json(formattedEvents)
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.name || !body.description || !body.date || !body.location || !body.price) {
      return NextResponse.json({ error: "All required fields must be provided" }, { status: 400 })
    }

    const db = await getDatabase()

    const eventData: Omit<Event, "_id"> = {
      name: body.name,
      description: body.description,
      date: new Date(body.date),
      location: body.location,
      price: Number(body.price),
      tags: body.tags || [],
      images: body.images || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("events").insertOne(eventData)

    const newEvent = {
      _id: result.insertedId.toString(),
      ...eventData,
    }

    return NextResponse.json(newEvent)
  } catch (error) {
    console.error("Error creating event:", error)
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 })
  }
}
