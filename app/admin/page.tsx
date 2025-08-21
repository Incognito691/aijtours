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
  TrendingUp,
  type LucideIcon,
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
  gradient: string;
  iconColor: string;
  sub: string;
}

interface QuickActionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  primaryHref?: string;
  secondaryHref: string;
  hidePrimary?: boolean;
  gradient: string;
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-sky-500 border-t-transparent"></div>
          <div className="animate-pulse absolute inset-0 flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-sky-500" />
          </div>
        </div>
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
      gradient:
        "from-blue-50 to-blue-100/50 dark:from-blue-950 dark:to-blue-900/50",
      iconColor: "text-blue-500",
      sub: "Package categories",
    },
    {
      title: "Packages",
      value: stats.packages,
      icon: Package2,
      gradient:
        "from-emerald-50 to-emerald-100/50 dark:from-emerald-950 dark:to-emerald-900/50",
      iconColor: "text-emerald-500",
      sub: "Travel packages",
    },
    {
      title: "Events",
      value: stats.events,
      icon: Calendar,
      gradient:
        "from-purple-50 to-purple-100/50 dark:from-purple-950 dark:to-purple-900/50",
      iconColor: "text-purple-500",
      sub: "Special events",
    },
    {
      title: "Bookings",
      value: stats.bookings,
      icon: Users,
      gradient:
        "from-amber-50 to-amber-100/50 dark:from-amber-950 dark:to-amber-900/50",
      iconColor: "text-amber-500",
      sub: "Customer bookings",
    },
    {
      title: "Messages",
      value: stats.messages,
      icon: MessageSquare,
      gradient:
        "from-rose-50 to-rose-100/50 dark:from-rose-950 dark:to-rose-900/50",
      iconColor: "text-rose-500",
      sub: "Contact messages",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
            Admin Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
            Manage travel packages, events, and bookings with ease
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
          {statCards.map((card) => (
            <Card
              key={card.title}
              className="overflow-hidden hover:shadow-lg transition-all duration-300 rounded-2xl border-0 ring-1 ring-black/5 dark:ring-white/10"
            >
              <div className={`bg-gradient-to-br ${card.gradient} p-6`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {card.title}
                  </h3>
                  <card.icon className={`h-5 w-5 ${card.iconColor}`} />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {card.value}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {card.sub}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <QuickAction
            icon={<FolderOpen className="h-6 w-6 mr-3 text-blue-500" />}
            title="Manage Categories"
            description="Organize package categories for easy browsing"
            primaryHref="/admin/categories/new"
            secondaryHref="/admin/categories"
            gradient="from-blue-50 via-white to-white dark:from-blue-950 dark:via-gray-900 dark:to-gray-900"
          />
          <QuickAction
            icon={<Package2 className="h-6 w-6 mr-3 text-emerald-500" />}
            title="Manage Packages"
            description="Create and update travel packages"
            primaryHref="/admin/packages/new"
            secondaryHref="/admin/packages"
            gradient="from-emerald-50 via-white to-white dark:from-emerald-950 dark:via-gray-900 dark:to-gray-900"
          />
          <QuickAction
            icon={<Calendar className="h-6 w-6 mr-3 text-purple-500" />}
            title="Manage Events"
            description="Plan and manage special travel events"
            primaryHref="/admin/events/new"
            secondaryHref="/admin/events"
            gradient="from-purple-50 via-white to-white dark:from-purple-950 dark:via-gray-900 dark:to-gray-900"
          />
          <QuickAction
            icon={<Users className="h-6 w-6 mr-3 text-amber-500" />}
            title="Manage Bookings"
            description="Track and manage customer bookings"
            secondaryHref="/admin/bookings"
            hidePrimary
            gradient="from-amber-50 via-white to-white dark:from-amber-950 dark:via-gray-900 dark:to-gray-900"
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
  gradient,
}: QuickActionProps) {
  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 rounded-2xl border-0 ring-1 ring-black/5 dark:ring-white/10">
      <div className={`bg-gradient-to-br ${gradient} p-8`}>
        <CardHeader className="p-0 mb-8">
          <div className="flex items-start justify-between mb-4">
            <CardTitle className="text-xl font-semibold flex items-center text-gray-900 dark:text-white">
              {icon}
              {title}
            </CardTitle>
            <span className="h-8 w-8 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
              {icon}
            </span>
          </div>
          <CardDescription className="text-base text-gray-600 dark:text-gray-400">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 flex flex-col gap-3">
          {!hidePrimary && primaryHref && (
            <Link href={primaryHref} className="block">
              <Button className="w-full h-12 text-base font-medium rounded-xl shadow hover:shadow-lg hover:translate-y-[-1px] active:translate-y-[1px] transition-all duration-200">
                <Plus className="h-5 w-5 mr-2" /> Add New
              </Button>
            </Link>
          )}
          <Link href={secondaryHref} className="block">
            <Button
              variant="outline"
              className="w-full h-12 text-base font-medium rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white/80 dark:bg-black/50 backdrop-blur hover:bg-white dark:hover:bg-black/80 hover:translate-y-[-1px] active:translate-y-[1px] transition-all duration-200"
            >
              View All
            </Button>
          </Link>
        </CardContent>
      </div>
    </Card>
  );
}
