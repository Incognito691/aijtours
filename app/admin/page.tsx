"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";
import {
  Package2,
  Calendar,
  MessageSquare,
  Users,
  Plus,
  FolderOpen,
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [stats, setStats] = useState({
    packages: 0,
    events: 0,
    bookings: 0,
    messages: 0,
    categories: 0,
  });

  useEffect(() => {
    if (
      isLoaded &&
      (!user ||
        user.emailAddresses[0]?.emailAddress !==
          process.env.NEXT_PUBLIC_ADMIN_EMAIL)
    ) {
      router.push("/");
    }
  }, [user, isLoaded, router]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          packagesRes,
          eventsRes,
          bookingsRes,
          messagesRes,
          categoriesRes,
        ] = await Promise.all([
          fetch("/api/packages"),
          fetch("/api/events"),
          fetch("/api/bookings"),
          fetch("/api/contact"),
          fetch("/api/package-categories"),
        ]);

        const packages = packagesRes.ok ? await packagesRes.json() : [];
        const events = eventsRes.ok ? await eventsRes.json() : [];
        const bookings = bookingsRes.ok ? await bookingsRes.json() : [];
        const messages = messagesRes.ok ? await messagesRes.json() : [];
        const categories = categoriesRes.ok ? await categoriesRes.json() : [];

        setStats({
          packages: packages.length || 0,
          events: events.length || 0,
          bookings: bookings.length || 0,
          messages: messages.length || 0,
          categories: categories.length || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    if (
      user?.emailAddresses[0]?.emailAddress ===
      process.env.NEXT_PUBLIC_ADMIN_EMAIL
    ) {
      fetchStats();
    }
  }, [user]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (
    !user ||
    user.emailAddresses[0]?.emailAddress !== process.env.NEXT_PUBLIC_ADMIN_EMAIL
  ) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Admin Dashboard
          </h1>
          <p className="text-xl text-gray-600">
            Manage your travel packages, events, and bookings
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-16">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Categories
              </CardTitle>
              <FolderOpen className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {stats.categories}
              </div>
              <p className="text-sm text-gray-500 mt-1">Package categories</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Packages
              </CardTitle>
              <Package2 className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {stats.packages}
              </div>
              <p className="text-sm text-gray-500 mt-1">Travel packages</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Events
              </CardTitle>
              <Calendar className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {stats.events}
              </div>
              <p className="text-sm text-gray-500 mt-1">Special events</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Bookings
              </CardTitle>
              <Users className="h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {stats.bookings}
              </div>
              <p className="text-sm text-gray-500 mt-1">Customer bookings</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Messages
              </CardTitle>
              <MessageSquare className="h-5 w-5 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {stats.messages}
              </div>
              <p className="text-sm text-gray-500 mt-1">Contact messages</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold flex items-center">
                <FolderOpen className="h-6 w-6 mr-3 text-blue-600" />
                Manage Categories
              </CardTitle>
              <CardDescription className="text-base">
                Create and organize package categories to help customers find
                the perfect travel experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/admin/categories/new">
                <Button className="w-full h-12 text-base">
                  <Plus className="h-5 w-5 mr-3" />
                  Add New Category
                </Button>
              </Link>
              <Link href="/admin/categories">
                <Button
                  variant="outline"
                  className="w-full h-12 text-base bg-transparent"
                >
                  View All Categories
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold flex items-center">
                <Package2 className="h-6 w-6 mr-3 text-green-600" />
                Manage Packages
              </CardTitle>
              <CardDescription className="text-base">
                Create, edit, and manage travel packages with detailed
                itineraries and pricing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/admin/packages/new">
                <Button className="w-full h-12 text-base">
                  <Plus className="h-5 w-5 mr-3" />
                  Add New Package
                </Button>
              </Link>
              <Link href="/admin/packages">
                <Button
                  variant="outline"
                  className="w-full h-12 text-base bg-transparent"
                >
                  View All Packages
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold flex items-center">
                <Calendar className="h-6 w-6 mr-3 text-purple-600" />
                Manage Events
              </CardTitle>
              <CardDescription className="text-base">
                Create and manage special events, tours, and time-sensitive
                travel opportunities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/admin/events/new">
                <Button className="w-full h-12 text-base">
                  <Plus className="h-5 w-5 mr-3" />
                  Add New Event
                </Button>
              </Link>
              <Link href="/admin/events">
                <Button
                  variant="outline"
                  className="w-full h-12 text-base bg-transparent"
                >
                  View All Events
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold flex items-center">
                <Users className="h-6 w-6 mr-3 text-orange-600" />
                Manage Bookings
              </CardTitle>
              <CardDescription className="text-base">
                View and manage customer bookings, track payments, and handle
                customer requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/bookings">
                <Button
                  variant="outline"
                  className="w-full h-12 text-base bg-transparent"
                >
                  View All Bookings
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
