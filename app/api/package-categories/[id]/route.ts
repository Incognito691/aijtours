import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// GET single category
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid category ID" }, { status: 400 });
    }

    const db = await getDatabase();
    const category = await db.collection("packageCategories").findOne({
      _id: new ObjectId(id),
    });

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...category,
      _id: category._id.toString(),
    });
  } catch (error) {
    console.error("❌ Error fetching category:", error);
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 }
    );
  }
}

// PUT update category
export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid category ID" }, { status: 400 });
    }

    const body = await request.json();
    const { name, description, image, slug } = body;

    if (!name || !description || !slug) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const db = await getDatabase();

    // Check for duplicate slug (exclude current)
    const existingCategory = await db.collection("packageCategories").findOne({
      slug,
      _id: { $ne: new ObjectId(id) },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: "Category with this slug already exists" },
        { status: 400 }
      );
    }

    const result = await db.collection("packageCategories").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name,
          description,
          image,
          slug,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Category updated successfully" });
  } catch (error) {
    console.error("❌ Error updating category:", error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

// DELETE category
export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid category ID" }, { status: 400 });
    }

    const db = await getDatabase();

    // Check if category has associated packages
    const packagesCount = await db.collection("packages").countDocuments({
      categoryId: id,
    });

    if (packagesCount > 0) {
      return NextResponse.json(
        {
          error:
            "Cannot delete category with associated packages. Please remove or reassign packages first.",
        },
        { status: 400 }
      );
    }

    const result = await db.collection("packageCategories").deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting category:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
