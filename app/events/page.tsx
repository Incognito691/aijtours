import { Metadata } from "next";
import EventsPage from "./_components/EventsPage";

export const metadata: Metadata = {
  title: "UAE Activities & Events - AFI Travel & Tourism | Dubai Experiences",
  description:
    "Discover exciting UAE activities and events in Dubai. From desert safaris to city tours, water sports to cultural experiences - book your perfect Dubai adventure with AFI Travel & Tourism.",
  keywords: [
    "UAE activities",
    "Dubai events",
    "Dubai tours",
    "desert safari Dubai",
    "Dubai attractions",
    "UAE experiences",
    "Dubai activities",
    "things to do Dubai",
    "Dubai adventures",
    "UAE tourism",
    "Dubai excursions",
  ],
  openGraph: {
    title: "UAE Activities & Events - Discover Dubai with AFI Travel & Tourism",
    description:
      "Experience the best of Dubai and UAE with our curated activities and events. From adventure to culture, we have it all.",
    images: ["/images/events-dubai.jpg"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "UAE Activities & Events - AFI Travel & Tourism",
    description:
      "Discover exciting UAE activities and Dubai events with expert local guides.",
    images: ["/images/events-dubai.jpg"],
  },
};

export default function Events() {
  return <EventsPage />;
}
