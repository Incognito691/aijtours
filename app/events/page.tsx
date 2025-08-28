"use client";

import { useEffect, useState, useMemo, ChangeEvent } from "react";
import { motion, Variants } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Event } from "@/lib/models";
import {
  Search,
  MapPin,
  Sparkles,
  Filter,
  BadgePercent,
  ArrowRight,
} from "lucide-react";

// Animation constants
const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_IN_OUT: [number, number, number, number] = [0.45, 0, 0.55, 1];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, ease: EASE_OUT },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 26, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: EASE_OUT },
  },
};

const heroVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE_OUT },
  },
};

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const filteredEvents = useMemo(() => {
    return searchTerm
      ? events.filter(
          (event) =>
            event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : events;
  }, [searchTerm, events]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/events");
        if (!res.ok) throw new Error("Failed to fetch events");
        const data: Event[] = await res.json();
        setEvents(data);
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 border-red-700">
      <Navbar />

      {/* Hero */}
      <section className="relative py-20 md:py-24 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/events-dubai.jpg"
            alt="Activities"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/70 via-slate-900/40 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div
            variants={heroVariants}
            initial="hidden"
            animate="visible"
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-full px-5 py-2.5 mb-6 border border-white/20">
              <Sparkles className="h-4 w-4 text-blue-200" />
              <span className="text-white/90 text-sm font-medium">
                Discover Amazing Activity
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
              Travel{" "}
              <span className="bg-gradient-to-r from-amber-300 via-pink-300 to-violet-300 bg-clip-text text-transparent">
                Activities
              </span>
            </h1>

            <p className="mt-4 text-lg text-blue-100/90">
              Join us for exciting travel activities, workshops, and unique
              experiences that will create memories to last a lifetime.
            </p>

            {/* Stats */}
            <div className="mt-10 flex flex-wrap gap-4">
              {[
                {
                  number: filteredEvents.length.toString(),
                  label: "Activity",
                  icon: Sparkles,
                },
                {
                  number: "24/7",
                  label: "Support",
                  icon: Filter,
                },
              ].map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.1, ease: EASE_OUT }}
                    className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3"
                  >
                    <Icon className="h-4 w-4 text-white/90" />
                    <span className="text-white font-semibold">{s.number}</span>
                    <span className="text-white/80 text-sm">{s.label}</span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search */}
      <section className="relative -mt-8 z-10">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
            className="bg-white/70 backdrop-blur-2xl rounded-2xl border border-white/60 shadow-xl"
          >
            <div className="p-5 md:p-6">
              <div className="flex flex-col md:flex-row items-stretch gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
                  <Input
                    placeholder="Search activities, locations, or descriptions…"
                    value={searchTerm}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setSearchTerm(e.target.value)
                    }
                    className="pl-12 pr-28 py-6 text-base bg-white/80 border-white/60 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400 shadow-sm"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <Button
                      size="sm"
                      className="rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white"
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between md:justify-center gap-3 bg-white/70 backdrop-blur-xl rounded-xl px-4 py-3 border border-white/60">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-sm font-medium text-gray-700">
                    {filteredEvents.length} activit
                    {filteredEvents.length !== 1 ? "ies" : "y"} found
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-16 md:py-20 relative">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            // Skeleton loading
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <motion.div
                  key={`skeleton-${i}`}
                  variants={cardVariants}
                  className="h-[26rem] rounded-2xl bg-white/30 backdrop-blur-md border border-white/40 shadow-lg animate-pulse"
                />
              ))}
            </motion.div>
          ) : filteredEvents.length > 0 ? (
            // Event cards
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredEvents.map((event, index) => (
                <motion.article
                  key={event._id?.toString() ?? index}
                  variants={cardVariants}
                  whileHover={{
                    y: -6,
                    transition: { duration: 0.3, ease: EASE_OUT },
                  }}
                  className="group relative rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-shadow"
                >
                  {/* Clickable card overlay (entire card navigates) */}
                  <Link
                    href={event._id ? `/events/${event._id}` : "#"}
                    className="absolute inset-0 z-[5]"
                    aria-label={`Open ${event.name}`}
                  >
                    <span className="sr-only">{event.name}</span>
                  </Link>

                  {/* Image */}
                  <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl">
                    <Image
                      src={
                        event.images?.[0] ||
                        "/placeholder.svg?height=300&width=400&text=Event"
                      }
                      alt={event.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      priority={index < 3}
                    />

                    {/* Price badge */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        delay: index * 0.06 + 0.2,
                        ease: EASE_IN_OUT,
                      }}
                      className="absolute top-3 right-3"
                    >
                      <div className="bg-white/95 text-gray-900 font-medium text-sm rounded-lg px-3 py-1.5 shadow-md border border-gray-200 flex items-center gap-1.5">
                        <BadgePercent className="h-4 w-4 text-blue-600" />
                        AED
                        {event.price}
                      </div>
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {event.name}
                    </h3>

                    {/* Meta */}
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-emerald-600" />
                        {event.location}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="mt-5 flex items-center gap-3">
                      <Link
                        href={event._id ? `/events/${event._id}` : "#"}
                        className="z-[6]"
                      >
                        <Button className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium">
                          View Details
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          ) : (
            // No events state
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: EASE_OUT }}
              className="text-center py-24"
            >
              <div className="max-w-lg mx-auto bg-white/20 backdrop-blur-xl rounded-2xl p-12 shadow-xl border border-white/30">
                <div className="w-20 h-20 mx-auto bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-6 shadow-md">
                  <Search className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  No events found
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm
                    ? "Try a different keyword or clear your search to view all events."
                    : "No events are available right now. Please check back soon!"}
                </p>
                {searchTerm && (
                  <Button
                    onClick={() => setSearchTerm("")}
                    className="bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 text-gray-900 font-medium rounded-lg px-6 transition-all duration-300"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Show All Events
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
