import Script from "next/script";

export default function StructuredData() {
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: "AFI Travel & Tourism",
    description:
      "Premium travel agency offering customized vacation packages, tour planning, and destination management services worldwide.",
    url: "https://www.afitravelandtourism.com",
    logo: "https://www.afitravelandtourism.com/images/logo.jpg",
    image: "https://www.afitravelandtourism.com/images/hero-bg.png",
    telephone: "+971 564995248",
    email: "sales@afitravelandtourism.com",
    address: {
      "@type": "PostalAddress",
      addressCountry: "AE",
      addressRegion: "Dubai",
      streetAddress:
        "C101, 1st Floor - Al Bateen Tower (Abu Dhabi Islamic Bank)",
    },
    sameAs: [
      "https://www.facebook.com/afiholidays",
      "https://www.instagram.com/afitravelandtourism/",
      "https://www.tiktok.com/@afiholidays",
      "https://www.threads.com/@afitravelandtourism",
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "100",
    },
    priceRange: "$$",
    paymentAccepted: "Cash, Credit Card, Debit Card",
    currenciesAccepted: "AED, USD, EUR",
    openingHours: "Mo-Su 09:00-18:00",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Travel Packages",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "TouristTrip",
            name: "Bosnia Adventure Package",
            description: "Complete Bosnia travel experience with guided tours",
          },
        },
      ],
    },
  };

  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AFI Travel & Tourism",
    url: "https://www.afitravelandtourism.com",
    description:
      "Discover amazing travel packages and destinations with AFI Travel & Tourism",
    potentialAction: {
      "@type": "SearchAction",
      target:
        "https://www.afitravelandtourism.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationData),
        }}
      />
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteData),
        }}
      />
    </>
  );
}
