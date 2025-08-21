import type { ObjectId } from "mongodb"

export interface PackageCategory {
  _id?: ObjectId
  name: string
  description: string
  slug: string
  image: string
  createdAt: Date
  updatedAt: Date
}

export interface Package {
  _id?: ObjectId
  name: string
  price: number
  description: string
  dailyItinerary: string[]
  included: string[]
  excluded: string[]
  tags: string[]
  images: string[]
  destination: string
  duration: string
  categoryId: string
  categoryName: string
  featured?: boolean
  limitedOffer?: boolean
  rating?: number
  createdAt: Date
  updatedAt: Date
}

export interface Event {
  _id?: ObjectId
  name: string
  description: string
  date: Date
  location: string
  price: number
  tags: string[]
  images: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Booking {
  _id?: ObjectId
  userId: string
  userEmail: string
  userName: string
  packageId?: string
  eventId?: string
  type: "package" | "event"
  bookingDetails: {
    travelers: number
    travelDate: Date
    specialRequests?: string
    contactNumber: string
  }
  totalAmount: number
  status: "pending" | "confirmed" | "cancelled"
  createdAt: Date
}

export interface ContactMessage {
  _id?: ObjectId
  name: string
  email: string
  subject: string
  message: string
  createdAt: Date
  status: "unread" | "read"
}
