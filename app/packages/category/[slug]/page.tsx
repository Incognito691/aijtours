"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import type { Package, PackageCategory } from "@/lib/models"
import { Search, MapPin, Calendar, ArrowLeft } from "lucide-react"

export default function CategoryPackagesPage() {
  const params = useParams()
  const [category, setCategory] = useState<PackageCategory | null>(null)
  const [packages, setPackages] = useState<Package[]>([])
  const [filteredPackages, setFilteredPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, packagesRes] = await Promise.all([
          fetch("/api/package-categories"),
          fetch("/api/packages"),
        ])

        if (categoriesRes.ok && packagesRes.ok) {
          const categories = await categoriesRes.json()
          const allPackages = await packagesRes.json()

          const currentCategory = categories.find((cat: PackageCategory) => cat.slug === params.slug)
          if (currentCategory) {
            setCategory(currentCategory)
            const categoryPackages = allPackages.filter((pkg: Package) => pkg.categoryId === currentCategory._id)
            setPackages(categoryPackages)
            setFilteredPackages(categoryPackages)
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (params.slug) {
      fetchData()
    }
  }, [params.slug])

  useEffect(() => {
    if (searchTerm) {
      const filtered = packages.filter(
        (pkg) =>
          pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pkg.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pkg.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredPackages(filtered)
    } else {
      setFilteredPackages(packages)
    }
  }, [packages, searchTerm])

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-300 rounded-lg mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md">
                  <div className="h-48 bg-gray-300 rounded-t-lg"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-2/3 mb-4"></div>
                    <div className="h-10 bg-gray-300 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!category) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Category not found</h1>
          <Link href="/packages">
            <Button>Back to Packages</Button>
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-64 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="absolute inset-0">
          <Image
            src={category.image || "/placeholder.svg?height=300&width=800&query=travel category"}
            alt={category.name}
            fill
            className="object-cover opacity-30"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 py-16 text-white">
          <Link href="/packages" className="inline-flex items-center text-white hover:text-gray-200 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to All Packages
          </Link>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">{category.name}</h1>
            <p className="text-xl text-gray-100 max-w-2xl">{category.description}</p>
          </motion.div>
        </div>
      </section>

      {/* Search */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search packages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          {filteredPackages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPackages.map((pkg, index) => (
                <motion.div
                  key={pkg._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                    <div className="relative h-48">
                      <Image
                        src={pkg.images[0] || "/placeholder.svg?height=200&width=400&query=travel destination"}
                        alt={pkg.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                        {pkg.tags.map((tag) => (
                          <Badge
                            key={tag}
                            className={
                              tag === "Featured"
                                ? "bg-yellow-500 text-black"
                                : tag === "Limited Offer"
                                  ? "bg-red-500 text-white"
                                  : "bg-blue-500 text-white"
                            }
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="line-clamp-1">{pkg.name}</span>
                        <span className="text-blue-600 font-bold">${pkg.price}</span>
                      </CardTitle>
                      <CardDescription className="flex items-center space-x-4 text-sm">
                        <span className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {pkg.destination}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {pkg.duration}
                        </span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                      <p className="text-gray-600 mb-4 line-clamp-3 flex-1">{pkg.description}</p>
                      <Link href={`/packages/${pkg._id}`}>
                        <Button className="w-full">View Details</Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="mb-4">
                  <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                    <Search className="h-12 w-12 text-gray-400" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No packages found</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm
                    ? "Try adjusting your search term"
                    : `No packages available in ${category.name} right now. Check back later!`}
                </p>
                {searchTerm && (
                  <Button variant="outline" onClick={() => setSearchTerm("")}>
                    Clear Search
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
