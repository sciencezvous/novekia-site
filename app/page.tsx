import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { HomeHero } from '@/components/home/home-hero'
import { PositionnementSection } from '@/components/home/positionnement-section'
import { ExpertisesSection } from '@/components/home/expertises-section'
import { MethodeSection } from '@/components/home/methode-section'
import { SouveraineteSection } from '@/components/home/souverainete-section'
import { TechnologiesSection } from '@/components/home/technologies-section'
import { SectionPlaceholder } from '@/components/home/section-placeholder'
import { JsonLd, organizationJsonLd } from '@/components/brand/json-ld'

export default function HomePage() {
  return (
    <>
      <JsonLd data={organizationJsonLd} />
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

        {/* R&D */}
        <SectionPlaceholder
          id="rd"
          index="06"
          eyebrow="Recherche & Développement"
          tone="muted"
          title="De la recherche appliquée aux produits."
          description="Un effort continu de R&D pour repousser les limites techniques."
        />

        {/* Contact */}
        <SectionPlaceholder
          id="contact"
          index="07"
          eyebrow="Contact"
          tone="dark"
          title="Discutons de votre problématique technique."
          description="Décrivez votre contexte : nous revenons vers vous avec une première lecture d'ingénierie."
        />
      </main>
      <SiteFooter />
    </>
  )
}
