import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Novekia — Synergies Intelligentes',
    short_name: 'Novekia',
    description:
      'Entreprise technologique française qui développe Lead Engine et NovekiAct, ainsi que des logiciels, systèmes d’IA locale et infrastructures.',
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
