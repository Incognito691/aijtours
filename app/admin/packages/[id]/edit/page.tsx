// app/admin/packages/[id]/edit/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Package } from "@/lib/models";

export default function EditPackagePage() {
  const router = useRouter();
  const { id } = useParams();
  const { user } = useUser();

  const [formData, setFormData] = useState<Package>({
    name: "",
    price: 0,
    description: "",
    dailyItinerary: [],
    included: [],
    excluded: [],
    tags: [],
    images: [],
    destination: "",
    duration: "",
    categoryId: "",
    categoryName: "",
    featured: false,
    limitedOffer: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check admin
  useEffect(() => {
    if (
      user &&
      user.primaryEmailAddress?.emailAddress !==
        process.env.NEXT_PUBLIC_ADMIN_EMAIL
    ) {
      router.push("/"); // redirect if not admin
    }
  }, [user, router]);

  // Fetch package data
  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const res = await fetch(`/api/packages/${id}`);
        if (!res.ok) throw new Error("Failed to fetch package");
        const data: Package = await res.json();
        setFormData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchPackage();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" && "checked" in e.target
        ? e.target.checked
        : undefined;

    setFormData((prev: Package) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleArrayChange = (name: keyof Package, value: string) => {
    setFormData((prev: Package) => ({
      ...prev,
      [name]: value.split(",").map((item) => item.trim()),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/packages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to update package");
      router.push("/admin/packages");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading package...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Package</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          rows={4}
        />
        <input
          type="text"
          placeholder="Daily Itinerary (comma separated)"
          value={formData.dailyItinerary.join(", ")}
          onChange={(e) => handleArrayChange("dailyItinerary", e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Included items (comma separated)"
          value={formData.included.join(", ")}
          onChange={(e) => handleArrayChange("included", e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Excluded items (comma separated)"
          value={formData.excluded.join(", ")}
          onChange={(e) => handleArrayChange("excluded", e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={formData.tags.join(", ")}
          onChange={(e) => handleArrayChange("tags", e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Images URLs (comma separated)"
          value={formData.images.join(", ")}
          onChange={(e) => handleArrayChange("images", e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="destination"
          placeholder="Destination"
          value={formData.destination}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="duration"
          placeholder="Duration"
          value={formData.duration}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="categoryId"
          placeholder="Category ID"
          value={formData.categoryId}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="categoryName"
          placeholder="Category Name"
          value={formData.categoryName}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="featured"
            checked={!!formData.featured}
            onChange={handleChange}
          />
          <span>Featured</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="limitedOffer"
            checked={!!formData.limitedOffer}
            onChange={handleChange}
          />
          <span>Limited Offer</span>
        </label>
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {saving ? "Updating..." : "Update Package"}
        </button>
      </form>
    </div>
  );
}
