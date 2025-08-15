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

  // Currency helpers (AED)
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
          // If your PDF generator supports it, pass a currency label
          currency: "AED",
        } as const;

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
              total_amount: `${formatAED(
                packageData ? packageData.price * bookingData.travelers : 0
              )}`,
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
              from_name: "AIJ Holidays System",
              package_name: packageData?.name,
              destination: packageData?.destination,
              duration: packageData?.duration,
              travel_date: new Date(
                bookingData.travelDate
              ).toLocaleDateString(),
              travelers: bookingData.travelers,
              total_amount: `${formatAED(
                packageData ? packageData.price * bookingData.travelers : 0
              )}`,
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
          <div className="absolute inset-0 flex items-end">
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
                      <Button className="w-full h-11 text-base font-semibold rounded-xl shadow hover:shadow-lg transition-all">
                        Book Now
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md rounded-2xl">
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
                                  travelers:
                                    Number.parseInt(e.target.value) || 1,
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
                            placeholder="+971 50 123 4567"
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
                        <div className="bg-slate-50 dark:bg-neutral-800 p-4 rounded-xl ring-1 ring-black/5 dark:ring-white/10">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Total Amount:</span>
                            <span className="text-xl font-bold text-sky-700 dark:text-sky-300">
                              {formatAED(totalAmount)}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                            {bookingData.travelers} traveler
                            {bookingData.travelers > 1 ? "s" : ""} ×{" "}
                            {formatAED(packageData.price)}
                          </p>
                          <p className="text-xs text-amber-600 mt-2 italic">
                            *Price may differ during final payment processing.
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
                            : "Confirm Booking & Download Invoice"}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>

                  <p className="text-xs text-slate-500 text-center">
                    By booking, you agree to our terms and conditions. Your
                    invoice will be automatically downloaded and confirmation
                    emails will be sent.
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
