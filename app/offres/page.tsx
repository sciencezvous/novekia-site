import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { JsonLd } from '@/components/brand/json-ld'
import { TechnicalLabel } from '@/components/brand/technical-label'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { offerList } from '@/lib/offers'
import { siteConfig } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Offres d’ingénierie',
  description:
    'Audits, ateliers d’architecture et déploiements privés proposés par Novekia pour vos réseaux, infrastructures et projets d’intelligence artificielle.',
  alternates: { canonical: '/offres' },
}

export default function OffersPage() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Offres d’ingénierie Novekia',
          url: `${siteConfig.url}/offres`,
          inLanguage: 'fr-FR',
          isPartOf: { '@id': `${siteConfig.url}/#website` },
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: offerList.map((offer, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              url: `${siteConfig.url}/offres/${offer.slug}`,
              name: offer.title,
            })),
          },
        }}
      />
      <SiteHeader />
      <main id="contenu">
        <section className="relative overflow-hidden border-b border-border px-5 py-20 sm:px-6 sm:py-28 md:px-8">
          <div aria-hidden="true" className="technical-grid-pattern absolute inset-0 opacity-25" />
          <div aria-hidden="true" className="novekia-glow -left-40 top-0" />
          <div className="relative mx-auto max-w-7xl">
            <TechnicalLabel index="00">Offres d&apos;ingénierie</TechnicalLabel>
            <h1 className="mt-6 max-w-5xl text-balance text-5xl font-semibold leading-[0.95] tracking-[-0.055em] sm:text-7xl lg:text-8xl">
              Décider juste.
              <br />
              <span className="text-primary">Construire solide.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Des missions cadrées avec un objectif, une durée, des livrables et des
              limites explicites avant le démarrage.
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-px bg-border px-5 py-16 sm:px-6 md:grid-cols-2 md:px-8 md:py-24">
          {offerList.map((offer, index) => (
            <Link
              key={offer.slug}
              href={`/offres/${offer.slug}`}
              className="scan-sweep group flex min-h-80 flex-col bg-card p-6 outline-none transition-colors hover:bg-accent/50 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring sm:p-8"
            >
              <div className="flex items-start justify-between gap-5">
                <span className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
                  {String(index + 1).padStart(2, '0')} / {offer.eyebrow}
                </span>
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-5 text-muted-foreground transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary"
                />
              </div>
              <h2 className="mt-8 text-3xl font-semibold tracking-tight">{offer.title}</h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">{offer.summary}</p>
              <p className="mt-auto pt-8 font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
                Durée indicative · {offer.duration}
              </p>
            </Link>
          ))}
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
