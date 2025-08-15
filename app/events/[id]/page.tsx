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
import type { Event } from "@/lib/models";
import {
  MapPin,
  Calendar,
  ArrowLeft,
  Download,
  Mail,
  Clock,
} from "lucide-react";
import Link from "next/link";
import emailjs from "emailjs-com";
import { generateInvoicePDF } from "@/lib/pdf-generator";

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const { toast } = useToast();
  const [eventData, setEventData] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingData, setBookingData] = useState({
    email: "",
    travelers: 1,
    contactNumber: "",
    specialRequests: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setEventData(data);
        } else {
          router.push("/events");
        }
      } catch (error) {
        console.error("Error fetching event:", error);
        router.push("/events");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchEvent();
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
        eventId: eventData?._id,
        type: "event",
        bookingDetails: {
          ...bookingData,
          travelDate: eventData?.date,
        },
        totalAmount: eventData ? eventData.price * bookingData.travelers : 0,
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
          eventName: eventData?.name || "",
          location: eventData?.location || "",
          date: eventData?.date.toString() || "",
          travelers: bookingData.travelers,
          totalAmount: eventData ? eventData.price * bookingData.travelers : 0,
          contactNumber: bookingData.contactNumber,
          specialRequests: bookingData.specialRequests,
          type: "event" as const,
        };

        // Generate and automatically download PDF
        const pdf = generateInvoicePDF(invoiceData);
        pdf.save(`AIJ-Holidays-Event-Invoice-${booking._id}.pdf`);

        // Send email to customer
        try {
          await emailjs.send(
            process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
            process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
            {
              to_name: user?.fullName || user?.firstName || "Guest User",
              to_email: bookingData.email,
              from_name: "AFI Travel and tourism",
              package_name: eventData?.name,
              destination: eventData?.location,
              duration: "Event",
              travel_date: new Date(eventData?.date || "").toLocaleDateString(),
              travelers: bookingData.travelers,
              total_amount: `$${(eventData
                ? eventData.price * bookingData.travelers
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
              to_email: "afitravelandtourism.sales@gmail.com",
              from_name: "AFI Travel and tourism System",
              package_name: eventData?.name,
              destination: eventData?.location,
              duration: "Event",
              travel_date: new Date(eventData?.date || "").toLocaleDateString(),
              travelers: bookingData.travelers,
              total_amount: `$${(eventData
                ? eventData.price * bookingData.travelers
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
          title: "Event Booking Confirmed! 🎉",
          description:
            "Your invoice has been downloaded and confirmation emails have been sent.",
        });

        setBookingOpen(false);
        setBookingData({
          email: user?.emailAddresses[0]?.emailAddress || "",
          travelers: 1,
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

  if (!eventData) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Event not found
          </h1>
          <Link href="/events">
            <Button>Back to Events</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const eventDate = new Date(eventData.date);
  const isEventPast = eventDate < new Date();

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Link
          href="/events"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Events
        </Link>

        {/* Hero Image */}
        <div className="relative h-96 rounded-lg overflow-hidden mb-8">
          <Image
            src={
              eventData.images[0] ||
              "/placeholder.svg?height=400&width=800&query=travel event"
            }
            alt={eventData.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end">
            <div className="p-8 text-white">
              <div className="flex flex-wrap gap-2 mb-4">
                {eventData.tags.map((tag) => (
                  <Badge key={tag} className="bg-green-500 text-white">
                    {tag}
                  </Badge>
                ))}
              </div>
              <h1 className="text-4xl font-bold mb-2">{eventData.name}</h1>
              <div className="flex items-center space-x-6 text-lg">
                <span className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  {eventData.location}
                </span>
                <span className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  {eventDate.toLocaleDateString()}
                </span>
                <span className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  {eventDate.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
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
                <CardTitle>About This Event</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  {eventData.description}
                </p>
              </CardContent>
            </Card>

            {/* Additional Images */}
            {eventData.images.length > 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Gallery</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {eventData.images.slice(1).map((image, index) => (
                      <div
                        key={index}
                        className="relative h-32 rounded-lg overflow-hidden"
                      >
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`${eventData.name} ${index + 2}`}
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
                <CardTitle className="text-2xl text-green-600">
                  ${eventData.price}
                </CardTitle>
                <CardDescription>per person</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">
                      {eventDate.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium">
                      {eventDate.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium">{eventData.location}</span>
                  </div>
                </div>

                <Separator />

                {isEventPast ? (
                  <div className="text-center py-4">
                    <p className="text-red-600 font-medium">
                      This event has already passed
                    </p>
                  </div>
                ) : (
                  <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full" size="lg">
                        Register Now
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Register for {eventData.name}</DialogTitle>
                        <DialogDescription>
                          Fill in your details to register for this event
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleBooking} className="space-y-4">
                        {/* Email Field */}
                        <div>
                          <Label htmlFor="email" className="flex items-center">
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

                        <div>
                          <Label htmlFor="travelers">Number of Attendees</Label>
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
                          <Label htmlFor="contactNumber">Contact Number</Label>
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
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="specialRequests">
                            Special Requirements (Optional)
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
                          />
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Total Amount:</span>
                            <span className="text-xl font-bold text-green-600">
                              AED {eventData.price * bookingData.travelers}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {bookingData.travelers} attendee
                            {bookingData.travelers > 1 ? "s" : ""} × AED
                            {eventData.price}
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
                            : "Confirm Registration & Download Invoice"}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                )}

                <p className="text-xs text-gray-500 text-center">
                  By registering, you agree to our terms and conditions. Your
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
