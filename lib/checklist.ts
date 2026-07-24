export type ChecklistSection = {
  number: string
  title: string
  objective: string
  items: string[]
}

export const localAiChecklist: ChecklistSection[] = [
  {
    number: '01',
    title: 'Objectif et résultat métier',
    objective:
      'Définir pourquoi le système doit exister et comment sa valeur sera vérifiée.',
    items: [
      'Le problème actuel et ses conséquences sont décrits.',
      'Les utilisateurs et le moment précis d’utilisation sont identifiés.',
      'Le résultat attendu possède au moins un indicateur mesurable.',
      'Les situations où l’IA n’est pas nécessaire sont explicitées.',
    ],
  },
  {
    number: '02',
    title: 'Processus et responsabilités',
    objective:
      'Inscrire l’IA dans un flux de travail réel avec une responsabilité humaine claire.',
    items: [
      'Le processus avant et après l’intervention de l’IA est cartographié.',
      'La personne qui valide, corrige ou refuse le résultat est identifiée.',
      'Les conséquences d’une erreur sont classées.',
      'Une procédure manuelle ou un mode dégradé est prévu.',
    ],
  },
  {
    number: '03',
    title: 'Données et conformité',
    objective:
      'Savoir quelles données peuvent être utilisées, où et par qui.',
    items: [
      'Les données sont inventoriées, classées et rattachées à un propriétaire.',
      'Les données personnelles, sensibles ou contractuellement protégées sont identifiées.',
      'Les durées de conservation et les destinataires sont définis.',
      'Les flux autorisés vers un service externe sont explicitement documentés.',
    ],
  },
  {
    number: '04',
    title: 'Architecture de déploiement',
    objective:
      'Comparer local, cloud et hybride selon le risque plutôt que par principe.',
    items: [
      'Les traitements devant rester locaux sont distingués des autres.',
      'Les dépendances réseau et les besoins hors ligne sont connus.',
      'Les interfaces entre composants privés et externes sont documentées.',
      'La réversibilité et la solution de repli sont prévues.',
    ],
  },
  {
    number: '05',
    title: 'Modèle, RAG et outils',
    objective:
      'Choisir les composants à partir du cas d’usage et des licences.',
    items: [
      'Plusieurs modèles candidats sont comparés sur les mêmes exemples.',
      'La langue, la licence, la précision et le contexte sont vérifiés.',
      'Le RAG n’est retenu que si des sources maintenues existent.',
      'Les actions et outils accessibles au modèle sont limités et contrôlés.',
    ],
  },
  {
    number: '06',
    title: 'Évaluation de la qualité',
    objective:
      'Décider avec un corpus représentatif, des réponses attendues et des cas d’échec.',
    items: [
      'Un jeu de questions réelles et de réponses attendues est constitué.',
      'Les erreurs critiques et les refus attendus sont inclus.',
      'La qualité de la recherche est évaluée séparément de la génération.',
      'Les seuils de go, no-go et régression sont définis.',
    ],
  },
  {
    number: '07',
    title: 'Charge et infrastructure',
    objective:
      'Dimensionner la plateforme selon la charge réelle et le niveau de service.',
    items: [
      'Le modèle, la précision et la longueur de contexte sont fixés pour le test.',
      'La concurrence, la latence et le débit attendus sont estimés.',
      'Mémoire, stockage, réseau, énergie et refroidissement sont pris en compte.',
      'Le matériel est validé par une charge représentative avant achat.',
    ],
  },
  {
    number: '08',
    title: 'Sécurité et accès',
    objective:
      'Traiter l’IA comme un système complet et non comme un simple modèle.',
    items: [
      'Les accès aux données, modèles, interfaces et outils sont authentifiés.',
      'Les secrets et comptes de service sont isolés.',
      'Les injections de consignes et documents malveillants sont testées.',
      'Les journaux utiles à l’audit sont définis et protégés.',
    ],
  },
  {
    number: '09',
    title: 'Exploitation et continuité',
    objective:
      'Prévoir la vie du système après la démonstration.',
    items: [
      'Un responsable du service et une procédure d’escalade sont nommés.',
      'Les mises à jour de modèles et dépendances suivent un processus de validation.',
      'La supervision, la sauvegarde et le retour arrière sont prévus.',
      'Les pannes, saturations et indisponibilités sont testées.',
    ],
  },
  {
    number: '10',
    title: 'Coût complet et décision',
    objective:
      'Comparer les options sur une période et un niveau de service communs.',
    items: [
      'Le coût inclut matériel ou API, intégration, énergie, sécurité et exploitation.',
      'Les hypothèses de charge et d’amortissement sont visibles.',
      'Les risques, dépendances et compétences nécessaires sont chiffrés ou qualifiés.',
      'La décision finale, ses limites et sa date de réévaluation sont documentées.',
    ],
  },
]
