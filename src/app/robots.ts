import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://github-streak-stats.vercel.app';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/'], // Prevent crawlers from artificially invoking the API generators
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
