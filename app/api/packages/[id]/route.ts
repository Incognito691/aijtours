import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"

// GET package by ID
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const client = await clientPromise
    const db = client.db("afisales")

    const packageData = await db.collection("packages").findOne({ _id: new ObjectId(id) })

    if (!packageData) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 })
    }

    return NextResponse.json(packageData, { status: 200 })
  } catch (error) {
    console.error("Error fetching package:", error)
    return NextResponse.json({ error: "Failed to fetch package" }, { status: 500 })
  }
}

// UPDATE package by ID
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { categoryId, ...rest } = body

    const client = await clientPromise
    const db = client.db("afisales")

    let categoryName = ""
    if (categoryId) {
      const category = await db.collection("packageCategories").findOne({ _id: new ObjectId(categoryId) })

      if (!category) {
        return NextResponse.json({ error: "Category not found" }, { status: 404 })
      }
      categoryName = category.name || ""
    }

    const updateData = {
      ...rest,
      ...(categoryId && { categoryId }),
      ...(categoryName && { categoryName }),
      updatedAt: new Date(),
    }

    const result = await db.collection("packages").updateOne({ _id: new ObjectId(id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Package updated successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error updating package:", error)
    return NextResponse.json({ error: "Failed to update package" }, { status: 500 })
  }
}

// DELETE package by ID
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const client = await clientPromise
    const db = client.db("afisales")

    const result = await db.collection("packages").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Package deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting package:", error)
    return NextResponse.json({ error: "Failed to delete package" }, { status: 500 })
  }
}
