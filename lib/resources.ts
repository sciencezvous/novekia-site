export type ResourceArticle = {
  slug: string
  eyebrow: string
  title: string
  description: string
  directAnswer: string
  readingTime: string
  publishedAt: string
  modifiedAt: string
}

export const resourceArticles: ResourceArticle[] = [
  {
    slug: 'demonstrateur-rag-local',
    eyebrow: 'Preuve technique Novekia',
    title: 'Démonstrateur RAG local : architecture, dimensionnement et recette',
    description:
      'Une preuve de méthode reproductible pour cadrer un assistant documentaire local : hypothèses visibles, calcul mémoire, architecture cible et protocole de recette.',
    directAnswer:
      'Pour un scénario de prototype avec un modèle de 8 milliards de paramètres quantifié en 4 bits et quatre sessions simultanées, le calcul documenté aboutit à une enveloppe de planification de 12,7 Gio. Une carte de 24 Gio constitue donc un point de départ plausible pour mesurer le prototype, mais pas une recommandation d’achat avant benchmark sur le corpus, le moteur d’inférence et la charge réels.',
    readingTime: '8 min',
    publishedAt: '2026-07-25',
    modifiedAt: '2026-07-25',
  },
  {
    slug: 'ia-locale-vs-api-cloud',
    eyebrow: 'Décision d’architecture',
    title: 'IA locale ou API cloud : coûts, confidentialité et exploitation',
    description:
      'Une méthode de décision pour comparer IA locale, API cloud et architecture hybride à partir des données, de la charge, du coût complet et des contraintes d’exploitation.',
    directAnswer:
      'L’IA locale devient pertinente lorsque la maîtrise des données, la continuité de service ou une charge stable justifient l’exploitation d’une infrastructure. Une API cloud reste efficace pour démarrer vite, absorber une charge variable ou accéder à des modèles avancés. Dans de nombreux cas, une architecture hybride documentée offre le meilleur compromis.',
    readingTime: '9 min',
    publishedAt: '2026-07-24',
    modifiedAt: '2026-07-24',
  },
  {
    slug: 'rag-local-entreprise',
    eyebrow: 'Architecture documentaire',
    title: 'RAG local en entreprise : architecture et conditions de réussite',
    description:
      'Comprendre l’architecture d’un RAG local, ses conditions de réussite, son évaluation, ses limites de sécurité et les responsabilités d’exploitation.',
    directAnswer:
      'Un RAG local recherche des passages dans les sources autorisées puis les fournit au modèle comme contexte de réponse. Il ne corrige pas des documents obsolètes, ne remplace pas les droits d’accès et ne garantit pas l’exactitude. Sa réussite dépend d’abord des sources, des permissions, d’un corpus d’évaluation et de citations vérifiables.',
    readingTime: '11 min',
    publishedAt: '2026-07-24',
    modifiedAt: '2026-07-24',
  },
  {
    slug: 'choisir-station-serveur-gpu-ia',
    eyebrow: 'Dimensionnement IA',
    title: 'Choisir une station ou un serveur GPU pour l’IA',
    description:
      'Méthode de dimensionnement d’une station ou d’un serveur GPU à partir du modèle, de la mémoire, du contexte, de la concurrence et des contraintes d’exploitation.',
    directAnswer:
      'Le bon matériel se déduit du modèle réellement évalué, de sa précision, de la longueur de contexte, du nombre de sessions simultanées et du niveau de service attendu. La mémoire nécessaire n’est qu’un premier filtre : débit, refroidissement, alimentation, stockage, réseau, disponibilité et maintenance déterminent ensuite le choix entre station, serveur ou plusieurs nœuds.',
    readingTime: '10 min',
    publishedAt: '2026-07-24',
    modifiedAt: '2026-07-24',
  },
]

export function getResourceArticle(slug: string) {
  return resourceArticles.find((article) => article.slug === slug)
}
