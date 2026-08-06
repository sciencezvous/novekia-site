import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight,
  Check,
  FileCheck2,
  FlaskConical,
  Newspaper,
  ShieldCheck,
} from 'lucide-react'
import { Breadcrumbs } from '@/components/brand/breadcrumbs'
import { JsonLd } from '@/components/brand/json-ld'
import { PrimaryButton } from '@/components/brand/primary-button'
import { TechnicalLabel } from '@/components/brand/technical-label'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { ResourceCard } from '@/components/resources/resource-card'
import { aiNewsArticles } from '@/lib/ai-news'
import { resourceArticles } from '@/lib/resources'
import { siteConfig } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Ressources sur l’IA locale, le RAG et les serveurs GPU',
  description:
    'Guides techniques Novekia pour décider entre IA locale et cloud, réussir un RAG privé et dimensionner une station ou un serveur GPU.',
  alternates: { canonical: '/ressources' },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: `${siteConfig.url}/ressources`,
    title: 'Ressources IA locale et infrastructures — Novekia',
    description:
      'Des guides sourcés, schémas et outils de cadrage pour les projets d’IA locale en entreprise.',
    images: ['/og.png'],
  },
}

const proofPrinciples = [
  {
    title: 'Montrer le raisonnement',
    description:
      'Les formules, hypothèses et critères restent visibles afin qu’une décision puisse être discutée et reproduite.',
  },
  {
    title: 'Citer la source primaire',
    description:
      'Les recommandations renvoient d’abord aux organismes publics, publications de recherche et documentations techniques.',
  },
  {
    title: 'Séparer mesure et promesse',
    description:
      'Une estimation est présentée comme telle. Un résultat client ou un benchmark ne sera publié qu’avec un protocole et des données réelles.',
  },
]

export default function ResourcesPage() {
  const url = `${siteConfig.url}/ressources`
  const latestNews = aiNewsArticles[0]

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          '@id': `${url}#webpage`,
          url,
          name: 'Ressources Novekia sur l’IA locale',
          description: metadata.description,
          inLanguage: 'fr-FR',
          isPartOf: { '@id': `${siteConfig.url}/#website` },
          about: { '@id': `${siteConfig.url}/#organization` },
          hasPart: resourceArticles.map((article) => ({
            '@type': 'Article',
            headline: article.title,
            url: `${url}/${article.slug}`,
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
              items={[{ label: 'Accueil', href: '/' }, { label: 'Ressources' }]}
            />
            <div className="mt-12 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-20">
              <div>
                <TechnicalLabel index="01">Centre de ressources</TechnicalLabel>
                <h1 className="mt-6 max-w-5xl text-balance text-5xl font-semibold leading-[0.96] tracking-[-0.05em] sm:text-7xl">
                  Décider avec des
                  <br />
                  <span className="text-primary">preuves vérifiables.</span>
                </h1>
              </div>
              <p className="max-w-xl text-lg leading-8 text-muted-foreground">
                Des réponses orientées décision, des architectures types, des
                limites explicites et des outils transparents pour cadrer un
                projet d’IA locale avant de choisir un modèle ou une machine.
              </p>
            </div>
          </div>
        </section>

        <section className="border-b border-border px-5 py-16 sm:px-6 md:px-8 md:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-center lg:gap-20">
            <div>
              <TechnicalLabel index="02">Actualités & analyses IA</TechnicalLabel>
              <Newspaper
                aria-hidden="true"
                className="mt-8 size-12 text-primary"
                strokeWidth={1.4}
              />
              <h2 className="mt-5 text-balance text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
                La nouveauté, sans l’effet d’annonce.
              </h2>
              <p className="mt-5 leading-7 text-muted-foreground">
                Une veille sélective qui distingue les faits publiés, l’analyse
                Novekia et les décisions d’architecture à prendre.
              </p>
              <PrimaryButton href="/actualites-ia" withArrow className="mt-7">
                Voir les analyses IA
              </PrimaryButton>
            </div>

            <Link
              href={`/actualites-ia/${latestNews.slug}`}
              className="group border border-border bg-card p-6 transition-colors hover:border-primary/60 sm:p-8"
            >
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-primary">
                Dernière analyse · {latestNews.category}
              </p>
              <h3 className="mt-5 text-balance text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
                {latestNews.title}
              </h3>
              <p className="mt-4 leading-7 text-muted-foreground">
                {latestNews.description}
              </p>
              <span className="mt-7 flex items-center justify-between gap-4 border-t border-border pt-5 font-semibold text-primary">
                Lire l’analyse
                <ArrowRight
                  aria-hidden="true"
                  className="size-5 transition-transform group-hover:translate-x-1"
                />
              </span>
            </Link>
          </div>
        </section>

        <section className="border-b border-border px-5 py-16 sm:px-6 md:px-8 md:py-24">
          <div className="mx-auto max-w-7xl">
            <TechnicalLabel index="03">Guides prioritaires</TechnicalLabel>
            <div className="mt-8 grid gap-px bg-border md:grid-cols-2">
              {resourceArticles.map((article) => (
                <div key={article.slug} className="relative">
                  <ResourceCard article={article} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-border px-5 py-16 sm:px-6 md:px-8 md:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
            <div>
              <TechnicalLabel index="04">Preuve publiée</TechnicalLabel>
              <ShieldCheck
                aria-hidden="true"
                className="mt-8 size-12 text-primary"
                strokeWidth={1.4}
              />
              <h2 className="mt-5 text-balance text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
                Une conclusion que vous pouvez recalculer.
              </h2>
              <p className="mt-5 leading-7 text-muted-foreground">
                Le démonstrateur RAG expose son scénario, sa formule de mémoire,
                ses limites et son protocole de recette. Il ne se présente ni
                comme un projet client ni comme un benchmark matériel.
              </p>
              <PrimaryButton
                href="/ressources/demonstrateur-rag-local"
                withArrow
                className="mt-7"
              >
                Examiner la démonstration
              </PrimaryButton>
            </div>

            <div className="grid gap-px bg-border sm:grid-cols-3">
              {[
                {
                  value: '12,7 Gio',
                  label: 'enveloppe calculée',
                  detail: 'Formule et hypothèses visibles.',
                },
                {
                  value: '4 sessions',
                  label: 'charge de cadrage',
                  detail: 'À confirmer par mesure réelle.',
                },
                {
                  value: '100 questions',
                  label: 'jeu de recette proposé',
                  detail: 'Recherche, fidélité et refus.',
                },
              ].map((item) => (
                <article key={item.label} className="min-h-56 bg-background p-6">
                  <p className="font-mono text-2xl font-semibold text-primary">
                    {item.value}
                  </p>
                  <h3 className="mt-4 font-semibold">{item.label}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {item.detail}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden border-b border-border px-5 py-16 sm:px-6 md:px-8 md:py-24">
          <div
            aria-hidden="true"
            className="technical-grid-pattern absolute inset-0 opacity-15"
          />
          <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-center lg:gap-20">
            <div>
              <TechnicalLabel index="05">Outil de cadrage</TechnicalLabel>
              <FileCheck2
                aria-hidden="true"
                className="mt-8 size-12 text-primary"
                strokeWidth={1.4}
              />
              <h2 className="mt-5 text-balance text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
                Checklist d’un projet d’IA locale.
              </h2>
              <p className="mt-5 leading-7 text-muted-foreground">
                Dix blocs à vérifier : objectif, données, utilisateurs,
                évaluation, architecture, sécurité, exploitation, coût complet
                et critères de décision.
              </p>
              <PrimaryButton
                href="/ressources/checklist-cadrage-ia-locale"
                withArrow
                className="mt-7"
              >
                Ouvrir la checklist
              </PrimaryButton>
            </div>

            <div className="novekia-surface p-6 sm:p-8">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
                Avant le prototype
              </p>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                {[
                  'Résultat métier mesurable',
                  'Données et accès autorisés',
                  'Jeu d’évaluation représentatif',
                  'Architecture locale, cloud ou hybride',
                  'Charge, latence et concurrence',
                  'Responsable de l’exploitation',
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 border border-border bg-background/60 p-4 text-sm leading-6"
                  >
                    <Check
                      aria-hidden="true"
                      className="mt-0.5 size-4 shrink-0 text-primary"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="px-5 py-16 sm:px-6 md:px-8 md:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
              <div>
                <TechnicalLabel index="06">Méthode de preuve</TechnicalLabel>
                <FlaskConical
                  aria-hidden="true"
                  className="mt-8 size-12 text-primary"
                  strokeWidth={1.4}
                />
                <h2 className="mt-5 text-balance text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
                  L’autorité se construit par la démonstration.
                </h2>
              </div>
              <div className="grid gap-px bg-border md:grid-cols-3">
                {proofPrinciples.map((principle) => (
                  <article
                    key={principle.title}
                    className="min-h-64 bg-background p-6"
                  >
                    <h3 className="text-lg font-semibold tracking-tight">
                      {principle.title}
                    </h3>
                    <p className="mt-4 text-sm leading-7 text-muted-foreground">
                      {principle.description}
                    </p>
                  </article>
                ))}
              </div>
            </div>

            <Link
              href="/intelligence-artificielle-locale"
              className="mt-12 flex items-center justify-between gap-6 border-y border-border py-6 text-lg font-semibold transition-colors hover:text-primary"
            >
              Voir l’expertise Intelligence artificielle locale
              <ArrowRight aria-hidden="true" className="size-5 shrink-0" />
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
