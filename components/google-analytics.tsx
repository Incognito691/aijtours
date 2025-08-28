import Script from "next/script";

export default function GoogleAnalytics({ gaId }: { gaId: string }) {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          
          // Configure Google Analytics for travel business
          gtag('config', '${gaId}', {
            page_title: 'AFI Travel & Tourism',
            page_location: window.location.href,
            content_group1: 'Travel Agency',
            custom_map: {
              'custom_parameter_1': 'travel_package_type',
              'custom_parameter_2': 'destination_country'
            }
          });

          // Track travel-specific events
          gtag('event', 'page_view', {
            page_title: document.title,
            page_location: window.location.href,
            business_type: 'travel_agency',
            service_area: 'UAE_Dubai'
          });

          // Enhanced e-commerce tracking for travel bookings
          gtag('config', '${gaId}', {
            send_page_view: true,
            enhanced_ecommerce: true,
            travel_partner_id: 'AFI_Travel_Tourism'
          });
        `}
      </Script>
    </>
  );
}
