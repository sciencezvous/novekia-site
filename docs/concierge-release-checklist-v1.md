# Checklist de release — Concierge V1

## Configuration

- [ ] `RESEND_API_KEY` est présent dans Preview puis Production.
- [ ] Le domaine Resend est vérifié.
- [ ] `CONTACT_FROM` correspond à l’expéditeur vérifié existant.
- [ ] `CONTACT_TO` correspond au destinataire interne attendu.
- [ ] `CONCIERGE_SUBMISSION_ENABLED` est absent ou différent de `false` pour activer.
- [ ] Le kill switch a été testé avec la valeur exacte `false`.
- [ ] `CONCIERGE_AI_ENABLED` et les variables Mistral sont vérifiés séparément.
- [ ] Aucun secret n’est exposé au client ou dans Git.

## Recette Preview

- [ ] Lint, TypeScript et build réussissent sans avertissement concierge.
- [ ] `/api/concierge/ai` et `/api/concierge/submit` sont présentes.
- [ ] Les parcours Lead Engine, site web, IA locale et cyber sont testés.
- [ ] Les états prêt, envoi, succès, erreur, rate limit et désactivation sont testés.
- [ ] Le double clic, le retry avec même UUID et la fermeture pendant l’envoi sont testés.
- [ ] Un test d’e-mail réel utilise uniquement des données synthétiques et l’activation explicite prévue.
- [ ] L’e-mail interne arrive au bon destinataire et reste lisible en HTML et texte.
- [ ] La confirmation visiteur ne révèle aucun score ou détail interne.
- [ ] Le formulaire historique fonctionne et conserve ses propres protections.

## Qualité d’interface

- [ ] Desktop : 1280×720 et 1440×900.
- [ ] Mobile : 390×844 et 360×800.
- [ ] Aucun débordement ou champ masqué par le clavier mobile.
- [ ] Navigation clavier, focus, Échap et lecteur d’écran vérifiés.
- [ ] `prefers-reduced-motion` respecté.
- [ ] Aucun warning React ou erreur d’hydratation.
- [ ] Les événements analytics locaux ne contiennent aucune donnée personnelle ou réponse libre.

## Confidentialité et exploitation

- [ ] La politique de confidentialité du 31 juillet 2026 a été relue.
- [ ] Une validation juridique humaine a été obtenue.
- [ ] Les contrats et transferts de Vercel, Resend et Mistral ont été contrôlés.
- [ ] La procédure de revue, archivage contrôlé et suppression des e-mails est attribuée.
- [ ] Les demandes d’accès, rectification et effacement ont un responsable.
- [ ] L’absence de base de données et les limites serverless sont acceptées.

## Publication et retour arrière

- [ ] La PR Preview a été relue et approuvée humainement.
- [ ] Le comportement du kill switch en Preview est confirmé.
- [ ] Le déploiement précédent à restaurer est identifié avant production.
- [ ] La procédure de rollback Vercel est connue.
- [ ] Après production, vérifier route, e-mails, mobile et formulaire historique.
- [ ] Après déploiement, contrôler Search Console et les erreurs d’exploration.
