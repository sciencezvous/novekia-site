export const modelSizes = [
  { value: 8, label: '8 milliards', detail: 'Assistant ciblé et tâches courantes' },
  { value: 14, label: '14 milliards', detail: 'Raisonnement intermédiaire' },
  { value: 32, label: '32 milliards', detail: 'Analyse et génération avancées' },
  { value: 70, label: '70 milliards', detail: 'Capacité élevée, infrastructure exigeante' },
] as const

export const precisionOptions = [
  { value: 'int4', label: '4 bits', detail: 'Empreinte réduite', effectiveBits: 4.5 },
  { value: 'int8', label: '8 bits', detail: 'Équilibre mémoire / fidélité', effectiveBits: 8.5 },
  { value: 'fp16', label: 'BF16 / FP16', detail: 'Empreinte maximale', effectiveBits: 16 },
] as const

export const contextOptions = [4096, 8192, 16384, 32768] as const
export const sessionOptions = [1, 4, 8, 16] as const
export const corpusOptions = [
  { value: 0, label: 'Sans corpus documentaire' },
  { value: 50, label: 'Environ 50 Go' },
  { value: 250, label: 'Environ 250 Go' },
  { value: 1000, label: 'Environ 1 To' },
] as const

export type Precision = (typeof precisionOptions)[number]['value']

export type SizingInput = {
  parametersB: number
  precision: Precision
  contextTokens: number
  concurrentSessions: number
  corpusGb: number
}

export type SizingEstimate = {
  modelWeightsGib: number
  vramLowGib: number
  vramHighGib: number
  systemRamGib: number
  storageGb: number
  architecture: string
  acceleratorEnvelope: string
  notes: string[]
}

function roundUp(value: number, step: number) {
  return Math.ceil(value / step) * step
}

function getAcceleratorEnvelope(vramHighGib: number) {
  if (vramHighGib <= 20) {
    return {
      architecture: 'Station mono-accélérateur',
      acceleratorEnvelope: '24 Go de VRAM cible',
    }
  }

  if (vramHighGib <= 42) {
    return {
      architecture: 'Station professionnelle',
      acceleratorEnvelope: '48 Go de VRAM cible',
    }
  }

  if (vramHighGib <= 76) {
    return {
      architecture: 'Serveur mono-accélérateur',
      acceleratorEnvelope: '80 Go de VRAM cible',
    }
  }

  if (vramHighGib <= 104) {
    return {
      architecture: 'Serveur haute capacité',
      acceleratorEnvelope: '96 à 120 Go de VRAM agrégée',
    }
  }

  return {
    architecture: 'Serveur multi-accélérateurs',
    acceleratorEnvelope: `${roundUp(vramHighGib, 40)} Go de VRAM agrégée ou plus`,
  }
}

export function calculateAiSizing(input: SizingInput): SizingEstimate {
  const precision = precisionOptions.find((item) => item.value === input.precision)

  if (!precision) {
    throw new Error('Unsupported precision')
  }

  const bytesPerWeight = precision.effectiveBits / 8
  const modelWeightsGib =
    (input.parametersB * 1_000_000_000 * bytesPerWeight) / 1_073_741_824
  const runtimeReserveGib = Math.max(2.5, modelWeightsGib * 0.18)
  const kvCachePerSessionGib =
    0.35 * Math.sqrt(input.parametersB / 8) * (input.contextTokens / 8192)
  const activeKvCacheGib = kvCachePerSessionGib * input.concurrentSessions
  const baseVramGib = modelWeightsGib + runtimeReserveGib + activeKvCacheGib
  const vramLowGib = roundUp(baseVramGib, 2)
  const vramHighGib = roundUp(baseVramGib * 1.25, 2)
  const systemRamGib = roundUp(Math.max(32, vramHighGib * 1.5), 16)
  const storageGb = roundUp(
    Math.max(256, input.corpusGb * 2.5 + modelWeightsGib * 4 + 64),
    128,
  )
  const envelope = getAcceleratorEnvelope(vramHighGib)
  const notes: string[] = []

  if (input.contextTokens >= 16384) {
    notes.push(
      'Le contexte long augmente fortement le cache mémoire et doit être testé sur le modèle retenu.',
    )
  }

  if (input.concurrentSessions >= 8) {
    notes.push(
      'Cette concurrence justifie un moteur d’inférence, une file d’attente et des objectifs de latence explicites.',
    )
  }

  if (input.precision === 'int4') {
    notes.push(
      'La quantification 4 bits réduit l’empreinte, mais la qualité doit être évaluée sur vos tâches réelles.',
    )
  }

  if (input.parametersB >= 70) {
    notes.push(
      'Un modèle de cette taille impose de valider bande passante mémoire, parallélisation et coût d’exploitation.',
    )
  }

  if (input.corpusGb > 0) {
    notes.push(
      'Le stockage inclut une réserve pour les documents, index, sauvegardes et versions ; le pipeline RAG reste à définir.',
    )
  }

  return {
    modelWeightsGib: Math.round(modelWeightsGib * 10) / 10,
    vramLowGib,
    vramHighGib,
    systemRamGib,
    storageGb,
    architecture: envelope.architecture,
    acceleratorEnvelope: envelope.acceleratorEnvelope,
    notes,
  }
}
