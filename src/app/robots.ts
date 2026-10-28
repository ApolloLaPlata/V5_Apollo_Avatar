import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://avatar.v5apollo.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/live/overlay'],
        disallow: ['/api/', '/auth/callback'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
