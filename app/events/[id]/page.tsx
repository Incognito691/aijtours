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
import { motion } from "framer-motion";

const formatAED = (n: number | string) => {
  const num = typeof n === "string" ? Number(n) : n;
  if (Number.isNaN(num)) return "AED 0";
  return `AED ${num.toLocaleString()}`;
};

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

  const [submitOnceRef] = useState({ current: false });

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (submitOnceRef.current) return; // idempotency guard
    submitOnceRef.current = true;

    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to register for this event.",
        variant: "destructive",
      });
      submitOnceRef.current = false;
      return;
    }

    if (!bookingData.email || !bookingData.email.includes("@")) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      submitOnceRef.current = false;
      return;
    }

    if (!eventData?._id) {
      toast({
        title: "Event missing",
        description: "This event cannot be booked at the moment.",
        variant: "destructive",
      });
      submitOnceRef.current = false;
      return;
    }

    setSubmitting(true);
    try {
      // Match the API contract: contactNumber & specialRequests live INSIDE bookingDetails
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageId: undefined, // explicit: event booking
          eventId: eventData._id,
          bookingDetails: {
            email: bookingData.email,
            travelers: bookingData.travelers,
            travelDate: new Date(eventData.date),
            contactNumber: bookingData.contactNumber,
            specialRequests: bookingData.specialRequests || "",
          },
          totalAmount: eventData.price * bookingData.travelers,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit booking");
      }

      const { bookingId } = await response.json();

      // Generate & download invoice on the client
      const invoiceData = {
        bookingId,
        customerName: user.fullName || user.firstName || "Guest User",
        customerEmail: bookingData.email,
        eventName: eventData.name,
        location: eventData.location,
        date: eventData.date.toString(),
        travelers: bookingData.travelers,
        totalAmount: eventData.price * bookingData.travelers,
        contactNumber: bookingData.contactNumber,
        specialRequests: bookingData.specialRequests,
        type: "event" as const,
      };

      const pdf = generateInvoicePDF(invoiceData);
      pdf.save(`AFI-Travel-and-Tourism-Invoice-${bookingId}.pdf`);

      // Send notification only to admin
      try {
        await emailjs.send(
          process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
          process.env.NEXT_PUBLIC_EMAILJS_BOOKING_TEMPLATE_ID!,
          {
            to_name: "Admin",
            to_email: "afitravelandtourism.sales@gmail.com",
            from_name: "AFI Travel and Tourism System",
            package_name: eventData.name,
            destination: eventData.location,
            duration: "Event",
            travel_date: new Date(eventData.date).toLocaleDateString(),
            travelers: bookingData.travelers,
            total_amount: formatAED(eventData.price * bookingData.travelers),
            booking_id: bookingId,
            contact_number: bookingData.contactNumber,
            special_requests: bookingData.specialRequests || "None",
            customer_name: user.fullName || user.firstName || "Guest User",
            customer_email: bookingData.email,
            is_admin_notification: true,
          },
          process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
        );
      } catch (emailError) {
        console.error("Email sending failed:", emailError);
        // Don't show error to user, we'll still consider booking successful
      }

      toast({
        title: "Registration Confirmed 🎉",
        description:
          "Your invoice has been downloaded and confirmation emails have been sent.",
      });

      setBookingOpen(false);
      setBookingData({
        email: user.emailAddresses[0]?.emailAddress || "",
        travelers: 1,
        contactNumber: "",
        specialRequests: "",
      });
    } catch (error) {
      console.error("Error submitting booking:", error);
      toast({
        title: "Error",
        description: "Failed to submit registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
      // let the guard reset after state settles
      setTimeout(() => {
        submitOnceRef.current = false;
      }, 300);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-white dark:from-neutral-950 dark:via-neutral-950 dark:to-black">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="animate-pulse">
            <div className="h-96 rounded-2xl mb-8 bg-gradient-to-r from-slate-200 to-slate-100 dark:from-neutral-800 dark:to-neutral-700" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-3">
                <div className="h-8 rounded-xl bg-slate-200 dark:bg-neutral-800" />
                <div className="h-4 rounded-xl bg-slate-200 dark:bg-neutral-800" />
                <div className="h-4 w-2/3 rounded-xl bg-slate-200 dark:bg-neutral-800" />
              </div>
              <div className="h-64 rounded-2xl bg-slate-200 dark:bg-neutral-800" />
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
    <div className="min-h-screen bg-gradient-to-b from-sky-50/60 via-white to-white dark:from-neutral-950 dark:via-neutral-950 dark:to-black">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-sky-700 hover:text-sky-900 dark:text-sky-300 dark:hover:text-sky-200 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="underline-offset-4 hover:underline">
            Back to Events
          </span>
        </Link>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative h-[26rem] rounded-3xl overflow-hidden mb-10 ring-1 ring-black/5 dark:ring-white/10"
        >
          <Image
            src={
              eventData.images[0] ||
              "/placeholder.svg?height=400&width=800&query=travel event"
            }
            alt={eventData.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute inset-0 flex items-end">
            <div className="p-8 md:p-10 text-white w-full">
              <div className="flex flex-wrap gap-2 mb-4">
                {eventData.tags.map((tag) => (
                  <Badge
                    key={tag}
                    className={
                      tag === "Featured"
                        ? "bg-yellow-400 text-black shadow"
                        : tag === "Limited Spots"
                        ? "bg-rose-500 text-white shadow"
                        : "bg-sky-500 text-white shadow"
                    }
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              <h1 className="text-3xl md:text-5xl font-bold mb-3 drop-shadow-sm">
                {eventData.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-base md:text-lg opacity-95">
                <span className="inline-flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  {eventData.location}
                </span>
                <span className="inline-flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  {eventDate.toLocaleDateString()}
                </span>
                <span className="inline-flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  {eventDate.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
            >
              <Card className="rounded-2xl shadow-sm border border-slate-200/70 dark:border-white/10">
                <CardHeader>
                  <CardTitle className="text-xl">About This Event</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 dark:text-slate-200 leading-relaxed">
                    {eventData.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Additional Images */}
            {eventData.images.length > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.05 }}
              >
                <Card className="rounded-2xl shadow-sm border border-slate-200/70 dark:border-white/10">
                  <CardHeader>
                    <CardTitle className="text-xl">Event Gallery</CardTitle>
                    <CardDescription>
                      Event photos and highlights
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {eventData.images.slice(1).map((image, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          className="relative h-32 rounded-xl overflow-hidden ring-1 ring-black/5 dark:ring-white/10"
                        >
                          <Image
                            src={image || "/placeholder.svg"}
                            alt={`${eventData.name} ${index + 2}`}
                            fill
                            className="object-cover"
                          />
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45 }}
            >
              <Card className="sticky top-24 rounded-2xl shadow-xl border-0 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/10">
                <CardHeader>
                  <CardTitle className="text-3xl text-sky-700 dark:text-sky-300 tracking-tight">
                    {formatAED(eventData.price)}
                  </CardTitle>
                  <CardDescription>per person</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-300">
                        Date:
                      </span>
                      <span className="font-medium text-slate-900 dark:text-slate-100">
                        {eventDate.toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-300">
                        Time:
                      </span>
                      <span className="font-medium text-slate-900 dark:text-slate-100">
                        {eventDate.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-300">
                        Location:
                      </span>
                      <span className="font-medium text-slate-900 dark:text-slate-100">
                        {eventData.location}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  {isEventPast ? (
                    <div className="text-center py-4">
                      <p className="text-rose-600 dark:text-rose-400 font-medium">
                        This event has already passed
                      </p>
                    </div>
                  ) : (
                    <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
                      <DialogTrigger asChild>
                        <Button
                          className="w-full h-11 text-base font-semibold rounded-xl shadow hover:shadow-lg transition-all"
                          disabled={!user}
                        >
                          {user ? "Register Now" : "Sign in to Register"}
                        </Button>
                      </DialogTrigger>

                      {/* Redesigned & Larger Dialog */}
                      <DialogContent className="w-[95vw] sm:max-w-xl md:max-w-2xl lg:max-w-3xl rounded-2xl p-0 overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-5">
                          {/* Left: Form */}
                          <div className="md:col-span-3 p-6 md:p-8">
                            <DialogHeader className="mb-4">
                              <DialogTitle className="text-xl md:text-2xl">
                                Register for {eventData.name}
                              </DialogTitle>
                              <DialogDescription>
                                Fill in your details to register for this event
                              </DialogDescription>
                            </DialogHeader>

                            <form
                              onSubmit={handleBooking}
                              className="space-y-5"
                            >
                              <div>
                                <Label
                                  htmlFor="email"
                                  className="flex items-center mb-2"
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

                              <div>
                                <Label htmlFor="travelers">
                                  Number of Attendees *
                                </Label>
                                <Input
                                  id="travelers"
                                  type="number"
                                  min="1"
                                  value={bookingData.travelers}
                                  onChange={(e) =>
                                    setBookingData((prev) => ({
                                      ...prev,
                                      travelers:
                                        Number.parseInt(e.target.value) || 1,
                                    }))
                                  }
                                  required
                                />
                              </div>

                              <div>
                                <Label htmlFor="contactNumber">
                                  Contact Number *
                                </Label>
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
                                  inputMode="tel"
                                  placeholder="+971 50 123 4567"
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
                                  placeholder="Any dietary requirements or special needs..."
                                />
                              </div>

                              <div className="bg-slate-50 dark:bg-neutral-900 p-4 rounded-xl ring-1 ring-black/5 dark:ring-white/10">
                                <div className="flex justify-between items-center">
                                  <span className="font-medium">
                                    Total Amount:
                                  </span>
                                  <span className="text-xl font-bold text-sky-700 dark:text-sky-300">
                                    {formatAED(
                                      eventData.price * bookingData.travelers
                                    )}
                                  </span>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                                  {bookingData.travelers} attendee
                                  {bookingData.travelers > 1 ? "s" : ""} ×{" "}
                                  {formatAED(eventData.price)}
                                </p>
                                <p className="text-xs text-amber-600 mt-2 italic">
                                  *Price may differ during final payment
                                  processing.
                                </p>
                              </div>

                              <Button
                                type="submit"
                                className="w-full h-11 rounded-xl font-semibold"
                                disabled={submitting}
                              >
                                <Download className="h-4 w-4 mr-2" />
                                {submitting
                                  ? "Processing..."
                                  : "Confirm Registration & Download Invoice"}
                              </Button>
                            </form>
                          </div>

                          {/* Right: Summary */}
                          <div className="md:col-span-2 bg-slate-50/70 dark:bg-neutral-900/60 p-6 md:p-8 border-l border-slate-200/80 dark:border-white/10">
                            <h3 className="text-lg font-semibold mb-4">
                              Event Summary
                            </h3>
                            <div className="space-y-3 text-sm">
                              <div className="flex items-center justify-between">
                                <span className="text-slate-600 dark:text-slate-300">
                                  Event
                                </span>
                                <span className="font-medium text-slate-900 dark:text-slate-100">
                                  {eventData.name}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-slate-600 dark:text-slate-300">
                                  Location
                                </span>
                                <span className="font-medium text-slate-900 dark:text-slate-100">
                                  {eventData.location}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-slate-600 dark:text-slate-300">
                                  Date & Time
                                </span>
                                <span className="font-medium text-slate-900 dark:text-slate-100">
                                  {eventDate.toLocaleDateString()} at{" "}
                                  {eventDate.toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                              <Separator />
                              <div className="flex items-center justify-between">
                                <span className="text-slate-600 dark:text-slate-300">
                                  Price / person
                                </span>
                                <span className="font-medium text-slate-900 dark:text-slate-100">
                                  {formatAED(eventData.price)}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-slate-600 dark:text-slate-300">
                                  Attendees
                                </span>
                                <span className="font-medium text-slate-900 dark:text-slate-100">
                                  {bookingData.travelers}
                                </span>
                              </div>
                              <Separator />
                              <div className="flex items-center justify-between">
                                <span className="text-slate-600 dark:text-slate-300">
                                  Total
                                </span>
                                <span className="text-xl font-bold text-sky-700 dark:text-sky-300">
                                  {formatAED(
                                    eventData.price * bookingData.travelers
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}

                  {!user && (
                    <p className="text-xs text-center text-slate-500">
                      Please sign in to register for this event.
                    </p>
                  )}

                  <p className="text-xs text-slate-500 text-center">
                    By registering, you agree to our terms and conditions. Your
                    invoice will be automatically downloaded and a confirmation
                    email will be sent.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
