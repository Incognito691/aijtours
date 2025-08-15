import type React from "react";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "AFI Travel and Tourism - Travel & Tours",
  description:
    "Discover amazing travel packages and destinations with AFI Travel and Tourism",
  keywords: [
    "travel",
    "holidays",
    "tours",
    "vacation packages",
    "destinations",
    "adventure travel",
  ],
  authors: [{ name: "AFI Travel and Tourism" }],
  creator: "AFI Travel and Tourism",
  publisher: "AFI Travel and Tourism",
  robots: "index, follow",
  openGraph: {
    title: "AFI Travel and Tourism - Travel & Tours",
    description:
      "Discover amazing travel packages and destinations with AFI Travel and Tourism",
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
        <body className={`${poppins.variable} font-sans`}>
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
