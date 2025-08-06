"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Package } from "@/lib/models"
import { Search, MapPin, Package2 } from "lucide-react"

export default function DestinationsPage() {
  const [packages, setPackages] = useState<Package[]>([])
  const [destinations, setDestinations] = useState<string[]>([])
  const [filteredDestinations, setFilteredDestinations] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch("/api/packages")
        if (response.ok) {
          const data = await response.json()
          setPackages(data)

          // Extract unique destinations
          const uniqueDestinations = Array.from(new Set(data.map((pkg: Package) => pkg.destination)))
          setDestinations(uniqueDestinations)
          setFilteredDestinations(uniqueDestinations)
        }
      } catch (error) {
        console.error("Error fetching packages:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPackages()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = destinations.filter((destination) =>
        destination.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredDestinations(filtered)
    } else {
      setFilteredDestinations(destinations)
    }
  }, [searchTerm, destinations])

  const getDestinationPackages = (destination: string) => {
    return packages.filter((pkg) => pkg.destination === destination)
  }

  const getDestinationImage = (destination: string) => {
    const destinationPackages = getDestinationPackages(destination)
    return destinationPackages[0]?.images[0] || `/placeholder.svg?height=300&width=400&query=${destination} destination`
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="hero-gradient text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">Destinations</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Explore amazing destinations around the world with our carefully curated travel packages
            </p>
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
                placeholder="Search destinations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Destinations Grid */}
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
          ) : filteredDestinations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDestinations.map((destination, index) => {
                const destinationPackages = getDestinationPackages(destination)
                return (
                  <motion.div
                    key={destination}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                      <div className="relative h-48">
                        <Image
                          src={getDestinationImage(destination) || "/placeholder.svg"}
                          alt={destination}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span className="flex items-center">
                            <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                            {destination}
                          </span>
                        </CardTitle>
                        <CardDescription className="flex items-center">
                          <Package2 className="h-4 w-4 mr-1" />
                          {destinationPackages.length} package{destinationPackages.length !== 1 ? "s" : ""} available
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 mb-4">
                          Discover {destination} with our carefully curated travel packages. From cultural experiences
                          to adventure tours, find your perfect getaway.
                        </p>
                        <Link href={`/packages?destination=${encodeURIComponent(destination)}`}>
                          <Button className="w-full">View Packages</Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="mb-4">
                  <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                    <Search className="h-12 w-12 text-gray-400" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No destinations found</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm
                    ? "Try adjusting your search term"
                    : "No destinations available right now. Check back later!"}
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
