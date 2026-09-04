import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, CheckCircle2, SearchCheck, ShieldCheck } from 'lucide-react'
import { Breadcrumbs } from '@/components/brand/breadcrumbs'
import { JsonLd } from '@/components/brand/json-ld'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { siteConfig } from '@/lib/site-config'

export const metadata: Metadata = {
  title: {
    absolute: 'Audit SEO, GEO, AEO & Brand SERP approfondi | Tarifs Novekia',
  },
  description:
    'Audit approfondi Novekia Visibility : SEO, GEO, AEO, Entity SEO, Brand SERP, preuves, priorisation et remédiation. Tarifs de lancement affichés dès 490 € HT.',
  alternates: { canonical: '/audit-approfondi' },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: `${siteConfig.url}/audit-approfondi`,
    title: 'Audit SEO, GEO, AEO & Brand SERP approfondi | Novekia',
    description:
      'Une analyse approfondie fondée sur des preuves, avec priorisation, plan de remédiation, tarifs affichés et vérification après correction.',
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
    title: 'Brand SERP & autorité',
    text: 'Présence de la marque, sources officielles et tierces, cohérence d’identité, homonymes, corroboration et signaux de confiance.',
  },
  {
    title: 'Remédiation & retest',
    text: 'Chaque correction prioritaire est reliée à sa preuve initiale, à une recommandation et, lorsque le périmètre le prévoit, à une vérification après correction.',
  },
] as const

const process = [
  ['01', 'Cadrage', 'Définir le domaine, le périmètre, les accès autorisés et les questions auxquelles l’audit doit répondre.'],
  ['02', 'Mesure', 'Exécuter uniquement les contrôles réellement disponibles et conserver leur provenance, leur date et leurs limites.'],
  ['03', 'Contre-vérification', 'Rejouer ou recouper les constats importants avant de les présenter comme confirmés.'],
  ['04', 'Priorisation', 'Distinguer faits observés, interprétations, recommandations et ordre de remédiation.'],
  ['05', 'Correction & retest', 'Préparer ou appliquer les corrections selon le niveau de risque, puis vérifier le résultat après modification.'],
] as const

const visibilityOffers = [
  {
    name: 'Pack Optimisation',
    price: 490,
    priceLabel: '490 € HT',
    startingAt: false,
    recommended: false,
    summary:
      'Pour un site dont le pré-audit révèle quelques corrections prioritaires clairement démontrées.',
    included: [
      'Validation humaine des constats prioritaires',
      'Corrections techniques essentielles',
      'SEO on-page prioritaire',
      'Données structurées essentielles',
      'Retest des points corrigés',
    ],
  },
  {
    name: 'Pack Visibility',
    price: 990,
    priceLabel: '990 € HT',
    startingAt: false,
    recommended: true,
    summary:
      'Pour traiter ensemble SEO, GEO, AEO et compréhension de l’entité avec une analyse plus profonde.',
    included: [
      'Audit approfondi Evidence-First',
      'SEO technique et on-page',
      'Entity SEO et données structurées',
      'Optimisation GEO / AEO',
      'Plan de remédiation et retest',
    ],
  },
  {
    name: 'Visibility Authority',
    price: 1490,
    priceLabel: '1 490 € HT',
    startingAt: true,
    recommended: false,
    summary:
      'Pour étendre l’analyse à l’autorité externe, aux citations, aux backlinks et aux écarts concurrentiels.',
    included: [
      'Tout le périmètre du Pack Visibility',
      'Backlinks et domaines référents',
      'Mentions de marque liées et non liées',
      'Citation gaps et comparaison concurrentielle',
      'Plan d’autorité et opportunités Digital PR',
    ],
  },
] as const

export default function DeepAuditPage() {
  const pageUrl = `${siteConfig.url}/audit-approfondi`

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          '@id': `${pageUrl}#service`,
          name: 'Audit approfondi Novekia Visibility',
          url: pageUrl,
          inLanguage: 'fr-FR',
          provider: { '@id': `${siteConfig.url}/#organization` },
          description: metadata.description,
          serviceType: 'Audit SEO, GEO, AEO, Entity SEO et Brand SERP',
          areaServed: { '@type': 'Country', name: 'France' },
          offers: visibilityOffers.map((offer) => ({
            '@type': 'Offer',
            name: offer.name,
            price: offer.price,
            priceCurrency: 'EUR',
            url: `${pageUrl}#tarifs`,
            description: offer.startingAt
              ? `${offer.summary} Tarif à partir de ${offer.price} € HT selon périmètre.`
              : offer.summary,
          })),
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
                { label: 'Audit approfondi' },
              ]}
            />

            <div className="mt-12 grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:gap-20">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary">
                  Novekia Visibility · Audit approfondi
                </p>
                <h1 className="mt-6 max-w-5xl text-balance text-5xl font-semibold leading-[0.94] tracking-[-0.055em] sm:text-7xl">
                  Comprendre votre visibilité.
                  <br />
                  <span className="text-primary">Prouver ce qui doit être corrigé.</span>
                </h1>
              </div>

              <div>
                <p className="max-w-xl text-lg leading-8 text-muted-foreground">
                  Une prestation fondée sur Novekia Visibility. Chaque constat est relié à
                  une preuve, un niveau de confiance et une limite méthodologique explicite.
                  Les tarifs standard sont affichés avant engagement.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="#tarifs"
                    className="inline-flex min-h-12 items-center justify-center gap-2 bg-primary px-5 font-semibold text-primary-foreground transition hover:opacity-90"
                  >
                    Voir les tarifs
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
                  Le périmètre final est confirmé avant la mission. Un contrôle impossible à mesurer de façon fiable est déclaré non conclu ou transféré vers une méthode plus profonde ; il n’est jamais transformé artificiellement en défaut.
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
                  'Séparation entre fait observé, interprétation, recommandation et opportunité de correction.',
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
            <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-end lg:gap-16">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary">
                  Tarifs de lancement
                </p>
                <h2
                  id="pricing-title"
                  className="mt-4 text-balance text-4xl font-semibold tracking-[-0.045em] sm:text-5xl"
                >
                  Le prix est visible. La recommandation doit rester justifiée.
                </h2>
              </div>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground lg:justify-self-end">
                Le pré-audit gratuit sert à déterminer s’il existe réellement quelque chose à
                corriger. Novekia ne dégrade pas un score pour pousser vers une formule plus chère.
                Lorsque les preuves sont insuffisantes, la recommandation reste à confirmer humainement.
              </p>
            </div>

            <div className="mt-12 grid gap-4 lg:grid-cols-3">
              {visibilityOffers.map((offer) => (
                <article
                  key={offer.name}
                  className={`relative flex h-full flex-col border p-7 sm:p-8 ${
                    offer.recommended
                      ? 'border-primary bg-primary/5 shadow-[0_0_0_1px_hsl(var(--primary)/0.12)]'
                      : 'border-border bg-secondary/15'
                  }`}
                >
                  {offer.recommended && (
                    <span className="mb-5 w-fit bg-primary px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-primary-foreground">
                      Recommandé
                    </span>
                  )}
                  <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
                    {offer.startingAt ? 'À partir de' : 'Tarif standard'}
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold">{offer.name}</h3>
                  <div className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-primary sm:text-5xl">
                    {offer.priceLabel}
                  </div>
                  <p className="mt-5 text-sm leading-7 text-muted-foreground">
                    {offer.summary}
                  </p>
                  <ul className="mt-7 grid gap-3 text-sm leading-6">
                    {offer.included.map((item) => (
                      <li key={item} className="flex gap-2.5">
                        <CheckCircle2
                          aria-hidden="true"
                          className="mt-0.5 size-4 shrink-0 text-primary"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/#contact"
                    className={`mt-8 inline-flex min-h-12 items-center justify-center gap-2 px-5 font-semibold transition ${
                      offer.recommended
                        ? 'bg-primary text-primary-foreground hover:opacity-90'
                        : 'border border-border hover:border-primary/60 hover:text-primary'
                    }`}
                  >
                    Choisir ce périmètre
                    <ArrowUpRight aria-hidden="true" className="size-4" />
                  </Link>
                </article>
              ))}
            </div>

            <div className="mt-8 grid gap-4 border border-border bg-secondary/20 p-6 text-sm leading-6 text-muted-foreground sm:grid-cols-2">
              <p>
                <strong className="text-foreground">Inclus dans le cadre standard :</strong>{' '}
                un site principal, un périmètre confirmé avant mission et les corrections
                compatibles avec les accès fournis.
              </p>
              <p>
                <strong className="text-foreground">Hors cadre par défaut :</strong>{' '}
                refonte complète, production éditoriale volumineuse, achat de liens ou médias,
                développements spécifiques et abonnements tiers. Tout écart est annoncé avant engagement.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-secondary/35 px-5 py-16 sm:px-6 sm:py-24 md:px-8" aria-labelledby="process-title">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary">Déroulé</p>
              <h2 id="process-title" className="mt-4 text-balance text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
                De la mesure à la remédiation vérifiée.
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
                <span className="font-mono text-xs uppercase tracking-[0.14em]">Remédiation contrôlée</span>
              </div>
              <h2 className="mt-5 text-3xl font-semibold sm:text-4xl">L’objectif n’est pas de produire un PDF. C’est de fermer la boucle.</h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
                Selon le périmètre, Novekia peut préparer un plan de correction et organiser un retest. Les corrections automatisées ou connectées restent soumises au niveau de risque, aux autorisations accordées et à une validation humaine avant toute action sensible.
              </p>
            </div>
            <Link
              href="/#contact"
              className="mt-7 inline-flex min-h-12 shrink-0 items-center justify-center bg-primary px-6 font-semibold text-primary-foreground transition hover:opacity-90 lg:mt-0"
            >
              Cadrer mon intervention
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
