import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { JsonLd } from '@/components/brand/json-ld'
import { PrimaryButton } from '@/components/brand/primary-button'
import { SecondaryButton } from '@/components/brand/secondary-button'
import { TechnicalLabel } from '@/components/brand/technical-label'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { OfferDiagram } from '@/components/offers/offer-diagram'
import { getOffer, getOfferMetadata, offerList } from '@/lib/offers'
import { siteConfig } from '@/lib/site-config'

type OfferPageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return offerList.map((offer) => ({ slug: offer.slug }))
}

export async function generateMetadata({ params }: OfferPageProps): Promise<Metadata> {
  const { slug } = await params
  const offer = getOffer(slug)
  return offer ? getOfferMetadata(offer) : {}
}

export default async function OfferPage({ params }: OfferPageProps) {
  const { slug } = await params
  const offer = getOffer(slug)

  if (!offer) notFound()

  const offerUrl = `${siteConfig.url}/offres/${offer.slug}`

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          '@id': `${offerUrl}#service`,
          name: offer.title,
          description: offer.summary,
          url: offerUrl,
          provider: { '@id': `${siteConfig.url}/#organization` },
          areaServed: { '@type': 'Country', name: 'France' },
          audience: offer.forWhom.map((name) => ({ '@type': 'Audience', name })),
          serviceOutput: offer.outcomes,
        }}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: offer.faq.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: { '@type': 'Answer', text: item.answer },
          })),
        }}
      />
      <SiteHeader />
      <main id="contenu">
        <section className="relative overflow-hidden border-b border-border px-5 py-16 sm:px-6 sm:py-24 md:px-8">
          <div aria-hidden="true" className="technical-grid-pattern absolute inset-0 opacity-25" />
          <div aria-hidden="true" className="novekia-glow -right-48 -top-20" />
          <div className="relative mx-auto max-w-7xl">
            <TechnicalLabel index="OFFRE">{offer.eyebrow}</TechnicalLabel>
            <div className="mt-7 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              <div>
                <h1 className="max-w-4xl text-balance text-5xl font-semibold leading-[0.95] tracking-[-0.055em] sm:text-7xl">
                  {offer.title}
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                  {offer.intro}
                </p>
              </div>
              <dl className="novekia-surface grid gap-px bg-border sm:grid-cols-2">
                <div className="bg-card/90 p-5">
                  <dt className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    Budget indicatif
                  </dt>
                  <dd className="mt-2 font-semibold">{offer.startingPrice}</dd>
                </div>
                <div className="bg-card/90 p-5">
                  <dt className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    Durée
                  </dt>
                  <dd className="mt-2 font-semibold">{offer.duration}</dd>
                </div>
              </dl>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <PrimaryButton href="/#contact" withArrow>{offer.ctaLabel}</PrimaryButton>
              <SecondaryButton href="/offres">Voir toutes les offres</SecondaryButton>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 md:px-8 md:py-24">
          <OfferDiagram type={offer.diagram} />

          <div className="mt-16 grid gap-12 lg:grid-cols-2">
            <ContentList title="Pour qui ?" items={offer.forWhom} />
            <ContentList title="Résultats attendus" items={offer.outcomes} />
            <ContentList title="Livrables" items={offer.deliverables} />
            <ContentList title="Prérequis" items={offer.prerequisites} />
          </div>

          <div className="mt-20">
            <TechnicalLabel index="PROCESS">Déroulement</TechnicalLabel>
            <ol className="mt-8 grid gap-px bg-border md:grid-cols-2 lg:grid-cols-4">
              {offer.process.map((step, index) => (
                <li key={step.title} className="bg-card p-6">
                  <span className="font-mono text-xs text-primary">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h2 className="mt-5 text-lg font-semibold">{step.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{step.description}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-20">
            <TechnicalLabel index="FAQ">Questions fréquentes</TechnicalLabel>
            <div className="mt-8 divide-y divide-border border-y border-border">
              {offer.faq.map((item) => (
                <details key={item.question} className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-lg font-semibold outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    {item.question}
                    <span
                      aria-hidden="true"
                      className="text-2xl font-light text-primary transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="max-w-3xl pb-7 text-sm leading-7 text-muted-foreground">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>

          <aside className="mt-16 border-l-2 border-primary bg-card p-6">
            <h2 className="font-semibold">Ce qui n’est pas inclus</h2>
            <ul className="mt-4 grid gap-2 text-sm leading-6 text-muted-foreground">
              {offer.exclusions.map((item) => <li key={item}>— {item}</li>)}
            </ul>
          </aside>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}

function ContentList({ title, items }: { title: string; items: string[] }) {
  return (
    <section>
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <ul className="mt-6 divide-y divide-border border-y border-border">
        {items.map((item) => (
          <li key={item} className="flex gap-4 py-4 text-sm leading-7 text-muted-foreground">
            <span className="text-primary" aria-hidden="true">↳</span>
            {item}
          </li>
        ))}
      </ul>
    </section>
  )
}
