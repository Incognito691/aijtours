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
  title: {
    default: "AFI Travel & Tourism – Premium Travel Packages & Destinations",
    template: "%s | AFI Travel & Tourism",
  },
  description:
    "Discover amazing travel packages and destinations with AFI Travel & Tourism. Book your dream vacation with our expert travel planning services and exclusive deals.",
  keywords: [
    "AFI Travel",
    "AFI Tourism",
    "travel packages",
    "vacation planning",
    "travel agency",
    "tourism services",
    "holiday packages",
    "travel deals",
    "destination planning",
  ],
  authors: [
    {
      name: "AFI Travel & Tourism",
      url: "https://www.afitravelandtourism.com",
    },
  ],
  creator: "AFI Travel & Tourism",
  publisher: "AFI Travel & Tourism",
  icons: {
    icon: [
      { url: "/images/logo.jpg", sizes: "32x32", type: "image/jpeg" },
      { url: "/images/logo.jpg", sizes: "16x16", type: "image/jpeg" },
    ],
    apple: [{ url: "/images/logo.jpg", sizes: "180x180", type: "image/jpeg" }],
    shortcut: "/images/logo.jpg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.afitravelandtourism.com",
    siteName: "AFI Travel & Tourism",
    title: "AFI Travel & Tourism – Premium Travel Packages & Destinations",
    description:
      "Discover amazing travel packages and destinations with AFI Travel & Tourism. Book your dream vacation with our expert travel planning services.",
    images: [
      {
        url: "/images/logo.jpg",
        width: 1200,
        height: 630,
        alt: "AFI Travel & Tourism Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AFI Travel & Tourism – Premium Travel Packages & Destinations",
    description:
      "Discover amazing travel packages and destinations with AFI Travel & Tourism.",
    images: ["/images/logo.jpg"],
  },

  alternates: {
    canonical: "https://www.afitravelandtourism.com",
  },
  category: "travel",
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
