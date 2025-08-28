import React from "react";
import AboutPage from "./_components/aboutPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - AFI Travel & Tourism | Premium Travel Services Since 2024",
  description:
    "Learn about AFI Travel & Tourism's journey, mission, and team. We've been creating unforgettable travel experiences with 99% satisfaction rate and 100+ happy customers.",
  keywords: [
    "about AFI travel",
    "travel agency team",
    "tourism company history",
    "travel experts",
    "Al Falah Group travel",
  ],
  openGraph: {
    title: "About AFI Travel & Tourism - Your Trusted Travel Partner",
    description:
      "Discover our story, mission, and the passionate team behind AFI Travel & Tourism's success in creating memorable journeys.",
    images: ["/images/about-logo.png"],
  },
};

const page = () => {
  return <AboutPage />;
};

export default page;
