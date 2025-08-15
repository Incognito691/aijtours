"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
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
import type { Package, Event } from "@/lib/models";
import {
  MapPin,
  Calendar,
  Users,
  Star,
  Clock,
  ArrowRight,
  Plane,
  Shield,
  DollarSign,
  Award,
} from "lucide-react";

export default function HomePage() {
  const [featuredPackages, setFeaturedPackages] = useState<Package[]>([]);
  const [limitedOffers, setLimitedOffers] = useState<Package[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch packages
        const packagesResponse = await fetch("/api/packages");
        if (packagesResponse.ok) {
          const packages = await packagesResponse.json();
          setFeaturedPackages(
            packages
              .filter((pkg: Package) => pkg.tags.includes("Featured"))
              .slice(0, 3)
          );
          setLimitedOffers(
            packages
              .filter((pkg: Package) => pkg.tags.includes("Limited Offer"))
              .slice(0, 3)
          );
        }

        // Fetch events
        const eventsResponse = await fetch("/api/events");
        if (eventsResponse.ok) {
          const events = await eventsResponse.json();
          setUpcomingEvents(events.slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar />

      {/* Hero Section with Video */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden rounded-b-[3rem]">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            className="w-full h-full object-cover"
            poster="/placeholder.svg?height=1080&width=1920"
          >
            <source src="/video/landing-cinematic.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60" />
        </div>

        <div className="relative z-10 text-center text-white max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="backdrop-blur-sm bg-white/5 rounded-3xl p-8 border border-white/10"
          >
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            >
              Your Dream Journey
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                Awaits You
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl lg:text-2xl mb-8 text-white/90 font-light"
            >
              Discover extraordinary destinations with our handcrafted travel
              experiences
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/packages">
                <Button
                  size="lg"
                  className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-10 py-4 text-lg rounded-full shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105"
                >
                  <Plane className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                  Explore Destinations
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="group border-2 border-white/40 text-white hover:bg-white hover:text-gray-900 px-10 py-4 text-lg rounded-full bg-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  Plan My Trip
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Packages Section */}
      {featuredPackages.length > 0 && (
        <section className="py-24 bg-gradient-to-b from-white to-blue-50/30">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-20"
            >
              <div className="inline-flex items-center justify-center mb-6 p-3 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full">
                <Star className="h-8 w-8 text-amber-500 mr-2" />
                <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Featured Journeys
                </h2>
              </div>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Handpicked destinations that offer the perfect blend of
                adventure, culture, and unforgettable memories
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPackages.map((pkg, index) => (
                <motion.div
                  key={pkg._id?.toString() ?? index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="group overflow-hidden transition-all duration-500 rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-xl hover:shadow-2xl hover:bg-white/15 hover:border-white/30 hover:scale-[1.02] relative">
                    {/* Subtle gradient overlay for depth */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl pointer-events-none" />

                    <div className="relative h-72 overflow-hidden rounded-t-3xl">
                      <Image
                        src={
                          pkg.images[0] ||
                          "/placeholder.svg?height=300&width=400&query=travel destination"
                        }
                        alt={pkg.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                      {/* Featured Badge with glass effect */}
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-white/20 backdrop-blur-md border border-white/30 text-white font-semibold px-4 py-2 rounded-full shadow-lg hover:bg-white/25 transition-all duration-300">
                          <span className="drop-shadow-sm">⭐ Featured</span>
                        </Badge>
                      </div>

                      {/* Price tag with enhanced glass effect */}
                      <div className="absolute top-4 right-4">
                        <div className="bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl px-4 py-2 shadow-xl hover:bg-white/20 transition-all duration-300">
                          <span className="text-lg font-bold text-white drop-shadow-sm">
                            AED {pkg.price}
                          </span>
                        </div>
                      </div>
                    </div>

                    <CardHeader className="pb-3 relative z-10">
                      <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 drop-shadow-sm">
                        {pkg.name}
                      </CardTitle>
                      <CardDescription className="flex items-center text-gray-700">
                        <MapPin className="h-4 w-4 mr-2 text-blue-500 drop-shadow-sm" />
                        <span className="drop-shadow-sm">
                          {pkg.destination}
                        </span>
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-0 relative z-10">
                      <div className="flex items-center justify-between mb-4 gap-3">
                        <div className="flex items-center text-sm text-gray-700 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl px-3 py-2 shadow-sm hover:bg-white/25 transition-all duration-300">
                          <Calendar className="h-4 w-4 mr-2 text-gray-600" />
                          <span className="font-medium">{pkg.duration}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-700 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl px-3 py-2 shadow-sm hover:bg-white/25 transition-all duration-300">
                          <Users className="h-4 w-4 mr-2 text-gray-600" />
                          <span className="font-medium">
                            {pkg.categoryName}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-700 text-sm mb-6 line-clamp-2 leading-relaxed drop-shadow-sm">
                        {pkg.description}
                      </p>

                      <Link href={`/packages/${pkg._id}`}>
                        <Button className="w-full group bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/25 hover:border-white/40 rounded-2xl py-3 transition-all duration-300 hover:shadow-xl text-gray-800 font-semibold hover:text-blue-700">
                          <span className="drop-shadow-sm">
                            Explore Package
                          </span>
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center mt-16"
            >
              <Link href="/packages">
                <Button
                  variant="outline"
                  size="lg"
                  className="group border-2 border-blue-200 hover:border-blue-300 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-full transition-all duration-300 hover:scale-105"
                >
                  View All Packages
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* Limited Offers Section */}
      {limitedOffers.length > 0 && (
        <section className="py-24 bg-gradient-to-r from-red-50 via-pink-50 to-red-50">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-20"
            >
              <div className="inline-flex items-center justify-center mb-6 p-3 bg-gradient-to-r from-red-100 to-pink-100 rounded-full">
                <Clock className="h-8 w-8 text-red-500 mr-2 animate-pulse" />
                <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                  Limited Offers
                </h2>
              </div>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Exclusive deals that won't last long! Grab these amazing offers
                before they're gone
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {limitedOffers.map((pkg, index) => (
                <motion.div
                  key={pkg._id?.toString() ?? index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="group overflow-hidden transition-all duration-500 rounded-3xl border border-red-200/30 bg-gradient-to-br from-red-50/20 via-white/10 to-pink-50/20 backdrop-blur-xl shadow-xl hover:shadow-2xl hover:bg-gradient-to-br hover:from-red-50/30 hover:via-white/15 hover:to-pink-50/30 hover:border-red-300/40 hover:scale-[1.02] relative">
                    {/* Enhanced gradient overlay for limited offers */}
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-pink-500/5 rounded-3xl pointer-events-none" />

                    <div className="relative h-72 overflow-hidden rounded-t-3xl">
                      <Image
                        src={
                          pkg.images[0] ||
                          "/placeholder.svg?height=300&width=400&query=travel destination"
                        }
                        alt={pkg.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                      {/* Hot Deal Badge with glass effect and pulse animation */}
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-red-500/20 backdrop-blur-md border border-red-300/40 text-white font-semibold px-4 py-2 rounded-full shadow-lg hover:bg-red-500/30 transition-all animate-pulse">
                          <span className="drop-shadow-sm">🔥 Hot Deal</span>
                        </Badge>
                      </div>

                      {/* Price tag with red-tinted glass effect */}
                      <div className="absolute top-4 right-4">
                        <div className="bg-white/15 backdrop-blur-md border border-red-200/30 rounded-2xl px-4 py-2 shadow-xl hover:bg-white/20 hover:border-red-300/40 transition-all duration-300">
                          <span className="text-lg font-bold text-white drop-shadow-sm">
                            AED {pkg.price}
                          </span>
                        </div>
                      </div>
                    </div>

                    <CardHeader className="pb-3 relative z-10">
                      <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-red-600 transition-colors duration-300 drop-shadow-sm">
                        {pkg.name}
                      </CardTitle>
                      <CardDescription className="flex items-center text-gray-700">
                        <MapPin className="h-4 w-4 mr-2 text-red-500 drop-shadow-sm" />
                        <span className="drop-shadow-sm">
                          {pkg.destination}
                        </span>
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-0 relative z-10">
                      <div className="flex items-center justify-between mb-4 gap-3">
                        <div className="flex items-center text-sm text-gray-700 bg-white/20 backdrop-blur-sm border border-red-200/20 rounded-xl px-3 py-2 shadow-sm hover:bg-white/25 hover:border-red-200/30 transition-all duration-300">
                          <Calendar className="h-4 w-4 mr-2 text-gray-600" />
                          <span className="font-medium">{pkg.duration}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-700 bg-white/20 backdrop-blur-sm border border-red-200/20 rounded-xl px-3 py-2 shadow-sm hover:bg-white/25 hover:border-red-200/30 transition-all duration-300">
                          <Users className="h-4 w-4 mr-2 text-gray-600" />
                          <span className="font-medium">
                            {pkg.categoryName}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-700 text-sm mb-6 line-clamp-2 leading-relaxed drop-shadow-sm">
                        {pkg.description}
                      </p>

                      <Link href={`/packages/${pkg._id}`}>
                        <Button className="w-full group bg-gradient-to-r from-red-500/20 to-pink-500/20 backdrop-blur-md border border-red-300/30 hover:from-red-500/30 hover:to-pink-500/30 hover:border-red-400/40 rounded-2xl py-3 transition-all duration-300 hover:shadow-xl text-white font-semibold hover:text-white">
                          <span className="drop-shadow-sm">
                            Book Now - Limited Time!
                          </span>
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center mt-16"
            >
              <Link href="/packages">
                <Button
                  variant="outline"
                  size="lg"
                  className="group border-2 border-red-200 hover:border-red-300 text-red-600 hover:bg-red-50 px-8 py-3 rounded-full transition-all duration-300 hover:scale-105"
                >
                  View All Offers
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* Why Choose Us Section */}
      <section className="py-24 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Why Choose AFI Travel and Tourism?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We're passionate about creating extraordinary travel experiences
              that exceed your expectations
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Award className="h-10 w-10" />,
                title: "Expert Planning",
                description:
                  "Our travel specialists craft personalized itineraries tailored just for you",
                color: "bg-gradient-to-br from-blue-500 to-cyan-600",
              },
              {
                icon: <DollarSign className="h-10 w-10" />,
                title: "Best Value",
                description:
                  "Competitive pricing with transparent costs and no hidden surprises",
                color: "bg-gradient-to-br from-green-500 to-emerald-600",
              },
              {
                icon: <Shield className="h-10 w-10" />,
                title: "Safe & Secure",
                description:
                  "Your safety is paramount with 24/7 support throughout your journey",
                color: "bg-gradient-to-br from-purple-500 to-indigo-600",
              },
              {
                icon: <Star className="h-10 w-10" />,
                title: "5-Star Experience",
                description:
                  "Exceptional service from the moment you book until you return home",
                color: "bg-gradient-to-br from-amber-500 to-orange-600",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="group text-center h-full hover:shadow-2xl transition-all duration-500 rounded-2xl border-0 bg-white hover:scale-105 cursor-pointer">
                  <CardContent className="pt-8 pb-8">
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${feature.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                    >
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      {upcomingEvents.length > 0 && (
        <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-20"
            >
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Upcoming Events
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Join us for these special occasions and create memories that
                will last forever
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.map((event, index) => (
                <motion.div
                  key={event._id?.toString() ?? index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-500 rounded-2xl border-0 bg-white/80 backdrop-blur-sm hover:bg-white hover:scale-[1.02]">
                    <div className="relative h-56 overflow-hidden rounded-t-2xl">
                      <Image
                        src={
                          event.images[0] ||
                          "/placeholder.svg?height=200&width=400&query=event celebration"
                        }
                        alt={event.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent group-hover:from-black/30 transition-all duration-300" />
                      <div className="absolute top-4 right-4">
                        <div className="bg-white/95 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg">
                          <span className="text-lg font-bold text-gray-900">
                            AED {event.price}
                          </span>
                        </div>
                      </div>
                    </div>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-bold group-hover:text-blue-600 transition-colors duration-300">
                        {event.name}
                      </CardTitle>
                      <CardDescription className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                        {event.location}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center text-sm text-gray-600 mb-4 bg-gray-50 rounded-lg px-3 py-2">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(event.date).toLocaleDateString()}
                      </div>
                      <p className="text-gray-600 text-sm mb-6 line-clamp-2 leading-relaxed">
                        {event.description}
                      </p>
                      <Link href={`/events/${event._id}`}>
                        <Button
                          className="w-full group border-2 border-blue-200 hover:border-blue-300 text-blue-600 hover:bg-blue-50 rounded-xl py-3 transition-all duration-300"
                          variant="outline"
                        >
                          Learn More
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center mt-16"
            >
              <Link href="/events">
                <Button
                  variant="outline"
                  size="lg"
                  className="group border-2 border-blue-200 hover:border-blue-300 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-full transition-all duration-300 hover:scale-105"
                >
                  View All Events
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white rounded-t-[3rem] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=400&width=1200&query=abstract pattern')] opacity-10" />
        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="backdrop-blur-sm bg-white/5 rounded-3xl p-12 border border-white/10"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Ready for Your Next Adventure?
            </h2>
            <p className="text-xl text-blue-100 mb-10 leading-relaxed max-w-3xl mx-auto">
              Let our travel experts help you create the perfect getaway. Your
              dream destination is just a click away!
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/contact">
                <Button
                  size="lg"
                  className="group bg-white text-blue-600 hover:bg-gray-50 px-10 py-4 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <Plane className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                  Start Planning Today
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
              <Link href="/packages">
                <Button
                  size="lg"
                  variant="outline"
                  className="group border-2 border-white/40 text-white hover:bg-white hover:text-blue-600 px-10 py-4 text-lg rounded-full bg-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                >
                  Browse All Packages
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
