import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { Booking, Package, Event } from "@/lib/models";

// GET all bookings (for Admin Dashboard)
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("afisales");

    const bookings = await db
      .collection<Booking>("bookings")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    const enrichedBookings = await Promise.all(
      bookings.map(async (booking) => {
        if (booking.type === "package" && booking.packageId) {
          const pkg = await db
            .collection<Package>("packages")
            .findOne({ _id: new ObjectId(booking.packageId) });

          return {
            ...booking,
            packageName: pkg?.name || "Unknown Package",
            destination: pkg?.destination || "",
          };
        }

        if (booking.type === "event" && booking.eventId) {
          const evt = await db
            .collection<Event>("events")
            .findOne({ _id: new ObjectId(booking.eventId) });

          return {
            ...booking,
            eventName: evt?.name || "Unknown Event",
            location: evt?.location || "",
          };
        }

        return booking;
      })
    );

    return NextResponse.json(enrichedBookings);
  } catch (error) {
    console.error("❌ Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

// POST a new booking
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const client = await clientPromise;
    const db = client.db("afisales");

    const newBooking: Booking = {
      userId: body.userId ?? null,
      userEmail: body.userEmail ?? body.bookingDetails?.email ?? "",
      userName: body.userName ?? "Guest",
      packageId: body.packageId,
      eventId: body.eventId,
      type: body.type ?? (body.packageId ? "package" : "event"),
      bookingDetails: {
        travelers: body.bookingDetails?.travelers,
        travelDate: new Date(body.bookingDetails?.travelDate),
        specialRequests: body.bookingDetails?.specialRequests,
        contactNumber: body.bookingDetails?.contactNumber,
      },
      totalAmount: body.totalAmount,
      status: "pending",
      createdAt: new Date(),
    };

    const result = await db.collection("bookings").insertOne(newBooking);
    const bookingId = result.insertedId.toString();

    // Fetch package/event name (send back for frontend email/invoice)
    let bookedItem = "";
    if (newBooking.type === "package" && newBooking.packageId) {
      const pkg = await db
        .collection<Package>("packages")
        .findOne({ _id: new ObjectId(newBooking.packageId) });
      bookedItem = pkg?.name || "Unknown Package";
    } else if (newBooking.type === "event" && newBooking.eventId) {
      const evt = await db
        .collection<Event>("events")
        .findOne({ _id: new ObjectId(newBooking.eventId) });
      bookedItem = evt?.name || "Unknown Event";
    }

    return NextResponse.json(
      { message: "Booking created successfully", bookingId, bookedItem },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error creating booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
