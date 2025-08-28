import { Metadata } from "next";
import PackagesPage from "./_components/PackagesPage";

export const metadata: Metadata = {
  title: "UAE Travel Packages - AFI Travel & Tourism | Dubai Holiday Packages",
  description:
    "Explore our curated UAE travel packages and Dubai holiday packages. From luxury tours to budget adventures, desert safaris to city experiences - find your perfect UAE getaway.",
  keywords: [
    "UAE travel packages",
    "Dubai holiday packages",
    "UAE tour packages",
    "Dubai vacation packages",
    "UAE honeymoon packages",
    "Dubai family packages",
    "UAE adventure tours",
    "Dubai luxury packages",
    "UAE budget travel",
    "Dubai tour operators",
    "UAE tourism packages",
  ],
  openGraph: {
    title: "UAE Travel Packages - Discover Dubai & Emirates with AFI Travel",
    description:
      "Premium UAE travel packages for every traveler. Experience Dubai, Abu Dhabi, and more with our expertly crafted tours.",
    images: ["/images/packages-hero.jpeg"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "UAE Travel Packages - AFI Travel & Tourism",
    description:
      "Discover the best UAE travel packages and Dubai experiences with our expert local guides.",
    images: ["/images/packages-hero.jpeg"],
  },
};

export default function Packages() {
  return <PackagesPage />;
}
