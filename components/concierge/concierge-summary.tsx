'use client'

import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { conciergePathLabels } from '@/lib/concierge/config'
import type { ConciergeSummary as Summary } from '@/lib/concierge/types'

type ConciergeSummaryProps = {
  summary: Summary
  onContinue: () => void
  onBack: () => void
  onRestart: () => void
  final?: boolean
}

type SummaryItem = { label: string; value: string | null }

export function ConciergeSummaryView({
  summary,
  onContinue,
  onBack,
  onRestart,
  final = false,
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
        {final ? 'Demande prête' : 'Synthèse du cadrage'}
      </p>
      <h3 className="mt-3 text-balance text-2xl font-semibold tracking-tight">
        {final ? 'Votre demande est structurée.' : 'Vérifiez les éléments déclarés.'}
      </h3>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        Cette synthèse reprend vos réponses sans interprétation par une IA.
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
        <div className="mt-6 border border-primary/35 bg-primary/8 p-4">
          <p className="text-sm font-semibold leading-6">
            Votre demande est prête. La transmission sécurisée sera activée après validation technique.
          </p>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            Aucune donnée n’a été envoyée dans cette version.
          </p>
          <Button type="button" disabled className="mt-4 min-h-11 w-full whitespace-normal px-4 text-center">
            Transmission non activée dans cette version
          </Button>
        </div>
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

      <button
        type="button"
        onClick={onRestart}
        className="mx-auto mt-5 flex min-h-11 items-center gap-2 rounded-sm px-3 text-xs text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
      >
        <RotateCcw aria-hidden="true" className="size-3.5" />
        Recommencer
      </button>
    </div>
  )
}
