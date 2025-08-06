import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import type { PackageCategory } from "@/lib/models"

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase()
    const categories = await db.collection("package_categories").find({}).sort({ createdAt: -1 }).toArray()

    // Convert MongoDB _id to string
    const formattedCategories = categories.map((category) => ({
      ...category,
      _id: category._id.toString(),
    }))

    return NextResponse.json(formattedCategories)
  } catch (error) {
    console.error("Error fetching package categories:", error)
    return NextResponse.json({ error: "Failed to fetch package categories" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.name || !body.description) {
      return NextResponse.json({ error: "Name and description are required" }, { status: 400 })
    }

    const db = await getDatabase()

    // Create slug from name
    const slug = body.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")

    // Check if slug already exists
    const existingCategory = await db.collection("package_categories").findOne({ slug })
    if (existingCategory) {
      return NextResponse.json({ error: "A category with this name already exists" }, { status: 400 })
    }

    const categoryData: Omit<PackageCategory, "_id"> = {
      name: body.name,
      description: body.description,
      slug: slug,
      image: body.image || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("package_categories").insertOne(categoryData)

    const newCategory = {
      _id: result.insertedId.toString(),
      ...categoryData,
    }

    return NextResponse.json(newCategory)
  } catch (error) {
    console.error("Error creating package category:", error)
    return NextResponse.json({ error: "Failed to create package category" }, { status: 500 })
  }
}
