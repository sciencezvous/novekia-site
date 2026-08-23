import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight,
  CheckCircle2,
  FileCheck2,
  FlaskConical,
  Quote,
  ShieldCheck,
} from 'lucide-react'
import { Breadcrumbs } from '@/components/brand/breadcrumbs'
import { JsonLd } from '@/components/brand/json-ld'
import { PrimaryButton } from '@/components/brand/primary-button'
import { TechnicalLabel } from '@/components/brand/technical-label'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { siteConfig } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Preuves Novekia — validations techniques et retours terrain',
  description:
    'Preuves propriétaires, protocoles de validation, résultats reproductibles et futurs témoignages clients vérifiés publiés par Novekia.',
  alternates: { canonical: '/preuves' },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: `${siteConfig.url}/preuves`,
    title: 'Preuves Novekia — validations techniques et retours terrain',
    description:
      'Ce que Novekia affirme, ce qui a été testé, comment cela a été mesuré et quelles limites restent explicitement ouvertes.',
    images: ['/og.png'],
  },
}

const visibilityProofFacts = [
  ['Version testée', 'public-audit-v1'],
  ['Architecture SSR testée', 'novekia.fr · Next.js'],
  ['Architecture SPA testée', 'instant-devis.fr · React / Vite'],
  ['Règle validée', 'Un contrôle non mesurable ne devient pas une pénalité'],
]

const proofRules = [
  {
    title: 'Fait observé',
    description:
      'Une affirmation publiée comme résultat doit être reliée à une observation, une version et un périmètre identifiables.',
  },
  {
    title: 'Interprétation séparée',
    description:
      'L’analyse Novekia reste distincte du fait brut afin qu’un lecteur puisse comprendre ce qui est mesuré et ce qui est déduit.',
  },
  {
    title: 'Limites explicites',
    description:
      'Une absence de mesure, une incertitude ou une dépendance à un accès supplémentaire est indiquée au lieu d’être transformée en certitude.',
  },
]

export default function ProofsPage() {
  const pageUrl = `${siteConfig.url}/preuves`

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          '@id': `${pageUrl}#webpage`,
          url: pageUrl,
          name: 'Preuves Novekia',
          description: metadata.description,
          inLanguage: 'fr-FR',
          isPartOf: { '@id': `${siteConfig.url}/#website` },
          about: { '@id': `${siteConfig.url}/#organization` },
          hasPart: [
            {
              '@type': 'TechArticle',
              headline: 'Validation du pré-audit public Novekia Visibility V1',
              datePublished: '2026-08-23',
              about: 'Novekia Visibility',
              author: { '@id': `${siteConfig.url}/#organization` },
            },
            {
              '@type': 'TechArticle',
              headline: 'Démonstrateur RAG local Novekia',
              url: `${siteConfig.url}/ressources/demonstrateur-rag-local`,
              author: { '@id': `${siteConfig.url}/#organization` },
            },
          ],
        }}
      />

      <SiteHeader />
      <main id="contenu">
        <section className="relative overflow-hidden border-b border-border px-5 py-16 sm:px-6 sm:py-24 md:px-8 lg:py-28">
          <div aria-hidden="true" className="technical-grid-pattern absolute inset-0 opacity-20" />
          <div aria-hidden="true" className="novekia-glow -right-40 -top-48" />
          <div className="relative mx-auto max-w-7xl">
            <Breadcrumbs items={[{ label: 'Accueil', href: '/' }, { label: 'Preuves' }]} />
            <div className="mt-12 grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-end lg:gap-20">
              <div>
                <TechnicalLabel index="01">Preuves Novekia</TechnicalLabel>
                <h1 className="mt-6 max-w-5xl text-balance text-5xl font-semibold leading-[0.96] tracking-[-0.05em] sm:text-7xl">
                  Affirmer moins.
                  <br />
                  <span className="text-primary">Démontrer davantage.</span>
                </h1>
              </div>
              <div>
                <p className="max-w-xl text-lg leading-8 text-muted-foreground">
                  Cette rubrique rassemble les validations techniques, protocoles,
                  démonstrations reproductibles et, lorsqu’ils sont autorisés,
                  retours clients associés aux travaux de Novekia.
                </p>
                <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground">
                  Une preuve propriétaire ne remplace pas une validation indépendante.
                  Elle documente précisément ce que Novekia a testé, avec quelle
                  méthode, à quelle date et dans quelles limites.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-border px-5 py-16 sm:px-6 md:px-8 md:py-24">
          <div className="mx-auto max-w-7xl">
            <TechnicalLabel index="02">Preuves propriétaires</TechnicalLabel>
            <div className="mt-8 grid gap-6 xl:grid-cols-[1.18fr_0.82fr]">
              <article className="border border-primary/35 bg-primary/5 p-6 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.16em] text-primary">
                      Preuve propriétaire · 23 août 2026
                    </p>
                    <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                      Novekia Visibility — pré-audit public V1
                    </h2>
                  </div>
                  <span className="inline-flex items-center gap-2 border border-primary/35 bg-background/80 px-3 py-2 text-xs font-semibold text-primary">
                    <CheckCircle2 aria-hidden="true" className="size-4" />
                    Testé en conditions réelles
                  </span>
                </div>

                <p className="mt-6 max-w-4xl leading-7 text-muted-foreground">
                  Novekia Visibility est un moteur propriétaire conçu, développé et
                  édité exclusivement par Novekia. Sa couche de pré-audit public V1 a
                  été testée sur deux architectures web différentes afin de vérifier
                  que le moteur distingue un défaut réellement observé d’un contrôle
                  qu’il ne peut pas conclure de façon fiable.
                </p>

                <div className="mt-7 grid gap-px bg-border sm:grid-cols-2">
                  {visibilityProofFacts.map(([label, value]) => (
                    <div key={label} className="bg-background p-5">
                      <p className="font-mono text-[0.64rem] uppercase tracking-[0.16em] text-muted-foreground">
                        {label}
                      </p>
                      <p className="mt-2 text-sm font-semibold leading-6">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-7 grid gap-4 md:grid-cols-2">
                  <div className="border border-border bg-background/75 p-5">
                    <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary">
                      Cas Novekia
                    </p>
                    <p className="mt-3 text-3xl font-semibold">96/100</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      Couverture observée : 100 %. Le moteur conserve les écarts
                      documentés sans dégrader la couverture lorsque les contrôles sont mesurables.
                    </p>
                  </div>
                  <div className="border border-border bg-background/75 p-5">
                    <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary">
                      Cas InstantDevis
                    </p>
                    <p className="mt-3 text-3xl font-semibold">100/100</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      Score sur les contrôles mesurables, avec 93 % de couverture globale
                      et 77 % de couverture on-page : les signaux dépendant du rendu JavaScript
                      non vérifié n’ont pas été transformés en défauts.
                    </p>
                  </div>
                </div>

                <div className="mt-7 border-t border-border pt-6">
                  <h3 className="font-semibold">Ce que cette preuve démontre</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    La V1 sait exécuter un pré-audit public, calculer séparément score
                    et couverture, conserver une logique de preuve et exclure de la
                    pénalisation les contrôles non conclus. Cette validation ne constitue
                    pas encore une preuve du futur profil complet de Visibility pour le
                    GEO multi-moteurs, le Brand SERP approfondi ou les sources authentifiées.
                  </p>
                  <PrimaryButton href="/audit" withArrow className="mt-6">
                    Tester le pré-audit public
                  </PrimaryButton>
                </div>
              </article>

              <article className="border border-border bg-card p-6 sm:p-8">
                <FlaskConical aria-hidden="true" className="size-10 text-primary" strokeWidth={1.5} />
                <p className="mt-6 font-mono text-xs uppercase tracking-[0.16em] text-primary">
                  Démonstration publiée
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                  Démonstrateur RAG local
                </h2>
                <p className="mt-4 leading-7 text-muted-foreground">
                  Une démonstration dont les hypothèses, la formule de mémoire, les
                  limites et le protocole de recette restent visibles. Elle n’est pas
                  présentée comme un benchmark matériel ni comme un résultat client.
                </p>
                <Link
                  href="/ressources/demonstrateur-rag-local"
                  className="mt-7 inline-flex items-center gap-2 font-semibold text-primary"
                >
                  Examiner la démonstration
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              </article>
            </div>
          </div>
        </section>

        <section className="border-b border-border px-5 py-16 sm:px-6 md:px-8 md:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
              <div>
                <TechnicalLabel index="03">Cas clients & témoignages</TechnicalLabel>
                <Quote aria-hidden="true" className="mt-8 size-11 text-primary" strokeWidth={1.4} />
                <h2 className="mt-5 text-balance text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
                  Une preuve sociale doit rester une preuve.
                </h2>
              </div>
              <div className="border border-border bg-card p-6 sm:p-8">
                <h3 className="text-xl font-semibold">Aucun témoignage fabriqué.</h3>
                <p className="mt-4 leading-7 text-muted-foreground">
                  Novekia publiera ici uniquement des témoignages et cas clients
                  autorisés. Lorsqu’une métrique est citée, son contexte, sa période
                  de mesure et ses limites doivent pouvoir être expliqués.
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {[
                    'Identité ou anonymisation validée avec le client',
                    'Citation publiée avec autorisation',
                    'Métriques contextualisées lorsque présentes',
                    'Aucune attribution causale non démontrée',
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3 border border-border bg-background/60 p-4 text-sm leading-6">
                      <ShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-border px-5 py-16 sm:px-6 md:px-8 md:py-24">
          <div className="mx-auto max-w-7xl">
            <TechnicalLabel index="04">Méthode de preuve</TechnicalLabel>
            <div className="mt-8 grid gap-px bg-border md:grid-cols-3">
              {proofRules.map((rule) => (
                <article key={rule.title} className="min-h-64 bg-background p-6 sm:p-8">
                  <FileCheck2 aria-hidden="true" className="size-8 text-primary" strokeWidth={1.5} />
                  <h2 className="mt-6 text-xl font-semibold">{rule.title}</h2>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground">
                    {rule.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-16 sm:px-6 md:px-8 md:py-24">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 border border-primary/30 bg-primary/5 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-primary">
                Vérifier par vous-même
              </p>
              <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">
                Le pré-audit public est une preuve vivante du moteur.
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
                Entrez une URL publique : Novekia Visibility restitue uniquement les
                contrôles qu’il peut établir sur son périmètre public, avec score et couverture séparés.
              </p>
            </div>
            <PrimaryButton href="/audit" withArrow>
              Lancer un pré-audit
            </PrimaryButton>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
