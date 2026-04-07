import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/portal', '/admin'], // Don't let search engine index the private dashboard or admin spaces
    },
    sitemap: 'https://www.orvelan.fr/sitemap.xml',
  };
}
