# Plan de mesure SEO et acquisition

## Objectif

Relier les performances organiques aux demandes réellement reçues, sans
collecter le contenu du formulaire dans l’outil d’analytics.

## Mesure installée dans le site

- Vercel Web Analytics pour les pages vues agrégées.
- Événement `contact_form_submitted` après une réponse serveur réussie.
- Attribution de première visite conservée pendant la session :
  - chemin de la page d’entrée ;
  - chemin de la page de conversion ;
  - référent limité à l’origine et au chemin, sans paramètres ;
  - paramètres `utm_source`, `utm_medium`, `utm_campaign`, `utm_content` et
    `utm_term` lorsqu’ils existent.
- L’origine est jointe à l’e-mail de contact pour qualifier le prospect.
- Aucun nom, e-mail, téléphone ou texte libre n’est envoyé à Vercel Analytics.

## Mise en service de Google Search Console

1. Ajouter la propriété de domaine `novekia.fr` dans Search Console.
2. Privilégier la validation DNS pour couvrir HTTP, HTTPS, www et sans www.
3. À défaut, renseigner `GOOGLE_SITE_VERIFICATION` dans l’environnement Vercel
   avec le jeton fourni par Google, puis redéployer.
4. Soumettre `https://novekia.fr/sitemap.xml`.
5. Contrôler l’indexation des pages services et ressources.

La validation DNS et l’accès Search Console nécessitent le compte Google et le
gestionnaire DNS du propriétaire ; ils ne peuvent pas être automatisés depuis
le dépôt.

## Tableau de bord mensuel

Suivre séparément :

- clics, impressions, CTR et position par page ;
- requêtes de marque : `novekia`, `andy legrand` et variantes ;
- requêtes hors marque : toutes les autres requêtes ;
- pages d’entrée avant envoi du formulaire ;
- source ou campagne des demandes ;
- passages d’une ressource vers le formulaire.

Dans Search Console, exporter les requêtes puis appliquer une expression
régulière de marque, par exemple :

```text
(?i)novekia|andy[ -]?legrand
```

Le complément constitue le segment hors marque. Le petit volume ou les requêtes
anonymisées par Google doivent être signalés plutôt que reconstitués.

## Revue hebdomadaire

- Vérifier l’indexation et les erreurs d’exploration.
- Repérer les requêtes hors marque avec impressions mais CTR faible.
- Identifier les pages qui génèrent une demande et celles qui assistent le
  parcours.
- Noter les modifications éditoriales afin de comparer des périodes cohérentes.

## Règle de décision

Ne pas fixer un objectif de croissance arbitraire avant quatre à six semaines de
données fiables. La première base de référence doit associer visibilité hors
marque, trafic qualifié et demandes reçues.
