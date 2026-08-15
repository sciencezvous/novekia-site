'use client'

import { getFlowByPath, getStepById } from '@/lib/concierge/flows'
import type { ConciergeRuntimeState } from '@/lib/concierge/runtime'
import type { ConciergeAnswer, ConciergeQuestion } from '@/lib/concierge/types'
import { ConciergeAvatar } from './concierge-avatar'

type ConciergeConversationContextProps = {
  runtime: ConciergeRuntimeState
  currentSection: string
}

function optionLabel(question: ConciergeQuestion, value: string): string {
  return question.options?.find((option) => option.value === value)?.label ?? value
}

function formatAnswer(question: ConciergeQuestion, answer: ConciergeAnswer): string {
  if (question.sensitiveData || ['contact', 'consent'].includes(question.section)) {
    return 'Réponse enregistrée en toute discrétion.'
  }
  if (typeof answer === 'boolean') return answer ? 'Oui' : 'Non'
  if (Array.isArray(answer)) return answer.map((value) => optionLabel(question, value)).join(' · ')
  if (typeof answer === 'number') return String(answer)
  if (typeof answer !== 'string') return 'Réponse enregistrée.'
  const value = optionLabel(question, answer).trim()
  return value.length > 140 ? `${value.slice(0, 137)}…` : value
}

function acknowledgement(section: string): string {
  if (section === 'contact') return 'Votre cadrage est prêt. Je recueille maintenant les coordonnées utiles.'
  if (section === 'consent') return 'Dernière vérification avant de préparer votre demande.'
  return 'C’est noté. Cette réponse précise votre contexte.'
}

export function ConciergeConversationContext({
  runtime,
  currentSection,
}: ConciergeConversationContextProps) {
  const flow = getFlowByPath(runtime.session.activePath)
  if (!flow) return null

  const previousQuestion = [...runtime.visitedStepIds]
    .reverse()
    .map((stepId) => getStepById(flow, stepId))
    .find((step): step is ConciergeQuestion => (
      step?.kind === 'question' &&
      step.id !== runtime.session.currentStepId &&
      runtime.session.answers[step.id] !== undefined
    ))

  if (!previousQuestion) return null
  const answer = runtime.session.answers[previousQuestion.id]
  if (answer === undefined) return null

  return (
    <section className="mb-5 space-y-3 border-b border-border/70 pb-5" aria-label="Dernier échange avec Nova">
      <div className="flex justify-end">
        <div className="max-w-[86%] rounded-lg rounded-tr-sm bg-action px-4 py-3 text-primary-foreground shadow-[0_8px_28px_rgba(8,124,255,0.15)]">
          <p className="text-[0.65rem] font-medium uppercase tracking-[0.12em] text-primary-foreground/70">
            Votre réponse · {previousQuestion.label}
          </p>
          <p className="mt-1 text-sm leading-5">{formatAnswer(previousQuestion, answer)}</p>
        </div>
      </div>
      <div className="flex items-start gap-2.5">
        <ConciergeAvatar size="sm" state="listening" className="mt-0.5" />
        <p className="max-w-[82%] rounded-lg rounded-tl-sm border border-primary/15 bg-primary/[0.045] px-3.5 py-2.5 text-xs leading-5 text-muted-foreground">
          {acknowledgement(currentSection)}
        </p>
      </div>
    </section>
  )
}
