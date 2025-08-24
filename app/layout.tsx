import type React from "react";
import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/next";

const poppins = Lexend({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "AFI Travel & Tourism – Frame your space",
  description:
    "Discover amazing travel packages and destinations with AFI Travel & Tourism.",
  authors: [{ name: "AFI Travel & Tourism" }],
  creator: "AFI Travel & Tourism",
  publisher: "AFI Travel & Tourism",
  robots: "index, follow",
  openGraph: {
    title: "AFI Travel & Tourism – Frame your space",
    description:
      "Discover amazing travel packages and destinations with AFI Travel & Tourism.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${poppins.className}`}>
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
