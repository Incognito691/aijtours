// middleware.ts
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    // Protect API routes
    "/api/(.*)",

    // Protect all app routes except static files
    "/((?!_next|.*\\..*).*)",
  ],
};
