"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import type { Package } from "@/lib/models"
import { Search, MapPin, Calendar, Filter } from "lucide-react"

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([])
  const [filteredPackages, setFilteredPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTag, setSelectedTag] = useState("all")
  const [selectedDestination, setSelectedDestination] = useState("all")

  const searchParams = useSearchParams()
  const destinationParam = searchParams.get("destination")

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch("/api/packages")
        if (response.ok) {
          const data = await response.json()
          setPackages(data)
          setFilteredPackages(data)

          // Set destination filter if coming from destinations page
          if (destinationParam) {
            setSelectedDestination(destinationParam)
          }
        }
      } catch (error) {
        console.error("Error fetching packages:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPackages()
  }, [destinationParam])

  useEffect(() => {
    let filtered = packages

    if (searchTerm) {
      filtered = filtered.filter(
        (pkg) =>
          pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pkg.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pkg.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedTag !== "all") {
      filtered = filtered.filter((pkg) => pkg.tags.includes(selectedTag))
    }

    if (selectedDestination !== "all") {
      filtered = filtered.filter((pkg) => pkg.destination === selectedDestination)
    }

    setFilteredPackages(filtered)
  }, [packages, searchTerm, selectedTag, selectedDestination])

  const tags = ["all", ...Array.from(new Set(packages.flatMap((pkg) => pkg.tags)))]
  const destinations = ["all", ...Array.from(new Set(packages.map((pkg) => pkg.destination)))]

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="hero-gradient text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">Travel Packages</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Discover our carefully curated travel packages designed to create unforgettable memories
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search packages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-4">
              <Select value={selectedTag} onValueChange={setSelectedTag}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tags</SelectItem>
                  {tags
                    .filter((tag) => tag !== "all")
                    .map((tag) => (
                      <SelectItem key={tag} value={tag}>
                        {tag}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              <Select value={selectedDestination} onValueChange={setSelectedDestination}>
                <SelectTrigger className="w-48">
                  <MapPin className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by destination" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Destinations</SelectItem>
                  {destinations
                    .filter((dest) => dest !== "all")
                    .map((destination) => (
                      <SelectItem key={destination} value={destination}>
                        {destination}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md animate-pulse">
                  <div className="h-48 bg-gray-300 rounded-t-lg"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-2/3 mb-4"></div>
                    <div className="h-10 bg-gray-300 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredPackages.length > 0 ? (
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
                  {searchTerm || selectedTag !== "all" || selectedDestination !== "all"
                    ? "Try adjusting your search or filters"
                    : "No packages available right now. Check back later!"}
                </p>
                {(searchTerm || selectedTag !== "all" || selectedDestination !== "all") && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("")
                      setSelectedTag("all")
                      setSelectedDestination("all")
                    }}
                  >
                    Clear Filters
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
