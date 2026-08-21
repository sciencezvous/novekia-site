import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Breadcrumbs } from '@/components/brand/breadcrumbs'
import { founderIdentityJsonLd, JsonLd } from '@/components/brand/json-ld'
import { TechnicalLabel } from '@/components/brand/technical-label'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { aiNewsArticles } from '@/lib/ai-news'
import { resourceArticles } from '@/lib/resources'
import { siteConfig } from '@/lib/site-config'

const authorUrl = `${siteConfig.url}/auteurs/andy-legrand`

export const metadata: Metadata = {
  title: {
    absolute: 'Andy Legrand — Fondateur de Novekia',
  },
  description:
    'Page auteur d’Andy Legrand, fondateur de Novekia et auteur des ressources techniques publiées sur novekia.fr.',
  alternates: { canonical: '/auteurs/andy-legrand' },
  openGraph: {
    type: 'profile',
    locale: 'fr_FR',
    url: authorUrl,
    title: 'Andy Legrand — Fondateur de Novekia',
    description:
      'Auteur des ressources Novekia sur l’ingénierie logicielle, l’IA locale et les infrastructures de calcul.',
    images: [
      {
        url: '/andy-legrand-novekia-v3.png',
        width: 972,
        height: 1619,
        alt: 'Andy Legrand, fondateur de Novekia',
      },
    ],
  },
}

const publications = [
  ...aiNewsArticles.map((article) => ({
    title: article.title,
    href: `/actualites-ia/${article.slug}`,
    kind: 'Analyse',
    modifiedAt: article.modifiedAt,
  })),
  ...resourceArticles.map((article) => ({
    title: article.title,
    href: `/ressources/${article.slug}`,
    kind: 'Guide',
    modifiedAt: article.modifiedAt,
  })),
]

export default function AndyLegrandAuthorPage() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ProfilePage',
          '@id': `${authorUrl}#webpage`,
          url: authorUrl,
          name: 'Andy Legrand — Fondateur de Novekia',
          description: metadata.description,
          inLanguage: 'fr-FR',
          isPartOf: { '@id': `${siteConfig.url}/#website` },
          mainEntity: {
            ...founderIdentityJsonLd,
            description:
              'Fondateur de Novekia et auteur des ressources techniques publiées sur novekia.fr.',
            knowsAbout: [
              'Ingénierie logicielle',
              'Intelligence artificielle locale',
              'Infrastructure de calcul',
              'Architecture de systèmes',
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
              name: 'À propos',
              item: `${siteConfig.url}/a-propos`,
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: 'Andy Legrand',
              item: authorUrl,
            },
          ],
        }}
      />
      <SiteHeader />
      <main id="contenu">
        <section className="relative overflow-hidden border-b border-border px-5 py-16 sm:px-6 sm:py-24 md:px-8">
          <div aria-hidden="true" className="technical-grid-pattern absolute inset-0 opacity-20" />
          <div className="relative mx-auto max-w-7xl">
            <Breadcrumbs
              items={[
                { label: 'Accueil', href: '/' },
                { label: 'À propos', href: '/a-propos' },
                { label: 'Andy Legrand' },
              ]}
            />
            <div className="mt-12 grid items-center gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
              <div className="novekia-surface mx-auto w-full max-w-sm p-4">
                <div className="relative aspect-[3/4] overflow-hidden border border-border bg-[#071224]">
                  <Image
                    src="/andy-legrand-novekia-v3.png"
                    alt="Andy Legrand, fondateur de Novekia"
                    fill
                    priority
                    sizes="(min-width: 1024px) 30vw, 80vw"
                    className="object-cover object-[center_18%]"
                  />
                </div>
              </div>
              <div>
                <TechnicalLabel index="Auteur">Novekia</TechnicalLabel>
                <h1 className="mt-6 text-balance text-5xl font-semibold tracking-[-0.055em] sm:text-7xl">
                  Andy Legrand
                </h1>
                <p className="mt-4 font-mono text-xs uppercase tracking-[0.18em] text-primary">
                  Fondateur de Novekia
                </p>
                <p className="mt-7 max-w-3xl text-lg leading-8 text-muted-foreground">
                  Andy Legrand a fondé Novekia et publie sur novekia.fr des
                  ressources consacrées à l’ingénierie logicielle, à
                  l’intelligence artificielle locale, aux architectures de
                  systèmes et aux infrastructures de calcul. Les contenus
                  distinguent les faits, les hypothèses, les limites et les
                  décisions qui nécessitent une validation humaine.
                </p>
                <Link
                  href="/a-propos"
                  className="mt-8 inline-flex items-center gap-2 border-b border-primary pb-1 font-mono text-xs uppercase tracking-[0.14em] text-primary transition-colors hover:text-foreground"
                >
                  À propos de Novekia
                  <ArrowUpRight aria-hidden="true" className="size-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 py-16 sm:px-6 md:px-8 md:py-24">
          <div className="mx-auto max-w-7xl">
            <TechnicalLabel index="Publications">Contenus signés</TechnicalLabel>
            <h2 className="mt-5 max-w-3xl text-balance text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
              Ressources et analyses publiées sur novekia.fr.
            </h2>
            <div className="mt-10 grid gap-px bg-border md:grid-cols-2">
              {publications.map((publication) => (
                <article key={publication.href} className="bg-background p-6 sm:p-8">
                  <p className="font-mono text-xs uppercase tracking-[0.16em] text-primary">
                    {publication.kind} · Mis à jour le {publication.modifiedAt}
                  </p>
                  <h3 className="mt-4 text-xl font-semibold leading-snug">
                    <Link
                      href={publication.href}
                      className="transition-colors hover:text-primary"
                    >
                      {publication.title}
                    </Link>
                  </h3>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
