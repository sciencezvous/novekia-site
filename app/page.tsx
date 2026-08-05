import type { Metadata } from 'next'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { InstitutionalHero } from '@/components/home/institutional-hero'
import { BusinessPillarsSection } from '@/components/home/business-pillars-section'
import { ConversionFunnelSection } from '@/components/home/conversion-funnel-section'
import { ProofSection } from '@/components/home/proof-section'
import { MethodeSection } from '@/components/home/methode-section'
import { TestimonialsSection } from '@/components/home/testimonials-section'
import { TrustSection } from '@/components/home/trust-section'
import { ContactSection } from '@/components/home/contact-section'
import { FaqSection, homeFaq } from '@/components/home/faq-section'
import {
  JsonLd,
  founderJsonLd,
  homePageJsonLd,
  organizationJsonLd,
  websiteJsonLd,
} from '@/components/brand/json-ld'
import { HashNavigation } from '@/components/layout/hash-navigation'
import { siteConfig } from '@/lib/site-config'

export const metadata: Metadata = {
  title: {
    absolute: 'Novekia — Lead Engine Studio et solutions technologiques',
  },
  description: siteConfig.description,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: siteConfig.url,
    title: 'Novekia — Lead Engine Studio et solutions technologiques',
    description: siteConfig.description,
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Novekia — studio commercial et technologique',
      },
    ],
  },
}

export default function HomePage() {
  return (
    <>
      <JsonLd data={organizationJsonLd} />
      <JsonLd data={founderJsonLd} />
      <JsonLd data={websiteJsonLd} />
      <JsonLd data={homePageJsonLd} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: homeFaq.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.answer,
            },
          })),
        }}
      />
      <HashNavigation />
      <SiteHeader />
      <main id="contenu">
        <InstitutionalHero />
        <BusinessPillarsSection />
        <ConversionFunnelSection />
        <ProofSection />
        <MethodeSection />
        <TestimonialsSection />
        <TrustSection />
        <FaqSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </>
  )
}
