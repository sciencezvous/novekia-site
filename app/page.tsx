import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { HomeHero } from '@/components/home/home-hero'
import { PositionnementSection } from '@/components/home/positionnement-section'
import { ExpertisesSection } from '@/components/home/expertises-section'
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

        {/* Méthode */}
        <SectionPlaceholder
          id="methode"
          index="03"
          eyebrow="Méthode"
          tone="light"
          title="Une démarche d'ingénierie rigoureuse."
          description="De l'audit à la mise en production, une méthode structurée et mesurable."
        />

        {/* Souveraineté */}
        <SectionPlaceholder
          id="souverainete"
          index="04"
          eyebrow="Souveraineté"
          tone="dark"
          title="Intelligence souveraine, sur votre infrastructure."
          description="Des modèles et des données maîtrisés localement, sans dépendance externe."
        />

        {/* Technologies */}
        <SectionPlaceholder
          id="technologies"
          index="05"
          eyebrow="Technologies"
          tone="light"
          title="Une pile technologique éprouvée."
          description="Architectures modulaires, calcul haute performance et sécurité par conception."
        />

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
