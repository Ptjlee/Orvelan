import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/portal', '/admin', '/login', '/register'], // Don't let search engine index the private dashboard, admin spaces or auth pages
    },
    sitemap: 'https://www.orvelan.fr/sitemap.xml',
  };
}
