"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hasNewBookings, setHasNewBookings] = useState(false);

  useEffect(() => {
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
  }, []);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Destinations", href: "/destinations" },
    { name: "UAE Activities", href: "/events" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const isAdmin =
    user?.emailAddresses[0]?.emailAddress ===
    process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  // fetch bookings if admin
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch("/api/bookings");
        if (res.ok) {
          const data = await res.json();
          const pendingExists = data.some((b: any) => b.status === "pending");
          const hasSeen = localStorage.getItem("admin_seen_bookings");
          setHasNewBookings(pendingExists && hasSeen !== "true");
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    };
    if (isAdmin) fetchBookings();
  }, [isAdmin]);

  const displayCategories = categories.slice(0, 4);
  const hasMoreCategories = categories.length > 4;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3">
            <img
              src="/images/logo.jpg"
              alt="AFI Travel and Tourism"
              className="h-10 sm:h-12 w-auto object-contain"
            />
            <span className="text-lg sm:text-xl font-bold text-gray-900 whitespace-nowrap">
              AFI Travel
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
            <NavigationMenu>
              <NavigationMenuList className="flex items-center space-x-1">
                {navigation.map((item) => (
                  <NavigationMenuItem key={item.name}>
                    <Link href={item.href} legacyBehavior passHref>
                      <NavigationMenuLink
                        className={cn(
                          "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                          isActive(item.href)
                            ? "bg-blue-100 text-blue-700"
                            : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                        )}
                      >
                        {item.name}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                ))}

                {/* Packages Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={cn(
                      "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive("/packages")
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                    )}
                  >
                    Packages
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-72 sm:w-80 p-4">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                        Travel Packages
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 mb-3">
                        Explore curated categories
                      </p>
                      {categories.length > 0 ? (
                        <div className="space-y-2 max-h-56 overflow-y-auto">
                          {displayCategories.map((category) => (
                            <Link
                              key={category._id}
                              href={`/packages/category/${category.slug}`}
                              legacyBehavior
                              passHref
                            >
                              <NavigationMenuLink className="block px-3 py-2 rounded-md text-sm text-gray-700 hover:text-blue-600 hover:bg-gray-50 border-b border-gray-100 last:border-0">
                                {category.name}
                                {category.description && (
                                  <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                                    {category.description}
                                  </p>
                                )}
                              </NavigationMenuLink>
                            </Link>
                          ))}
                          {hasMoreCategories && (
                            <Link href="/packages" legacyBehavior passHref>
                              <NavigationMenuLink className="block text-center px-3 py-2 rounded-md text-sm font-medium text-blue-600 hover:bg-blue-50">
                                View All Categories
                              </NavigationMenuLink>
                            </Link>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">
                          No categories available
                        </p>
                      )}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Admin */}
                {isAdmin && (
                  <NavigationMenuItem>
                    <Link href="/admin" legacyBehavior passHref>
                      <NavigationMenuLink
                        className={cn(
                          "relative px-3 py-2 rounded-md text-sm font-medium",
                          isActive("/admin")
                            ? "bg-red-100 text-red-700"
                            : "text-red-600 hover:text-red-700 hover:bg-red-50"
                        )}
                      >
                        Admin
                        {hasNewBookings && (
                          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-blue-500"></span>
                        )}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                )}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-2">
            {isLoaded &&
              (user ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700 hidden sm:block">
                    Hi, {user.firstName || user.emailAddresses[0]?.emailAddress}
                  </span>
                  <UserButton afterSignOutUrl="/" />
                </div>
              ) : (
                <>
                  <SignInButton mode="modal">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-700 hover:text-blue-600"
                    >
                      Sign In
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Sign Up
                    </Button>
                  </SignUpButton>
                </>
              ))}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 sm:w-80">
                <div className="flex flex-col space-y-3 mt-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "px-4 py-2 rounded-md text-base transition-colors",
                        isActive(item.href)
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}

                  {/* Mobile Packages */}
                  <div className="border-t pt-3">
                    <p className="px-4 py-2 text-sm font-medium text-gray-900 flex items-center justify-between">
                      Packages <ChevronDown className="h-4 w-4" />
                    </p>
                    {categories.length > 0 && (
                      <div className="ml-3 mt-2 space-y-1 max-h-40 overflow-y-auto">
                        {displayCategories.map((category) => (
                          <Link
                            key={category._id}
                            href={`/packages/category/${category.slug}`}
                            onClick={() => setIsOpen(false)}
                            className="block px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                          >
                            {category.name}
                          </Link>
                        ))}
                        {hasMoreCategories && (
                          <Link
                            href="/packages"
                            onClick={() => setIsOpen(false)}
                            className="block px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md"
                          >
                            View All Categories
                          </Link>
                        )}
                      </div>
                    )}
                  </div>

                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "px-4 py-2 rounded-md text-base",
                        isActive("/admin")
                          ? "bg-red-100 text-red-700"
                          : "text-red-600 hover:text-red-700 hover:bg-red-50"
                      )}
                    >
                      Admin Panel
                    </Link>
                  )}

                  {/* Mobile Auth */}
                  <div className="border-t pt-3">
                    {isLoaded &&
                      (user ? (
                        <div className="flex items-center justify-between px-4 py-2">
                          <span className="text-sm text-gray-700">
                            {user.firstName ||
                              user.emailAddresses[0]?.emailAddress}
                          </span>
                          <UserButton afterSignOutUrl="/" />
                        </div>
                      ) : (
                        <div className="space-y-2 px-4">
                          <SignInButton mode="modal">
                            <Button variant="outline" className="w-full">
                              Sign In
                            </Button>
                          </SignInButton>
                          <SignUpButton mode="modal">
                            <Button className="w-full bg-blue-600 hover:bg-blue-700">
                              Sign Up
                            </Button>
                          </SignUpButton>
                        </div>
                      ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
