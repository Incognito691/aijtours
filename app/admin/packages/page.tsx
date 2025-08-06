"use client"

import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import type { Package } from "@/lib/models"
import { Plus, Edit, Trash2, ArrowLeft, MapPin, Calendar } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function AdminPackagesPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const { toast } = useToast()
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isLoaded && (!user || user.emailAddresses[0]?.emailAddress !== "sahilniraula00@gmail.com")) {
      router.push("/")
    }
  }, [user, isLoaded, router])

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch("/api/packages")
        if (response.ok) {
          const data = await response.json()
          setPackages(data)
        }
      } catch (error) {
        console.error("Error fetching packages:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user?.emailAddresses[0]?.emailAddress === "sahilniraula00@gmail.com") {
      fetchPackages()
    }
  }, [user])

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/packages/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setPackages(packages.filter((pkg) => pkg._id !== id))
        toast({
          title: "Package deleted",
          description: "The package has been successfully deleted.",
        })
      } else {
        throw new Error("Failed to delete package")
      }
    } catch (error) {
      console.error("Error deleting package:", error)
      toast({
        title: "Error",
        description: "Failed to delete package. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user || user.emailAddresses[0]?.emailAddress !== "sahilniraula00@gmail.com") {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Packages</h1>
            <p className="text-gray-600">Manage your travel packages</p>
          </div>
          <Link href="/admin/packages/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Package
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        ) : packages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
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
                  <CardContent>
                    <p className="text-gray-600 mb-4 line-clamp-2">{pkg.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{pkg.categoryName}</Badge>
                      <div className="flex space-x-2">
                        <Link href={`/admin/packages/${pkg._id}/edit`}>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700 bg-transparent"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Package</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{pkg.name}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(pkg._id!)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
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
                  <Plus className="h-12 w-12 text-gray-400" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No packages yet</h3>
              <p className="text-gray-500 mb-4">Create your first package to get started.</p>
              <Link href="/admin/packages/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Package
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
