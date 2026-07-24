import type { Metadata } from 'next'
import { AlertTriangle, Check } from 'lucide-react'
import {
  ArchitectureDiagram,
  type ArchitectureLayer,
} from '@/components/brand/architecture-diagram'
import { ArticleLayout } from '@/components/resources/article-layout'
import { SourceList } from '@/components/resources/source-list'
import { getResourceArticle } from '@/lib/resources'
import { siteConfig } from '@/lib/site-config'

const article = getResourceArticle('rag-local-entreprise')!

export const metadata: Metadata = {
  title: article.title,
  description: article.description,
  alternates: { canonical: `/ressources/${article.slug}` },
  openGraph: {
    type: 'article',
    locale: 'fr_FR',
    url: `${siteConfig.url}/ressources/${article.slug}`,
    title: article.title,
    description: article.description,
    publishedTime: article.publishedAt,
    modifiedTime: article.modifiedAt,
    authors: ['Andy Legrand'],
    images: ['/og.png'],
  },
}

const tableOfContents = [
  { id: 'definition', label: 'Ce que fait réellement un RAG' },
  { id: 'architecture', label: 'Architecture de référence' },
  { id: 'conditions', label: 'Conditions de réussite' },
  { id: 'evaluation', label: 'Évaluer avant de déployer' },
  { id: 'limites', label: 'Limites et risques' },
  { id: 'sources', label: 'Sources' },
]

const ragLayers: ArchitectureLayer[] = [
  {
    id: 'sources',
    label: 'Sources et permissions',
    title: 'Documents autorisés et propriétaires identifiés',
    nodes: ['GED', 'procédures', 'bases métier', 'droits d’accès'],
  },
  {
    id: 'ingestion',
    label: 'Ingestion',
    title: 'Extraction, découpage et métadonnées',
    nodes: ['parsing', 'chunks', 'version', 'provenance'],
  },
  {
    id: 'index',
    label: 'Index',
    title: 'Représentation et recherche',
    nodes: ['embeddings', 'index lexical', 'index vectoriel', 'filtres'],
  },
  {
    id: 'retrieval',
    label: 'Retrieval',
    title: 'Sélection du contexte utile',
    nodes: ['requête', 'filtres ACL', 'reclassement', 'passages'],
  },
  {
    id: 'generation',
    label: 'Génération locale',
    title: 'Réponse à partir du contexte',
    nodes: ['LLM', 'instructions', 'citations', 'refus'],
  },
  {
    id: 'control',
    label: 'Contrôle',
    title: 'Validation, journaux et évaluation continue',
    nodes: ['feedback', 'tests', 'monitoring', 'audit'],
  },
]

export default function RagLocalPage() {
  return (
    <ArticleLayout article={article} tableOfContents={tableOfContents}>
      <section id="definition" className="scroll-mt-24">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
          Définition
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em]">
          Le RAG ajoute un contexte, il ne réentraîne pas le modèle.
        </h2>
        <p className="mt-5 leading-7 text-muted-foreground">
          Le Retrieval-Augmented Generation associe une étape de recherche à
          une étape de génération. À chaque question, le système cherche des
          passages pertinents dans un corpus puis les fournit au modèle. Le
          modèle doit répondre à partir de ce contexte et, idéalement, citer les
          sources utilisées.
        </p>
        <div className="mt-7 grid gap-px bg-border md:grid-cols-3">
          {[
            {
              title: 'Rechercher',
              text: 'Identifier les passages autorisés les plus utiles pour la question.',
            },
            {
              title: 'Répondre',
              text: 'Produire une réponse limitée par les instructions et le contexte reçu.',
            },
            {
              title: 'Vérifier',
              text: 'Afficher les références et permettre une validation par l’utilisateur.',
            },
          ].map((item) => (
            <article key={item.title} className="bg-background p-6">
              <h3 className="font-semibold text-primary">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {item.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section id="architecture" className="scroll-mt-24">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
          Architecture
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em]">
          Une chaîne de données et de responsabilités.
        </h2>
        <p className="mt-5 leading-7 text-muted-foreground">
          Un RAG exploitable ne se résume pas à une base vectorielle. Les droits
          d’accès doivent être appliqués avant que le contexte n’arrive au
          modèle ; la provenance et la version des documents doivent rester
          visibles jusqu’à la citation.
        </p>
        <ArchitectureDiagram
          layers={ragLayers}
          className="mt-8"
          caption="Architecture de référence à adapter aux données, aux droits et au niveau de service."
        />
      </section>

      <section id="conditions" className="scroll-mt-24">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
          Prérequis
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em]">
          Six conditions de réussite.
        </h2>
        <div className="mt-7 divide-y divide-border border-y border-border">
          {[
            {
              title: 'Des sources possédées et maintenues',
              text: 'Chaque corpus a un propriétaire, une fréquence de mise à jour et une règle d’archivage.',
            },
            {
              title: 'Des permissions applicables à la recherche',
              text: 'Un utilisateur ne doit jamais récupérer un passage auquel il n’a pas droit, même si le modèle peut techniquement le résumer.',
            },
            {
              title: 'Un découpage adapté au document',
              text: 'La taille des passages, les titres, tableaux et métadonnées sont évalués selon les questions réelles.',
            },
            {
              title: 'Des réponses avec provenance',
              text: 'Les passages cités, leur document et leur version doivent être accessibles depuis la réponse.',
            },
            {
              title: 'Une règle de refus',
              text: 'Le système doit savoir indiquer qu’aucune source suffisante n’a été trouvée.',
            },
            {
              title: 'Une boucle de maintenance',
              text: 'Les erreurs observées alimentent le corpus de test, les réglages de recherche et la gouvernance documentaire.',
            },
          ].map((item) => (
            <article
              key={item.title}
              className="grid gap-3 py-5 md:grid-cols-[14rem_1fr]"
            >
              <h3 className="flex items-start gap-3 font-semibold">
                <Check
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0 text-primary"
                />
                {item.title}
              </h3>
              <p className="text-sm leading-7 text-muted-foreground">
                {item.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section id="evaluation" className="scroll-mt-24">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
          Évaluation
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em]">
          Tester la recherche séparément de la réponse.
        </h2>
        <p className="mt-5 leading-7 text-muted-foreground">
          Une réponse incorrecte peut venir d’un document absent, d’un mauvais
          passage, d’un contexte tronqué ou du modèle. Un jeu d’évaluation doit
          donc conserver la question, la source attendue, les passages
          pertinents et les critères de réponse.
        </p>
        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          {[
            {
              title: 'Recherche',
              text: 'Le bon document et le bon passage apparaissent-ils dans les premiers résultats ?',
            },
            {
              title: 'Fidélité',
              text: 'La réponse est-elle supportée par les passages cités, sans ajout non démontré ?',
            },
            {
              title: 'Complétude',
              text: 'Les éléments indispensables de la réponse attendue sont-ils présents ?',
            },
            {
              title: 'Refus et sécurité',
              text: 'Le système refuse-t-il lorsque la source manque ou que l’utilisateur n’est pas autorisé ?',
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
          Limites
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em]">
          Les risques à traiter explicitement.
        </h2>
        <div className="mt-7 border border-border bg-card p-6 sm:p-8">
          <AlertTriangle aria-hidden="true" className="size-6 text-primary" />
          <ul className="mt-5 grid gap-4 sm:grid-cols-2">
            {[
              'Documents obsolètes ou contradictoires',
              'Fuite de données par des droits mal appliqués',
              'Instructions malveillantes dans les documents',
              'Passages pertinents absents des premiers résultats',
              'Réponse plausible mais non supportée par la source',
              'Coût mémoire et latence d’un contexte trop long',
            ].map((risk) => (
              <li key={risk} className="flex gap-3 text-sm leading-6">
                <span
                  aria-hidden="true"
                  className="mt-2 size-1.5 shrink-0 bg-primary"
                />
                {risk}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <SourceList
        sources={[
          {
            publisher: 'Recherche',
            label:
              'Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks',
            href: 'https://arxiv.org/abs/2005.11401',
            note: 'Publication fondatrice de l’approche RAG.',
          },
          {
            publisher: 'Recherche',
            label:
              'Retrieval-Augmented Generation for Large Language Models: A Survey',
            href: 'https://arxiv.org/abs/2312.10997',
            note: 'Panorama des composants, méthodes d’évaluation et difficultés.',
          },
          {
            publisher: 'ANSSI',
            label:
              'Recommandations de sécurité pour un système d’IA générative',
            href: 'https://messervices.cyber.gouv.fr/guides/recommandations-de-securite-pour-un-systeme-dia-generative',
          },
          {
            publisher: 'CNIL',
            label:
              'Questions-réponses sur l’utilisation d’un système d’IA générative',
            href: 'https://cnil.fr/fr/les-questions-reponses-de-la-cnil-sur-lutilisation-dun-systeme-dia-generative',
          },
        ]}
      />
    </ArticleLayout>
  )
}
