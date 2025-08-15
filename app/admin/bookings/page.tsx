"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Calendar, MapPin, Users, Mail, Phone } from "lucide-react";

interface Booking {
  _id: string;
  userId: string;
  userEmail: string;
  userName: string;
  packageId?: string;
  eventId?: string;
  type: "package" | "event";
  bookingDetails: {
    travelers: number;
    travelDate: string;
    contactNumber: string;
    specialRequests?: string;
  };
  totalAmount: number;
  status: string;
  createdAt: string;
  packageName?: string;
  eventName?: string;
  destination?: string;
  location?: string;
}

export default function AdminBookingsPage() {
  const { user } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (
      user?.emailAddresses[0]?.emailAddress !==
      process.env.NEXT_PUBLIC_ADMIN_EMAIL
    ) {
      router.push("/");
      return;
    }

    const fetchBookings = async () => {
      try {
        const response = await fetch("/api/bookings");
        if (response.ok) {
          const data = await response.json();
          setBookings(data);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user, router]);

  const handleDelete = async (bookingId: string) => {
    setDeleting(bookingId);
    try {
      const response = await fetch(`/api/bookings/AED {bookingId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setBookings((prev) =>
          prev.filter((booking) => booking._id !== bookingId)
        );
        toast({
          title: "Booking deleted",
          description: "The booking has been successfully deleted.",
        });
      } else {
        throw new Error("Failed to delete booking");
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
      toast({
        title: "Error",
        description: "Failed to delete booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeleting(null);
    }
  };

  if (
    user?.emailAddresses[0]?.emailAddress !==
    process.env.NEXT_PUBLIC_ADMIN_EMAIL
  ) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-300 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Bookings Management
          </h1>
          <p className="text-gray-600 mt-2">
            View and manage all customer bookings
          </p>
        </div>

        {bookings.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No bookings yet
              </h3>
              <p className="text-gray-600">
                Customer bookings will appear here once they start booking
                packages and events.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => (
              <Card
                key={booking._id}
                className="hover:shadow-lg transition-shadow duration-200"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {booking.type === "package"
                          ? booking.packageName
                          : booking.eventName}
                      </CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        {booking.type === "package"
                          ? booking.destination
                          : booking.location}
                      </CardDescription>
                    </div>
                    <Badge
                      variant={
                        booking.status === "confirmed" ? "default" : "secondary"
                      }
                    >
                      {booking.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Customer Info */}
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="h-4 w-4 mr-2" />
                      <span className="font-medium">{booking.userName}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="h-4 w-4 mr-2" />
                      {booking.userEmail}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-4 w-4 mr-2" />
                      {booking.bookingDetails.contactNumber}
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="border-t pt-3 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-1" />
                        Travel Date:
                      </span>
                      <span className="font-medium">
                        {new Date(
                          booking.bookingDetails.travelDate
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center text-gray-600">
                        <Users className="h-4 w-4 mr-1" />
                        Travelers:
                      </span>
                      <span className="font-medium">
                        {booking.bookingDetails.travelers}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-bold text-lg text-green-600">
                        AED {booking.totalAmount}
                      </span>
                    </div>
                  </div>

                  {/* Special Requests */}
                  {booking.bookingDetails.specialRequests && (
                    <div className="border-t pt-3">
                      <p className="text-sm text-gray-600 mb-1">
                        Special Requests:
                      </p>
                      <p className="text-sm bg-gray-50 p-2 rounded">
                        {booking.bookingDetails.specialRequests}
                      </p>
                    </div>
                  )}

                  {/* Booking Date */}
                  <div className="border-t pt-3">
                    <p className="text-xs text-gray-500">
                      Booked on:{" "}
                      {new Date(booking.createdAt).toLocaleDateString()} at{" "}
                      {new Date(booking.createdAt).toLocaleTimeString()}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="border-t pt-3">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="w-full"
                          disabled={deleting === booking._id}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          {deleting === booking._id
                            ? "Deleting..."
                            : "Delete Booking"}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Booking</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this booking? This
                            action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(booking._id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
