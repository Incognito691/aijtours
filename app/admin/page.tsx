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
  LucideIcon,
} from "lucide-react";
import Link from "next/link";

interface Stats {
  packages: number;
  events: number;
  bookings: number;
  messages: number;
  categories: number;
}

interface StatCard {
  title: string;
  value: number;
  icon: LucideIcon;
  color: string;
  sub: string;
}

interface QuickActionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  primaryHref?: string;
  secondaryHref: string;
  hidePrimary?: boolean;
}

export default function AdminDashboard() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({
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
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (
    !user ||
    user.emailAddresses[0]?.emailAddress !== process.env.NEXT_PUBLIC_ADMIN_EMAIL
  ) {
    return null;
  }

  const statCards: StatCard[] = [
    {
      title: "Categories",
      value: stats.categories,
      icon: FolderOpen,
      color: "text-blue-500",
      sub: "Package categories",
    },
    {
      title: "Packages",
      value: stats.packages,
      icon: Package2,
      color: "text-green-500",
      sub: "Travel packages",
    },
    {
      title: "Events",
      value: stats.events,
      icon: Calendar,
      color: "text-purple-500",
      sub: "Special events",
    },
    {
      title: "Bookings",
      value: stats.bookings,
      icon: Users,
      color: "text-orange-500",
      sub: "Customer bookings",
    },
    {
      title: "Messages",
      value: stats.messages,
      icon: MessageSquare,
      color: "text-red-500",
      sub: "Contact messages",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Manage travel packages, events, and bookings with ease
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-16">
          {statCards.map((card) => (
            <Card
              key={card.title}
              className="hover:shadow-xl transition-all duration-300 rounded-2xl border border-gray-200"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-sm font-medium text-gray-500">
                  {card.title}
                </CardTitle>
                <card.icon className={`h-6 w-6 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {card.value}
                </div>
                <p className="text-sm text-gray-500">{card.sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <QuickAction
            icon={<FolderOpen className="h-6 w-6 mr-3 text-blue-500" />}
            title="Manage Categories"
            description="Organize package categories for easy browsing"
            primaryHref="/admin/categories/new"
            secondaryHref="/admin/categories"
          />
          <QuickAction
            icon={<Package2 className="h-6 w-6 mr-3 text-green-500" />}
            title="Manage Packages"
            description="Create and update travel packages"
            primaryHref="/admin/packages/new"
            secondaryHref="/admin/packages"
          />
          <QuickAction
            icon={<Calendar className="h-6 w-6 mr-3 text-purple-500" />}
            title="Manage Events"
            description="Plan and manage special travel events"
            primaryHref="/admin/events/new"
            secondaryHref="/admin/events"
          />
          <QuickAction
            icon={<Users className="h-6 w-6 mr-3 text-orange-500" />}
            title="Manage Bookings"
            description="Track and manage customer bookings"
            secondaryHref="/admin/bookings"
            hidePrimary
          />
        </div>
      </div>
    </div>
  );
}

function QuickAction({
  icon,
  title,
  description,
  primaryHref,
  secondaryHref,
  hidePrimary,
}: QuickActionProps) {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 rounded-2xl border border-gray-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold flex items-center">
          {icon}
          {title}
        </CardTitle>
        <CardDescription className="text-base text-gray-500">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {!hidePrimary && primaryHref && (
          <Link href={primaryHref}>
            <Button className="w-full h-11 text-base shadow-sm hover:shadow-md transition-all">
              <Plus className="h-5 w-5 mr-2" /> Add New
            </Button>
          </Link>
        )}
        <Link href={secondaryHref}>
          <Button
            variant="outline"
            className="w-full h-11 text-base border-gray-300 hover:border-gray-400"
          >
            View All
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
