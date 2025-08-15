"use client";

import { useEffect, useState, useMemo, ChangeEvent } from "react";
import { motion, Variants } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Package } from "@/lib/models";
import { Search, MapPin, Calendar, Tag } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Animation Variants
const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, ease: EASE_OUT },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: EASE_OUT },
  },
};

const heroVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT } },
};

// Currency formatter for AED
const formatAED = (amount: number) =>
  new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: "AED",
    minimumFractionDigits: 0,
  }).format(amount);

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");
  const [selectedDestination, setSelectedDestination] = useState("all");

  const searchParams = useSearchParams();
  const destinationParam = searchParams.get("destination");

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch("/api/packages");
        if (res.ok) {
          const data = await res.json();
          setPackages(data);
          setFilteredPackages(data);
          if (destinationParam) setSelectedDestination(destinationParam);
        }
      } catch (err) {
        console.error("Error fetching packages:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, [destinationParam]);

  useEffect(() => {
    let filtered = packages;
    if (searchTerm) {
      filtered = filtered.filter(
        (pkg) =>
          pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pkg.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pkg.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedTag !== "all") {
      filtered = filtered.filter((pkg) => pkg.tags.includes(selectedTag));
    }
    if (selectedDestination !== "all") {
      filtered = filtered.filter(
        (pkg) => pkg.destination === selectedDestination
      );
    }
    setFilteredPackages(filtered);
  }, [packages, searchTerm, selectedTag, selectedDestination]);

  const tags = useMemo(
    () => ["all", ...Array.from(new Set(packages.flatMap((pkg) => pkg.tags)))],
    [packages]
  );
  const destinations = useMemo(
    () => [
      "all",
      ...Array.from(new Set(packages.map((pkg) => pkg.destination))),
    ],
    [packages]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Navbar />

      {/* Hero */}
      <section className="relative py-20 md:py-24 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/packages-hero.jpg"
            alt="Travel Packages"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/70 via-slate-900/40 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <motion.div
            variants={heroVariants}
            initial="hidden"
            animate="visible"
          >
            <h1 className="text-4xl md:text-6xl font-extrabold text-white">
              Explore{" "}
              <span className="bg-gradient-to-r from-amber-300 via-pink-300 to-violet-300 bg-clip-text text-transparent">
                Travel Packages
              </span>
            </h1>
            <p className="mt-4 text-lg text-blue-100/90 max-w-2xl mx-auto">
              Discover our curated packages for unforgettable experiences
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="relative -mt-8 z-10">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
            className="bg-white/40 backdrop-blur-3xl rounded-3xl border border-white/30 shadow-xl p-6 flex flex-col md:flex-row gap-4 items-center"
          >
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
              <Input
                placeholder="Search packages..."
                value={searchTerm}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setSearchTerm(e.target.value)
                }
                className="pl-12 pr-28 py-4 text-base bg-white/50 border border-white/40 rounded-2xl focus:ring-4 focus:ring-blue-400/20 focus:border-blue-400 shadow-sm"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <Button className="rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start w-full md:w-auto">
              <Select value={selectedTag} onValueChange={setSelectedTag}>
                <SelectTrigger className="w-full md:w-[180px] bg-white/50 border border-white/40 rounded-2xl">
                  <Tag className="h-4 w-4 mr-2 text-gray-500" />
                  <SelectValue placeholder="All Tags" />
                </SelectTrigger>
                <SelectContent>
                  {tags.map((tag) => (
                    <SelectItem key={tag} value={tag}>
                      {tag === "all" ? "All Tags" : tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={selectedDestination}
                onValueChange={setSelectedDestination}
              >
                <SelectTrigger className="w-full md:w-[180px] bg-white/50 border border-white/40 rounded-2xl">
                  <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                  <SelectValue placeholder="All Destinations" />
                </SelectTrigger>
                <SelectContent>
                  {destinations.map((dest) => (
                    <SelectItem key={dest} value={dest}>
                      {dest === "all" ? "All Destinations" : dest}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Packages */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <motion.div key={i} variants={cardVariants}>
                  <div className="h-96 rounded-3xl bg-white/30 animate-pulse" />
                </motion.div>
              ))}
            </motion.div>
          ) : filteredPackages.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredPackages.map((pkg) => (
                <motion.article
                  key={pkg._id?.toString()}
                  variants={cardVariants}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="relative group rounded-3xl overflow-hidden shadow-xl border border-white/20 bg-white/10 backdrop-blur-2xl transition-all duration-500"
                >
                  <Link href={`/packages/${pkg._id}`}>
                    {/* Image + Price Ribbon */}
                    <div className="relative h-64">
                      <Image
                        src={pkg.images[0] || "/placeholder.svg"}
                        alt={pkg.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                        {formatAED(pkg.price)}
                      </div>
                      {/* Tags */}
                      <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                        {pkg.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-white/80 text-gray-800 text-xs font-medium rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900">
                        {pkg.name}
                      </h3>
                      <div className="flex items-center justify-between text-sm text-gray-600 mt-2">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-emerald-500" />
                          {pkg.destination}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-amber-500" />
                          {pkg.duration}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm mt-4 line-clamp-3">
                        {pkg.description}
                      </p>
                      <Button className="w-full mt-6 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white">
                        View Details
                      </Button>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </motion.div>
          ) : (
            <div className="text-center text-gray-600">No packages found</div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
