# Novekia Site — Agent Rules

These instructions apply to the whole repository unless a deeper `AGENTS.md` overrides them.

## Canonical Novekia context

Before any material product, architecture, positioning, roadmap, provider, commercial, or cross-product change, consult the private canonical Novekia context maintained in `sciencezvous/novekia-lead-engine-studio` on `main`:

- `docs/novekia/NOVEKIA_CONTEXT.md` — durable doctrine and architecture.
- `docs/novekia/NOVEKIA_STATE.md` — current consolidated state and priorities.
- `docs/novekia/NOVEKIA_CAPABILITIES.md` — capability registry and maturity.
- `docs/novekia/NOVEKIA_DECISIONS.md` — accepted structural decisions.

Do not copy private canonical context into this public repository. Reference only the minimum public-safe information needed for implementation.

If the canonical private context is unavailable, do not invent cross-product facts. Restrict work to facts verified in this repository and explicitly flag any assumption that would require Novekia-wide context.

## Source-of-truth hierarchy

For implementation facts in this repository, code, tests, configuration and deployed behavior are authoritative. Canonical Novekia context governs intent, product boundaries and cross-product decisions; it never overrides verified implementation reality silently.

## Maintenance

A repository-local implementation change does not automatically rewrite canonical Novekia state. Update or propose an update to the canonical context only when a material milestone, capability, architectural decision, commercial constraint or product boundary has actually changed and is verified.

## Public repository safety

This repository is public. Never add private strategy, customer data, internal operating details, credentials, provider secrets, unpublished commercial assumptions, or sensitive content from the canonical private context.
