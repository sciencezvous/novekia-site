export type AiNewsArticle = {
  slug: string
  category: string
  title: string
  description: string
  directAnswer: string
  readingTime: string
  publishedAt: string
  modifiedAt: string
  sourcePublishedAt: string
}

export const aiNewsArticles: AiNewsArticle[] = [
  {
    slug: 'mistral-workflows-orchestration-ia-entreprise',
    category: 'Orchestration IA',
    title:
      'Mistral Workflows : ce que l’orchestration IA change vraiment pour l’entreprise',
    description:
      'Analyse Novekia de Mistral Workflows : architecture hybride, exécution durable, contrôle humain et questions à trancher avant une mise en production.',
    directAnswer:
      'Mistral Workflows traite un problème plus opérationnel que le choix du modèle : faire durer, tracer et reprendre un processus IA composé de plusieurs étapes. Son architecture annoncée reste hybride — le plan de contrôle est hébergé par Mistral tandis que les workers et le traitement des données peuvent fonctionner dans l’environnement du client. Ce n’est donc ni une IA entièrement locale, ni une réponse automatique aux exigences de sécurité et d’exploitation.',
    readingTime: '9 min',
    publishedAt: '2026-08-06',
    modifiedAt: '2026-08-06',
    sourcePublishedAt: '2026-04-27',
  },
]

export function getAiNewsArticle(slug: string) {
  return aiNewsArticles.find((article) => article.slug === slug)
}
