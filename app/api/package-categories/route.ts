import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const db = await getDatabase();
    const categories = await db
      .collection("packageCategories")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    // Convert _id ObjectId to string for client
    const categoriesWithIdString = categories.map((cat) => ({
      ...cat,
      _id: cat._id.toString(),
    }));

    return NextResponse.json(categoriesWithIdString);
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, description, image } = await req.json();

    if (!name || !description) {
      return NextResponse.json(
        { error: "Name and description are required" },
        { status: 400 }
      );
    }

    const slug = name.trim().toLowerCase().replace(/\s+/g, "-");

    const db = await getDatabase();

    const result = await db.collection("packageCategories").insertOne({
      name,
      description,
      slug,
      image: image || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (!result.acknowledged) {
      return NextResponse.json(
        { error: "Failed to create category" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Category created successfully",
      id: result.insertedId.toString(),
    });
  } catch (error) {
    console.error("Failed to create category:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
