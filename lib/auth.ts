import { auth } from "@clerk/nextjs/server"

export async function isAdmin() {
  const { userId } = await auth()
  if (!userId) return false

  // Check if user email matches admin email
  return process.env.ADMIN_EMAIL === "sahilniraula00@gmail.com"
}

export async function requireAuth() {
  const { userId } = await auth()
  if (!userId) {
    throw new Error("Authentication required")
  }
  return userId
}

export async function requireAdmin() {
  const isAdminUser = await isAdmin()
  if (!isAdminUser) {
    throw new Error("Admin access required")
  }
}
