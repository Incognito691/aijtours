"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, X } from "lucide-react";
import Link from "next/link";
import ImageUpload from "@/components/image-upload";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function NewPackagePage() {
  const router = useRouter();
  const { user } = useUser();
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    destination: "",
    duration: "",
    price: "",
    categoryId: "",
    included: [""],
    excluded: [""],
    dailyItinerary: [""],
    isFeatured: false,
    isLimitedOffer: false,
  });

  useEffect(() => {
    if (
      user?.emailAddresses[0]?.emailAddress !==
      process.env.NEXT_PUBLIC_ADMIN_EMAIL
    ) {
      router.push("/");
      return;
    }

    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/package-categories");
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const tags = [];
      if (formData.isFeatured) tags.push("Featured");
      if (formData.isLimitedOffer) tags.push("Limited Offer");

      const packageData = {
        ...formData,
        price: Number.parseFloat(formData.price),
        included: formData.included.filter((item) => item.trim() !== ""),
        excluded: formData.excluded.filter((item) => item.trim() !== ""),
        dailyItinerary: formData.dailyItinerary.filter(
          (item) => item.trim() !== ""
        ),
        images,
        tags,
      };

      const response = await fetch("/api/packages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(packageData),
      });

      if (response.ok) {
        toast({
          title: "Package created successfully!",
          description: "The package has been added to your catalog.",
        });
        router.push("/admin/packages");
      } else {
        throw new Error("Failed to create package");
      }
    } catch (error) {
      console.error("Error creating package:", error);
      toast({
        title: "Error",
        description: "Failed to create package. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleArrayChange = (
    index: number,
    value: string,
    field: "included" | "excluded" | "dailyItinerary"
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addArrayItem = (field: "included" | "excluded" | "dailyItinerary") => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeArrayItem = (
    index: number,
    field: "included" | "excluded" | "dailyItinerary"
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  if (
    user?.emailAddresses[0]?.emailAddress !==
    process.env.NEXT_PUBLIC_ADMIN_EMAIL
  ) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-8">
          <Link
            href="/admin/packages"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Packages
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            Create New Package
          </h1>
          <p className="text-gray-600 mt-2">
            Add a new travel package to your catalog
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Enter the basic details of the package
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Package Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="e.g., Bali Adventure Tour"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="destination">Destination *</Label>
                  <Input
                    id="destination"
                    value={formData.destination}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        destination: e.target.value,
                      }))
                    }
                    placeholder="e.g., Bali, Indonesia"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="duration">Duration *</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        duration: e.target.value,
                      }))
                    }
                    placeholder="e.g., 7 Days 6 Nights"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price (AED ) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        price: e.target.value,
                      }))
                    }
                    placeholder="e.g., 1299.99"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, categoryId: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Describe the package in detail..."
                  rows={4}
                  required
                />
              </div>

              {/* Featured and Limited Offer Checkboxes */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Package Tags</Label>
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="featured"
                      checked={formData.isFeatured}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          isFeatured: checked as boolean,
                        }))
                      }
                    />
                    <Label
                      htmlFor="featured"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Featured Package
                    </Label>
                    <span className="text-xs text-gray-500">
                      (Will appear in Featured Packages section on homepage)
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="limitedOffer"
                      checked={formData.isLimitedOffer}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          isLimitedOffer: checked as boolean,
                        }))
                      }
                    />
                    <Label
                      htmlFor="limitedOffer"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Limited Offer
                    </Label>
                    <span className="text-xs text-gray-500">
                      (Will appear in Limited Offers section on homepage)
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Package Images</CardTitle>
              <CardDescription>
                Upload images for your package (first image will be the main
                image)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUpload images={images} onImagesChange={setImages} />
            </CardContent>
          </Card>

          {/* What's Included */}
          <Card>
            <CardHeader>
              <CardTitle>What's Included</CardTitle>
              <CardDescription>
                List what's included in the package
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {formData.included.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={item}
                      onChange={(e) =>
                        handleArrayChange(index, e.target.value, "included")
                      }
                      placeholder="e.g., Hotel accommodation"
                    />
                    {formData.included.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeArrayItem(index, "included")}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addArrayItem("included")}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* What's Excluded */}
          <Card>
            <CardHeader>
              <CardTitle>What's Not Included</CardTitle>
              <CardDescription>
                List what's not included in the package
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {formData.excluded.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={item}
                      onChange={(e) =>
                        handleArrayChange(index, e.target.value, "excluded")
                      }
                      placeholder="e.g., International flights"
                    />
                    {formData.excluded.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeArrayItem(index, "excluded")}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addArrayItem("excluded")}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Daily Itinerary */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Itinerary</CardTitle>
              <CardDescription>
                Describe the daily activities (optional)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {formData.dailyItinerary.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <div className="flex-shrink-0 w-12 h-10 bg-blue-100 rounded flex items-center justify-center text-blue-600 font-semibold">
                      {index + 1}
                    </div>
                    <Input
                      value={item}
                      onChange={(e) =>
                        handleArrayChange(
                          index,
                          e.target.value,
                          "dailyItinerary"
                        )
                      }
                      placeholder={`Day AED {index + 1} activities...`}
                    />
                    {formData.dailyItinerary.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeArrayItem(index, "dailyItinerary")}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addArrayItem("dailyItinerary")}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Day
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/packages")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Package"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
