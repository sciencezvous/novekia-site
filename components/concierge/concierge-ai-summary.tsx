'use client'

import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type {
  AssistedQualificationSummary,
  ConciergeAIRouteEnvelope,
} from '@/lib/concierge/ai-schemas'
import type { ConciergeSummary } from '@/lib/concierge/types'
import { ConciergeAIDisclosure } from './concierge-ai-disclosure'

type ConciergeAISummaryProps = {
  summary: ConciergeSummary
  enabled: boolean
  disclosureAcknowledged: boolean
  status: 'idle' | 'requesting' | 'available' | 'fallback' | 'unavailable' | 'error'
  onRequest: (input: Record<string, unknown>) => Promise<ConciergeAIRouteEnvelope>
  onDisable: () => void
}

function summaryInput(summary: ConciergeSummary): Record<string, unknown> {
  return {
    context: summary.context?.value ?? null,
    objective: summary.objective?.value ?? null,
    currentSituation: summary.currentSituation?.value ?? null,
    target: summary.target?.value ?? null,
    mainNeed: summary.mainNeed?.value ?? null,
    constraints: summary.constraints.map((item) => item.value),
    timeframe: summary.timeframe?.value ?? null,
    positiveSignals: summary.positiveSignals.map((item) => item.value),
    uncertainties: summary.uncertainties.map((item) => item.value),
    missingInformation: summary.missingInformation.map((item) => item.value),
    humanReviewPoints: summary.humanReviewPoints.map((item) => item.value),
    recommendedServiceCategory: summary.recommendedServiceCategory?.value ?? null,
    recommendedNextAction: summary.recommendedNextAction.value,
  }
}

function displayValue(value: { value: string | null } | null): string | null {
  return value?.value ?? null
}

export function ConciergeAISummary({
  summary,
  enabled,
  disclosureAcknowledged,
  status,
  onRequest,
  onDisable,
}: ConciergeAISummaryProps) {
  const [assisted, setAssisted] = useState<AssistedQualificationSummary | null>(null)
  const [message, setMessage] = useState('')

  async function requestSummary() {
    setMessage('')
    const response = await onRequest(summaryInput(summary))
    if (!response.success || response.task !== 'summarize_qualification' || !('recommendedNextAction' in response.result)) {
      setMessage('La synthèse assistée n’est pas disponible. La synthèse déterministe ci-dessus reste valide.')
      return
    }
    setAssisted(response.result)
    if (response.fallbackUsed) {
      setMessage('La synthèse a été structurée avec les règles déterministes du concierge.')
    }
  }

  if (!enabled) return null

  const assistedItems = assisted ? [
    ['Contexte', displayValue(assisted.context)],
    ['Objectif', displayValue(assisted.objective)],
    ['Situation actuelle', displayValue(assisted.currentSituation)],
    ['Cible', displayValue(assisted.target)],
    ['Besoin principal', displayValue(assisted.mainNeed)],
    ['Délai', displayValue(assisted.timeframe)],
    ['Prochaine action suggérée', assisted.recommendedNextAction.value],
  ].filter((item): item is [string, string] => Boolean(item[1])) : []
  const confirmations = assisted
    ? [...assisted.uncertainties, ...assisted.missingInformation, ...assisted.humanReviewPoints]
    : []

  return (
    <section className="mt-5 border border-primary/25 bg-primary/5 p-4" aria-labelledby="assisted-summary-title">
      <div className="flex items-center gap-2">
        <Sparkles aria-hidden="true" className="size-4 text-primary" />
        <h4 id="assisted-summary-title" className="text-sm font-semibold">Synthèse assistée</h4>
      </div>
      {!disclosureAcknowledged && !assisted ? <div className="mt-4"><ConciergeAIDisclosure /></div> : null}
      {!assisted ? (
        <>
          <p className="mt-3 text-xs leading-5 text-muted-foreground">Cette vue reste complémentaire et ne remplace pas les informations fournies.</p>
          <Button type="button" variant="outline" size="lg" onClick={requestSummary} disabled={status === 'requesting'} className="mt-4 min-h-11 w-full">
            <Sparkles aria-hidden="true" />
            {status === 'requesting' ? 'Structuration en cours…' : 'Structurer cette synthèse avec l’assistant IA'}
          </Button>
          <button type="button" onClick={onDisable} className="mt-3 min-h-10 w-full text-xs text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring">
            Continuer sans assistance IA
          </button>
        </>
      ) : (
        <>
          <dl className="mt-4 divide-y divide-border border-y border-border">
            {assistedItems.map(([label, value]) => (
              <div key={label} className="py-3">
                <dt className="font-mono text-[0.62rem] uppercase tracking-[0.12em] text-muted-foreground">{label}</dt>
                <dd className="mt-1 text-sm leading-6">{value}</dd>
              </div>
            ))}
          </dl>
          {confirmations.length > 0 ? (
            <div className="mt-4">
              <p className="text-sm font-semibold">Points à confirmer</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-xs leading-5 text-muted-foreground">
                {confirmations.map((item, index) => <li key={`${item.value}-${index}`}>{item.value}</li>)}
              </ul>
            </div>
          ) : null}
          <p className="mt-4 text-[0.68rem] leading-5 text-muted-foreground">Vue générée comme inférence, à confirmer lors d’un échange humain.</p>
        </>
      )}
      {message ? <p role="status" className="mt-3 text-xs leading-5 text-muted-foreground">{message}</p> : null}
    </section>
  )
}
