import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/auth/',
          '/_next/',
          '/.well-known/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/api/packages',
          '/api/events',
          '/api/contact',
        ],
        disallow: [
          '/admin/',
          '/api/auth/',
          '/_next/',
        ],
      }
    ],
    sitemap: 'https://www.afitravelandtourism.com/sitemap.xml',
  }
}
