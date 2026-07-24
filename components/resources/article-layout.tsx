import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowRight, CalendarDays, Clock3 } from 'lucide-react'
import { Breadcrumbs } from '@/components/brand/breadcrumbs'
import { JsonLd } from '@/components/brand/json-ld'
import { PrimaryButton } from '@/components/brand/primary-button'
import { TechnicalLabel } from '@/components/brand/technical-label'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import type { ResourceArticle } from '@/lib/resources'
import { siteConfig } from '@/lib/site-config'

type ArticleLayoutProps = {
  article: ResourceArticle
  tableOfContents: { id: string; label: string }[]
  children: ReactNode
}

function formatArticleDate(date: string) {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`))
}

export function ArticleLayout({
  article,
  tableOfContents,
  children,
}: ArticleLayoutProps) {
  const url = `${siteConfig.url}/ressources/${article.slug}`

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          '@id': `${url}#article`,
          headline: article.title,
          description: article.description,
          datePublished: article.publishedAt,
          dateModified: article.modifiedAt,
          inLanguage: 'fr-FR',
          mainEntityOfPage: url,
          author: { '@id': `${siteConfig.url}/#andy-legrand` },
          publisher: { '@id': `${siteConfig.url}/#organization` },
          image: `${siteConfig.url}/og.png`,
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
              name: 'Ressources',
              item: `${siteConfig.url}/ressources`,
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: article.title,
              item: url,
            },
          ],
        }}
      />
      <SiteHeader />
      <main id="contenu">
        <header className="relative overflow-hidden border-b border-border px-5 py-16 sm:px-6 sm:py-24 md:px-8">
          <div
            aria-hidden="true"
            className="technical-grid-pattern absolute inset-0 opacity-20"
          />
          <div aria-hidden="true" className="novekia-glow -right-48 -top-48" />
          <div className="relative mx-auto max-w-5xl">
            <Breadcrumbs
              items={[
                { label: 'Accueil', href: '/' },
                { label: 'Ressources', href: '/ressources' },
                { label: article.title },
              ]}
            />
            <TechnicalLabel index="Guide" className="mt-12">
              {article.eyebrow}
            </TechnicalLabel>
            <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.02] tracking-[-0.05em] sm:text-6xl">
              {article.title}
            </h1>
            <p className="mt-7 max-w-4xl text-lg leading-8 text-muted-foreground">
              {article.description}
            </p>
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
              <span>Par Andy Legrand</span>
              <span className="flex items-center gap-2">
                <CalendarDays aria-hidden="true" className="size-3.5" />
                {formatArticleDate(article.publishedAt)}
              </span>
              <span className="flex items-center gap-2">
                <Clock3 aria-hidden="true" className="size-3.5" />
                {article.readingTime}
              </span>
            </div>
          </div>
        </header>

        <section className="border-b border-border px-5 py-10 sm:px-6 md:px-8 md:py-14">
          <div className="novekia-surface mx-auto max-w-5xl border-l-2 border-l-primary p-6 sm:p-8">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
              Réponse directe
            </p>
            <p className="mt-4 text-lg font-medium leading-8 text-foreground/95">
              {article.directAnswer}
            </p>
          </div>
        </section>

        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-6 md:px-8 md:py-24 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-20">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
              Dans ce guide
            </p>
            <nav aria-label="Sommaire de l’article">
              <ol className="mt-5 divide-y divide-border border-y border-border">
                {tableOfContents.map((item, index) => (
                  <li key={item.id}>
                    <Link
                      href={`#${item.id}`}
                      className="group flex gap-3 py-3 text-sm leading-6 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <span className="font-mono text-xs text-primary">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ol>
            </nav>
            <Link
              href="/ressources/checklist-cadrage-ia-locale"
              className="mt-6 flex items-center justify-between gap-4 border border-border bg-card p-4 text-sm font-semibold transition-colors hover:border-primary/60 hover:text-primary"
            >
              Checklist de cadrage
              <ArrowRight aria-hidden="true" className="size-4 shrink-0" />
            </Link>
          </aside>

          <article className="min-w-0 space-y-16">{children}</article>
        </div>

        <section className="border-t border-border px-5 py-16 sm:px-6 md:px-8 md:py-24">
          <div className="novekia-surface relative mx-auto max-w-7xl overflow-hidden p-8 sm:p-10 lg:flex lg:items-end lg:justify-between lg:gap-12">
            <div aria-hidden="true" className="novekia-glow -bottom-72 -right-40" />
            <div className="relative">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
                Décision suivante
              </p>
              <h2 className="mt-4 max-w-3xl text-balance text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
                Valider le cas d’usage avant de choisir le modèle ou le matériel.
              </h2>
            </div>
            <PrimaryButton
              href="/#contact"
              withArrow
              className="relative mt-7 shrink-0 lg:mt-0"
            >
              Présenter votre contexte
            </PrimaryButton>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
