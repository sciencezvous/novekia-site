import type { ConciergeAITask } from '../ai-contract'

export type ConciergeAITaskPolicy = {
  minimumConfidence: number
  fallbackSupported: boolean
}

export const conciergeAITaskPolicies: Readonly<Record<ConciergeAITask, ConciergeAITaskPolicy>> = {
  classify_intent: { minimumConfidence: 0.45, fallbackSupported: true },
  extract_structured_answer: { minimumConfidence: 0.45, fallbackSupported: true },
  rewrite_question: { minimumConfidence: 0.4, fallbackSupported: true },
  summarize_qualification: { minimumConfidence: 0.4, fallbackSupported: true },
  detect_missing_information: { minimumConfidence: 0.4, fallbackSupported: true },
  prepare_human_handoff: { minimumConfidence: 0.45, fallbackSupported: true },
}
