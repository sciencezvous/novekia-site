import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/brand/breadcrumbs'
import { JsonLd } from '@/components/brand/json-ld'
import { TechnicalLabel } from '@/components/brand/technical-label'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { NewsArticleCard } from '@/components/news/news-article-card'
import { aiNewsArticles } from '@/lib/ai-news'
import { siteConfig } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Actualités et analyses IA pour les entreprises',
  description:
    'Décryptages Novekia des nouveautés IA : conséquences techniques, limites, architectures et critères de décision pour les entreprises.',
  alternates: { canonical: '/actualites-ia' },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: `${siteConfig.url}/actualites-ia`,
    title: 'Actualités et analyses IA — Novekia',
    description:
      'Une veille sélective et sourcée pour transformer les nouveautés IA en décisions techniques utiles.',
    images: ['/og.png'],
  },
}

export default function AiNewsPage() {
  const url = `${siteConfig.url}/actualites-ia`

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          '@id': `${url}#webpage`,
          url,
          name: 'Actualités et analyses IA — Novekia',
          description: metadata.description,
          inLanguage: 'fr-FR',
          isPartOf: { '@id': `${siteConfig.url}/#website` },
          about: { '@id': `${siteConfig.url}/#organization` },
          hasPart: aiNewsArticles.map((article) => ({
            '@type': 'Article',
            headline: article.title,
            url: `${url}/${article.slug}`,
            datePublished: article.publishedAt,
          })),
        }}
      />
      <SiteHeader />
      <main id="contenu">
        <section className="relative overflow-hidden border-b border-border px-5 py-16 sm:px-6 sm:py-24 md:px-8 lg:py-28">
          <div
            aria-hidden="true"
            className="technical-grid-pattern absolute inset-0 opacity-20"
          />
          <div aria-hidden="true" className="novekia-glow -right-40 -top-48" />
          <div className="relative mx-auto max-w-7xl">
            <Breadcrumbs
              items={[{ label: 'Accueil', href: '/' }, { label: 'Actualités IA' }]}
            />
            <div className="mt-12 grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-end lg:gap-20">
              <div>
                <TechnicalLabel index="Veille">Actualités IA</TechnicalLabel>
                <h1 className="mt-6 max-w-5xl text-balance text-5xl font-semibold leading-[0.96] tracking-[-0.05em] sm:text-7xl">
                  Comprendre la nouveauté.
                  <br />
                  <span className="text-primary">Décider sans effet de mode.</span>
                </h1>
              </div>
              <p className="max-w-xl text-lg leading-8 text-muted-foreground">
                Une sélection d’annonces importantes, relues sous l’angle de
                l’architecture, de la souveraineté, de l’exploitation et de la
                valeur métier. Pas de reprise automatique : chaque publication
                apporte une analyse Novekia.
              </p>
            </div>
          </div>
        </section>

        <section className="px-5 py-16 sm:px-6 md:px-8 md:py-24">
          <div className="mx-auto max-w-7xl">
            <TechnicalLabel index="01">Dernière analyse</TechnicalLabel>
            <div className="mt-8 grid gap-px bg-border">
              {aiNewsArticles.map((article) => (
                <NewsArticleCard key={article.slug} article={article} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
