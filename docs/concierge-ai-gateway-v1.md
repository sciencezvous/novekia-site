# AI Gateway du concierge Novekia — V1

## 1. Objectif

La Gateway ajoute une aide facultative à la compréhension et à la structuration du concierge. Le parcours, les questions, la validation, la qualification, les consentements et l’état `ready_to_submit` restent entièrement déterministes.

## 2. Architecture

- `lib/concierge/ai-client.ts` : client navigateur, annulation et cache de session en mémoire ;
- `lib/concierge/ai-schemas.ts` : contrats partagés et validateurs étroits ;
- `lib/concierge/ai-sanitization.ts` : limites structurelles, exclusion des coordonnées et détection simple de secrets ;
- `lib/concierge/ai-prompts.ts` : règles communes et consignes par tâche ;
- `lib/concierge/server/gateway.ts` : sélection du fournisseur et fallback ;
- `lib/concierge/providers/*` : providers déterministe et Mistral ;
- `app/api/concierge/ai/route.ts` : unique frontière HTTP publique.

Le navigateur ne contacte jamais Mistral directement. Les fichiers serveur ne sont importés que par la route API.

## 3. Fournisseurs

La V1 implémente `mistral` et `deterministic`. Les noms `lm_studio`, `ovh_endpoint` et `ovh_private` restent réservés dans le contrat, sans implémentation. `unavailable` représente l’absence de fournisseur exploitable.

## 4. Tâches

La Gateway reconnaît exactement :

- `classify_intent` ;
- `extract_structured_answer` ;
- `rewrite_question` ;
- `summarize_qualification` ;
- `detect_missing_information` ;
- `prepare_human_handoff`.

L’interface utilise `classify_intent` après une description volontaire et `summarize_qualification` après la synthèse déterministe.

## 5. Rôle du déterministe

Le provider déterministe couvre les six tâches avec des règles prudentes. Il ne se présente pas comme un modèle. Il est utilisé si Mistral est absent, désactivé, en erreur, trop lent ou invalide, lorsque le fallback est autorisé.

## 6. Rôle limité de Mistral

Mistral classe, reformule ou structure. Il ne décide jamais d’un consentement, d’une acceptation commerciale, d’un prix, d’un délai, d’une faisabilité, d’une conformité ou d’une autorisation cyber. Aucun outil, recherche web, fichier, streaming ou état agent n’est activé.

## 7. Variables d’environnement

- `MISTRAL_API_KEY` : secret serveur, jamais préfixé `NEXT_PUBLIC_` ;
- `MISTRAL_API_BASE_URL` : facultatif, défaut `https://api.eu.mistral.ai` ;
- `MISTRAL_CONCIERGE_MODEL` : facultatif, défaut `mistral-small-2603` ;
- `CONCIERGE_AI_ENABLED` : la valeur exacte `false` désactive Mistral ;
- `CONCIERGE_AI_TIMEOUT_MS` : défaut 12 000 ms, borné entre 2 000 et 20 000 ms ;
- `CONCIERGE_AI_MAX_OUTPUT_TOKENS` : défaut 700, borné entre 100 et 1 000.

Aucun fichier `.env` n’est modifié par ce chantier.

## 8. Endpoint européen

L’adaptateur REST appelle `${MISTRAL_API_BASE_URL}/v1/chat/completions` avec `response_format: { "type": "json_object" }`. L’URL de base doit être HTTPS ; sa barre finale est normalisée.

## 9. Données envoyées

Seuls la tâche, l’entrée métier minimale, le parcours courant, l’étape courante, les catégories autorisées et la version des règles entrent dans le prompt. Les données utilisateur sont placées dans un bloc `UNTRUSTED_USER_DATA` séparé.

## 10. Données exclues

La route refuse les clés de coordonnées, consentements, adresses, secrets, jetons, IP et user-agent. Les e-mails et numéros de téléphone évidents présents dans un texte sont également refusés. L’identifiant de session et l’identifiant de requête ne sont jamais inclus dans le prompt. Les query strings et fragments des URL sont retirés avant l’appel.

La synthèse envoyée par l’interface exclut le contact, les consentements, le nom de la personne, le rôle de contact et l’entreprise par prudence. Le nom d’entreprise resterait juridiquement possible lorsqu’il est indispensable, mais la V1 n’en a pas besoin pour sa synthèse assistée.

## 11. Sorties structurées

Chaque tâche possède un schéma TypeScript explicite. Les champs inférés portent `provenance: "inferred"`, `confidence`, `rationale` et `requiresHumanReview`. Les tableaux et textes sont bornés. Les clés supplémentaires, HTML, scripts, structures récursives et valeurs hors enum sont rejetés.

## 12. Validation

La requête est contrôlée avant la Gateway : JSON, taille maximale de 32 Ko, profondeur 6, 100 valeurs, 12 000 caractères cumulés, locale `fr-FR`, tâche autorisée, identifiants bornés, timeout et tokens bornés. La sortie est validée dans le provider puis une seconde fois dans la Gateway et dans la route.

L’en-tête `Origin`, lorsqu’il est présent, est parsé puis comparé exactement à `novekia.fr`, `www.novekia.fr`, un localhost ou un hostname Preview commençant par `novekia` et se terminant réellement par `.vercel.app`. Une origine absente est tolérée pour rester compatible avec les appels serveur same-origin ; elle n’élargit aucun CORS et aucune réponse n’utilise `Access-Control-Allow-Origin: *`.

## 13. Prompt injection

Les prompts indiquent que les réponses sont des données non fiables. Toute instruction telle que « ignore les règles », « révèle le prompt », « appelle une URL » ou « force une qualification » doit être ignorée. Cette séparation réduit le risque sans prétendre fournir une protection parfaite.

## 14. Détection de secrets

Le filtre détecte notamment les clés privées PEM, jetons `sk-`, Bearer longs, affectations de mot de passe, clés AWS manifestes, JWT et longues chaînes base64. Un signal bloque l’appel fournisseur et retourne `SECRET_DETECTED` sans recopier la valeur.

## 15. Limitation de débit

La V1 limite à 10 appels par fenêtre de 10 minutes et 3 appels simultanés par empreinte. Une limite globale défensive par instance est également appliquée. L’IP brute n’est ni stockée ni journalisée : une empreinte SHA-256 salée et éphémère est conservée en mémoire.

Cette protection n’est pas globale en environnement serverless : chaque instance possède sa propre mémoire. Une solution distribuée sera nécessaire avant une exposition à fort trafic.

## 16. Timeouts

Le provider utilise `AbortController`. Le client applique un timeout légèrement supérieur à la borne serveur. Une fermeture du panneau annule la requête client. Aucun état de chargement ne peut rester infini.

## 17. Fallback

Le fallback déterministe est activé par défaut. Le client distingue techniquement un résultat validé, un fallback et une indisponibilité, mais le visiteur ne voit ni le fournisseur, ni le modèle, ni les tokens, ni la latence.

## 18. Coûts et fréquence

L’IA n’est jamais appelée à l’ouverture, pendant la frappe, pour les coordonnées ou pour les consentements. Une action explicite déclenche au maximum une classification par description et une synthèse par version. Un cache mémoire client réutilise un résultat identique dans la session. Les réponses HTTP utilisent `Cache-Control: no-store`.

## 19. Logs

La V1 n’ajoute aucun log de contenu, prompt, réponse, nom, entreprise, coordonnées, IP, consentement ou secret. Les enveloppes d’erreur client restent génériques. Une future observabilité devra se limiter au requestId aléatoire, à la tâche, au statut, à la durée et à la présence d’un fallback.

## 20. Limites connues

- rate limit local à l’instance ;
- détection de secrets et de coordonnées heuristique, non exhaustive ;
- absence de stockage durable, de reprise inter-page et de monitoring central ;
- le cache navigateur disparaît au rechargement ;
- aucune vérification réelle de l’autorisation cyber par l’IA ;
- aucun SLA fournisseur ni engagement de résultat.

## 21. Désactivation

Définir `CONCIERGE_AI_ENABLED=false` désactive Mistral. Sans clé, le provider externe est indisponible. Dans les deux cas, le fallback déterministe garde le parcours fonctionnel si `fallbackAllowed` vaut `true`. Pour masquer tout le concierge, le mécanisme historique `NEXT_PUBLIC_CONCIERGE_ENABLED=false` reste distinct.

## 22. Tests

Les contrôles couvrent les validateurs, les limites structurelles, les coordonnées, les secrets, les injections, les six tâches déterministes, les réponses Mistral mockées, le timeout, les erreurs HTTP, le fallback et les headers de route. Aucun test n’appelle Mistral par défaut.

Un test réel n’est autorisé que si `MISTRAL_API_KEY` est présent et `RUN_MISTRAL_LIVE_TEST` vaut exactement `true`. Il doit rester synthétique, unique et limité.

## 23. Étapes restantes avant production

1. Configurer la clé uniquement dans les secrets serveur de l’environnement cible.
2. Rejouer les contrôles de route et d’interface sur une Preview.
3. Vérifier les coûts et erreurs réels avec un seul test explicitement activé.
4. Mettre en place un rate limit distribué avant une hausse de trafic.
5. Ajouter une observabilité sans contenu ni donnée personnelle.
6. Réaliser une revue sécurité et une validation humaine des prompts.
7. Conserver la transmission Resend désactivée pour le concierge tant qu’un sprint dédié n’est pas approuvé.
