import type { Metadata } from 'next'
import { CheckSquare2, Printer } from 'lucide-react'
import { Breadcrumbs } from '@/components/brand/breadcrumbs'
import {
  founderIdentityJsonLd,
  JsonLd,
  organizationIdentityJsonLd,
} from '@/components/brand/json-ld'
import { TechnicalLabel } from '@/components/brand/technical-label'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { ChecklistDownload } from '@/components/resources/checklist-download'
import { localAiChecklist } from '@/lib/checklist'
import { siteConfig } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Checklist de cadrage d’un projet d’IA locale',
  description:
    'Checklist Novekia en 10 blocs pour cadrer un projet d’intelligence artificielle locale : objectifs, données, RAG, évaluation, infrastructure, sécurité et exploitation.',
  alternates: { canonical: '/ressources/checklist-cadrage-ia-locale' },
  openGraph: {
    type: 'article',
    locale: 'fr_FR',
    url: `${siteConfig.url}/ressources/checklist-cadrage-ia-locale`,
    title: 'Checklist de cadrage d’un projet d’IA locale — Novekia',
    description:
      'Quarante vérifications pour décider avant le prototype, le modèle ou le matériel.',
    images: ['/og.png'],
  },
}

export default function LocalAiChecklistPage() {
  const url = `${siteConfig.url}/ressources/checklist-cadrage-ia-locale`

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'DigitalDocument',
          '@id': `${url}#document`,
          name: 'Checklist de cadrage d’un projet d’IA locale',
          description: metadata.description,
          inLanguage: 'fr-FR',
          url,
          author: founderIdentityJsonLd,
          publisher: organizationIdentityJsonLd,
          datePublished: '2026-07-24',
          dateModified: '2026-07-24',
          encoding: {
            '@type': 'MediaObject',
            contentUrl: `${siteConfig.url}/ressources/checklist-cadrage-ia-locale.pdf`,
            encodingFormat: 'application/pdf',
          },
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
                { label: 'Checklist de cadrage IA locale' },
              ]}
            />
            <TechnicalLabel index="Outil" className="mt-12">
              Cadrage avant prototype
            </TechnicalLabel>
            <h1 className="mt-6 max-w-4xl text-balance text-4xl font-semibold leading-[1.02] tracking-[-0.05em] sm:text-6xl">
              Checklist de cadrage d’un projet d’IA locale.
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-muted-foreground">
              Quarante points de contrôle pour transformer une idée en décision
              documentée, avant de choisir un modèle, un RAG ou une machine.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ChecklistDownload />
              <a
                href="#checklist"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border px-5 text-sm font-semibold transition-colors hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Printer aria-hidden="true" className="size-4" />
                Lire la version web
              </a>
            </div>
          </div>
        </header>

        <section className="border-b border-border px-5 py-10 sm:px-6 md:px-8">
          <div className="novekia-surface mx-auto grid max-w-5xl gap-6 p-6 sm:grid-cols-3 sm:p-8">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary">
                Usage
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Atelier de cadrage, revue de prototype ou décision
                d’investissement.
              </p>
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary">
                Sortie attendue
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Hypothèses, risques, responsables et critères de go / no-go.
              </p>
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary">
                Principe
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Une case inconnue devient une question à résoudre, pas une
                validation implicite.
              </p>
            </div>
          </div>
        </section>

        <section
          id="checklist"
          className="px-5 py-16 sm:px-6 md:px-8 md:py-24"
        >
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-6 lg:grid-cols-2">
              {localAiChecklist.map((section) => (
                <article
                  key={section.number}
                  className="border border-border bg-card p-6 sm:p-8"
                >
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <p className="font-mono text-xs uppercase tracking-[0.16em] text-primary">
                        {section.number}
                      </p>
                      <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em]">
                        {section.title}
                      </h2>
                    </div>
                    <CheckSquare2
                      aria-hidden="true"
                      className="size-7 shrink-0 text-primary"
                      strokeWidth={1.4}
                    />
                  </div>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground">
                    {section.objective}
                  </p>
                  <ul className="mt-6 divide-y divide-border border-y border-border">
                    {section.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 py-3 text-sm leading-6"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-0.5 size-4 shrink-0 border border-primary/60 bg-background"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>

            <div className="novekia-surface mt-10 p-6 sm:p-8">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
                Décision
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em]">
                Le cadrage est terminé quand les inconnues critiques ont un
                responsable et une méthode de résolution.
              </h2>
              <p className="mt-5 max-w-3xl leading-7 text-muted-foreground">
                La checklist ne remplace ni une analyse juridique ni un audit de
                sécurité. Elle permet d’identifier les sujets qui doivent être
                traités avant la mise en production.
              </p>
              <ChecklistDownload className="mt-7" />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
