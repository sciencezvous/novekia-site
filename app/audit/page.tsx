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

          <section
            className="mb-12 border border-primary/30 bg-primary/5 p-6 sm:p-8 lg:p-10"
            aria-labelledby="audit-complet-title"
          >
            <div className="grid gap-8 lg:grid-cols-[1fr_0.85fr] lg:items-center">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.12em] text-primary">
                  Audit approfondi · prestation payante
                </p>
                <h2 id="audit-complet-title" className="mt-3 text-2xl font-semibold sm:text-3xl">
                  Le pré-audit montre les priorités. L’audit complet explique tout le reste.
                </h2>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
                  Le pré-audit public est volontairement borné et ne restitue qu’un aperçu des constats prioritaires. L’audit approfondi Novekia élargit le périmètre, documente les preuves et transforme les écarts confirmés en plan d’action exploitable.
                </p>
              </div>

              <div className="border border-border bg-background/80 p-5 sm:p-6">
                <ul className="space-y-3 text-sm leading-6 text-muted-foreground">
                  <li>• Analyse élargie des pages et signaux stratégiques.</li>
                  <li>• SEO technique, entité, AEO/GEO et visibilité approfondis.</li>
                  <li>• Constats complets, preuves par page et priorisation impact / effort.</li>
                  <li>• Recommandations de remédiation détaillées et retest après correction.</li>
                </ul>
                <Link
                  href="/#contact"
                  className="mt-6 inline-flex min-h-12 w-full items-center justify-center bg-primary px-5 text-center font-semibold text-primary-foreground transition hover:opacity-90 sm:w-auto"
                >
                  Demander mon audit complet
                </Link>
              </div>
            </div>
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
