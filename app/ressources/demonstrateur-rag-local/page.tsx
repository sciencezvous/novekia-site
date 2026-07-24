import type { Metadata } from 'next'
import Link from 'next/link'
import {
  AlertTriangle,
  Check,
  Download,
  Equal,
  FlaskConical,
} from 'lucide-react'
import {
  ArchitectureDiagram,
  type ArchitectureLayer,
} from '@/components/brand/architecture-diagram'
import { ArticleLayout } from '@/components/resources/article-layout'
import { SourceList } from '@/components/resources/source-list'
import { getResourceArticle } from '@/lib/resources'
import { siteConfig } from '@/lib/site-config'

const article = getResourceArticle('demonstrateur-rag-local')!

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
  { id: 'statut', label: 'Ce que cette preuve démontre' },
  { id: 'scenario', label: 'Scénario et hypothèses' },
  { id: 'architecture', label: 'Architecture proposée' },
  { id: 'dimensionnement', label: 'Calcul reproductible' },
  { id: 'recette', label: 'Protocole de recette' },
  { id: 'conclusion', label: 'Conclusion et limites' },
  { id: 'sources', label: 'Sources' },
]

const architectureLayers: ArchitectureLayer[] = [
  {
    id: 'identity',
    label: 'Identité et droits',
    title: 'L’autorisation précède la recherche',
    nodes: ['SSO', 'groupes', 'ACL documentaires', 'journal d’accès'],
  },
  {
    id: 'sources',
    label: 'Corpus maîtrisé',
    title: 'Les sources conservent leur propriétaire et leur version',
    nodes: ['procédures', 'GED', 'métadonnées', 'cycle de vie'],
  },
  {
    id: 'retrieval',
    label: 'Recherche hybride',
    title: 'Le contexte est filtré, classé puis transmis',
    nodes: ['index lexical', 'index vectoriel', 'filtres ACL', 'reclassement'],
  },
  {
    id: 'inference',
    label: 'Inférence locale',
    title: 'Le modèle répond avec citations ou refuse',
    nodes: ['LLM 8B 4 bits', 'contexte', 'citations', 'règle de refus'],
  },
  {
    id: 'control',
    label: 'Contrôle',
    title: 'Les résultats alimentent une recette reproductible',
    nodes: ['jeu de 100 questions', 'latence', 'fidélité', 'tests d’accès'],
  },
]

const assumptions = [
  ['Utilisateurs inscrits', '25', 'Le nombre total ne dimensionne pas seul le GPU.'],
  ['Sessions simultanées', '4', 'Hypothèse de pointe à confirmer par observation.'],
  ['Modèle de cadrage', '8B / 4 bits', 'Référence de calcul, pas choix définitif.'],
  ['Réserve par session', '2 Gio', 'Contexte et cache à mesurer avec le moteur retenu.'],
  ['Marge runtime', '25 %', 'Marge explicite pour le premier dimensionnement.'],
]

const acceptanceCriteria = [
  {
    name: 'Recherche',
    target: '≥ 85 %',
    definition: 'La source attendue apparaît dans les cinq premiers passages.',
  },
  {
    name: 'Fidélité',
    target: '≥ 90 %',
    definition: 'Les affirmations évaluées sont supportées par les citations.',
  },
  {
    name: 'Contrôle d’accès',
    target: '100 %',
    definition: 'Les scénarios non autorisés ne révèlent aucun passage restreint.',
  },
  {
    name: 'Refus',
    target: '≥ 95 %',
    definition: 'Le système refuse lorsque la réponse n’existe pas dans le corpus.',
  },
  {
    name: 'Latence',
    target: 'p95 ≤ 8 s',
    definition: 'Seuil proposé pour quatre sessions, à valider avec les utilisateurs.',
  },
]

export default function RagLocalDemonstratorPage() {
  return (
    <ArticleLayout article={article} tableOfContents={tableOfContents}>
      <section id="statut" className="scroll-mt-24">
        <div className="border border-primary/40 bg-primary/5 p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <FlaskConical aria-hidden="true" className="size-6 text-primary" />
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
              Démonstrateur Novekia — données synthétiques
            </p>
          </div>
          <h2 className="mt-5 text-3xl font-semibold tracking-[-0.035em]">
            Une preuve de méthode, pas un faux cas client.
          </h2>
          <p className="mt-5 leading-7 text-muted-foreground">
            Cette page montre comment Novekia transforme un besoin en
            architecture, en calcul vérifiable et en critères de recette. Aucun
            client, résultat de production ou gain commercial n’est revendiqué.
            Les hypothèses sont volontairement visibles pour pouvoir être
            contestées, remplacées et recalculées.
          </p>
        </div>
      </section>

      <section id="scenario" className="scroll-mt-24">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
          Scénario
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em]">
          Un assistant documentaire privé pour une équipe de 25 personnes.
        </h2>
        <p className="mt-5 leading-7 text-muted-foreground">
          Le scénario vise à rechercher dans des procédures internes avec
          citations, permissions documentaires et refus explicite lorsque la
          source manque. Les documents restent sur une infrastructure privée.
          L’objectif du prototype est de mesurer la qualité de recherche et
          l’expérience réelle avant tout achat définitif.
        </p>

        <div className="mt-7 overflow-x-auto border border-border">
          <table className="w-full min-w-[44rem] border-collapse text-left text-sm">
            <caption className="sr-only">
              Hypothèses utilisées pour le démonstrateur RAG local
            </caption>
            <thead className="bg-card font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
              <tr>
                <th className="px-5 py-4 font-medium">Variable</th>
                <th className="px-5 py-4 font-medium">Hypothèse</th>
                <th className="px-5 py-4 font-medium">Interprétation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {assumptions.map(([variable, value, note]) => (
                <tr key={variable}>
                  <th className="px-5 py-4 font-semibold">{variable}</th>
                  <td className="px-5 py-4 font-mono text-primary">{value}</td>
                  <td className="px-5 py-4 text-muted-foreground">{note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="architecture" className="scroll-mt-24">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
          Architecture
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em]">
          Les droits, les sources et l’évaluation font partie du système.
        </h2>
        <p className="mt-5 leading-7 text-muted-foreground">
          La pile ne commence pas par le modèle. Elle commence par l’identité,
          les permissions et la propriété des documents. La génération arrive
          après la recherche filtrée et reste observable par ses citations et
          ses journaux.
        </p>
        <ArchitectureDiagram
          layers={architectureLayers}
          className="mt-8"
          caption="Architecture de démonstration à adapter au système d’identité, au corpus et aux exigences d’exploitation."
        />
      </section>

      <section id="dimensionnement" className="scroll-mt-24">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
          Dimensionnement
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em]">
          Une enveloppe de 12,7 Gio, calculée étape par étape.
        </h2>
        <p className="mt-5 leading-7 text-muted-foreground">
          Le calcul utilise des gibioctets (Gio) et sépare les poids du modèle,
          la marge d’exécution et la réserve liée aux sessions. Il reprend la
          même méthode que le calculateur public Novekia.
        </p>

        <div className="mt-8 grid gap-px bg-border md:grid-cols-3">
          {[
            {
              label: 'Poids seuls',
              value: '3,7 Gio',
              formula: '8 × 10⁹ × 4/8 ÷ 1024³',
            },
            {
              label: 'Avec marge runtime',
              value: '4,7 Gio',
              formula: '3,7 × 1,25',
            },
            {
              label: 'Avec quatre sessions',
              value: '12,7 Gio',
              formula: '4,7 + (2 × 4)',
            },
          ].map((step) => (
            <article key={step.label} className="bg-background p-6">
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                {step.label}
              </p>
              <p className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-primary">
                {step.value}
              </p>
              <p className="mt-4 font-mono text-xs text-muted-foreground">
                {step.formula}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-6 flex items-start gap-4 border border-border bg-card p-6">
          <Equal
            aria-hidden="true"
            className="mt-1 size-5 shrink-0 text-primary"
          />
          <div>
            <h3 className="font-semibold">
              Décision de cadrage : tester dans une enveloppe de 24 Gio.
            </h3>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              Cette enveloppe laisse une marge au prototype, mais ne prouve ni
              le débit, ni la latence, ni la qualité du modèle. Le cache KV, le
              moteur d’inférence, la longueur de contexte et la quantification
              réelle doivent être mesurés avant achat ou mise en production.
            </p>
          </div>
        </div>
      </section>

      <section id="recette" className="scroll-mt-24">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
          Recette
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em]">
          Cent questions avant une conclusion.
        </h2>
        <p className="mt-5 leading-7 text-muted-foreground">
          Les seuils ci-dessous sont des objectifs de démonstration proposés,
          pas des résultats obtenus. Ils doivent être validés avec le métier,
          puis mesurés sur des questions, documents et profils d’accès
          représentatifs.
        </p>

        <div className="mt-7 divide-y divide-border border-y border-border">
          {acceptanceCriteria.map((criterion) => (
            <article
              key={criterion.name}
              className="grid gap-3 py-5 sm:grid-cols-[10rem_7rem_1fr] sm:items-start"
            >
              <h3 className="flex items-center gap-3 font-semibold">
                <Check
                  aria-hidden="true"
                  className="size-4 shrink-0 text-primary"
                />
                {criterion.name}
              </h3>
              <p className="font-mono text-sm font-semibold text-primary">
                {criterion.target}
              </p>
              <p className="text-sm leading-7 text-muted-foreground">
                {criterion.definition}
              </p>
            </article>
          ))}
        </div>

        <Link
          href="/ressources/modele-recette-rag-local.csv"
          download
          className="mt-7 inline-flex min-h-11 items-center gap-3 border border-border bg-card px-5 text-sm font-semibold transition-colors hover:border-primary/60 hover:text-primary"
        >
          <Download aria-hidden="true" className="size-4" />
          Télécharger le modèle de recette CSV
        </Link>
      </section>

      <section id="conclusion" className="scroll-mt-24">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
          Conclusion
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em]">
          Ce qui est démontré — et ce qui reste à mesurer.
        </h2>
        <div className="mt-7 grid gap-px bg-border md:grid-cols-2">
          <article className="bg-background p-6">
            <h3 className="font-semibold text-primary">Démontré</h3>
            <ul className="mt-5 space-y-3 text-sm leading-6">
              {[
                'Une architecture cohérente avec des permissions documentaires.',
                'Un calcul mémoire transparent et reproductible.',
                'Un protocole de recette couvrant qualité, refus et sécurité.',
                'Une décision de prototype séparée d’une décision d’achat.',
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <Check
                    aria-hidden="true"
                    className="mt-0.5 size-4 shrink-0 text-primary"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </article>
          <article className="bg-card p-6">
            <h3 className="flex items-center gap-3 font-semibold">
              <AlertTriangle
                aria-hidden="true"
                className="size-5 text-primary"
              />
              À mesurer sur le terrain
            </h3>
            <ul className="mt-5 space-y-3 text-sm leading-6 text-muted-foreground">
              {[
                'Qualité du modèle sur le vocabulaire réel.',
                'Rappel de la recherche sur le corpus réel.',
                'Latence et débit avec le moteur retenu.',
                'Consommation, disponibilité et charge d’exploitation.',
              ].map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
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
