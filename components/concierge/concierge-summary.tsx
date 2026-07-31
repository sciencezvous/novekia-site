'use client'

import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { conciergePathLabels } from '@/lib/concierge/config'
import type {
  AssistedQualificationSummary,
  ConciergeAIRouteEnvelope,
} from '@/lib/concierge/ai-schemas'
import type { ConciergeSubmissionUIState } from '@/lib/concierge/submission/client'
import type { ConciergeSummary as Summary } from '@/lib/concierge/types'
import { ConciergeAISummary } from './concierge-ai-summary'
import { ConciergeSubmit } from './concierge-submit'

type ConciergeSummaryProps = {
  summary: Summary
  onContinue: () => void
  onBack: () => void
  onRestart: () => void
  onClose?: () => void
  onSubmit?: (honeypot: string) => Promise<void>
  submission?: ConciergeSubmissionUIState
  final?: boolean
  ai?: {
    enabled: boolean
    disclosureAcknowledged: boolean
    status: 'idle' | 'requesting' | 'available' | 'fallback' | 'unavailable' | 'error'
    onRequest: (input: Record<string, unknown>) => Promise<ConciergeAIRouteEnvelope>
    onDisable: () => void
    assisted: AssistedQualificationSummary | null
    onAssistedChange: (summary: AssistedQualificationSummary | null) => void
  }
}

type SummaryItem = { label: string; value: string | null }

export function ConciergeSummaryView({
  summary,
  onContinue,
  onBack,
  onRestart,
  onClose,
  onSubmit,
  submission,
  final = false,
  ai,
}: ConciergeSummaryProps) {
  const items: SummaryItem[] = [
    { label: 'Pôle', value: conciergePathLabels[summary.selectedPath.value] },
    { label: 'Entreprise', value: summary.company?.value ?? null },
    { label: 'Objectif', value: summary.objective?.value ?? null },
    { label: 'Situation actuelle', value: summary.currentSituation?.value ?? null },
    { label: 'Cible ou besoin principal', value: summary.target?.value ?? summary.mainNeed?.value ?? null },
    { label: 'Contraintes', value: summary.constraints.map((item) => item.value).join(' · ') || null },
    { label: 'Délai', value: summary.timeframe?.value ?? null },
  ]

  return (
    <div data-concierge-step-id={final ? 'submission.ready' : 'summary.review'}>
      <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-primary">
        {final ? 'Demande prête' : 'Informations fournies'}
      </p>
      <h3 className="mt-3 text-balance text-2xl font-semibold tracking-tight">
        {final ? 'Votre demande est structurée.' : 'Vérifiez les éléments déclarés.'}
      </h3>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        Cette synthèse déterministe reprend vos réponses sans interprétation par une IA.
      </p>

      <dl className="mt-6 divide-y divide-border border-y border-border">
        {items.filter((item) => item.value).map((item) => (
          <div key={item.label} className="py-4">
            <dt className="font-mono text-[0.65rem] uppercase tracking-[0.12em] text-muted-foreground">
              {item.label}
            </dt>
            <dd className="mt-1.5 whitespace-pre-wrap text-sm leading-6 text-foreground">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>

      {!final && ai ? (
        <ConciergeAISummary
          summary={summary}
          enabled={ai.enabled}
          disclosureAcknowledged={ai.disclosureAcknowledged}
          status={ai.status}
          onRequest={ai.onRequest}
          onDisable={ai.onDisable}
          assisted={ai.assisted}
          onAssistedChange={ai.onAssistedChange}
        />
      ) : null}

      {summary.missingInformation.length > 0 ? (
        <section className="mt-5 border border-border bg-background/40 p-4" aria-labelledby="concierge-missing-title">
          <h4 id="concierge-missing-title" className="text-sm font-semibold">Informations à clarifier</h4>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-muted-foreground">
            {summary.missingInformation.map((item) => <li key={item.value}>{item.value}</li>)}
          </ul>
        </section>
      ) : null}

      {summary.humanReviewPoints.length > 0 ? (
        <section className="mt-4 border border-primary/25 bg-primary/5 p-4" aria-labelledby="concierge-review-title">
          <h4 id="concierge-review-title" className="text-sm font-semibold">Points à valider humainement</h4>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-muted-foreground">
            {summary.humanReviewPoints.map((item) => <li key={item.value}>{item.value}</li>)}
          </ul>
        </section>
      ) : null}

      {final ? (
        submission && onSubmit && onClose ? (
          <ConciergeSubmit
            submission={submission}
            onSubmit={onSubmit}
            onClose={onClose}
          />
        ) : null
      ) : (
        <div className="mt-6 grid gap-2">
          <Button type="button" size="lg" onClick={onContinue} className="min-h-11 w-full">
            Continuer vers les coordonnées
            <ArrowRight aria-hidden="true" />
          </Button>
          <Button type="button" variant="outline" size="lg" onClick={onBack} className="min-h-11 w-full">
            <ArrowLeft aria-hidden="true" />
            Revoir mes réponses
          </Button>
        </div>
      )}

      {submission?.status !== 'submitted' ? <button
        type="button"
        onClick={onRestart}
        className="mx-auto mt-5 flex min-h-11 items-center gap-2 rounded-sm px-3 text-xs text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
      >
        <RotateCcw aria-hidden="true" className="size-3.5" />
        Recommencer
      </button> : null}
    </div>
  )
}
