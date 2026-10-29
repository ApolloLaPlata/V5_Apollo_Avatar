import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'V5 Apollo Avatar',
    short_name: 'Apollo Avatar',
    description: 'Estúdio de Personagens Digitais, Lip Sync e Apresentadores IA',
    start_url: '/',
    display: 'standalone',
    background_color: '#090e18',
    theme_color: '#a855f7',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
