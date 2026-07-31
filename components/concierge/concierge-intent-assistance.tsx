'use client'

import { useState } from 'react'
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import type { ConciergeAIRouteEnvelope, ClassifyIntentResult } from '@/lib/concierge/ai-schemas'
import type { ConciergePath } from '@/lib/concierge/types'
import { ConciergeAIDisclosure } from './concierge-ai-disclosure'

const pathLabels: Readonly<Record<ConciergePath, string>> = {
  lead_engine: 'Développer ma prospection',
  solutions: 'Réaliser un projet numérique',
  information: 'Comprendre les services Novekia',
  direct_contact: 'Contacter directement Novekia',
  unknown: 'Choix manuel recommandé',
}

const categoryLabels: Readonly<Record<string, string>> = {
  website_seo_geo: 'Site web, SEO et GEO',
  business_software: 'Logiciel métier',
  web_app_integration: 'Application, intégration ou automatisation',
  local_ai: 'Intelligence artificielle locale',
  ai_infrastructure: 'Station ou serveur IA',
  backup_continuity: 'Sauvegarde et continuité',
  cybersecurity_authorized_audit: 'Cybersécurité — revue humaine requise',
  other: 'Autre besoin',
}

function confidenceLabel(confidence: number): string {
  if (confidence >= 0.75) return 'Confiance élevée'
  if (confidence >= 0.5) return 'Confiance modérée'
  return 'Confiance limitée'
}

type ConciergeIntentAssistanceProps = {
  status: 'idle' | 'requesting' | 'available' | 'fallback' | 'unavailable' | 'error'
  onAnalyze: (description: string) => Promise<ConciergeAIRouteEnvelope>
  onConfirm: (path: Exclude<ConciergePath, 'unknown'>) => void
  onChooseManually: () => void
  onDisable: () => void
}

export function ConciergeIntentAssistance({
  status,
  onAnalyze,
  onConfirm,
  onChooseManually,
  onDisable,
}: ConciergeIntentAssistanceProps) {
  const [description, setDescription] = useState('')
  const [suggestion, setSuggestion] = useState<ClassifyIntentResult | null>(null)
  const [message, setMessage] = useState('')

  async function analyze() {
    if (description.trim().length < 10) {
      setMessage('Décrivez votre besoin en au moins 10 caractères.')
      return
    }
    setMessage('')
    const response = await onAnalyze(description.trim())
    if (!response.success || response.task !== 'classify_intent' || !('path' in response.result)) {
      setSuggestion(null)
      setMessage('L’assistance n’est pas disponible. Vous pouvez choisir un parcours manuellement.')
      return
    }
    setSuggestion(response.result)
    if (response.fallbackUsed) {
      setMessage('Une orientation prudente a été préparée avec les règles du concierge.')
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={onChooseManually}
        className="mb-5 inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Revenir aux choix
      </button>
      <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-primary">Orientation facultative</p>
      <h3 className="mt-3 text-balance text-2xl font-semibold">Décrivez votre besoin en une phrase.</h3>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        L’assistant peut proposer un parcours. Vous gardez toujours le choix final.
      </p>
      <div className="mt-5">
        <ConciergeAIDisclosure />
      </div>

      {!suggestion ? (
        <>
          <Textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            maxLength={600}
            rows={5}
            disabled={status === 'requesting'}
            aria-label="Description courte de votre besoin"
            className="mt-5 min-h-32 resize-y bg-background/45"
          />
          <p className="mt-2 text-right font-mono text-[0.65rem] text-muted-foreground">{description.length}/600</p>
          <Button
            type="button"
            size="lg"
            onClick={analyze}
            disabled={status === 'requesting' || description.trim().length < 10}
            className="mt-4 min-h-11 w-full"
          >
            <Sparkles aria-hidden="true" />
            {status === 'requesting' ? 'Analyse en cours…' : 'Analyser mon besoin'}
          </Button>
          <Button type="button" variant="ghost" size="lg" onClick={onDisable} className="mt-2 min-h-11 w-full">
            Continuer sans assistance IA
          </Button>
        </>
      ) : (
        <section className="mt-5 border border-primary/30 bg-background/45 p-4" aria-labelledby="intent-suggestion-title">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.12em] text-primary">Suggestion à confirmer</p>
          <h4 id="intent-suggestion-title" className="mt-2 text-lg font-semibold">{pathLabels[suggestion.path]}</h4>
          {suggestion.solutionsCategory ? (
            <p className="mt-1 text-sm text-muted-foreground">Catégorie proposée : {categoryLabels[suggestion.solutionsCategory]}</p>
          ) : null}
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{suggestion.rationale}</p>
          <p className="mt-3 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-muted-foreground">
            {confidenceLabel(suggestion.confidence)}
          </p>
          {suggestion.humanReviewRequired ? (
            <p className="mt-3 text-xs leading-5 text-muted-foreground">Cette orientation devra être contrôlée humainement.</p>
          ) : null}
          {suggestion.path !== 'unknown' ? (
            <Button type="button" size="lg" onClick={() => onConfirm(suggestion.path as Exclude<ConciergePath, 'unknown'>)} className="mt-5 min-h-11 w-full">
              Continuer avec cette orientation <ArrowRight aria-hidden="true" />
            </Button>
          ) : null}
          <Button type="button" variant="outline" size="lg" onClick={onChooseManually} className="mt-2 min-h-11 w-full">
            Choisir un autre parcours
          </Button>
          <Button type="button" variant="ghost" size="lg" onClick={onDisable} className="mt-2 min-h-11 w-full">
            Continuer sans assistance IA
          </Button>
        </section>
      )}
      {message ? <p role="status" className="mt-4 text-xs leading-5 text-muted-foreground">{message}</p> : null}
    </div>
  )
}
