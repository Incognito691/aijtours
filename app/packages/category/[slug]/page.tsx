"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { useParams } from "next/navigation";
import { motion, Variants } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import type { Package, PackageCategory } from "@/lib/models";
import { Search, MapPin, Calendar, ArrowLeft, ArrowRight } from "lucide-react";

// -------------------- Animation Variants --------------------
const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, ease: EASE_OUT },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
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

export default function CategoryPackagesPage() {
  const params = useParams();
  const [category, setCategory] = useState<PackageCategory | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, packagesRes] = await Promise.all([
          fetch("/api/package-categories"),
          fetch("/api/packages"),
        ]);

        if (categoriesRes.ok && packagesRes.ok) {
          const categories = await categoriesRes.json();
          const allPackages = await packagesRes.json();

          const currentCategory = categories.find(
            (cat: PackageCategory) => cat.slug === params.slug
          );
          if (currentCategory) {
            setCategory(currentCategory);
            const categoryId = currentCategory._id.toString();
            const categoryPackages = allPackages.filter(
              (pkg: Package) =>
                pkg.categoryId === categoryId ||
                pkg.categoryId.toString() === categoryId
            );
            setPackages(categoryPackages);
            setFilteredPackages(categoryPackages);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchData();
    }
  }, [params.slug]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = packages.filter(
        (pkg) =>
          pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pkg.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pkg.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPackages(filtered);
    } else {
      setFilteredPackages(packages);
    }
  }, [packages, searchTerm]);

  // Loading and Not Found states are kept simple for clarity
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-300 rounded-lg mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-96 rounded-3xl bg-white/30 backdrop-blur-md border border-white/20 shadow-lg"
                />
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Category not found
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 md:py-24 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={category.image || "/images/packages-hero.jpg"}
            alt={category.name}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/70 via-slate-900/40 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6">
          <Link
            href="/packages"
            className="inline-flex items-center text-white/80 hover:text-white transition-colors duration-300 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to All Packages
          </Link>
          <motion.div
            variants={heroVariants}
            initial="hidden"
            animate="visible"
          >
            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
              Explore{" "}
              <span className="bg-gradient-to-r from-amber-300 via-pink-300 to-violet-300 bg-clip-text text-transparent">
                {category.name} Packages
              </span>
            </h1>
            <p className="mt-4 text-lg text-blue-100/90 max-w-2xl">
              {category.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search & Packages Count Section */}
      <section className="relative -mt-8 z-10">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
            className="bg-white/70 backdrop-blur-2xl rounded-2xl border border-white/60 shadow-xl p-5 md:p-6"
          >
            <div className="flex flex-col md:flex-row items-stretch gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
                <Input
                  placeholder={`Search in ${category.name}...`}
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
                  {filteredPackages.length} package
                  {filteredPackages.length !== 1 ? "s" : ""} found
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          {filteredPackages.length > 0 ? (
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
                  whileHover={{ y: -8 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden group transition-shadow duration-300 hover:shadow-2xl hover:shadow-slate-300/50"
                >
                  <Link href={`/packages/${pkg._id}`} className="block">
                    <div className="relative">
                      {/* Image Container */}
                      <div className="h-56 w-full overflow-hidden">
                        <Image
                          src={pkg.images[0] || "/placeholder.svg"}
                          alt={pkg.name}
                          fill
                          className="object-cover object-center transition-transform duration-500 ease-in-out group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      </div>

                      {/* Tags */}
                      <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                        {pkg.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-md ${
                              tag === "Featured"
                                ? "bg-amber-400 text-slate-900"
                                : tag === "Limited Offer"
                                ? "bg-rose-600 text-white"
                                : "bg-blue-600 text-white"
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Price Badge */}
                      <div className="absolute bottom-4 right-4 flex items-baseline gap-1 rounded-lg bg-white/90 px-3 py-1.5 text-slate-900 shadow-md backdrop-blur-sm">
                        <span className="text-xl font-bold tracking-tight">
                          AED {pkg.price}
                        </span>
                        <span className="text-xs font-medium text-slate-600">
                          /person
                        </span>
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-slate-800 truncate">
                        {pkg.name}
                      </h3>
                      <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                        <MapPin className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                        {pkg.destination}
                      </p>

                      {/* Divider & Footer */}
                      <div className="mt-4 flex items-center justify-between border-t border-slate-200/80 pt-4">
                        <span className="flex items-center gap-2 text-sm font-medium text-slate-600">
                          <Calendar className="h-4 w-4 text-amber-500" />
                          {pkg.duration}
                        </span>
                        <div className="inline-flex items-center text-blue-600 font-semibold text-sm transition-colors duration-300 group-hover:text-violet-600">
                          View Details
                          <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: EASE_OUT }}
              className="text-center py-24"
            >
              <div className="max-w-lg mx-auto bg-white/20 backdrop-blur-xl rounded-3xl p-12 shadow-xl border border-white/30">
                <div className="w-20 h-20 mx-auto bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-6 shadow-md">
                  <Search className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  No packages found
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm
                    ? "Try adjusting your search term"
                    : `No packages are available in the ${category.name} category right now. Please check back soon!`}
                </p>
                {searchTerm && (
                  <Button
                    onClick={() => setSearchTerm("")}
                    className="bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 text-gray-900 font-medium rounded-xl px-6 transition-all duration-300"
                  >
                    Clear Search
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
