import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import './audit-engagement.css'
import './audit-radar-v3.css'
import { AuditAutoReport } from './audit-auto-report'
import { AuditExperience } from './audit-experience'
import { JsonLd } from '@/components/brand/json-ld'
import { siteConfig } from '@/lib/site-config'

export const metadata: Metadata = {
  title: {
    absolute: 'Audit gratuit de visibilité Google & IA | Novekia',
  },
  description:
    'Entrez l’adresse de votre site et obtenez immédiatement un pré-audit gratuit : visibilité Google, compréhension par les moteurs IA, problèmes observés et preuves disponibles.',
  alternates: { canonical: '/audit' },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: `${siteConfig.url}/audit`,
    title: 'Audit gratuit de visibilité Google & IA | Novekia',
    description:
      'Une URL suffit. Novekia analyse un échantillon public de votre site, affiche le résultat immédiatement et peut vous envoyer le rapport détaillé.',
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
          name: 'Audit gratuit de visibilité Google & IA Novekia',
          url: pageUrl,
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Web',
          inLanguage: 'fr-FR',
          isAccessibleForFree: true,
          provider: { '@id': `${siteConfig.url}/#organization` },
          description:
            'Pré-audit public gratuit permettant d’observer la visibilité technique d’un site, sa compréhension par les moteurs de recherche et certains signaux utiles aux moteurs de réponse et d’IA.',
        }}
      />
      <AuditAutoReport />

      <main id="contenu" className="section-dark relative min-h-dvh overflow-hidden text-foreground">
        <div aria-hidden="true" className="technical-grid-pattern absolute inset-0 opacity-20" />
        <div aria-hidden="true" className="novekia-glow -left-48 top-0" />

        <div className="relative mx-auto flex min-h-dvh w-full max-w-7xl flex-col px-5 sm:px-6 md:px-8">
          <header className="flex min-h-20 items-center justify-between gap-4 border-b border-border/70 py-4">
            <Link
              href="/"
              className="inline-flex items-center gap-3 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Retour à Novekia"
            >
              <Image src="/novekia-icon.svg" alt="" width={40} height={40} className="size-10 shrink-0" />
              <span className="flex flex-col leading-none">
                <span className="text-lg font-semibold tracking-tight">Novekia</span>
                <span className="mt-1 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-primary">
                  Visibility
                </span>
              </span>
            </Link>

            <Link
              href="/"
              className="inline-flex min-h-11 items-center justify-center border border-border px-3 text-xs font-medium text-muted-foreground transition hover:border-primary/60 hover:text-foreground sm:px-4 sm:text-sm"
            >
              Retour au site
            </Link>
          </header>

          <section
            className="audit-engagement-surface flex flex-1 items-center py-8 sm:py-10 lg:py-12"
            aria-label="Application de pré-audit de visibilité"
          >
            <AuditExperience />
          </section>

          <footer className="flex flex-col gap-3 border-t border-border/70 py-5 font-mono text-[0.68rem] leading-5 text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>Pré-audit public Novekia Visibility · Evidence-First</p>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              <Link href="/politique-de-confidentialite" className="transition hover:text-foreground">
                Confidentialité
              </Link>
              <Link href="/mentions-legales" className="transition hover:text-foreground">
                Mentions légales
              </Link>
            </div>
          </footer>
        </div>
      </main>
    </>
  )
}
