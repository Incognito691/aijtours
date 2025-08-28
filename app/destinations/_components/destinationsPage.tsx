"use client";

import { useEffect, useState, useMemo, useCallback, ChangeEvent } from "react";
import { motion, Variants } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Package } from "@/lib/models";
import {
  Search,
  MapPin,
  Package2,
  ArrowRight,
  Globe,
  Sparkles,
  Heart,
  LucideIcon,
} from "lucide-react";

// -------------------- Animation Variants --------------------
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

export default function DestinationsPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const destinations = useMemo(
    () =>
      Array.from(
        new Set(
          packages
            .map((pkg) => pkg.destination)
            .filter((d): d is string => Boolean(d))
        )
      ),
    [packages]
  );

  const filteredDestinations = useMemo(() => {
    return searchTerm
      ? destinations.filter((dest) =>
          dest.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : destinations;
  }, [searchTerm, destinations]);

  const getDestinationPackages = useCallback(
    (destination: string) =>
      packages.filter((pkg) => pkg.destination === destination),
    [packages]
  );

  const getDestinationImage = useCallback(
    (destination: string) =>
      getDestinationPackages(destination)[0]?.images?.[0] ?? "/placeholder.svg",
    [getDestinationPackages]
  );

  // -------------------- Data Fetch --------------------
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/packages");
        if (!res.ok) throw new Error("Failed to fetch packages");
        const data: Package[] = await res.json();
        setPackages(data);
      } catch (err) {
        console.error("Error fetching packages:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // -------------------- UI --------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Navbar />

      {/* Hero */}
      <section className="relative py-20 md:py-24 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/destination-hero.jpg"
            alt="Destinations"
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
              <Globe className="h-4 w-4 text-blue-200" />
              <span className="text-white/90 text-sm font-medium">
                Explore the world
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
              Amazing{" "}
              <span className="bg-gradient-to-r from-amber-300 via-pink-300 to-violet-300 bg-clip-text text-transparent">
                Destinations
              </span>
            </h1>

            <p className="mt-4 text-lg text-blue-100/90">
              Discover breathtaking locations with curated travel packages. Your
              next adventure is one click away.
            </p>

            {/* Stats */}
            <div className="mt-10 flex flex-wrap gap-4">
              {[
                {
                  number: destinations.length.toString(),
                  label: "Destinations",
                  icon: Globe,
                },
                {
                  number: packages.length.toString(),
                  label: "Packages",
                  icon: Package2,
                },
                { number: "24/7", label: "Support", icon: Heart },
              ].map((s, i) => {
                const Icon: LucideIcon = s.icon;
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
                    placeholder="Search your dream destination…"
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
                    {filteredDestinations.length} destination
                    {filteredDestinations.length !== 1 ? "s" : ""} found
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-16 md:py-20 relative">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            // Loading skeletons
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
                  className="relative"
                >
                  <div className="h-[28rem] rounded-2xl bg-white/30 backdrop-blur-md border border-white/40 shadow-lg animate-pulse" />
                </motion.div>
              ))}
            </motion.div>
          ) : filteredDestinations.length > 0 ? (
            // Destination cards
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredDestinations.map((dest, index) => {
                const destPkgs = getDestinationPackages(dest);
                const img = getDestinationImage(dest);

                return (
                  <motion.article
                    key={dest}
                    variants={cardVariants}
                    whileHover={{
                      y: -6,
                      transition: {
                        duration: 0.3,
                        ease: "easeOut",
                      },
                    }}
                    className="group relative"
                  >
                    <div className="relative h-[28rem] rounded-2xl overflow-hidden shadow-xl border border-white/20 bg-white/10 backdrop-blur-md">
                      <Image
                        src={img}
                        alt={dest}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                        priority
                      />

                      {/* Glass overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                      {/* Package count badge */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          delay: index * 0.06 + 0.2,
                          ease: EASE_IN_OUT,
                        }}
                        className="absolute top-4 right-4"
                      >
                        <div className="bg-white/90 backdrop-blur-sm border border-white/40 rounded-lg px-3 py-1.5 shadow-md">
                          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-900">
                            <Package2 className="h-4 w-4 text-blue-600" />
                            {destPkgs.length}
                          </span>
                        </div>
                      </motion.div>

                      {/* Card content */}
                      <div className="absolute inset-x-4 bottom-4">
                        <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-xl p-6 shadow-lg">
                          <h3 className="text-white text-xl font-bold flex items-center gap-2 mb-3">
                            <MapPin className="h-5 w-5 text-emerald-400" />
                            {dest}
                          </h3>
                          <p className="text-white/90 text-sm leading-relaxed mb-4">
                            Discover {dest} with curated travel packages — from
                            cultural experiences to adventure tours.
                          </p>
                          <Link
                            href={`/packages?destination=${encodeURIComponent(
                              dest
                            )}`}
                            className="block"
                          >
                            <Button className="w-full rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 text-white font-medium transition-all duration-300 hover:shadow-lg">
                              Explore Packages
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </motion.div>
          ) : (
            // No results message
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
                  No destinations found
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm
                    ? "Try a different keyword or clear your search to view all destinations."
                    : "No destinations are available right now. Please check back soon!"}
                </p>
                {searchTerm && (
                  <Button
                    onClick={() => setSearchTerm("")}
                    className="bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 text-gray-900 font-medium rounded-lg px-6 transition-all duration-300"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Show All Destinations
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
