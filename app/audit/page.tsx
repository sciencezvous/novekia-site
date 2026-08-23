import type { Metadata } from 'next'
import Link from 'next/link'
import { AuditExperience } from './audit-experience'
import { Breadcrumbs } from '@/components/brand/breadcrumbs'
import { JsonLd } from '@/components/brand/json-ld'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { siteConfig } from '@/lib/site-config'

export const metadata: Metadata = {
  title: {
    absolute: 'Pré-audit SEO & visibilité IA gratuit | Novekia',
  },
  description:
    'Analysez un échantillon public de votre site : SEO, données structurées, entité, signaux GEO/AEO et premières preuves vérifiables.',
  alternates: { canonical: '/audit' },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: `${siteConfig.url}/audit`,
    title: 'Pré-audit SEO & visibilité IA gratuit | Novekia',
    description:
      'Entrez votre URL. Novekia Visibility analyse un échantillon public et restitue un score, une couverture et des constats documentés.',
  },
}

export default function AuditPage() {
  const pageUrl = `${siteConfig.url}/audit`

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          '@id': `${pageUrl}#application`,
          name: 'Pré-audit public Novekia',
          url: pageUrl,
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Web',
          inLanguage: 'fr-FR',
          isAccessibleForFree: true,
          provider: { '@id': `${siteConfig.url}/#organization` },
          description:
            'Pré-audit public borné de signaux SEO, de données structurées, d’entité et de préparation à la visibilité dans les moteurs de recherche et de réponse.',
        }}
      />

      <SiteHeader />
      <main id="contenu" className="section-dark relative min-h-screen overflow-hidden text-foreground">
        <div aria-hidden="true" className="technical-grid-pattern absolute inset-0 opacity-20" />
        <div aria-hidden="true" className="novekia-glow -left-48 top-0" />

        <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-8 sm:px-6 sm:pb-20 md:px-8">
          <Breadcrumbs
            items={[
              { label: 'Accueil', href: '/' },
              { label: 'Pré-audit gratuit' },
            ]}
          />

          <section className="py-10 sm:py-14 lg:py-16" aria-label="Pré-audit de visibilité">
            <AuditExperience />
          </section>

          <section
            className="border border-primary/30 bg-primary/5 p-6 sm:p-8 lg:flex lg:items-center lg:justify-between lg:gap-12 lg:p-10"
            aria-labelledby="audit-deep-bridge-title"
          >
            <div className="max-w-3xl">
              <p className="font-mono text-xs uppercase tracking-[0.12em] text-primary">
                Aller plus loin
              </p>
              <h2 id="audit-deep-bridge-title" className="mt-3 text-2xl font-semibold sm:text-3xl">
                Le pré-audit montre ce qui est publiquement vérifiable. L’audit approfondi analyse le reste.
              </h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
                Le pré-audit est volontairement borné. Les contrôles non mesurables ne sont pas transformés en défauts. Pour une analyse plus profonde — SEO, GEO, AEO, entités, Brand SERP, preuves complètes et plan de remédiation — consultez la prestation dédiée.
              </p>
            </div>
            <Link
              href="/audit-approfondi"
              className="mt-6 inline-flex min-h-12 shrink-0 items-center justify-center bg-primary px-5 text-center font-semibold text-primary-foreground transition hover:opacity-90 lg:mt-0"
            >
              Découvrir l’audit approfondi
            </Link>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
