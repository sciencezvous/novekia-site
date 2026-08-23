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

const auditComparison = [
  {
    label: 'Périmètre',
    free: 'Échantillon limité de pages publiques.',
    deep: 'Analyse élargie, rendu JavaScript et contrôles plus profonds.',
  },
  {
    label: 'SEO',
    free: 'Fondamentaux techniques et on-page réellement observables.',
    deep: 'SEO technique, architecture, contenu, performance et priorisation page par page.',
  },
  {
    label: 'GEO, AEO & entités',
    free: 'Signaux publics d’indexabilité, données structurées et compréhension d’entité.',
    deep: 'Tests GEO/AEO approfondis, cohérence d’entité, citations et visibilité multi-moteurs.',
  },
  {
    label: 'Brand SERP & autorité',
    free: 'Quelques signaux publics de confiance et d’identité.',
    deep: 'Brand SERP, sources officielles et tierces, réputation, corroboration et concurrents.',
  },
  {
    label: 'Restitution',
    free: 'Score, couverture, sous-scores et jusqu’à 3 constats prioritaires.',
    deep: 'Tous les constats, preuves, URLs, impact / effort, plan d’action et retest.',
  },
  {
    label: 'Points non mesurables',
    free: 'Signalés comme non conclus, sans pénaliser la note.',
    deep: 'Vérifiés avec des méthodes supplémentaires et, si autorisé, des données authentifiées.',
  },
]

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
            <div className="max-w-4xl">
              <p className="font-mono text-xs uppercase tracking-[0.12em] text-primary">
                Gratuit vs audit approfondi
              </p>
              <h2 id="audit-complet-title" className="mt-3 text-2xl font-semibold sm:text-3xl">
                Le pré-audit utilise un périmètre borné. Le payant active l’analyse complète de Novekia Visibility.
              </h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
                Les deux niveaux reposent sur le même moteur Novekia Visibility et la même logique Evidence-First. Le pré-audit public ne conclut que sur ce qu’il peut prouver avec un périmètre limité. L’audit approfondi est réalisé par Novekia avec le profil complet du moteur, des méthodes supplémentaires et, lorsque le client l’autorise, des sources authentifiées.
              </p>
            </div>

            <div className="mt-7 overflow-x-auto border border-border bg-background/75">
              <div className="min-w-[760px]">
                <div className="grid grid-cols-[0.72fr_1fr_1fr] border-b border-border bg-background/90 text-sm font-semibold">
                  <div className="p-4 text-muted-foreground">Domaine</div>
                  <div className="border-l border-border p-4">Pré-audit gratuit</div>
                  <div className="border-l border-border p-4 text-primary">
                    Novekia Visibility complet · payant
                  </div>
                </div>
                {auditComparison.map((row) => (
                  <div
                    key={row.label}
                    className="grid grid-cols-[0.72fr_1fr_1fr] border-b border-border/70 text-sm leading-6 last:border-b-0"
                  >
                    <div className="p-4 font-medium">{row.label}</div>
                    <div className="border-l border-border/70 p-4 text-muted-foreground">
                      {row.free}
                    </div>
                    <div className="border-l border-border/70 p-4 text-muted-foreground">
                      {row.deep}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-7 flex flex-col gap-4 border-t border-border/70 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
                L’audit approfondi est une prestation Novekia réalisée avec Novekia Visibility en profil complet : SEO, GEO, AEO, Entity SEO, Brand SERP, preuves, priorisation et retest. Le client reçoit les résultats et recommandations, pas l’accès au moteur interne.
              </p>
              <Link
                href="/#contact"
                className="inline-flex min-h-12 shrink-0 items-center justify-center bg-primary px-5 text-center font-semibold text-primary-foreground transition hover:opacity-90"
              >
                Demander mon audit approfondi
              </Link>
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
