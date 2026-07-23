import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Novekia — Synergies Intelligentes',
    short_name: 'Novekia',
    description:
      'Studio français d’ingénierie logicielle, d’intelligence artificielle locale et d’infrastructures de calcul.',
    start_url: '/',
    display: 'standalone',
    background_color: '#020817',
    theme_color: '#020817',
    lang: 'fr',
    icons: [
      {
        src: '/novekia-icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  }
}
