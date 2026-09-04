import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, CheckCircle2 } from 'lucide-react'
import { Breadcrumbs } from '@/components/brand/breadcrumbs'
import { ExpertiseGrid } from '@/components/brand/expertise-grid'
import { JsonLd } from '@/components/brand/json-ld'
import { TechnicalLabel } from '@/components/brand/technical-label'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { expertises } from '@/lib/expertises'
import { siteConfig } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Expertises, solutions et tarifs',
  description:
    'Découvrez les expertises Novekia et les tarifs de lancement de Novekia Visibility : pré-audit gratuit, optimisation, SEO/GEO/AEO et autorité de marque.',
  alternates: { canonical: '/offres' },
}

const visibilityOffers = [
  {
    name: 'Diagnostic Visibility',
    price: 0,
    priceLabel: 'Gratuit',
    description: 'Pré-audit public automatisé, score mesuré, preuves et premières priorités.',
    features: [
      'Analyse d’un échantillon public',
      'Score et couverture séparés',
      'Constats reliés à des preuves',
      'Rapport PDF par email',
    ],
    href: '/audit',
    cta: 'Analyser mon site',
    recommended: false,
    startingAt: false,
  },
  {
    name: 'Pack Optimisation',
    price: 490,
    priceLabel: '490 € HT',
    description: 'Pour corriger les problèmes prioritaires démontrés par l’audit.',
    features: [
      'Validation humaine des priorités',
      'Corrections techniques essentielles',
      'SEO on-page prioritaire',
      'Données structurées essentielles',
      'Retest après intervention',
    ],
    href: '/audit-approfondi#tarifs',
    cta: 'Voir le périmètre',
    recommended: false,
    startingAt: false,
  },
  {
    name: 'Pack Visibility',
    price: 990,
    priceLabel: '990 € HT',
    description: 'Le niveau recommandé pour travailler SEO, GEO, AEO et compréhension de l’entité ensemble.',
    features: [
      'Audit approfondi Evidence-First',
      'SEO technique et on-page',
      'Entity SEO et données structurées',
      'Optimisation GEO / AEO',
      'Plan de remédiation et retest',
    ],
    href: '/audit-approfondi#tarifs',
    cta: 'Choisir Visibility',
    recommended: true,
    startingAt: false,
  },
  {
    name: 'Visibility Authority',
    price: 1490,
    priceLabel: '1 490 € HT',
    description: 'Pour ajouter l’autorité externe, les citations et la comparaison concurrentielle au périmètre.',
    features: [
      'Tout le périmètre Visibility',
      'Backlinks et domaines référents',
      'Mentions de marque et citation gaps',
      'Sources tierces et concurrence',
      'Plan d’autorité / Digital PR',
    ],
    href: '/audit-approfondi#tarifs',
    cta: 'Étudier Authority',
    recommended: false,
    startingAt: true,
  },
] as const

export default function OffersPage() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Expertises et solutions Novekia',
          description: metadata.description,
          url: `${siteConfig.url}/offres`,
          inLanguage: 'fr-FR',
          isPartOf: { '@id': `${siteConfig.url}/#website` },
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: expertises.map((expertise, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              url: `${siteConfig.url}${expertise.href}`,
              name: expertise.title,
              description: expertise.description,
            })),
          },
        }}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          '@id': `${siteConfig.url}/offres#visibility-service`,
          name: 'Novekia Visibility',
          provider: { '@id': `${siteConfig.url}/#organization` },
          areaServed: { '@type': 'Country', name: 'France' },
          serviceType: 'Audit et optimisation SEO, GEO, AEO, Entity SEO et autorité numérique',
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Tarifs Novekia Visibility',
            itemListElement: visibilityOffers.map((offer) => ({
              '@type': 'Offer',
              name: offer.name,
              price: offer.price,
              priceCurrency: 'EUR',
              url: `${siteConfig.url}${offer.href}`,
              description: offer.startingAt
                ? `${offer.description} Tarif à partir de ${offer.price} € HT selon périmètre.`
                : offer.description,
            })),
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
              name: 'Expertises et solutions',
              item: `${siteConfig.url}/offres`,
            },
          ],
        }}
      />
      <SiteHeader />
      <main id="contenu">
        <section className="relative overflow-hidden border-b border-border px-5 py-20 sm:px-6 sm:py-28 md:px-8">
          <div
            aria-hidden="true"
            className="technical-grid-pattern absolute inset-0 opacity-25"
          />
          <div aria-hidden="true" className="novekia-glow -left-40 top-0" />
          <div className="relative mx-auto max-w-7xl">
            <Breadcrumbs
              items={[
                { label: 'Accueil', href: '/' },
                { label: 'Expertises et solutions' },
              ]}
              className="mb-12"
            />
            <TechnicalLabel index="00">Expertises &amp; solutions</TechnicalLabel>
            <h1 className="mt-6 max-w-5xl text-balance text-5xl font-semibold leading-[0.95] tracking-[-0.055em] sm:text-7xl lg:text-8xl">
              Cinq domaines.
              <br />
              <span className="text-primary">Une même exigence.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Les offres Novekia correspondent directement aux domaines
              d&apos;expertise du studio. Les prestations standard de Novekia Visibility
              affichent désormais leur prix de lancement ; les périmètres sur mesure
              restent cadrés avant engagement.
            </p>
          </div>
        </section>

        <section
          className="mx-auto max-w-7xl px-5 py-16 sm:px-6 md:px-8 md:py-24"
          aria-label="Domaines d’expertise Novekia"
        >
          <h2 className="sr-only">Les cinq expertises du studio Novekia</h2>
          <ExpertiseGrid />
        </section>

        <section
          id="tarifs-visibility"
          className="border-t border-border bg-secondary/25 px-5 py-16 sm:px-6 sm:py-24 md:px-8"
          aria-labelledby="visibility-pricing-title"
        >
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end lg:gap-16">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary">
                  Novekia Visibility · tarifs de lancement
                </p>
                <h2
                  id="visibility-pricing-title"
                  className="mt-4 text-balance text-4xl font-semibold tracking-[-0.045em] sm:text-5xl"
                >
                  Des prix visibles avant de parler à un commercial.
                </h2>
              </div>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground lg:justify-self-end">
                Le pré-audit reste gratuit. Lorsqu’une intervention est utile, le niveau
                proposé doit correspondre aux constats réellement démontrés — jamais à un
                score artificiellement dégradé pour vendre davantage.
              </p>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {visibilityOffers.map((offer) => (
                <article
                  key={offer.name}
                  className={`relative flex h-full flex-col border p-6 sm:p-7 ${
                    offer.recommended
                      ? 'border-primary bg-primary/5 shadow-[0_0_0_1px_hsl(var(--primary)/0.12)]'
                      : 'border-border bg-background'
                  }`}
                >
                  {offer.recommended && (
                    <span className="mb-5 w-fit bg-primary px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-primary-foreground">
                      Recommandé
                    </span>
                  )}
                  <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
                    {offer.startingAt ? 'À partir de' : 'Tarif'}
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold">{offer.name}</h3>
                  <div className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-primary">
                    {offer.priceLabel}
                  </div>
                  <p className="mt-5 text-sm leading-6 text-muted-foreground">
                    {offer.description}
                  </p>
                  <ul className="mt-6 grid gap-3 text-sm leading-6">
                    {offer.features.map((feature) => (
                      <li key={feature} className="flex gap-2.5">
                        <CheckCircle2
                          aria-hidden="true"
                          className="mt-0.5 size-4 shrink-0 text-primary"
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={offer.href}
                    className={`mt-8 inline-flex min-h-11 items-center justify-center gap-2 px-4 font-semibold transition ${
                      offer.recommended
                        ? 'bg-primary text-primary-foreground hover:opacity-90'
                        : 'border border-border hover:border-primary/60 hover:text-primary'
                    }`}
                  >
                    {offer.cta}
                    <ArrowUpRight aria-hidden="true" className="size-4" />
                  </Link>
                </article>
              ))}
            </div>

            <div className="mt-8 border border-border bg-background/70 p-5 text-sm leading-6 text-muted-foreground">
              <strong className="text-foreground">Cadre tarifaire :</strong> prix HT pour
              un site standard et un périmètre confirmé avant intervention. Sont exclus par
              défaut la refonte complète, la production éditoriale volumineuse, l’achat de
              liens ou médias, les développements spécifiques et les accès tiers payants.
              Si le périmètre sort de ce cadre, Novekia le signale avant engagement.
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
