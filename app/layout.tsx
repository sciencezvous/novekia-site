import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { AttributionTracker } from '@/components/analytics/attribution-tracker'
import { ConciergeRoot } from '@/components/concierge/concierge-root'
import { siteConfig } from '@/lib/site-config'
import { ScrollReveal } from '@/components/effects/scroll-reveal'
import './globals.css'

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  alternates: {
    canonical: '/',
  },
  keywords: [
    'prospection B2B',
    'qualification commerciale',
    'développement commercial',
    'studio commercial et technologique',
    'ingénierie logicielle',
    'intelligence artificielle locale',
    'IA souveraine',
    'infrastructures de calcul',
    'serveurs IA',
    'stations de calcul',
    'R&D technologique',
    'logiciels métiers',
    'Novekia',
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  category: 'technology',
  applicationName: siteConfig.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: siteConfig.url,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Novekia — Lead Engine Studio et solutions technologiques',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: ['/og.png'],
  },
  icons: {
    icon: [{ url: '/novekia-icon.svg', type: 'image/svg+xml' }],
  },
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#020817',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="fr"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        <AttributionTracker />
        <ScrollReveal />
        {children}
        {process.env.NEXT_PUBLIC_CONCIERGE_ENABLED !== 'false' ? (
          <ConciergeRoot />
        ) : null}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
