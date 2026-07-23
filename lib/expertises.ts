export type ExpertiseIcon =
  | 'software'
  | 'ai'
  | 'infrastructure'
  | 'web'
  | 'search'

export type Expertise = {
  id: string
  title: string
  description: string
  icon: ExpertiseIcon
}

export const expertises: Expertise[] = [
  {
    id: 'solution-logiciels-metiers',
    title: 'Logiciels métiers sur mesure',
    description:
      "Applications internes, plateformes professionnelles, automatisations et outils adaptés aux processus de l'entreprise.",
    icon: 'software',
  },
  {
    id: 'solution-ia-locale',
    title: 'Intelligence artificielle locale',
    description:
      'Déploiement de modèles IA sur infrastructure privée, sans transfert systématique des données vers un fournisseur externe.',
    icon: 'ai',
  },
  {
    id: 'solution-infrastructures-ia',
    title: 'Infrastructures de calcul & serveurs IA',
    description:
      "Conception, intégration et optimisation de stations GPU, serveurs IA, stockage et réseaux, dimensionnés selon les modèles utilisés, les volumes de données, les performances attendues, le budget et les contraintes d'exploitation.",
    icon: 'infrastructure',
  },
  {
    id: 'solution-applications-web',
    title: 'Applications web et intégrations',
    description:
      'Interfaces professionnelles, API, outils collaboratifs, automatisations et connexions avec les systèmes existants.',
    icon: 'web',
  },
  {
    id: 'solution-seo-geo',
    title: 'Création de sites web optimisés SEO & GEO',
    description:
      'Conception de sites web rapides, performants et structurés pour le référencement naturel, Google AI Overviews et les moteurs de recherche générative.',
    icon: 'search',
  },
]
