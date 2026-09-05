import Link from 'next/link'
import { ArrowRight, BadgeCheck, ShieldCheck } from 'lucide-react'
import type { PublicAuditResult } from '@/lib/audit-contract'
import type { PaidAuditOfferId } from '@/lib/audit-paid-offers'

type AuditOfferRecommendationProps = {
  result: PublicAuditResult
  onIntent: () => void
}

const NON_CONCLUSIVE_STATUSES = new Set([
  'needs_review',
  'unverified',
  'not_verified',
  'not_measured',
  'inconclusive',
])

function priorityFindingCount(result: PublicAuditResult) {
  return result.findings.filter((finding) => {
    const verification = finding.verification_status.toLowerCase()
    const severity = finding.severity.toLowerCase()
    return (
      !NON_CONCLUSIVE_STATUSES.has(verification) &&
      (severity === 'critical' || severity === 'high')
    )
  }).length
}

function recommendationFor(result: PublicAuditResult) {
  const priorityFindings = priorityFindingCount(result)

  if (result.result_state === 'partial') {
    return {
      kind: 'review' as const,
      eyebrow: 'RECOMMANDATION EN ATTENTE',
      title: 'Aucun pack payant recommandé automatiquement.',
      body:
        'Le résultat est partiel : les preuves ou la couverture doivent être confirmées avant de transformer ce diagnostic en proposition commerciale.',
      price: null,
      offerId: null,
      priorityFindings,
    }
  }

  if (result.total_findings === 0) {
    return {
      kind: 'none' as const,
      eyebrow: 'AUCUNE INTERVENTION PRIORITAIRE',
      title: 'Le pré-audit ne démontre pas de besoin payant immédiat.',
      body:
        'Sur le périmètre réellement contrôlé, Novekia n’a pas de correction prioritaire à vous vendre. Un audit plus large reste possible uniquement si votre enjeu le justifie.',
      price: null,
      offerId: null,
      priorityFindings,
    }
  }

  if (
    priorityFindings >= 2 ||
    result.total_findings >= 4 ||
    result.public_audit_score < 65
  ) {
    return {
      kind: 'offer' as const,
      eyebrow: 'PLAN RECOMMANDÉ',
      title: 'Pack Visibility',
      body:
        'Plusieurs constats ou priorités justifient un périmètre plus complet : SEO technique, on-page, entité, GEO/AEO, plan de remédiation et retest.',
      price: '990 € HT',
      offerId: 'visibility' as PaidAuditOfferId,
      priorityFindings,
    }
  }

  return {
    kind: 'offer' as const,
    eyebrow: 'PLAN RECOMMANDÉ',
    title: 'Pack Optimisation',
    body:
      'Les constats démontrés semblent ciblés : une intervention bornée sur les corrections prioritaires est plus cohérente qu’un périmètre plus large.',
    price: '490 € HT',
    offerId: 'optimisation' as PaidAuditOfferId,
    priorityFindings,
  }
}

export function AuditOfferRecommendation({
  result,
  onIntent,
}: AuditOfferRecommendationProps) {
  const recommendation = recommendationFor(result)
  const orderHref = recommendation.offerId
    ? `/audit/commande?offer=${recommendation.offerId}&auditId=${encodeURIComponent(result.audit_id)}&url=${encodeURIComponent(result.target_url)}`
    : '/audit-approfondi#tarifs'

  return (
    <section
      className="mt-7 border border-primary/35 bg-primary/[0.045] p-6 sm:p-8"
      aria-labelledby="audit-commercial-recommendation-title"
    >
      <div className="grid gap-7 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-primary">
            {recommendation.kind === 'offer' ? (
              <BadgeCheck aria-hidden="true" className="size-4" />
            ) : (
              <ShieldCheck aria-hidden="true" className="size-4" />
            )}
            {recommendation.eyebrow}
          </div>
          <h2
            id="audit-commercial-recommendation-title"
            className="mt-3 text-2xl font-semibold tracking-[-0.03em] sm:text-3xl"
          >
            {recommendation.title}
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
            {recommendation.body}
          </p>

          <div className="mt-5 flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span className="border border-border bg-background px-3 py-2">
              {result.total_findings} constat{result.total_findings > 1 ? 's' : ''} retenu{result.total_findings > 1 ? 's' : ''}
            </span>
            <span className="border border-border bg-background px-3 py-2">
              {recommendation.priorityFindings} priorité{recommendation.priorityFindings > 1 ? 's' : ''} haute{recommendation.priorityFindings > 1 ? 's' : ''}
            </span>
            <span className="border border-border bg-background px-3 py-2">
              couverture {result.coverage}%
            </span>
          </div>
        </div>

        <div className="min-w-60 lg:text-right">
          {recommendation.price && (
            <>
              <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
                Tarif public
              </p>
              <div className="mt-2 text-4xl font-semibold tracking-[-0.04em] text-primary">
                {recommendation.price}
              </div>
            </>
          )}

          {recommendation.kind !== 'none' && (
            <Link
              href={orderHref}
              onClick={onIntent}
              className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 bg-primary px-5 font-semibold text-primary-foreground transition hover:opacity-90 lg:w-auto"
            >
              {recommendation.kind === 'offer'
                ? 'Commander cet audit'
                : 'Confirmer les priorités'}
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          )}
        </div>
      </div>

      <p className="mt-6 border-t border-border pt-4 text-xs leading-5 text-muted-foreground">
        La recommandation commerciale est calculée après le résultat. Elle ne participe ni au
        score, ni au statut PARTIEL/CONCLUSIF, ni au niveau de confiance des constats.
      </p>
    </section>
  )
}
