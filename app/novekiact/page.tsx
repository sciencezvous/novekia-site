import type { Metadata } from 'next'
import { ClipboardList, FileCheck2, ShieldCheck } from 'lucide-react'
import { Breadcrumbs } from '@/components/brand/breadcrumbs'
import { JsonLd, novekiActIdentityJsonLd } from '@/components/brand/json-ld'
import { PrimaryButton } from '@/components/brand/primary-button'
import { SecondaryButton } from '@/components/brand/secondary-button'
import { SectionHeader } from '@/components/brand/section-header'
import { TechnicalLabel } from '@/components/brand/technical-label'
import { Section } from '@/components/layout/section'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { siteConfig } from '@/lib/site-config'

const pageUrl = `${siteConfig.url}/novekiact`

export const metadata: Metadata = {
  title: {
    absolute: 'NovekiAct — Gouvernance des usages IA pour les PME | Novekia',
  },
  description:
    'NovekiAct by Novekia est un produit en développement pour aider les PME à structurer et documenter la gouvernance de leurs usages d’intelligence artificielle.',
  alternates: { canonical: '/novekiact' },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: pageUrl,
    title: 'NovekiAct — Gouvernance des usages IA pour les PME | Novekia',
    description:
      'Un produit en développement par Novekia pour rendre la gouvernance IA plus claire, opérationnelle et documentée.',
  },
}

const principles = [
  {
    icon: ClipboardList,
    title: 'Rendre les usages visibles',
    description:
      'Recenser les usages d’IA, leurs objectifs, leurs responsables et les données concernées avant de décider des actions.',
  },
  {
    icon: ShieldCheck,
    title: 'Prioriser les risques réels',
    description:
      'Distinguer les situations à traiter rapidement, les informations manquantes et les décisions qui exigent une expertise humaine.',
  },
  {
    icon: FileCheck2,
    title: 'Conserver des preuves',
    description:
      'Documenter les règles, validations et actions afin de pouvoir expliquer la démarche suivie et ses limites.',
  },
] as const

export default function NovekiActPage() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          ...novekiActIdentityJsonLd,
        }}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          '@id': `${pageUrl}#webpage`,
          url: pageUrl,
          name: 'NovekiAct — Gouvernance des usages IA pour les PME',
          description: metadata.description,
          inLanguage: 'fr-FR',
          isPartOf: { '@id': `${siteConfig.url}/#website` },
          about: { '@id': `${pageUrl}#product` },
          mainEntity: { '@id': `${pageUrl}#product` },
        }}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Accueil',
              item: siteConfig.url,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Produits',
              item: `${siteConfig.url}/produits`,
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: 'NovekiAct',
              item: pageUrl,
            },
          ],
        }}
      />
      <SiteHeader />
      <main id="contenu">
        <section className="section-dark relative overflow-hidden border-b border-border px-5 py-16 text-foreground sm:px-6 sm:py-24 md:px-8 lg:py-28">
          <div aria-hidden="true" className="technical-grid-pattern absolute inset-0 opacity-25" />
          <div aria-hidden="true" className="novekia-glow -left-44 top-0" />
          <div className="relative mx-auto max-w-7xl">
            <Breadcrumbs
              items={[
                { label: 'Accueil', href: '/' },
                { label: 'Produits', href: '/produits' },
                { label: 'NovekiAct' },
              ]}
            />
            <div className="mt-12 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-20">
              <div>
                <TechnicalLabel index="Produit 02">NovekiAct by Novekia</TechnicalLabel>
                <h1 className="mt-6 max-w-5xl text-balance text-5xl font-semibold leading-[0.95] tracking-[-0.055em] sm:text-7xl">
                  Gouverner les usages IA.
                  <br />
                  <span className="text-primary">Garder des décisions explicables.</span>
                </h1>
              </div>
              <div>
                <p className="text-lg leading-8 text-muted-foreground">
                  NovekiAct est un produit en développement par Novekia pour
                  aider les PME à structurer et documenter la gouvernance de
                  leurs usages d’intelligence artificielle.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <PrimaryButton href="/#contact" withArrow>
                    Échanger sur NovekiAct
                  </PrimaryButton>
                  <SecondaryButton href="/produits">
                    Voir les produits Novekia
                  </SecondaryButton>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Section tone="light" containerSize="wide" aria-labelledby="objectif-title">
          <SectionHeader
            index="02"
            eyebrow="Objectif produit"
            title={<span id="objectif-title">Passer d’usages dispersés à une gouvernance documentée.</span>}
            description="Le produit vise à rendre les usages, responsabilités, risques, décisions et preuves plus lisibles. Le périmètre final dépendra des validations produit et réglementaires en cours."
          />
          <div className="mt-12 grid gap-px bg-border lg:grid-cols-3">
            {principles.map((principle) => {
              const Icon = principle.icon
              return (
                <article key={principle.title} className="min-h-72 bg-background p-7 sm:p-9">
                  <Icon aria-hidden="true" className="size-8 text-primary" strokeWidth={1.4} />
                  <h2 className="mt-7 text-2xl font-semibold tracking-tight">
                    {principle.title}
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground">
                    {principle.description}
                  </p>
                </article>
              )
            })}
          </div>
        </Section>

        <Section tone="muted" containerSize="wide" aria-labelledby="limites-title">
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
            <div>
              <TechnicalLabel index="03">Limites explicites</TechnicalLabel>
              <h2 id="limites-title" className="mt-5 text-balance text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
                Un outil de pilotage, pas une conformité automatique.
              </h2>
            </div>
            <div className="space-y-5 text-base leading-8 text-muted-foreground">
              <p>
                NovekiAct ne promet pas une conformité garantie, ne délivre pas
                de certification et ne remplace pas l’analyse d’un juriste, d’un
                DPO ou d’un autre expert lorsque le contexte l’exige.
              </p>
              <p>
                Les fonctionnalités, documents et niveaux d’accompagnement
                seront présentés uniquement lorsqu’ils auront été réellement
                validés. Cette page constitue la source officielle actuelle sur
                le produit et sera mise à jour avec son développement.
              </p>
            </div>
          </div>
        </Section>
      </main>
      <SiteFooter />
    </>
  )
}
