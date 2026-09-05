# Audit Visibility — frontière gratuit / premium V1

## Contrat de livraison

Le pré-audit public Novekia reste volontairement borné. Son email de synthèse ne récupère, n’attache et n’expose jamais le PDF premium de l’audit complet.

- Le navigateur ne reçoit jamais les secrets d’ingress ou de rapport.
- L’email gratuit contient uniquement une synthèse : score public, couverture, sous-scores et aperçu borné des constats.
- Les recommandations détaillées, l’analyse approfondie et le rapport premium sont réservés à l’offre payante.
- La route publique historique de téléchargement PDF est fermée avec `PAID_AUDIT_REQUIRED`.
- Une demande commerciale démarre avec le statut `pending_payment` et ne déclenche ni audit complet ni export premium.
- L’offre et le tarif sont résolus côté serveur à partir du catalogue Novekia ; ils ne sont jamais acceptés comme prix fourni par le navigateur.
- L’exécution de l’audit complet intervient uniquement après validation du paiement.
- Le moteur protège en plus son endpoint PDF par un secret dédié, distinct du secret du pré-audit public.

## Paiement V1

Le funnel reste provider-neutral pour le pilote opéré. Des liens de checkout HTTPS peuvent être fournis par variables d’environnement pour chaque offre. Sans lien configuré, la demande est enregistrée et Novekia transmet manuellement les modalités de paiement.

Cette architecture évite de rendre Stripe, ou tout autre PSP, structurel pour Visibility tout en conservant une frontière technique stricte entre acquisition gratuite et livraison premium.
