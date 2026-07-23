import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { HomeHero } from '@/components/home/home-hero'
import { PositionnementSection } from '@/components/home/positionnement-section'
import { FounderVisionSection } from '@/components/home/founder-vision-section'
import { ExpertisesSection } from '@/components/home/expertises-section'
import { OffersSection } from '@/components/home/offers-section'
import { MethodeSection } from '@/components/home/methode-section'
import { SouveraineteSection } from '@/components/home/souverainete-section'
import { TechnologiesSection } from '@/components/home/technologies-section'
import { ResearchSection } from '@/components/home/research-section'
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
        {/* 00 — Hero */}
        <HomeHero />

        {/* 01 — Positionnement */}
        <PositionnementSection />

        {/* 02 — Vision du fondateur */}
        <FounderVisionSection />

        {/* 03 — Expertises */}
        <ExpertisesSection />

        {/* 04 — Offres */}
        <OffersSection />

        {/* 05 — Méthode */}
        <MethodeSection />

        {/* 06 — Souveraineté */}
        <SouveraineteSection />

        {/* 07 — Technologies */}
        <TechnologiesSection />

        {/* 08 — Recherche & Développement */}
        <ResearchSection />

        {/* 09 — Questions fréquentes */}
        <FaqSection />

        {/* 10 — Contact */}
        <ContactSection />
      </main>
      <SiteFooter />
    </>
  )
}
