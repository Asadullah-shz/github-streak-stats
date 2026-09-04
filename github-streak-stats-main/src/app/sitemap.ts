import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://github-streak-plum.vercel.app';

  return [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/themes`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/deploy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];
}
