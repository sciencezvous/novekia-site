'use client'

import { useState } from 'react'
import { Info } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum)
}

function formatGib(value: number) {
  return new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
  }).format(value)
}

export function GpuMemoryCalculator() {
  const [parameters, setParameters] = useState(8)
  const [bits, setBits] = useState(4)
  const [overhead, setOverhead] = useState(20)
  const [sessionReserve, setSessionReserve] = useState(2)
  const [concurrency, setConcurrency] = useState(1)

  const safeParameters = clamp(parameters || 0, 0.1, 1000)
  const safeBits = clamp(bits || 0, 2, 32)
  const safeOverhead = clamp(overhead || 0, 0, 200)
  const safeReserve = clamp(sessionReserve || 0, 0, 512)
  const safeConcurrency = clamp(concurrency || 0, 1, 1000)
  const weightMemory =
    (safeParameters * 1_000_000_000 * (safeBits / 8)) / 1024 ** 3
  const runtimeMemory = weightMemory * (1 + safeOverhead / 100)
  const sessionMemory = safeReserve * safeConcurrency
  const total = runtimeMemory + sessionMemory
  const envelope =
    total <= 24
      ? 'Enveloppe jusqu’à 24 Gio'
      : total <= 48
        ? 'Enveloppe de 24 à 48 Gio'
        : total <= 96
          ? 'Enveloppe de 48 à 96 Gio'
          : 'Plus de 96 Gio : forte mémoire ou plusieurs accélérateurs'
  const estimate = {
    weightMemory,
    runtimeMemory,
    sessionMemory,
    total,
    envelope,
  }

  const inputClassName = 'mt-2 h-11 bg-background/50'

  return (
    <section
      id="calculateur"
      className="scroll-mt-24 border border-border bg-card p-6 sm:p-8"
    >
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
        Calculateur transparent
      </p>
      <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em]">
        Première estimation de mémoire.
      </h2>
      <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">
        L’outil estime la mémoire des poids, ajoute une marge d’exécution puis
        une réserve par session. Il sert au cadrage, pas à valider une
        configuration.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.8fr]">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="model-parameters">
              Paramètres du modèle (milliards)
            </Label>
            <Input
              id="model-parameters"
              type="number"
              min="0.1"
              max="1000"
              step="0.1"
              value={parameters}
              onChange={(event) => setParameters(Number(event.target.value))}
              className={inputClassName}
            />
          </div>
          <div>
            <Label htmlFor="weight-bits">Précision des poids (bits)</Label>
            <select
              id="weight-bits"
              value={bits}
              onChange={(event) => setBits(Number(event.target.value))}
              className="mt-2 h-11 w-full rounded-md border border-input bg-background/50 px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="4">4 bits</option>
              <option value="8">8 bits</option>
              <option value="16">16 bits</option>
            </select>
          </div>
          <div>
            <Label htmlFor="runtime-overhead">Marge d’exécution (%)</Label>
            <Input
              id="runtime-overhead"
              type="number"
              min="0"
              max="200"
              step="5"
              value={overhead}
              onChange={(event) => setOverhead(Number(event.target.value))}
              className={inputClassName}
            />
          </div>
          <div>
            <Label htmlFor="concurrency">Sessions simultanées</Label>
            <Input
              id="concurrency"
              type="number"
              min="1"
              max="1000"
              step="1"
              value={concurrency}
              onChange={(event) => setConcurrency(Number(event.target.value))}
              className={inputClassName}
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="session-reserve">
              Réserve de contexte et cache par session (Gio)
            </Label>
            <Input
              id="session-reserve"
              type="number"
              min="0"
              max="512"
              step="0.5"
              value={sessionReserve}
              onChange={(event) => setSessionReserve(Number(event.target.value))}
              className={inputClassName}
            />
          </div>
        </div>

        <output className="novekia-surface flex flex-col justify-between p-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
              Estimation minimale de planification
            </p>
            <p className="mt-3 text-5xl font-semibold tracking-[-0.05em] text-primary">
              {formatGib(estimate.total)}
              <span className="ml-2 text-lg text-foreground">Gio</span>
            </p>
            <p className="mt-3 font-semibold">{estimate.envelope}</p>
          </div>
          <dl className="mt-8 divide-y divide-border border-y border-border text-sm">
            <div className="flex justify-between gap-4 py-3">
              <dt className="text-muted-foreground">Poids seuls</dt>
              <dd>{formatGib(estimate.weightMemory)} Gio</dd>
            </div>
            <div className="flex justify-between gap-4 py-3">
              <dt className="text-muted-foreground">Avec marge runtime</dt>
              <dd>{formatGib(estimate.runtimeMemory)} Gio</dd>
            </div>
            <div className="flex justify-between gap-4 py-3">
              <dt className="text-muted-foreground">Réserve sessions</dt>
              <dd>{formatGib(estimate.sessionMemory)} Gio</dd>
            </div>
          </dl>
        </output>
      </div>

      <p className="mt-6 flex items-start gap-3 border-t border-border pt-5 text-sm leading-6 text-muted-foreground">
        <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
        Le cache KV varie fortement selon le modèle, la longueur de contexte, la
        concurrence et le moteur d’inférence. La quantification ajoute aussi des
        métadonnées. Mesurez toujours le modèle, le backend et le corpus
        réellement retenus avant tout achat.
      </p>
    </section>
  )
}
