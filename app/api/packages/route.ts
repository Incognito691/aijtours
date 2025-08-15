import { type NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import type { Package } from "@/lib/models";
import { ObjectId } from "mongodb";

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase();
    const packages = await db
      .collection("packages")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    const formattedPackages = packages.map((pkg) => ({
      ...pkg,
      _id: pkg._id.toString(),
    }));

    return NextResponse.json(formattedPackages);
  } catch (error) {
    console.error("Error fetching packages:", error);
    return NextResponse.json(
      { error: "Failed to fetch packages" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (
      !body.name ||
      !body.price ||
      !body.description ||
      !body.destination ||
      !body.duration ||
      !body.categoryId
    ) {
      return NextResponse.json(
        { error: "All required fields must be provided" },
        { status: 400 }
      );
    }

    const db = await getDatabase();

    // 🔹 Fetch category name from DB
    const category = await db
      .collection("packageCategories")
      .findOne({ _id: new ObjectId(body.categoryId) });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    const packageData: Omit<Package, "_id"> = {
      name: body.name,
      price: Number(body.price),
      description: body.description,
      dailyItinerary: body.dailyItinerary || [],
      included: body.included || [],
      excluded: body.excluded || [],
      tags: body.tags || [],
      images: body.images || [],
      destination: body.destination,
      duration: body.duration,
      categoryId: body.categoryId,
      categoryName: category.name || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("packages").insertOne(packageData);

    return NextResponse.json({
      _id: result.insertedId.toString(),
      ...packageData,
    });
  } catch (error) {
    console.error("Error creating package:", error);
    return NextResponse.json(
      { error: "Failed to create package" },
      { status: 500 }
    );
  }
}
