import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, CheckCircle2, SearchCheck, ShieldCheck } from 'lucide-react'
import { Breadcrumbs } from '@/components/brand/breadcrumbs'
import { JsonLd } from '@/components/brand/json-ld'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { REMEDIATION_OFFERS } from '@/lib/audit-paid-offers'
import { siteConfig } from '@/lib/site-config'

export const metadata: Metadata = {
  title: {
    absolute: 'Audit Visibility Full SEO, GEO & AEO — 99 € HT | Novekia',
  },
  description:
    'Audit Visibility Full à 99 € HT sur données publiques : SEO, Entity SEO, GEO/AEO, preuves, scoring, rapport premium et plan de remédiation. Corrections Novekia en option après audit.',
  alternates: { canonical: '/audit-approfondi' },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: `${siteConfig.url}/audit-approfondi`,
    title: 'Audit Visibility Full — 99 € HT | Novekia',
    description:
      'Un audit complet sur les données publiques avec rapport premium, preuves et plan de remédiation. La mise en œuvre des corrections reste séparée.',
  },
}

const domains = [
  {
    title: 'SEO technique & indexabilité',
    text: 'Crawl, indexabilité, canonicals, robots, sitemaps, architecture, intégrité technique et signaux observables de performance.',
  },
  {
    title: 'Contenu, on-page & architecture',
    text: 'Titres, Hn, profondeur, maillage, pages stratégiques, cohérence sémantique et qualité des contenus réellement observés.',
  },
  {
    title: 'Entity SEO & données structurées',
    text: 'Compréhension de l’organisation, des personnes, produits, services et relations entre entités, avec contrôle des données structurées.',
  },
  {
    title: 'AEO & GEO',
    text: 'Préparation aux moteurs de réponse et génératifs : extractibilité, compréhension d’entité, éligibilité technique et signaux de citation lorsque la méthode permet de les observer.',
  },
  {
    title: 'Brand SERP & autorité observable',
    text: 'Présence de la marque, sources officielles et tierces, cohérence d’identité, homonymes, corroboration et signaux de confiance accessibles publiquement.',
  },
  {
    title: 'Plan de remédiation',
    text: 'Chaque priorité est reliée à sa preuve, son niveau de confiance et une action recommandée. L’exécution technique par Novekia reste une prestation séparée.',
  },
] as const

const process = [
  ['01', 'Cadrage', 'Définir le domaine et les questions auxquelles l’audit doit répondre à partir des données publiques disponibles.'],
  ['02', 'Mesure', 'Exécuter les contrôles disponibles et conserver leur provenance, leur date et leurs limites.'],
  ['03', 'Contre-vérification', 'Rejouer ou recouper les constats importants avant de les présenter comme confirmés.'],
  ['04', 'Priorisation', 'Distinguer faits observés, interprétations et ordre de priorité.'],
  ['05', 'Plan de remédiation', 'Livrer les actions recommandées dans le rapport premium, sans exécuter automatiquement les corrections.'],
] as const

const auditOffer = {
  name: 'Audit Visibility Full',
  price: 99,
  priceLabel: '99 € HT',
  summary:
    'Audit complet sur les données publiques disponibles, avec rapport premium, scoring, preuves, priorisation et plan de remédiation.',
  included: [
    'SEO technique et on-page',
    'Entity SEO et données structurées',
    'Analyse GEO / AEO sur les signaux observables',
    'Scoring complet, preuves et niveaux de confiance',
    'Rapport premium V3 et plan de remédiation',
  ],
} as const

const remediationOffers = Object.values(REMEDIATION_OFFERS)

export default function DeepAuditPage() {
  const pageUrl = `${siteConfig.url}/audit-approfondi`

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          '@id': `${pageUrl}#service`,
          name: 'Audit Visibility Full Novekia',
          url: pageUrl,
          inLanguage: 'fr-FR',
          provider: { '@id': `${siteConfig.url}/#organization` },
          description: metadata.description,
          serviceType: 'Audit SEO, GEO, AEO, Entity SEO et Brand SERP sur données publiques',
          areaServed: { '@type': 'Country', name: 'France' },
          offers: {
            '@type': 'Offer',
            name: auditOffer.name,
            price: auditOffer.price,
            priceCurrency: 'EUR',
            url: `${pageUrl}#tarifs`,
            description: auditOffer.summary,
          },
        }}
      />

      <SiteHeader />
      <main id="contenu">
        <section className="section-dark relative overflow-hidden border-b border-border px-5 py-16 text-foreground sm:px-6 sm:py-24 md:px-8 lg:py-28">
          <div aria-hidden="true" className="technical-grid-pattern absolute inset-0 opacity-25" />
          <div aria-hidden="true" className="novekia-glow -right-40 -top-40" />

          <div className="relative mx-auto max-w-7xl">
            <Breadcrumbs
              items={[
                { label: 'Accueil', href: '/' },
                { label: 'Audit', href: '/audit' },
                { label: 'Audit Visibility Full' },
              ]}
            />

            <div className="mt-12 grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:gap-20">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary">
                  Novekia Visibility · Audit Full
                </p>
                <h1 className="mt-6 max-w-5xl text-balance text-5xl font-semibold leading-[0.94] tracking-[-0.055em] sm:text-7xl">
                  Comprendre votre visibilité.
                  <br />
                  <span className="text-primary">Décider avant de corriger.</span>
                </h1>
              </div>

              <div>
                <p className="max-w-xl text-lg leading-8 text-muted-foreground">
                  Un audit complet fondé sur les données publiques disponibles. Novekia documente
                  les preuves, les limites, les priorités et le plan de remédiation. La mise en œuvre
                  des corrections reste volontairement séparée.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/audit/commande?offer=full"
                    className="inline-flex min-h-12 items-center justify-center gap-2 bg-primary px-5 font-semibold text-primary-foreground transition hover:opacity-90"
                  >
                    Commander l’audit — 99 € HT
                    <ArrowUpRight aria-hidden="true" className="size-4" />
                  </Link>
                  <Link
                    href="/audit"
                    className="inline-flex min-h-12 items-center justify-center border border-border px-5 font-semibold transition hover:border-primary/60 hover:text-primary"
                  >
                    Tester le pré-audit gratuit
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-background px-5 py-16 sm:px-6 sm:py-24 md:px-8" aria-labelledby="coverage-title">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary">Périmètre</p>
                <h2 id="coverage-title" className="mt-4 text-balance text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
                  Un audit de visibilité, pas un score opaque.
                </h2>
                <p className="mt-5 text-base leading-7 text-muted-foreground">
                  Le mot « Full » signifie complet sur le périmètre public mesurable. Un contrôle impossible à établir de façon fiable est déclaré non conclu ; il n’est jamais transformé artificiellement en défaut.
                </p>
              </div>

              <div className="grid gap-px bg-border sm:grid-cols-2">
                {domains.map((domain) => (
                  <article key={domain.title} className="bg-background p-6 sm:p-7">
                    <SearchCheck aria-hidden="true" className="size-6 text-primary" strokeWidth={1.5} />
                    <h3 className="mt-5 text-xl font-semibold">{domain.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">{domain.text}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-secondary/35 px-5 py-16 sm:px-6 sm:py-24 md:px-8" aria-labelledby="evidence-title">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary">Evidence-First</p>
                <h2 id="evidence-title" className="mt-4 text-balance text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
                  Chaque conclusion doit pouvoir être contestée et revérifiée.
                </h2>
              </div>
              <div className="grid gap-4">
                {[
                  'Preuve et URL source associées au constat lorsque disponibles.',
                  'Date, méthode, niveau de confiance et limites conservés dans la restitution.',
                  'Séparation entre fait observé, interprétation, recommandation et correction.',
                  'Aucune promesse de classement Google ou de citation garantie dans un moteur génératif.',
                  'Les données commerciales internes de Lead Engine ne font pas partie du rapport client.',
                ].map((item) => (
                  <div key={item} className="flex gap-3 border-b border-border pb-4 text-sm leading-6 last:border-b-0">
                    <CheckCircle2 aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          id="tarifs"
          className="bg-background px-5 py-16 sm:px-6 sm:py-24 md:px-8"
          aria-labelledby="pricing-title"
        >
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-4xl text-center">
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary">
                Offre publique
              </p>
              <h2
                id="pricing-title"
                className="mt-4 text-balance text-4xl font-semibold tracking-[-0.045em] sm:text-5xl"
              >
                Audit Visibility Full — 99 € HT
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
                Vous payez d’abord pour comprendre et décider. Le diagnostic complet et le plan de remédiation sont livrés avant toute proposition de correction par Novekia.
              </p>
            </div>

            <article className="mx-auto mt-10 max-w-4xl border border-primary bg-primary/[0.045] p-7 sm:p-10">
              <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <span className="inline-flex bg-primary px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-primary-foreground">
                    Produit principal
                  </span>
                  <h3 className="mt-5 text-3xl font-semibold tracking-[-0.035em]">{auditOffer.name}</h3>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">{auditOffer.summary}</p>
                  <ul className="mt-6 grid gap-3 text-sm leading-6 sm:grid-cols-2">
                    {auditOffer.included.map((item) => (
                      <li key={item} className="flex gap-2.5">
                        <CheckCircle2 aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="lg:min-w-56 lg:text-right">
                  <p className="text-5xl font-semibold tracking-[-0.05em] text-primary">{auditOffer.priceLabel}</p>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">Paiement unique · un site principal</p>
                  <Link
                    href="/audit/commande?offer=full"
                    className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 bg-primary px-5 font-semibold text-primary-foreground transition hover:opacity-90"
                  >
                    Commander l’audit
                    <ArrowUpRight aria-hidden="true" className="size-4" />
                  </Link>
                </div>
              </div>
              <p className="mt-8 border-t border-border pt-5 text-xs leading-6 text-muted-foreground">
                Aucune correction technique n’est incluse. Vous pouvez appliquer le plan vous-même, le transmettre à votre prestataire ou demander ensuite à Novekia de l’exécuter.
              </p>
            </article>

            <div className="mt-16 border-t border-border pt-12">
              <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end lg:gap-16">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary">Après l’audit</p>
                  <h3 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                    Vous choisissez qui exécute le plan.
                  </h3>
                </div>
                <p className="max-w-2xl text-sm leading-7 text-muted-foreground lg:justify-self-end">
                  Si vous confiez la remédiation à Novekia, le périmètre est déterminé à partir des preuves du rapport. Les 99 € HT de l’Audit Full sont alors déduits de la prestation de remédiation.
                </p>
              </div>

              <div className="mt-8 grid gap-4 lg:grid-cols-3">
                {remediationOffers.map((offer) => (
                  <article key={offer.id} className="border border-border bg-secondary/15 p-6">
                    <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                      Remédiation Novekia
                    </p>
                    <h4 className="mt-3 text-xl font-semibold">{offer.label}</h4>
                    <p className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-primary">{offer.priceLabel}</p>
                    <p className="mt-4 text-sm leading-6 text-muted-foreground">{offer.description}</p>
                  </article>
                ))}
              </div>

              <p className="mt-5 text-xs leading-6 text-muted-foreground">
                Les montants de remédiation correspondent à la prestation complète. Exemple : Audit Full 99 € puis Remédiation Visibility 990 € → solde de 891 € HT si Novekia réalise la remédiation.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-secondary/35 px-5 py-16 sm:px-6 sm:py-24 md:px-8" aria-labelledby="process-title">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary">Déroulé de l’audit</p>
              <h2 id="process-title" className="mt-4 text-balance text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
                De la mesure au plan d’action.
              </h2>
            </div>
            <div className="mt-12 grid gap-px bg-border md:grid-cols-5">
              {process.map(([index, title, text]) => (
                <article key={index} className="bg-background p-6">
                  <span className="font-mono text-xs text-primary">{index}</span>
                  <h3 className="mt-5 text-xl font-semibold">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-dark px-5 py-16 text-foreground sm:px-6 sm:py-20 md:px-8">
          <div className="mx-auto max-w-7xl border border-primary/30 bg-primary/5 p-7 sm:p-10 lg:flex lg:items-center lg:justify-between lg:gap-16">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 text-primary">
                <ShieldCheck aria-hidden="true" className="size-6" />
                <span className="font-mono text-xs uppercase tracking-[0.14em]">Séparation audit / exécution</span>
              </div>
              <h2 className="mt-5 text-3xl font-semibold sm:text-4xl">Le rapport doit être utile même si Novekia ne réalise aucune correction.</h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
                Le client conserve un diagnostic exploitable, les preuves et son plan de remédiation. La prestation de correction n’est proposée qu’ensuite, selon les besoins réellement démontrés.
              </p>
            </div>
            <Link
              href="/audit/commande?offer=full"
              className="mt-7 inline-flex min-h-12 shrink-0 items-center justify-center bg-primary px-6 font-semibold text-primary-foreground transition hover:opacity-90 lg:mt-0"
            >
              Commander à 99 € HT
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
