# Novekia public audit — T0

- Target: `https://novekia.fr`
- Observation: 2026-08-23 09:32 CEST
- Audit mode: public bounded pre-audit, no CMS access
- Engine branch: `codex/public-audit-ingress-v1`
- Engine calibration commit: `986975656bac5a5c6e7ec5c30d8154a4fcc32f6f`
- Site baseline commit: `dffc9d0a80f03b9e1b5afc6a6c30ba8e892f9b4a`

## Baseline metrics

- Opportunity index: **3/100**
- Coverage: **100/100**
- Confidence: **65/100**
- Public sample: **4/4 pages**

The opportunity index is not a global quality score. A lower value means the bounded public audit identified less observable improvement opportunity in the sampled pages.

## Verified findings retained for T0

1. `HYGIENE-CSP-001` — Content-Security-Policy absent.
2. `HYGIENE-FRAME-001` — framing protection not observable (`X-Frame-Options` absent and no `frame-ancestors` CSP directive).
3. `HYGIENE-REFERRER-001` — Referrer-Policy absent.

All three are informational public-configuration findings. They are suitable for a T0 → T1 remediation proof because they are deterministic HTTP-header observations.

## Calibration findings excluded from the baseline

The following earlier observations were rejected as audit-engine false positives during counter-verification and are not part of T0: missing primary CTA, missing privacy policy, missing editorial author/date, missing sources on the `/actualites-ia` collection page, unlabeled hidden honeypot field, and decorative images using `alt=""`.

## T1 acceptance criteria

The same public audit target and bounded sampling policy must be rerun after deployment. T1 is accepted only if:

- a real `Content-Security-Policy` response header is observable;
- framing protection is observable through `frame-ancestors 'none'` and/or `X-Frame-Options: DENY`;
- `Referrer-Policy: strict-origin-when-cross-origin` is observable;
- the public site remains functional after the policy change;
- no newly exposed regression replaces these three findings.

This file records the human-reviewed baseline. It is not a certification or an exhaustive security audit.
