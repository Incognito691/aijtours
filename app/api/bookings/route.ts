import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import type { Booking } from "@/lib/models"

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase()
    const bookings = await db.collection<Booking>("bookings").find({}).toArray()

    return NextResponse.json(bookings)
  } catch (error) {
    console.error("Error fetching bookings:", error)
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const db = await getDatabase()

    const bookingData: Omit<Booking, "_id"> = {
      ...body,
      bookingDetails: {
        ...body.bookingDetails,
        travelDate: new Date(body.bookingDetails.travelDate),
      },
      createdAt: new Date(),
      status: "pending",
    }

    const result = await db.collection<Booking>("bookings").insertOne(bookingData)

    return NextResponse.json({ _id: result.insertedId, ...bookingData })
  } catch (error) {
    console.error("Error creating booking:", error)
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
  }
}
