'use client'

import { useMemo, useState } from 'react'
import { Cpu, Database, Gauge, MemoryStick, ServerCog } from 'lucide-react'
import { ConciergeTrigger } from '@/components/concierge/concierge-trigger'
import {
  calculateAiSizing,
  contextOptions,
  corpusOptions,
  modelSizes,
  precisionOptions,
  sessionOptions,
  type Precision,
} from '@/lib/ai-sizing'

const selectClassName =
  'mt-3 h-12 w-full rounded-md border border-border bg-[#030b19] px-4 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/25'

function ResultMetric({
  label,
  value,
  detail,
  icon: Icon,
}: {
  label: string
  value: string
  detail: string
  icon: typeof Cpu
}) {
  return (
    <div className="border border-border/80 bg-[#041025] p-5">
      <div className="flex items-center justify-between gap-4">
        <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </p>
        <Icon aria-hidden="true" className="size-5 text-primary" strokeWidth={1.4} />
      </div>
      <p className="mt-5 text-2xl font-semibold tracking-[-0.04em] text-foreground">
        {value}
      </p>
      <p className="mt-2 text-xs leading-5 text-muted-foreground">{detail}</p>
    </div>
  )
}

export function AiSizingCalculator() {
  const [parametersB, setParametersB] = useState(14)
  const [precision, setPrecision] = useState<Precision>('int4')
  const [contextTokens, setContextTokens] = useState(8192)
  const [concurrentSessions, setConcurrentSessions] = useState(4)
  const [corpusGb, setCorpusGb] = useState(50)

  const estimate = useMemo(
    () =>
      calculateAiSizing({
        parametersB,
        precision,
        contextTokens,
        concurrentSessions,
        corpusGb,
      }),
    [parametersB, precision, contextTokens, concurrentSessions, corpusGb],
  )

  const loadRatio = Math.min(100, Math.round((estimate.vramHighGib / 160) * 100))

  return (
    <div className="grid border border-border/80 bg-[#020712]/85 lg:grid-cols-[0.82fr_1.18fr]">
      <form className="border-b border-border/80 p-5 sm:p-8 lg:border-b-0 lg:border-r lg:p-10">
        <div className="flex items-center justify-between gap-5 border-b border-border/80 pb-6">
          <div>
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-primary">
              Entrées du scénario
            </p>
            <h2 className="mt-2 text-xl font-semibold">Définissez votre charge</h2>
          </div>
          <span className="system-status-dot size-2 rounded-full bg-primary" aria-hidden="true" />
        </div>

        <div className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <label className="text-sm font-medium">
            Taille du modèle
            <select
              className={selectClassName}
              value={parametersB}
              onChange={(event) => setParametersB(Number(event.target.value))}
            >
              {modelSizes.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label} — {option.detail}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm font-medium">
            Précision des poids
            <select
              className={selectClassName}
              value={precision}
              onChange={(event) => setPrecision(event.target.value as Precision)}
            >
              {precisionOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label} — {option.detail}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm font-medium">
            Fenêtre de contexte
            <select
              className={selectClassName}
              value={contextTokens}
              onChange={(event) => setContextTokens(Number(event.target.value))}
            >
              {contextOptions.map((option) => (
                <option key={option} value={option}>
                  {(option / 1024).toLocaleString('fr-FR')}k tokens
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm font-medium">
            Sessions simultanées
            <select
              className={selectClassName}
              value={concurrentSessions}
              onChange={(event) => setConcurrentSessions(Number(event.target.value))}
            >
              {sessionOptions.map((option) => (
                <option key={option} value={option}>
                  {option} {option === 1 ? 'session active' : 'sessions actives'}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm font-medium sm:col-span-2 lg:col-span-1 xl:col-span-2">
            Corpus documentaire
            <select
              className={selectClassName}
              value={corpusGb}
              onChange={(event) => setCorpusGb(Number(event.target.value))}
            >
              {corpusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <p className="mt-7 border-t border-border/80 pt-5 text-xs leading-6 text-muted-foreground">
          Estimation d’inférence uniquement. Elle ne dimensionne ni entraînement,
          fine-tuning complet, haute disponibilité, refroidissement, réseau ou
          alimentation électrique.
        </p>
      </form>

      <div className="relative overflow-hidden p-5 sm:p-8 lg:p-10" aria-live="polite">
        <div aria-hidden="true" className="architecture-radar absolute -right-64 -top-64 size-[42rem] rounded-full" />
        <div className="relative">
          <div className="flex flex-col justify-between gap-5 border-b border-border/80 pb-6 sm:flex-row sm:items-end">
            <div>
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-primary">
                Enveloppe indicative
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.035em]">
                {estimate.architecture}
              </h2>
            </div>
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
              {parametersB}B · {precision.toUpperCase()} · {contextTokens / 1024}k
            </p>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <ResultMetric
              label="VRAM de travail"
              value={`${estimate.vramLowGib}–${estimate.vramHighGib} Gio`}
              detail={estimate.acceleratorEnvelope}
              icon={Gauge}
            />
            <ResultMetric
              label="Poids du modèle"
              value={`${estimate.modelWeightsGib.toLocaleString('fr-FR')} Gio`}
              detail="Estimation des poids chargés uniquement"
              icon={Cpu}
            />
            <ResultMetric
              label="Mémoire système"
              value={`${estimate.systemRamGib} Gio`}
              detail="Réserve indicative pour le système et le service"
              icon={MemoryStick}
            />
            <ResultMetric
              label="Stockage de départ"
              value={estimate.storageGb >= 1024 ? `${estimate.storageGb / 1024} To` : `${estimate.storageGb} Go`}
              detail="Modèles, corpus, index, versions et sauvegardes"
              icon={Database}
            />
          </div>

          <div className="mt-6 border border-border/80 bg-[#030b19] p-5">
            <div className="flex items-center justify-between gap-4">
              <span className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted-foreground">
                Intensité de l’architecture
              </span>
              <ServerCog aria-hidden="true" className="size-5 text-primary" strokeWidth={1.4} />
            </div>
            <div className="mt-4 h-1 overflow-hidden bg-white/10">
              <div className="h-full bg-primary transition-[width] duration-500" style={{ width: `${loadRatio}%` }} />
            </div>
          </div>

          {estimate.notes.length > 0 ? (
            <div className="mt-6">
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-primary">
                Points à valider
              </p>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
                {estimate.notes.map((note) => (
                  <li key={note} className="border-l border-primary/60 pl-4">
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <ConciergeTrigger source="sizing_tool" className="mt-7 w-full sm:w-auto">
            Faire valider ce scénario par Nova
          </ConciergeTrigger>
        </div>
      </div>
    </div>
  )
}
