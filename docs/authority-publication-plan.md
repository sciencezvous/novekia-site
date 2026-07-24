# Plan d’autorité technique Novekia

## Principe

L’autorité doit venir de démonstrations reproductibles, de sources primaires et
de retours d’expérience autorisés. Aucun chiffre client, partenaire, profil
social ou résultat de benchmark ne doit être publié sans preuve vérifiable.

## Actifs déjà disponibles

- page pilier sur l’intelligence artificielle locale ;
- guide IA locale, API cloud et architecture hybride ;
- guide d’architecture RAG local ;
- guide de dimensionnement d’une station ou d’un serveur GPU ;
- calculateur transparent de mémoire de planification ;
- checklist de cadrage web et PDF.

## Séquence de publication

### 1. LinkedIn

Pour chaque guide :

1. publier une décision difficile plutôt qu’un résumé promotionnel ;
2. montrer un extrait concret : matrice, schéma ou formule ;
3. citer la source primaire ;
4. renvoyer vers la page précise, avec des UTM cohérentes ;
5. répondre aux objections avec un exemple technique.

Convention recommandée :

```text
utm_source=linkedin
utm_medium=organic
utm_campaign=ia_locale_authority
utm_content=<slug-du-contenu>
```

Le lien public du profil doit être confirmé par Andy Legrand avant d’être ajouté
au schéma `sameAs` du site.

### 2. GitHub

Publier seulement des démonstrations dont les données, licences et secrets sont
maîtrisés :

- jeu d’évaluation RAG synthétique ;
- script reproductible de mesure mémoire et latence ;
- exemple d’architecture avec configuration minimale ;
- résultats accompagnés du modèle, du runtime, du matériel et de la charge.

Chaque dépôt doit contenir :

- objectif et limites ;
- procédure de reproduction ;
- versions des dépendances ;
- licence ;
- résultats bruts ;
- date du test.

Le compte ou l’organisation GitHub doit être confirmé avant tout lien depuis le
site.

### 3. Partenaires

Privilégier :

- une note technique co-signée ;
- une architecture validée par les deux parties ;
- une démonstration commune ;
- un retour d’intégration précis.

Ne pas afficher un logo, une citation ou une relation commerciale sans accord
écrit sur le texte et la durée de publication.

### 4. Retours d’expérience

Un cas public doit distinguer :

- situation initiale ;
- périmètre réellement traité ;
- méthode de mesure ;
- résultat observé ;
- limites et facteurs externes ;
- autorisation de nommer ou anonymiser l’organisation.

Un cas anonymisé ne doit pas comporter de détails permettant de réidentifier le
client.

## Cadence proposée

- semaine 1 : guide IA locale ou API cloud ;
- semaine 2 : schéma RAG et checklist ;
- semaine 3 : calculateur GPU et hypothèses ;
- semaine 4 : retour sur les questions reçues et mise à jour d’un guide ;
- mois 2 : première démonstration GitHub reproductible ;
- mois 3 : premier retour d’expérience autorisé ou benchmark documenté.

## Mesure

Relier chaque publication à :

- clics et pages d’entrée ;
- requêtes Search Console hors marque ;
- téléchargements de la checklist ;
- conversions du formulaire ;
- origine UTM jointe aux demandes.

Le plan de mesure détaillé se trouve dans `docs/seo-measurement-plan.md`.
