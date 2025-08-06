"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { Package } from "@/lib/models";
import {
  MapPin,
  Calendar,
  Check,
  X,
  ArrowLeft,
  Download,
  Mail,
} from "lucide-react";
import Link from "next/link";
import emailjs from "emailjs-com";
import { generateInvoicePDF } from "@/lib/pdf-generator";

export default function PackageDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const { toast } = useToast();
  const [packageData, setPackageData] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingData, setBookingData] = useState({
    email: "",
    travelers: 1,
    travelDate: "",
    contactNumber: "",
    specialRequests: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const response = await fetch(`/api/packages/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setPackageData(data);
        } else {
          router.push("/packages");
        }
      } catch (error) {
        console.error("Error fetching package:", error);
        router.push("/packages");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchPackage();
    }
  }, [params.id, router]);

  // Pre-fill email if user is signed in
  useEffect(() => {
    if (user && user.emailAddresses[0]?.emailAddress) {
      setBookingData((prev) => ({
        ...prev,
        email: user.emailAddresses[0]?.emailAddress || "",
      }));
    }
  }, [user]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email
    if (!bookingData.email || !bookingData.email.includes("@")) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const bookingPayload = {
        userId: user?.id || "guest",
        userEmail: bookingData.email,
        userName: user?.fullName || user?.firstName || "Guest User",
        packageId: packageData?._id,
        type: "package",
        bookingDetails: {
          ...bookingData,
          travelDate: new Date(bookingData.travelDate),
        },
        totalAmount: packageData
          ? packageData.price * bookingData.travelers
          : 0,
      };

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingPayload),
      });

      if (response.ok) {
        const booking = await response.json();

        // Generate and download PDF invoice
        const invoiceData = {
          bookingId: booking._id,
          customerName: user?.fullName || user?.firstName || "Guest User",
          customerEmail: bookingData.email,
          packageName: packageData?.name || "",
          destination: packageData?.destination || "",
          duration: packageData?.duration || "",
          date: bookingData.travelDate,
          travelers: bookingData.travelers,
          totalAmount: packageData
            ? packageData.price * bookingData.travelers
            : 0,
          contactNumber: bookingData.contactNumber,
          specialRequests: bookingData.specialRequests,
          type: "package" as const,
        };

        // Generate and automatically download PDF
        const pdf = generateInvoicePDF(invoiceData);
        pdf.save(`AIJ-Holidays-Invoice-${booking._id}.pdf`);

        // Send email to customer
        try {
          await emailjs.send(
            process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
            process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
            {
              to_name: user?.fullName || user?.firstName || "Guest User",
              to_email: bookingData.email,
              from_name: "AIJ Holidays",
              package_name: packageData?.name,
              destination: packageData?.destination,
              duration: packageData?.duration,
              travel_date: new Date(
                bookingData.travelDate
              ).toLocaleDateString(),
              travelers: bookingData.travelers,
              total_amount: `$${(packageData
                ? packageData.price * bookingData.travelers
                : 0
              ).toFixed(2)}`,
              booking_id: booking._id,
              contact_number: bookingData.contactNumber,
              special_requests: bookingData.specialRequests || "None",
            },
            process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
          );

          // Send email to admin
          await emailjs.send(
            process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
            process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
            {
              to_name: "Admin",
              to_email: "sahilniraula00@gmail.com",
              from_name: "AIJ Holidays System",
              package_name: packageData?.name,
              destination: packageData?.destination,
              duration: packageData?.duration,
              travel_date: new Date(
                bookingData.travelDate
              ).toLocaleDateString(),
              travelers: bookingData.travelers,
              total_amount: `$${(packageData
                ? packageData.price * bookingData.travelers
                : 0
              ).toFixed(2)}`,
              booking_id: booking._id,
              contact_number: bookingData.contactNumber,
              special_requests: bookingData.specialRequests || "None",
              customer_name: user?.fullName || user?.firstName || "Guest User",
              customer_email: bookingData.email,
            },
            process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
          );
        } catch (emailError) {
          console.error("Email sending failed:", emailError);
        }

        toast({
          title: "Booking Confirmed! 🎉",
          description:
            "Your invoice has been downloaded and confirmation emails have been sent.",
        });

        setBookingOpen(false);
        setBookingData({
          email: user?.emailAddresses[0]?.emailAddress || "",
          travelers: 1,
          travelDate: "",
          contactNumber: "",
          specialRequests: "",
        });
      } else {
        throw new Error("Failed to submit booking");
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
      toast({
        title: "Error",
        description: "Failed to submit booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-300 rounded-lg mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-8 bg-gray-300 rounded mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3"></div>
              </div>
              <div className="h-64 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Package not found
          </h1>
          <Link href="/packages">
            <Button>Back to Packages</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Link
          href="/packages"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Packages
        </Link>

        {/* Hero Image */}
        <div className="relative h-96 rounded-lg overflow-hidden mb-8">
          <Image
            src={
              packageData.images[0] ||
              "/placeholder.svg?height=400&width=800&query=travel destination"
            }
            alt={packageData.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end">
            <div className="p-8 text-white">
              <div className="flex flex-wrap gap-2 mb-4">
                {packageData.tags.map((tag) => (
                  <Badge
                    key={tag}
                    className={
                      tag === "Featured"
                        ? "bg-yellow-500 text-black"
                        : tag === "Limited Offer"
                        ? "bg-red-500 text-white"
                        : "bg-blue-500 text-white"
                    }
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              <h1 className="text-4xl font-bold mb-2">{packageData.name}</h1>
              <div className="flex items-center space-x-6 text-lg">
                <span className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  {packageData.destination}
                </span>
                <span className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  {packageData.duration}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About This Package</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  {packageData.description}
                </p>
              </CardContent>
            </Card>

            {/* Daily Itinerary */}
            {packageData.dailyItinerary.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Daily Itinerary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {packageData.dailyItinerary.map((day, index) => (
                      <div key={index} className="flex">
                        <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold mr-4">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-700">{day}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Included & Excluded */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {packageData.included.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-green-600">
                      What's Included
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {packageData.included.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {packageData.excluded.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-red-600">
                      What's Not Included
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {packageData.excluded.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <X className="h-5 w-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Additional Images */}
            {packageData.images.length > 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Gallery</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {packageData.images.slice(1).map((image, index) => (
                      <div
                        key={index}
                        className="relative h-32 rounded-lg overflow-hidden"
                      >
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`${packageData.name} ${index + 2}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-600">
                  ${packageData.price}
                </CardTitle>
                <CardDescription>per person</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{packageData.duration}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Destination:</span>
                    <span className="font-medium">
                      {packageData.destination}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium">
                      {packageData.categoryName}
                    </span>
                  </div>
                </div>

                <Separator />

                <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full" size="lg">
                      Book Now
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Book {packageData.name}</DialogTitle>
                      <DialogDescription>
                        Fill in your details to book this package
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleBooking} className="space-y-4">
                      {/* Email Field */}
                      <div>
                        <Label
                          htmlFor="email"
                          className="flex items-center mb-3"
                        >
                          <Mail className="h-4 w-4 mr-2" />
                          Email Address *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={bookingData.email}
                          onChange={(e) =>
                            setBookingData((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                          placeholder="your.email@example.com"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="travelers">
                            Number of Travelers *
                          </Label>
                          <Input
                            id="travelers"
                            type="number"
                            min="1"
                            value={bookingData.travelers}
                            onChange={(e) =>
                              setBookingData((prev) => ({
                                ...prev,
                                travelers: Number.parseInt(e.target.value) || 1,
                              }))
                            }
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="travelDate">Travel Date *</Label>
                          <Input
                            id="travelDate"
                            type="date"
                            value={bookingData.travelDate}
                            onChange={(e) =>
                              setBookingData((prev) => ({
                                ...prev,
                                travelDate: e.target.value,
                              }))
                            }
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="contactNumber">Contact Number *</Label>
                        <Input
                          id="contactNumber"
                          type="tel"
                          value={bookingData.contactNumber}
                          onChange={(e) =>
                            setBookingData((prev) => ({
                              ...prev,
                              contactNumber: e.target.value,
                            }))
                          }
                          placeholder="+1 (555) 123-4567"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="specialRequests">
                          Special Requests (Optional)
                        </Label>
                        <Textarea
                          id="specialRequests"
                          value={bookingData.specialRequests}
                          onChange={(e) =>
                            setBookingData((prev) => ({
                              ...prev,
                              specialRequests: e.target.value,
                            }))
                          }
                          rows={3}
                          placeholder="Any special requirements or requests..."
                        />
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Total Amount:</span>
                          <span className="text-xl font-bold text-blue-600">
                            ${packageData.price * bookingData.travelers}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {bookingData.travelers} traveler
                          {bookingData.travelers > 1 ? "s" : ""} × $
                          {packageData.price}
                        </p>
                        <p className="text-xs text-amber-600 mt-2 italic">
                          *Price may differ during final payment processing.
                        </p>
                      </div>
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={submitting}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        {submitting
                          ? "Processing..."
                          : "Confirm Booking & Download Invoice"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>

                <p className="text-xs text-gray-500 text-center">
                  By booking, you agree to our terms and conditions. Your
                  invoice will be automatically downloaded and confirmation
                  emails will be sent.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
