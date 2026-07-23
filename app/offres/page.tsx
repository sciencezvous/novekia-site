import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/brand/breadcrumbs'
import { ExpertiseGrid } from '@/components/brand/expertise-grid'
import { JsonLd } from '@/components/brand/json-ld'
import { TechnicalLabel } from '@/components/brand/technical-label'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { expertises } from '@/lib/expertises'
import { siteConfig } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Expertises et solutions',
  description:
    'Découvrez les cinq domaines d’intervention de Novekia : logiciels métiers, IA locale, infrastructures de calcul, applications web et sites optimisés SEO & GEO.',
  alternates: { canonical: '/offres' },
}

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
              d&apos;expertise du studio. Chaque domaine dispose désormais
              d&apos;une présentation détaillée&nbsp;; le périmètre précis reste
              défini après compréhension de votre contexte.
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
      </main>
      <SiteFooter />
    </>
  )
}
