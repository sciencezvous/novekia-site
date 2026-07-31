# Soumission du concierge Novekia — V1

## 1. Architecture

Le navigateur conserve le parcours en mémoire, puis appelle explicitement `POST /api/concierge/submit`. La route valide le corps, rejoue le moteur déterministe, transmet le lead avec Resend et tente ensuite une confirmation visiteur. Aucun stockage durable n’est ajouté.

## 2. Données acceptées

La racine accepte exclusivement `submissionId`, `schemaVersion`, `sessionStartedAt`, `sourcePage`, `attribution`, `activePath`, `answers`, `contact`, `consent`, `assistedSummary`, `honeypot` et `elapsedMs`. Le corps est limité à 64 Ko, sept niveaux, cent réponses et 40 000 caractères cumulés. Les clés inconnues sont refusées.

## 3. Validation serveur

Le serveur normalise les espaces, la casse de l’e-mail, les chemins et l’attribution. Il applique les types, longueurs, formats, enums et règles des parcours. Il refuse les clés de prototype, structures récursives, valeurs non finies, HTML, scripts et contenus anormaux.

## 4. Recalcul déterministe

Une session vierge est créée côté serveur. Le parcours déclaré est sélectionné et chaque réponse accessible est rejouée dans l’ordre du contrat. Les branches sont réévaluées, les réponses inaccessibles sont écartées, puis complétude, qualification, synthèse, revue humaine et état `ready_to_submit` sont recalculés. Les scores, synthèses ou états prétendument calculés par le client ne sont pas acceptés dans le contrat.

## 5. Consentements

Les deux consentements doivent être explicites et non précochés. Les versions attendues sont `contact-consent-2026-07-v1` et `privacy-policy-2026-07-31-v1`. Les dates ISO doivent suivre le démarrage de session et ne pas être anormalement futures.

## 6. Anti-spam

La défense combine un honeypot `website_confirm`, un délai minimal de huit secondes, une limite de débit, des limites structurelles et une inspection prudente du contenu. Aucun motif précis de détection n’est révélé à un robot.

## 7. Détection de secrets

La détection existante du gateway IA est réutilisée et complétée pour les clés privées, clés API, JWT, Bearer tokens, mots de passe préfixés, secrets cloud et longues chaînes base64. Une valeur détectée n’est ni envoyée, ni renvoyée, ni journalisée.

## 8. Rate limit

L’adresse réseau éphémère est hachée en SHA-256 avec un sel en mémoire. La limite est de cinq tentatives par trente minutes et deux requêtes simultanées par empreinte, avec une limite globale de 80 tentatives et 12 requêtes simultanées par instance. Les entrées expirées sont nettoyées périodiquement.

## 9. Idempotence

Le `submissionId` est un UUID conservé lors d’un retry. Une Map mémoire bloque un traitement concurrent ou terminé pendant 24 heures. Les clés Resend stables sont `concierge-internal:<uuid>:v1` et `concierge-confirmation:<uuid>:v1`. Un échec de l’e-mail interne autorise un retry avec la même clé.

## 10. Resend

La V1 réutilise le SDK et les variables du formulaire historique : `RESEND_API_KEY`, `CONTACT_FROM` et `CONTACT_TO`. Aucun second client ou nom de variable concurrent n’est introduit. Un timeout logique de douze secondes encadre chaque appel.

## 11. E-mails

L’e-mail interne est critique et contient uniquement la version serveur du lead, les contrôles internes et les consentements. La section facultative porte le titre « Synthèse assistée — non validée humainement ». La confirmation visiteur est secondaire, sobre et ne contient aucun score interne. Les demandes cyber rappellent l’obligation de vérifier l’autorisation et le périmètre.

## 12. Gestion des erreurs

Les réponses API utilisent des codes stables et des messages génériques. Aucune stack, configuration, adresse interne, erreur brute ou identifiant Resend n’est exposé. Un échec interne retourne une erreur ; un échec de confirmation après réussite interne retourne un succès assorti d’un avertissement et ne demande pas un nouvel envoi.

## 13. Kill switch

`CONCIERGE_SUBMISSION_ENABLED=false` désactive exactement la soumission. Toute autre valeur laisse la fonctionnalité active uniquement si Resend est entièrement configuré. La désactivation n’affecte pas le formulaire historique.

## 14. Confidentialité

L’assistance IA reste facultative. Lorsqu’elle est activée, le gateway peut transmettre à Mistral des informations de qualification sans coordonnées. La soumission finale utilise Resend. Aucune décision entièrement automatisée n’est prise. Une validation juridique humaine reste recommandée avant production.

## 15. Conservation

Il n’existe ni base, ni CRM, ni fichier local de leads. Les demandes vivent dans la boîte e-mail Novekia. Les prospects non clients sont conservés au maximum trois ans après la collecte ou leur dernier contact, avec suppression plus tôt si les données ne sont plus nécessaires. Novekia doit réviser périodiquement la boîte, supprimer ou archiver de façon contrôlée, traiter les demandes d’accès, rectification et effacement, et proscrire toute conservation indéfinie.

## 16. Limites serverless

Le rate limit et l’idempotence sont en mémoire : ils ne sont ni globaux entre instances Vercel, ni durables après redémarrage. La clé d’idempotence Resend constitue une seconde défense contre les doublons d’e-mail, mais une solution distribuée sera nécessaire si le volume augmente.

## 17. Procédure de test

1. Laisser Resend mocké et le test live désactivé.
2. Tester validation, recalcul, branches, secrets, honeypot, limites, idempotence et templates.
3. Tester la route avec des dépendances injectées.
4. Vérifier le parcours clavier, mobile, fermeture/réouverture, double clic et états d’erreur.
5. Exécuter lint, TypeScript, build et `git diff --check`.

## 18. Procédure de désactivation

Définir `CONCIERGE_SUBMISSION_ENABLED` à `false` dans l’environnement ciblé, redéployer cet environnement puis vérifier que l’API retourne `SUBMISSION_DISABLED` et que le formulaire historique fonctionne toujours. Le rollback applicatif reste disponible depuis le déploiement Vercel précédent.

## 19. Variables d’environnement

- `RESEND_API_KEY` : clé serveur existante ;
- `CONTACT_FROM` : expéditeur Resend existant et vérifié ;
- `CONTACT_TO` : destinataire interne existant ;
- `CONCIERGE_SUBMISSION_ENABLED` : kill switch facultatif ;
- `CONCIERGE_AI_ENABLED`, `MISTRAL_API_KEY`, `MISTRAL_API_BASE_URL`, `MISTRAL_CONCIERGE_MODEL` : configuration facultative du gateway IA existant.

Ne jamais committer de valeur réelle. `RUN_RESEND_LIVE_TEST=true` et une adresse synthétique explicitement configurée sont exigés pour tout test live manuel.

## 20. Risques restants

Les limites mémoire ne couvrent pas toutes les instances, l’e-mail n’est pas un système de gestion de dossiers, et la délivrabilité dépend de Resend et du domaine expéditeur. La base juridique, les durées et les contrats de sous-traitance doivent être confirmés humainement. Les tests Preview et le test d’e-mail synthétique contrôlé restent obligatoires avant production.
