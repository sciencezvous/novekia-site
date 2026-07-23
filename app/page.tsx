import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { HomeHero } from '@/components/home/home-hero'
import { PositionnementSection } from '@/components/home/positionnement-section'
import { ExpertisesSection } from '@/components/home/expertises-section'
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

        {/* 02 — Expertises */}
        <ExpertisesSection />

        {/* 03 — Méthode */}
        <MethodeSection />

        {/* 04 — Souveraineté */}
        <SouveraineteSection />

        {/* 05 — Technologies */}
        <TechnologiesSection />

        {/* 06 — Recherche & Développement */}
        <ResearchSection />

        {/* 07 — Questions fréquentes */}
        <FaqSection />

        {/* 08 — Contact */}
        <ContactSection />
      </main>
      <SiteFooter />
    </>
  )
}
