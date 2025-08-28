import { Metadata } from "next";
import React from "react";
import DestinationsPage from "./_components/destinationsPage";

export const metadata: Metadata = {
  title: "Travel Destinations - AFI Travel & Tourism | Explore Amazing Places",
  description:
    "Discover incredible travel destinations around the world with AFI Travel & Tourism. From Bosnia's hidden gems to Dubai's luxury experiences - find your perfect getaway.",
  keywords: [
    "travel destinations",
    "Bosnia travel",
    "Dubai tourism",
    "international destinations",
    "vacation spots",
    "tourist attractions",
    "AFI travel destinations",
    "holiday destinations",
    "world travel",
    "exotic destinations",
  ],
  openGraph: {
    title: "Amazing Travel Destinations - AFI Travel & Tourism",
    description:
      "Explore breathtaking destinations worldwide with our expert travel guides and curated experiences.",
    images: ["/images/destination-hero.jpg"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Travel Destinations - AFI Travel & Tourism",
    description:
      "Discover incredible destinations around the world with expert travel planning.",
    images: ["/images/destination-hero.jpg"],
  },
};

const page = () => {
  return <DestinationsPage />;
};

export default page;
