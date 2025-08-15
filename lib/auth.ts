import { auth, currentUser } from "@clerk/nextjs/server"

export async function isAdmin() {
  const { userId } = await auth()
  if (!userId) return false

  const user = await currentUser()
  if (!user) return false

  // Check if user email matches admin email from env
  const email = user.emailAddresses[0]?.emailAddress
  return email === process.env.ADMIN_EMAIL
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
