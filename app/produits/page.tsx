import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, Globe2, Radar, SearchCheck, ShieldCheck } from 'lucide-react'
import { Breadcrumbs } from '@/components/brand/breadcrumbs'
import {
  JsonLd,
  leadEngineIdentityJsonLd,
  novekiActIdentityJsonLd,
} from '@/components/brand/json-ld'
import { TechnicalLabel } from '@/components/brand/technical-label'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { siteConfig } from '@/lib/site-config'

const pageUrl = `${siteConfig.url}/produits`

export const metadata: Metadata = {
  title: {
    absolute: 'Produits et offres Novekia — Lead Engine, Visibility, sites web et NovekiAct',
  },
  description:
    'Découvrez les produits et offres productisées Novekia : Lead Engine, Novekia Visibility, création de sites web SEO/GEO/AEO et NovekiAct.',
  alternates: { canonical: '/produits' },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: pageUrl,
    title: 'Produits et offres Novekia',
    description:
      'Lead Engine, Novekia Visibility, sites web SEO/GEO/AEO et NovekiAct, réunis sous la même entité technologique française.',
  },
}

const products = [
  {
    name: 'Lead Engine',
    relation: 'Un produit de Novekia',
    description:
      'Un produit consacré à la prospection B2B : détection d’entreprises, analyse de signaux publics, qualification documentée et préparation des approches sous supervision humaine.',
    href: '/lead-engine-studio',
    cta: 'Découvrir Lead Engine',
    status: 'Produit en développement et validation',
    icon: Radar,
  },
  {
    name: 'Novekia Visibility',
    relation: 'Moteur & prestation Novekia',
    description:
      'Un moteur d’audit et de remédiation Evidence-First pour le SEO, le GEO, l’AEO, l’Entity SEO et l’autorité numérique. Le pré-audit gratuit mesure ce qui est réellement observable avant toute recommandation commerciale.',
    href: '/audit',
    cta: 'Tester Visibility',
    status: 'Offre disponible',
    icon: SearchCheck,
  },
  {
    name: 'Sites Web + Visibility',
    relation: 'Offre productisée par Novekia',
    description:
      'Création de sites web pour entreprises sans site ou en refonte, avec quatre niveaux de référencement clairement tarifés : présence locale, SEO, SEO + GEO/AEO et Authority.',
    href: '/sites-web',
    cta: 'Voir les tarifs sites web',
    status: 'Offre disponible dès 990 € HT',
    icon: Globe2,
  },
  {
    name: 'NovekiAct',
    relation: 'NovekiAct by Novekia',
    description:
      'Un produit destiné à aider les PME à structurer la gouvernance de leurs usages d’intelligence artificielle, avec des responsabilités, des risques, des actions et des preuves explicites.',
    href: '/novekiact',
    cta: 'Découvrir NovekiAct',
    status: 'Produit en développement',
    icon: ShieldCheck,
  },
] as const

export default function ProductsPage() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          '@id': `${pageUrl}#webpage`,
          url: pageUrl,
          name: 'Produits et offres Novekia',
          description: metadata.description,
          inLanguage: 'fr-FR',
          isPartOf: { '@id': `${siteConfig.url}/#website` },
          about: { '@id': `${siteConfig.url}/#organization` },
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                item: leadEngineIdentityJsonLd,
              },
              {
                '@type': 'ListItem',
                position: 2,
                item: {
                  '@type': 'Service',
                  '@id': `${siteConfig.url}/audit#visibility`,
                  name: 'Novekia Visibility',
                  url: `${siteConfig.url}/audit`,
                  provider: { '@id': `${siteConfig.url}/#organization` },
                  serviceType: 'Audit et remédiation SEO, GEO, AEO, Entity SEO et autorité numérique',
                },
              },
              {
                '@type': 'ListItem',
                position: 3,
                item: {
                  '@type': 'Service',
                  '@id': `${siteConfig.url}/sites-web#service`,
                  name: 'Sites Web + Visibility',
                  url: `${siteConfig.url}/sites-web`,
                  provider: { '@id': `${siteConfig.url}/#organization` },
                  serviceType: 'Création de sites web avec SEO, GEO, AEO et Entity SEO',
                },
              },
              {
                '@type': 'ListItem',
                position: 4,
                item: novekiActIdentityJsonLd,
              },
            ],
          },
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
              item: pageUrl,
            },
          ],
        }}
      />
      <SiteHeader />
      <main id="contenu">
        <section className="relative overflow-hidden border-b border-border px-5 py-16 sm:px-6 sm:py-24 md:px-8 lg:py-28">
          <div aria-hidden="true" className="technical-grid-pattern absolute inset-0 opacity-25" />
          <div aria-hidden="true" className="novekia-glow -left-48 top-0" />
          <div className="relative mx-auto max-w-7xl">
            <Breadcrumbs items={[{ label: 'Accueil', href: '/' }, { label: 'Produits' }]} />
            <TechnicalLabel index="01" className="mt-12">
              Produits et offres productisées Novekia
            </TechnicalLabel>
            <h1 className="mt-6 max-w-5xl text-balance text-5xl font-semibold leading-[0.95] tracking-[-0.055em] sm:text-7xl">
              Des moteurs propriétaires.
              <br />
              <span className="text-primary">Des offres directement exploitables.</span>
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-muted-foreground">
              Novekia développe ses propres moteurs et transforme certains d’entre eux en
              prestations immédiatement commercialisables. Lead Engine, Visibility, Sites Web +
              Visibility et NovekiAct restent reliés à une même entité, une même méthode et un
              même socle technologique.
            </p>
          </div>
        </section>

        <section className="px-5 py-16 sm:px-6 md:px-8 md:py-24">
          <div className="mx-auto grid max-w-7xl gap-px bg-border lg:grid-cols-2">
            {products.map((product) => {
              const Icon = product.icon
              return (
                <article
                  key={product.name}
                  className="group flex min-h-[34rem] flex-col bg-background p-7 sm:p-10"
                >
                  <div className="flex items-start justify-between gap-6">
                    <Icon aria-hidden="true" className="size-8 text-primary" strokeWidth={1.4} />
                    <span className="max-w-[15rem] text-right font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
                      {product.status}
                    </span>
                  </div>
                  <p className="mt-10 font-mono text-xs uppercase tracking-[0.18em] text-primary">
                    {product.relation}
                  </p>
                  <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
                    {product.name}
                  </h2>
                  <p className="mt-6 max-w-xl text-base leading-8 text-muted-foreground">
                    {product.description}
                  </p>
                  <Link
                    href={product.href}
                    className="mt-auto inline-flex w-fit items-center gap-2 border-b border-primary pt-10 pb-1 font-mono text-xs uppercase tracking-[0.14em] text-primary transition-colors hover:text-foreground"
                  >
                    {product.cta}
                    <ArrowUpRight aria-hidden="true" className="size-4" />
                  </Link>
                </article>
              )
            })}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
