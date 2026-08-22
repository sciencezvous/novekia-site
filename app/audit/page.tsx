import type { Metadata } from 'next'
import Link from 'next/link'
import { AuditExperience } from './audit-experience'
import { JsonLd } from '@/components/brand/json-ld'
import { siteConfig } from '@/lib/site-config'

export const metadata: Metadata = {
  title: {
    absolute: 'Pré-audit SEO & visibilité IA gratuit | Novekia',
  },
  description:
    'Analysez un échantillon public de votre site : SEO, GEO, autorité, réponses structurées et signaux utiles à l’AEO. Premiers constats visibles avant email.',
  alternates: { canonical: '/audit' },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: `${siteConfig.url}/audit`,
    title: 'Pré-audit SEO & visibilité IA gratuit | Novekia',
    description:
      'Entrez votre URL. Le moteur Novekia analyse un échantillon public et affiche de premiers constats documentés avant de demander votre email.',
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
            'Outil de pré-audit public borné pour analyser des signaux SEO, GEO, de réponse structurée, d’autorité et de conversion.',
          featureList: [
            'Pré-audit SEO technique',
            'Analyse GEO et visibilité IA',
            'Signaux utiles à l’AEO',
            'Constats documentés par des preuves publiques',
          ],
        }}
      />

      <main id="contenu" className="section-dark relative min-h-screen overflow-hidden text-foreground">
        <div aria-hidden="true" className="technical-grid-pattern absolute inset-0 opacity-20" />
        <div aria-hidden="true" className="novekia-glow -left-48 top-0" />

        <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-5 sm:px-6 sm:pb-20 md:px-8">
          <header className="flex min-h-14 items-center justify-between gap-4 border-b border-border/70 pb-4">
            <Link
              href="/"
              className="inline-flex items-center gap-3 font-semibold tracking-[-0.02em]"
              aria-label="Novekia — accueil"
            >
              <span className="inline-flex size-8 items-center justify-center border border-primary/50 font-mono text-xs text-primary">
                N
              </span>
              <span>NOVEKIA</span>
            </Link>
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground sm:text-xs">
              Moteur de pré-audit public
            </span>
          </header>

          <section className="py-10 sm:py-14 lg:py-20" aria-label="Pré-audit de visibilité">
            <AuditExperience />
          </section>

          <footer className="flex flex-col gap-3 border-t border-border/70 pt-6 text-xs leading-5 text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Novekia · Pré-audit public borné.</p>
            <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Informations légales">
              <Link href="/politique-de-confidentialite" className="hover:text-foreground">
                Confidentialité
              </Link>
              <Link href="/mentions-legales" className="hover:text-foreground">
                Mentions légales
              </Link>
              <Link href="/#contact" className="hover:text-foreground">
                Contact
              </Link>
            </nav>
          </footer>
        </div>
      </main>
    </>
  )
}
