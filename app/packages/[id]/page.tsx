"use client";

import type React from "react";
import { useEffect, useMemo, useState } from "react";
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
import { motion } from "framer-motion";

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

  const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "";
  const EMAILJS_BOOKING_TEMPLATE_ID =
    process.env.NEXT_PUBLIC_EMAILJS_BOOKING_TEMPLATE_ID || "";
  const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "";
  const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "";

  useEffect(() => {
    try {
      if (EMAILJS_PUBLIC_KEY) {
        emailjs.init(EMAILJS_PUBLIC_KEY);
      }
    } catch {}
  }, []);

  const formatAED = (n: number | string) => {
    const num = typeof n === "string" ? Number(n) : n;
    if (Number.isNaN(num)) return "AED 0";
    return `AED ${num.toLocaleString()}`;
  };

  const totalAmount = useMemo(() => {
    if (!packageData) return 0;
    return (packageData.price || 0) * (bookingData.travelers || 1);
  }, [packageData, bookingData.travelers]);

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

  useEffect(() => {
    if (user && user.emailAddresses[0]?.emailAddress) {
      setBookingData((prev) => ({
        ...prev,
        email: user.emailAddresses[0]?.emailAddress || "",
      }));
    }
  }, [user]);

  const sendBookingEmails = async (args: {
    bookingId: string;
    customerName: string;
    customerEmail: string;
    packageName: string;
    destination: string;
    duration: string;
    date: string;
    travelers: number;
    totalAmount: number;
    contactNumber: string;
    specialRequests: string;
  }) => {
    if (
      !EMAILJS_SERVICE_ID ||
      !EMAILJS_BOOKING_TEMPLATE_ID ||
      !EMAILJS_PUBLIC_KEY
    ) {
      return;
    }

    const baseParams = {
      booking_id: args.bookingId,
      bookingId: args.bookingId,
      package_name: args.packageName,
      item: args.packageName,
      customer_name: args.customerName,
      customer_email: args.customerEmail,
      destination: args.destination,
      duration: args.duration,
      travel_date: args.date,
      travelers: String(args.travelers),
      total_amount: formatAED(args.totalAmount),
      contact_number: args.contactNumber,
      special_requests: args.specialRequests || "None",
      booking_type: "package",
    };

    try {
      // Send to admin only, with complete booking information
      if (ADMIN_EMAIL) {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_BOOKING_TEMPLATE_ID, {
          ...baseParams,
          to_email: ADMIN_EMAIL,
          to_name: "AFI Travel and Tourism - Sales",
          from_name: "AFI Travel and Tourism System",
          customer_email: args.customerEmail,
          customer_name: args.customerName,
          is_admin_notification: "true",
        });
      } else {
        console.warn("Admin email not configured - no notification sent");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      throw error; // Re-throw to be handled by the caller
    }
  };

  // ===========================
  // Booking handler (BACKEND-DRIVEN)
  // ===========================
  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to book this package.",
        variant: "destructive",
      });
      return;
    }

    // Simple email check
    if (!bookingData.email || !bookingData.email.includes("@")) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    if (!packageData?._id) {
      toast({
        title: "Package missing",
        description: "This package cannot be booked at the moment.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      // 🎯 Only send what your /api/bookings expects
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageId: packageData._id,
          eventId: undefined, // explicit: this is a package booking
          bookingDetails: {
            email: bookingData.email,
            travelers: bookingData.travelers,
            travelDate: new Date(bookingData.travelDate),
          },
          totalAmount: packageData.price * bookingData.travelers,
          contactNumber: bookingData.contactNumber,
          specialRequests: bookingData.specialRequests || "",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit booking");
      }

      // { message, bookingId }
      const { bookingId } = await response.json();

      // 🧾 Generate & download invoice (frontend)
      const invoiceData = {
        bookingId,
        customerName: user?.fullName || user?.firstName || "Guest User",
        customerEmail: bookingData.email,
        packageName: packageData?.name || "",
        destination: packageData?.destination || "",
        duration: packageData?.duration || "",
        date: bookingData.travelDate,
        travelers: bookingData.travelers,
        totalAmount: packageData.price * bookingData.travelers,
        contactNumber: bookingData.contactNumber,
        specialRequests: bookingData.specialRequests,
        type: "package" as const,
      };

      const pdf = await generateInvoicePDF(invoiceData);
      pdf.save(`AFI-Travel-and-Tourism-Invoice-${bookingId}.pdf`);

      // 📩 Send confirmation emails (customer + admin) — frontend via EmailJS
      try {
        await sendBookingEmails({
          bookingId,
          customerName: invoiceData.customerName,
          customerEmail: invoiceData.customerEmail,
          packageName: invoiceData.packageName,
          destination: invoiceData.destination,
          duration: invoiceData.duration,
          date: invoiceData.date,
          travelers: invoiceData.travelers,
          totalAmount: invoiceData.totalAmount,
          contactNumber: invoiceData.contactNumber,
          specialRequests: invoiceData.specialRequests || "",
        });
      } catch (err) {
        console.error("EmailJS send failed:", err);
        // We won’t fail the booking if email sending fails; just inform softly
        toast({
          title: "Booking Confirmed (email pending)",
          description:
            "Your invoice has been downloaded. We had trouble sending the email — we’ll retry shortly.",
        });
      }

      toast({
        title: "Booking Confirmed! 🎉",
        description:
          "Your invoice has been downloaded. A confirmation email has been sent.",
      });

      setBookingOpen(false);
      setBookingData({
        email: user?.emailAddresses[0]?.emailAddress || "",
        travelers: 1,
        travelDate: "",
        contactNumber: "",
        specialRequests: "",
      });
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

  // ====== UI ======
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

  if (!packageData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-white dark:from-neutral-950 dark:via-neutral-950 dark:to-black">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
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
    <div className="min-h-screen bg-gradient-to-b from-sky-50/60 via-white to-white dark:from-neutral-950 dark:via-neutral-950 dark:to-black">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Link
          href="/packages"
          className="inline-flex items-center gap-2 text-sky-700 hover:text-sky-900 dark:text-sky-300 dark:hover:text-sky-200 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="underline-offset-4 hover:underline">
            Back to Packages
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
              packageData.images[0] ||
              "/placeholder.svg?height=400&width=800&query=travel destination"
            }
            alt={packageData.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute inset-0 flex items=end">
            <div className="p-8 md:p-10 text-white w-full">
              <div className="flex flex-wrap gap-2 mb-4">
                {packageData.tags.map((tag) => (
                  <Badge
                    key={tag}
                    className={
                      tag === "Featured"
                        ? "bg-yellow-400 text-black shadow"
                        : tag === "Limited Offer"
                        ? "bg-rose-500 text-white shadow"
                        : "bg-sky-500 text-white shadow"
                    }
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              <h1 className="text-3xl md:text-5xl font-bold mb-3 drop-shadow-sm">
                {packageData.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-base md:text-lg opacity-95">
                <span className="inline-flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  {packageData.destination}
                </span>
                <span className="inline-flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  {packageData.duration}
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
                  <CardTitle className="text-xl">About This Package</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 dark:text-slate-200 leading-relaxed">
                    {packageData.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Daily Itinerary */}
            {packageData.dailyItinerary.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.05 }}
              >
                <Card className="rounded-2xl shadow-sm border border-slate-200/70 dark:border-white/10">
                  <CardHeader>
                    <CardTitle className="text-xl">Daily Itinerary</CardTitle>
                    <CardDescription>What each day looks like</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-sky-300 via-sky-200 to-transparent dark:from-sky-600/60 dark:via-sky-700/40" />
                      <div className="space-y-6">
                        {packageData.dailyItinerary.map((day, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -8 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.35 }}
                            className="relative flex gap-4"
                          >
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 flex items-center justify-center font-semibold ring-1 ring-sky-200/70 dark:ring-sky-700/40">
                              {index + 1}
                            </div>
                            <div className="pt-1.5">
                              <p className="text-slate-800 dark:text-slate-100 leading-relaxed">
                                {day}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Included & Excluded */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {packageData.included.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                >
                  <Card className="rounded-2xl shadow-sm border border-emerald-200/70 dark:border-emerald-900/40">
                    <CardHeader>
                      <CardTitle className="text-emerald-600 dark:text-emerald-400">
                        What's Included
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {packageData.included.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <Check className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-800 dark:text-slate-100">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {packageData.excluded.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.05 }}
                >
                  <Card className="rounded-2xl shadow-sm border border-rose-200/70 dark:border-rose-900/40">
                    <CardHeader>
                      <CardTitle className="text-rose-600 dark:text-rose-400">
                        What's Not Included
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {packageData.excluded.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <X className="h-5 w-5 text-rose-600 dark:text-rose-400 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-800 dark:text-slate-100">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>

            {/* Gallery */}
            {packageData.images.length > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.05 }}
              >
                <Card className="rounded-2xl shadow-sm border border-slate-200/70 dark:border-white/10">
                  <CardHeader>
                    <CardTitle>Gallery</CardTitle>
                    <CardDescription>More views from the trip</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {packageData.images.slice(1).map((image, index) => (
                        <motion.div
                          key={index}
                          className="relative h-32 md:h-40 rounded-xl overflow-hidden group ring-1 ring-black/5 dark:ring-white/10"
                          whileHover={{ y: -2 }}
                          transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 16,
                          }}
                        >
                          <Image
                            src={image || "/placeholder.svg"}
                            alt={`${packageData.name} ${index + 2}`}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
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
                    {formatAED(packageData.price)}
                  </CardTitle>
                  <CardDescription>per person</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-300">
                        Duration:
                      </span>
                      <span className="font-medium text-slate-900 dark:text-slate-100">
                        {packageData.duration}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-300">
                        Destination:
                      </span>
                      <span className="font-medium text-slate-900 dark:text-slate-100">
                        {packageData.destination}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-300">
                        Category:
                      </span>
                      <span className="font-medium text-slate-900 dark:text-slate-100">
                        {packageData.categoryName}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
                    <DialogTrigger asChild>
                      <Button
                        className="w-full h-11 text-base font-semibold rounded-xl shadow hover:shadow-lg transition-all"
                        disabled={!user}
                      >
                        {user ? "Book Now" : "Sign in to Book"}
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="w-[95vw] sm:max-w-xl md:max-w-2xl lg:max-w-4xl rounded-2xl p-0 overflow-hidden">
                      <div className="grid grid-cols-1 md:grid-cols-5">
                        {/* Left: Form */}
                        <div className="md:col-span-3 p-6 md:p-8">
                          <DialogHeader className="mb-6">
                            <DialogTitle className="text-xl md:text-2xl">
                              Book {packageData.name}
                            </DialogTitle>
                            <DialogDescription>
                              Fill in your details to book this amazing
                              experience
                            </DialogDescription>
                          </DialogHeader>

                          <form onSubmit={handleBooking} className="space-y-6">
                            {/* Email Field */}
                            <div className="space-y-2">
                              <Label
                                htmlFor="email"
                                className="flex items-center text-sm font-medium"
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
                                className="h-11"
                                placeholder="your.email@example.com"
                                required
                              />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <Label
                                  htmlFor="travelers"
                                  className="text-sm font-medium"
                                >
                                  Number of Travelers *
                                </Label>
                                <Input
                                  id="travelers"
                                  type="number"
                                  min="1"
                                  className="h-11"
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
                              <div className="space-y-2">
                                <Label
                                  htmlFor="travelDate"
                                  className="text-sm font-medium"
                                >
                                  Travel Date *
                                </Label>
                                <Input
                                  id="travelDate"
                                  type="date"
                                  className="h-11"
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

                            <div className="space-y-2">
                              <Label
                                htmlFor="contactNumber"
                                className="text-sm font-medium"
                              >
                                Contact Number *
                              </Label>
                              <Input
                                id="contactNumber"
                                type="tel"
                                className="h-11"
                                value={bookingData.contactNumber}
                                onChange={(e) =>
                                  setBookingData((prev) => ({
                                    ...prev,
                                    contactNumber: e.target.value,
                                  }))
                                }
                                placeholder="+971 50 123 4567"
                                required
                              />
                            </div>

                            <div className="space-y-2">
                              <Label
                                htmlFor="specialRequests"
                                className="text-sm font-medium"
                              >
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
                                className="min-h-[100px] resize-none"
                                placeholder="Any dietary requirements, special needs, or specific preferences..."
                              />
                            </div>

                            <div className="bg-slate-50/80 dark:bg-neutral-900/60 p-5 rounded-xl ring-1 ring-black/5 dark:ring-white/10">
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-medium">
                                  Total Amount:
                                </span>
                                <span className="text-2xl font-bold text-sky-700 dark:text-sky-300">
                                  {formatAED(totalAmount)}
                                </span>
                              </div>
                              <p className="text-sm text-slate-600 dark:text-slate-300">
                                {bookingData.travelers} traveler
                                {bookingData.travelers > 1 ? "s" : ""} ×{" "}
                                {formatAED(packageData.price)}
                              </p>
                              <p className="text-xs text-center text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-lg border border-amber-200 dark:border-amber-800 mt-4 italic">
                                ⚠️ Price may differ during final payment
                                processing.
                              </p>
                            </div>

                            <Button
                              type="submit"
                              className="w-full h-12 text-base rounded-xl font-semibold"
                              disabled={submitting}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              {submitting
                                ? "Processing..."
                                : "Confirm Booking & Download Invoice"}
                            </Button>
                          </form>
                        </div>

                        {/* Right: Summary */}
                        <div className="hidden md:block md:col-span-2 bg-slate-50/80 dark:bg-neutral-900/60 p-6 md:p-8 border-l border-slate-200/80 dark:border-white/10">
                          <h3 className="text-lg font-semibold mb-6">
                            Booking Summary
                          </h3>
                          <div className="space-y-4 text-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-600 dark:text-slate-300">
                                Package
                              </span>
                              <span className="font-medium text-slate-900 dark:text-slate-100">
                                {packageData.name}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-600 dark:text-slate-300">
                                Destination
                              </span>
                              <span className="font-medium text-slate-900 dark:text-slate-100">
                                {packageData.destination}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-600 dark:text-slate-300">
                                Duration
                              </span>
                              <span className="font-medium text-slate-900 dark:text-slate-100">
                                {packageData.duration}
                              </span>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                              <span className="text-slate-600 dark:text-slate-300">
                                Price / person
                              </span>
                              <span className="font-medium text-slate-900 dark:text-slate-100">
                                {formatAED(packageData.price)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-600 dark:text-slate-300">
                                Travelers
                              </span>
                              <span className="font-medium text-slate-900 dark:text-slate-100">
                                {bookingData.travelers}
                              </span>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between pt-2">
                              <span className="text-slate-600 dark:text-slate-300">
                                Total Amount
                              </span>
                              <span className="text-xl font-bold text-sky-700 dark:text-sky-300">
                                {formatAED(totalAmount)}
                              </span>
                            </div>
                          </div>

                          <div className="mt-8 space-y-4">
                            <div className="flex items-start gap-3 text-sm">
                              <Check className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                              <div>
                                <span className="font-medium block mb-1">
                                  Instant Confirmation
                                </span>
                                <span className="text-slate-600 dark:text-slate-300">
                                  Receive your booking confirmation and invoice
                                  immediately
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {!user && (
                    <p className="text-xs text-center text-slate-500">
                      Please sign in to book.
                    </p>
                  )}

                  <div className="space-y-2">
                    <p className="text-xs text-slate-500 text-center">
                      By booking, you agree to our terms and conditions. Your
                      invoice will be automatically downloaded and a
                      confirmation email will be sent.
                    </p>
                    <p className="text-xs text-center text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-lg border border-amber-200 dark:border-amber-800">
                      ⚠️ Price may differ during final payment processing.
                    </p>
                  </div>
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
