import Link from 'next/link'
import { ArrowRight, BadgeCheck, ShieldCheck } from 'lucide-react'
import type { PublicAuditResult } from '@/lib/audit-contract'

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
      eyebrow: 'AUDIT COMPLET DISPONIBLE',
      title: 'Le pré-audit reste partiel : approfondir peut lever l’incertitude.',
      body:
        'Le pré-audit ne suffit pas à conclure sur tous les points. L’Audit Visibility Full analyse plus largement les données publiques, documente les limites et produit un plan de remédiation sans inclure les corrections.',
      priorityFindings,
    }
  }

  if (result.total_findings === 0) {
    return {
      kind: 'none' as const,
      eyebrow: 'AUCUNE REMÉDIATION PRIORITAIRE',
      title: 'Le pré-audit ne démontre pas de correction urgente.',
      body:
        'Sur le périmètre réellement contrôlé, aucun défaut prioritaire n’est démontré. L’Audit Visibility Full reste disponible si vous souhaitez une analyse plus complète et un rapport détaillé sur les données publiques.',
      priorityFindings,
    }
  }

  return {
    kind: 'offer' as const,
    eyebrow: 'AUDIT COMPLET RECOMMANDÉ',
    title: 'Audit Visibility Full',
    body:
      'Approfondissez les constats avec l’audit complet sur données publiques : SEO, Entity SEO, GEO/AEO, scoring, preuves, priorités, rapport premium et plan de remédiation. Les corrections par Novekia restent une prestation séparée.',
    priorityFindings,
  }
}

export function AuditOfferRecommendation({
  result,
  onIntent,
}: AuditOfferRecommendationProps) {
  const recommendation = recommendationFor(result)
  const orderHref = `/audit/commande?offer=full&auditId=${encodeURIComponent(result.audit_id)}&url=${encodeURIComponent(result.target_url)}`

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
          <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
            Audit complet public
          </p>
          <div className="mt-2 text-4xl font-semibold tracking-[-0.04em] text-primary">
            99 € HT
          </div>

          <Link
            href={orderHref}
            onClick={onIntent}
            className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 bg-primary px-5 font-semibold text-primary-foreground transition hover:opacity-90 lg:w-auto"
          >
            Commander l’audit Full
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </div>

      <p className="mt-6 border-t border-border pt-4 text-xs leading-5 text-muted-foreground">
        L’audit à 99 € couvre le diagnostic complet sur les données publiques disponibles et le plan de remédiation. La mise en œuvre des corrections par Novekia est chiffrée séparément après l’audit.
      </p>
    </section>
  )
}
