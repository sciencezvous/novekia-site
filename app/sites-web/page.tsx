import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, CheckCircle2, Globe2, SearchCheck, Sparkles } from 'lucide-react'
import { Breadcrumbs } from '@/components/brand/breadcrumbs'
import { JsonLd } from '@/components/brand/json-ld'
import { PrimaryButton } from '@/components/brand/primary-button'
import { SecondaryButton } from '@/components/brand/secondary-button'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { siteConfig } from '@/lib/site-config'

const pageUrl = `${siteConfig.url}/sites-web`

export const metadata: Metadata = {
  title: {
    absolute: 'Création de site web : tarifs SEO, GEO & AEO | Novekia',
  },
  description:
    'Tarifs de création de site web Novekia : présence locale dès 990 € HT, site SEO dès 1 490 € HT, SEO + GEO + AEO dès 2 490 € HT et Authority à partir de 3 490 € HT.',
  alternates: { canonical: '/sites-web' },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: pageUrl,
    title: 'Création de site web : tarifs SEO, GEO & AEO | Novekia',
    description:
      'Des sites construits pour être rapides, compréhensibles, indexables et mesurables, avec un niveau de référencement choisi avant engagement.',
  },
}

const offers = [
  {
    name: 'Site Présence',
    price: 990,
    priceLabel: '990 € HT',
    startingAt: false,
    recommended: false,
    tag: 'Premier site',
    description:
      'Pour une entreprise sans site qui veut une présence professionnelle simple, rapide et locale.',
    features: [
      'Site one-page responsive',
      'Présentation de l’activité, services et zone desservie',
      'SEO technique de base',
      'LocalBusiness / Organization Schema.org',
      'Sitemap, robots et indexabilité',
      'Formulaire ou appel direct',
    ],
  },
  {
    name: 'Site Essentiel SEO',
    price: 1490,
    priceLabel: '1 490 € HT',
    startingAt: false,
    recommended: false,
    tag: 'SEO',
    description:
      'Pour structurer plusieurs services ou intentions de recherche avec une base SEO sérieuse.',
    features: [
      'Jusqu’à 5 pages principales',
      'Architecture SEO et intentions de recherche',
      'SEO on-page : titres, Hn, métadonnées et maillage',
      'SEO local lorsque pertinent',
      'Données structurées essentielles',
      'Contrôle technique avant mise en ligne',
    ],
  },
  {
    name: 'Site Visibility',
    price: 2490,
    priceLabel: '2 490 € HT',
    startingAt: false,
    recommended: true,
    tag: 'SEO + GEO + AEO',
    description:
      'Le niveau recommandé pour travailler ensemble visibilité Google, moteurs de réponse et compréhension de l’entité.',
    features: [
      'Jusqu’à 8 pages principales',
      'Tout le périmètre Site Essentiel SEO',
      'Entity SEO et relations marque / services / personnes',
      'Optimisation GEO et AEO',
      'Contenus orientés réponse et preuves',
      'Audit Novekia Visibility avant et après mise en ligne',
    ],
  },
  {
    name: 'Site Authority',
    price: 3490,
    priceLabel: '3 490 € HT',
    startingAt: true,
    recommended: false,
    tag: 'Autorité',
    description:
      'Pour une entreprise qui veut construire le site et renforcer en parallèle sa présence de marque et ses signaux externes.',
    features: [
      'Tout le périmètre Site Visibility',
      'Jusqu’à 12 pages principales selon cadrage',
      'Brand SERP et cohérence d’entité',
      'Analyse des mentions, citations et domaines référents',
      'Citation gaps face aux concurrents',
      'Plan d’autorité / Digital PR sans achat de liens imposé',
    ],
  },
] as const

const comparison = [
  ['Site responsive et performant', true, true, true, true],
  ['SEO technique', 'Base', 'Complet', 'Complet', 'Complet'],
  ['SEO local', 'Base', 'Oui', 'Oui', 'Oui'],
  ['Architecture multi-pages', '—', 'Jusqu’à 5 pages', 'Jusqu’à 8 pages', 'Jusqu’à 12 pages'],
  ['Entity SEO', 'Base', 'Essentiel', 'Complet', 'Complet'],
  ['GEO / moteurs génératifs', '—', '—', 'Oui', 'Oui'],
  ['AEO / moteurs de réponse', '—', '—', 'Oui', 'Oui'],
  ['Audit Visibility avant / après', 'Contrôle technique', 'Contrôle technique', 'Oui', 'Oui'],
  ['Autorité / Brand SERP', '—', '—', 'Plan de base', 'Approfondi'],
] as const

export default function SitesWebPage() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          '@id': `${pageUrl}#service`,
          name: 'Création de sites web Novekia',
          url: pageUrl,
          inLanguage: 'fr-FR',
          provider: { '@id': `${siteConfig.url}/#organization` },
          areaServed: { '@type': 'Country', name: 'France' },
          serviceType: 'Création de sites web avec SEO, GEO, AEO et Entity SEO',
          description: metadata.description,
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Tarifs de création de site web Novekia',
            itemListElement: offers.map((offer) => ({
              '@type': 'Offer',
              name: offer.name,
              price: offer.price,
              priceCurrency: 'EUR',
              url: `${pageUrl}#tarifs`,
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
              name: 'Produits',
              item: `${siteConfig.url}/produits`,
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: 'Sites Web + Visibility',
              item: pageUrl,
            },
          ],
        }}
      />
      <SiteHeader />
      <main id="contenu">
        <section className="relative overflow-hidden border-b border-border px-5 py-16 sm:px-6 sm:py-24 md:px-8 lg:py-28">
          <div aria-hidden="true" className="technical-grid-pattern absolute inset-0 opacity-25" />
          <div aria-hidden="true" className="novekia-glow -right-44 -top-32" />
          <div className="relative mx-auto max-w-7xl">
            <Breadcrumbs
              items={[
                { label: 'Accueil', href: '/' },
                { label: 'Produits', href: '/produits' },
                { label: 'Sites Web + Visibility' },
              ]}
            />
            <div className="mt-12 grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-20">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-primary">
                  Offre productisée Novekia · création de site
                </p>
                <h1 className="mt-6 max-w-5xl text-balance text-5xl font-semibold leading-[0.95] tracking-[-0.055em] sm:text-7xl">
                  Un site professionnel.
                  <br />
                  <span className="text-primary">Le référencement choisi dès le départ.</span>
                </h1>
                <p className="mt-7 max-w-3xl text-lg leading-8 text-muted-foreground">
                  Pour une entreprise sans site ou pour une refonte complète. Novekia construit
                  la présence web et applique le niveau de référencement réellement acheté :
                  SEO, SEO + GEO/AEO ou travail d’autorité avancé.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <PrimaryButton href="#tarifs" withArrow>
                    Voir les tarifs
                  </PrimaryButton>
                  <SecondaryButton href="/creation-site-web-seo-geo">
                    Voir la méthode SEO &amp; GEO
                  </SecondaryButton>
                </div>
              </div>
              <aside className="novekia-surface border-l-2 border-l-primary p-6 sm:p-8">
                <div className="flex items-center gap-3 text-primary">
                  <Globe2 aria-hidden="true" className="size-6" strokeWidth={1.5} />
                  <span className="font-mono text-xs uppercase tracking-[0.16em]">
                    Positionnement
                  </span>
                </div>
                <p className="mt-5 text-base leading-7 text-foreground/90">
                  Le design n’est pas vendu séparément de la visibilité technique. Même le
                  premier niveau inclut une base propre d’indexabilité, de performance et
                  d’identité numérique. Les niveaux supérieurs ajoutent uniquement ce qui est
                  réellement mesuré et livré.
                </p>
              </aside>
            </div>
          </div>
        </section>

        <section id="tarifs" className="px-5 py-16 sm:px-6 sm:py-24 md:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end lg:gap-16">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary">
                  Tarifs de lancement
                </p>
                <h2 className="mt-4 text-balance text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
                  Quatre niveaux. Un périmètre lisible avant engagement.
                </h2>
              </div>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground lg:justify-self-end">
                Le niveau n’est pas un score marketing. Il correspond à une profondeur de
                construction et de référencement différente. Le périmètre final est confirmé
                avant démarrage lorsque le nombre de pages, les intégrations ou les contenus
                sortent du cadre standard.
              </p>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {offers.map((offer) => (
                <article
                  key={offer.name}
                  className={`relative flex h-full flex-col border p-6 sm:p-7 ${
                    offer.recommended
                      ? 'border-primary bg-primary/5 shadow-[0_0_0_1px_hsl(var(--primary)/0.12)]'
                      : 'border-border bg-background'
                  }`}
                >
                  {offer.recommended ? (
                    <span className="mb-5 w-fit bg-primary px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-primary-foreground">
                      Recommandé
                    </span>
                  ) : null}
                  <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
                    {offer.tag}
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold">{offer.name}</h3>
                  <div className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-primary">
                    {offer.priceLabel}
                  </div>
                  {offer.startingAt ? (
                    <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                      À partir de
                    </p>
                  ) : null}
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
                    href={`/?need=${encodeURIComponent('SEO et GEO')}#contact`}
                    className={`mt-8 inline-flex min-h-11 items-center justify-center gap-2 px-4 font-semibold transition ${
                      offer.recommended
                        ? 'bg-primary text-primary-foreground hover:opacity-90'
                        : 'border border-border hover:border-primary/60 hover:text-primary'
                    }`}
                  >
                    Demander ce site
                    <ArrowUpRight aria-hidden="true" className="size-4" />
                  </Link>
                </article>
              ))}
            </div>

            <div className="mt-8 border border-border bg-secondary/20 p-6 text-sm leading-7 text-muted-foreground">
              <strong className="text-foreground">Cadre standard :</strong> les tarifs couvrent
              un site vitrine principal et les livrables explicitement listés. Sont exclus par
              défaut : e-commerce, espace client, application métier, photographie, production
              éditoriale volumineuse, traduction, achat de médias ou de backlinks, licences
              tierces payantes et développements spécifiques. Tout écart est chiffré avant
              engagement.
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-secondary/25 px-5 py-16 sm:px-6 sm:py-24 md:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary">
                Comparatif référencement
              </p>
              <h2 className="mt-4 text-balance text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
                Ce qui change réellement entre les niveaux.
              </h2>
            </div>
            <div className="mt-10 overflow-x-auto border border-border bg-background">
              <table className="w-full min-w-[820px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/25">
                    <th className="p-4 font-semibold">Livrable</th>
                    {offers.map((offer) => (
                      <th key={offer.name} className="p-4 font-semibold">
                        {offer.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((row) => (
                    <tr key={String(row[0])} className="border-b border-border last:border-b-0">
                      {row.map((cell, index) => (
                        <td
                          key={`${String(row[0])}-${index}`}
                          className={`p-4 ${index === 0 ? 'font-medium text-foreground' : 'text-muted-foreground'}`}
                        >
                          {typeof cell === 'boolean' ? (cell ? 'Oui' : '—') : cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="px-5 py-16 sm:px-6 sm:py-24 md:px-8">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-3">
            <article className="border border-border bg-background p-7">
              <SearchCheck aria-hidden="true" className="size-7 text-primary" strokeWidth={1.5} />
              <h2 className="mt-5 text-2xl font-semibold">SEO</h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                Indexabilité, structure des pages, intentions de recherche, titres, métadonnées,
                maillage interne, données structurées et performance technique.
              </p>
            </article>
            <article className="border border-border bg-background p-7">
              <Sparkles aria-hidden="true" className="size-7 text-primary" strokeWidth={1.5} />
              <h2 className="mt-5 text-2xl font-semibold">GEO &amp; AEO</h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                Contenus plus faciles à extraire, comprendre et attribuer par les moteurs de
                réponse et génératifs, avec entités, réponses directes, preuves et limites.
              </p>
            </article>
            <article className="border border-border bg-background p-7">
              <Globe2 aria-hidden="true" className="size-7 text-primary" strokeWidth={1.5} />
              <h2 className="mt-5 text-2xl font-semibold">Authority</h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                Cohérence de marque, Brand SERP, mentions externes, citations, domaines référents
                et écarts par rapport aux concurrents afin de construire une autorité mesurable.
              </p>
            </article>
          </div>
        </section>

        <section className="section-dark px-5 py-16 text-foreground sm:px-6 sm:py-20 md:px-8">
          <div className="mx-auto max-w-7xl border border-primary/30 bg-primary/5 p-7 sm:p-10 lg:flex lg:items-center lg:justify-between lg:gap-16">
            <div className="max-w-3xl">
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary">
                Entreprise sans site
              </p>
              <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">
                Votre réputation existe déjà ? Transformons-la en actif web que vous contrôlez.
              </h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
                Une fiche Google, des avis ou une page Facebook peuvent générer des contacts,
                mais ils restent sur des plateformes tierces. Le site devient la source officielle
                de l’entreprise et la base du référencement futur.
              </p>
            </div>
            <PrimaryButton
              href={`/?need=${encodeURIComponent('SEO et GEO')}#contact`}
              withArrow
              className="mt-7 shrink-0 lg:mt-0"
            >
              Construire mon site
            </PrimaryButton>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
