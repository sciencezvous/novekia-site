import type { Metadata } from 'next'
import { AlertTriangle, Check, CloudCog, ServerCog } from 'lucide-react'
import { NewsArticleLayout } from '@/components/news/news-article-layout'
import { SourceList } from '@/components/resources/source-list'
import { getAiNewsArticle } from '@/lib/ai-news'
import { siteConfig } from '@/lib/site-config'

const article = getAiNewsArticle(
  'mistral-workflows-orchestration-ia-entreprise',
)!

export const metadata: Metadata = {
  title: article.title,
  description: article.description,
  alternates: { canonical: `/actualites-ia/${article.slug}` },
  openGraph: {
    type: 'article',
    locale: 'fr_FR',
    url: `${siteConfig.url}/actualites-ia/${article.slug}`,
    title: article.title,
    description: article.description,
    publishedTime: article.publishedAt,
    modifiedTime: article.modifiedAt,
    authors: ['Andy Legrand'],
    section: article.category,
    images: ['/og.png'],
  },
}

const tableOfContents = [
  { id: 'annonce', label: 'Ce que Mistral a annoncé' },
  { id: 'architecture', label: 'Une architecture hybride' },
  { id: 'valeur', label: 'Le problème réellement traité' },
  { id: 'limites', label: 'Ce que Workflows ne résout pas' },
  { id: 'decision', label: 'Quand l’étudier' },
  { id: 'questions', label: 'Questions avant production' },
  { id: 'sources', label: 'Sources' },
]

const productionQuestions = [
  'Quelles données, métadonnées et traces quittent réellement notre périmètre ?',
  'Que se passe-t-il si le plan de contrôle devient temporairement indisponible ?',
  'Comment les identités, secrets et droits sont-ils propagés jusqu’aux outils appelés ?',
  'Peut-on remplacer un modèle, un connecteur ou l’orchestrateur sans réécrire le processus ?',
  'Quelle preuve conserve-t-on pour expliquer une décision ou une validation humaine ?',
  'Quel est le plan de reprise, de réversibilité et d’exploitation en dehors de l’équipe projet ?',
] as const

export default function MistralWorkflowsAnalysisPage() {
  return (
    <NewsArticleLayout article={article} tableOfContents={tableOfContents}>
      <section id="annonce" className="scroll-mt-24">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
          Les faits publiés
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em]">
          Mistral déplace le débat du modèle vers l’exécution.
        </h2>
        <p className="mt-5 leading-7 text-muted-foreground">
          Le 27 avril 2026, Mistral AI a présenté Workflows en préversion
          publique comme une couche d’orchestration pour les processus IA en
          entreprise. Le produit vise les enchaînements qui doivent reprendre
          après une erreur, attendre une validation humaine, conserver leur état
          et rendre chaque étape observable.
        </p>
        <p className="mt-5 leading-7 text-muted-foreground">
          Selon l’annonce de Mistral, les workflows sont écrits en Python, suivis
          dans Studio et peuvent être déclenchés depuis Le Chat. Le SDK prend en
          charge des mécanismes comme les reprises, délais, limites de débit,
          traces et pauses pour validation humaine. Ces éléments sont des
          déclarations de l’éditeur ; ils devront être vérifiés sur un cas réel
          avant toute conclusion de performance ou de fiabilité.
        </p>
      </section>

      <section id="architecture" className="scroll-mt-24">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
          Lecture d’architecture
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em]">
          Hybride ne signifie pas entièrement local.
        </h2>
        <p className="mt-5 leading-7 text-muted-foreground">
          L’architecture décrite sépare le plan de contrôle du plan de données.
          Mistral héberge Studio, l’API Workflows et le cluster Temporal. Le
          client déploie des workers dans son propre environnement Kubernetes,
          sur site, dans son cloud ou dans une architecture hybride. Les workers
          exécutent la logique métier et traitent les données au plus près des
          systèmes internes.
        </p>

        <div className="mt-8 grid gap-px bg-border md:grid-cols-2">
          <article className="bg-background p-6 sm:p-8">
            <CloudCog aria-hidden="true" className="size-7 text-primary" />
            <p className="mt-6 font-mono text-xs uppercase tracking-[0.16em] text-primary">
              Plan de contrôle · Mistral
            </p>
            <h3 className="mt-3 text-xl font-semibold">Piloter et observer</h3>
            <ul className="mt-5 space-y-3 text-sm leading-6 text-muted-foreground">
              <li>Studio et historique d’exécution</li>
              <li>API Workflows et orchestration Temporal</li>
              <li>Déclenchement et gestion des processus</li>
            </ul>
          </article>
          <article className="bg-background p-6 sm:p-8">
            <ServerCog aria-hidden="true" className="size-7 text-primary" />
            <p className="mt-6 font-mono text-xs uppercase tracking-[0.16em] text-primary">
              Plan de données · Client
            </p>
            <h3 className="mt-3 text-xl font-semibold">Exécuter au plus près</h3>
            <ul className="mt-5 space-y-3 text-sm leading-6 text-muted-foreground">
              <li>Workers déployés sur Kubernetes</li>
              <li>Données et logique métier dans le périmètre client</li>
              <li>Connexion aux API, outils et systèmes internes</li>
            </ul>
          </article>
        </div>

        <div className="mt-7 border-l-2 border-l-primary bg-card p-6">
          <p className="font-semibold">L’analyse Novekia</p>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            Cette séparation peut limiter la circulation des données métier,
            mais elle ne rend pas le système autonome vis-à-vis de Mistral. Il
            faut documenter précisément les flux de contrôle, les traces, les
            identifiants et le comportement en cas de perte de connexion. Une
            exigence d’exploitation totalement hors ligne appellerait une autre
            architecture.
          </p>
        </div>
      </section>

      <section id="valeur" className="scroll-mt-24">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
          Valeur opérationnelle
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em]">
          La vraie difficulté commence après la démonstration.
        </h2>
        <p className="mt-5 leading-7 text-muted-foreground">
          Un prototype peut appeler un modèle et produire une réponse convaincante.
          Un processus métier doit aussi survivre aux indisponibilités, éviter
          les doubles traitements, attendre une décision humaine, gérer ses
          délais et expliquer son état plusieurs semaines plus tard. C’est cette
          couche d’exploitation que Workflows cherche à industrialiser.
        </p>
        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          {[
            {
              title: 'Reprise contrôlée',
              text: 'Un incident ne doit pas obliger à recommencer aveuglément tout le processus.',
            },
            {
              title: 'Validation humaine',
              text: 'Une étape sensible peut être suspendue jusqu’à une décision explicite.',
            },
            {
              title: 'Traçabilité',
              text: 'Les branches, reprises et changements d’état doivent rester consultables.',
            },
            {
              title: 'Responsabilité',
              text: 'Le workflow formalise où intervient le modèle et où demeure la décision humaine.',
            },
          ].map((item) => (
            <article key={item.title} className="border border-border bg-card p-5">
              <h3 className="font-semibold text-primary">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {item.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section id="limites" className="scroll-mt-24">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
          Limites à conserver
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em]">
          L’orchestrateur ne sécurise pas le métier à votre place.
        </h2>
        <div className="mt-7 border border-border bg-card p-6 sm:p-8">
          <AlertTriangle aria-hidden="true" className="size-6 text-primary" />
          <ul className="mt-5 grid gap-4 sm:grid-cols-2">
            {[
              'Il ne définit pas quelles données peuvent être utilisées par le modèle.',
              'Il ne prouve pas la qualité ou la justesse des décisions générées.',
              'Il ne remplace pas les contrôles d’accès des systèmes connectés.',
              'Il ne supprime pas la dépendance au plan de contrôle hébergé.',
              'Il ne fournit pas automatiquement un plan de réversibilité métier.',
              'Il ne transforme pas un processus mal défini en bon cas d’usage IA.',
            ].map((limit) => (
              <li key={limit} className="flex gap-3 text-sm leading-6">
                <span
                  aria-hidden="true"
                  className="mt-2 size-1.5 shrink-0 bg-primary"
                />
                {limit}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="decision" className="scroll-mt-24">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
          Critères de décision
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em]">
          Quand Workflows mérite une étude sérieuse.
        </h2>
        <div className="mt-7 divide-y divide-border border-y border-border">
          {[
            'Le processus comporte plusieurs étapes et peut durer longtemps.',
            'Une validation humaine doit suspendre puis reprendre l’exécution.',
            'Les erreurs, reprises et décisions doivent être auditables.',
            'Les données doivent être traitées dans un environnement client maîtrisé.',
            'L’entreprise possède déjà Kubernetes ou accepte d’en assumer l’exploitation.',
            'Le gain métier justifie une dépendance à une couche d’orchestration dédiée.',
          ].map((criterion) => (
            <div key={criterion} className="flex items-start gap-4 py-4">
              <Check
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-primary"
              />
              <p className="text-sm leading-6">{criterion}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 leading-7 text-muted-foreground">
          À l’inverse, un simple appel ponctuel à un modèle, sans état durable ni
          validation complexe, ne justifie probablement pas cette couche
          supplémentaire. Pour une PME sans plateforme Kubernetes existante, le
          coût d’exploitation doit être évalué avant la richesse fonctionnelle.
        </p>
      </section>

      <section id="questions" className="scroll-mt-24">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
          Cadrage préalable
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em]">
          Six questions à poser avant une mise en production.
        </h2>
        <ol className="mt-7 grid gap-px bg-border sm:grid-cols-2">
          {productionQuestions.map((question, index) => (
            <li key={question} className="bg-background p-6">
              <span className="font-mono text-xs text-primary">
                {String(index + 1).padStart(2, '0')}
              </span>
              <p className="mt-4 text-sm font-medium leading-7">{question}</p>
            </li>
          ))}
        </ol>
      </section>

      <SourceList
        sources={[
          {
            publisher: 'Mistral AI',
            label: 'Workflows for work that runs the business',
            href: 'https://mistral.ai/news/workflows/',
            note:
              'Annonce officielle du 27 avril 2026 : fonctionnalités, cas d’usage et séparation du plan de contrôle et du plan de données.',
          },
          {
            publisher: 'Kubernetes',
            label: 'Overview — Kubernetes documentation',
            href: 'https://kubernetes.io/docs/concepts/overview/',
            note:
              'Documentation officielle sur l’exploitation, la résilience et les limites de Kubernetes.',
          },
        ]}
      />
    </NewsArticleLayout>
  )
}
