'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, LoaderCircle, ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { ConciergeAnswer, ConciergeQuestion } from '@/lib/concierge/types'
import { ConciergeAvatar } from './concierge-avatar'
import { ConciergeChoiceOptions } from './concierge-choice-options'
import { ConciergeTextAnswer } from './concierge-text-answer'

type QuestionSubmission = {
  answer: ConciergeAnswer
  supplemental?: string
}

type ConciergeQuestionRendererProps = {
  question: ConciergeQuestion
  initialAnswer: ConciergeAnswer | undefined
  initialSupplemental?: string
  errors: readonly string[]
  canGoBack: boolean
  onContinue: (submission: QuestionSubmission) => void
  onBack: () => void
  onSkip: () => void
}

function isOtherOption(value: string, label: string): boolean {
  return value === 'other' || /autre/i.test(label)
}

function defaultAnswer(question: ConciergeQuestion, answer: ConciergeAnswer | undefined): ConciergeAnswer {
  if (answer !== undefined) return answer
  if (question.answerType === 'multiple_choice') return []
  if (question.answerType === 'boolean') return null
  if (question.answerType === 'consent') return false
  if (question.answerType === 'range') return question.validation?.min ?? 0
  return ''
}

function answerHasOther(question: ConciergeQuestion, answer: ConciergeAnswer): boolean {
  const values = Array.isArray(answer) ? answer : [answer]
  return question.options?.some(
    (option) =>
      values.includes(option.value) && isOtherOption(option.value, option.label),
  ) ?? false
}

function isSensitiveContext(question: ConciergeQuestion): boolean {
  return question.sensitiveData || [
    'constraints',
    'local_ai',
    'ai_infrastructure',
    'cybersecurity_authorized_audit',
    'backup_continuity',
  ].includes(question.section)
}

function answerLabel(question: ConciergeQuestion, answer: ConciergeAnswer): string {
  if (typeof answer === 'boolean') return answer ? 'Oui' : 'Non'
  if (typeof answer !== 'string') return ''
  return question.options?.find((option) => option.value === answer)?.label ?? answer
}

export function ConciergeQuestionRenderer({
  question,
  initialAnswer,
  initialSupplemental = '',
  errors,
  canGoBack,
  onContinue,
  onBack,
  onSkip,
}: ConciergeQuestionRendererProps) {
  const fieldId = useId()
  const errorId = `${fieldId}-error`
  const helpId = `${fieldId}-help`
  const [answer, setAnswer] = useState<ConciergeAnswer>(() =>
    defaultAnswer(question, initialAnswer),
  )
  const [supplemental, setSupplemental] = useState(initialSupplemental)
  const [localError, setLocalError] = useState('')
  const [advancingAnswer, setAdvancingAnswer] = useState<ConciergeAnswer | null>(null)
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const visibleErrors = localError ? [localError] : errors
  const describedBy = [question.helpText ? helpId : '', visibleErrors.length ? errorId : '']
    .filter(Boolean)
    .join(' ') || undefined

  useEffect(() => () => {
    if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current)
  }, [])

  function submit() {
    if (answerHasOther(question, answer) && !supplemental.trim()) {
      setLocalError('Précisez votre réponse dans le champ « Autre ».')
      return
    }
    setLocalError('')
    onContinue({ answer, supplemental: supplemental.trim() || undefined })
  }

  function handleAnswerChange(nextAnswer: ConciergeAnswer) {
    if (advanceTimerRef.current) return
    setAnswer(nextAnswer)
    setLocalError('')

    const canAdvanceImmediately = (
      question.answerType === 'single_choice' || question.answerType === 'boolean'
    ) && !answerHasOther(question, nextAnswer)

    if (!canAdvanceImmediately) return

    setAdvancingAnswer(nextAnswer)
    advanceTimerRef.current = setTimeout(() => {
      onContinue({ answer: nextAnswer })
    }, 420)
  }

  function handleShortKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault()
      submit()
    }
  }

  function handleLongKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault()
      submit()
    }
  }

  const maxLength = question.validation?.maxLength ?? (
    question.answerType === 'long_text' ? 1500
      : question.answerType === 'email' ? 254
        : question.answerType === 'phone' ? 40
          : question.answerType === 'url' ? 500
            : 160
  )
  const choiceQuestion = ['single_choice', 'multiple_choice', 'boolean', 'consent']
    .includes(question.answerType)
  const autoAdvanceQuestion = ['single_choice', 'boolean'].includes(question.answerType)
  const isAdvancing = advancingAnswer !== null

  return (
    <div data-concierge-step-id={question.id}>
      <div className="flex items-start gap-3 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300">
        <ConciergeAvatar size="sm" className="mt-1" />
        <div className="min-w-0 flex-1 rounded-lg rounded-tl-sm border border-primary/20 bg-primary/[0.06] p-4">
          {question.answerType !== 'consent' ? (
            <div>
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-primary">
                Nova · {question.required ? 'réponse requise' : 'réponse facultative'}
              </p>
              <Label htmlFor={fieldId} className="mt-2.5 block text-balance text-lg font-semibold leading-7 sm:text-xl">
                {question.prompt}
              </Label>
            </div>
          ) : (
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-primary">
              Nova · consentement explicite
            </p>
          )}

          {question.helpText ? (
            <p id={helpId} className="mt-3 text-sm leading-6 text-muted-foreground">
              {question.helpText}
            </p>
          ) : null}
          {question.id === 'contact.email' ? (
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Une adresse professionnelle est préférable lorsque vous en disposez.
            </p>
          ) : null}
        </div>
      </div>
      {isSensitiveContext(question) ? (
        <div className="mt-4 flex gap-3 border border-primary/20 bg-primary/5 p-3 text-xs leading-5 text-muted-foreground">
          <ShieldAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
          <p>Ne partagez aucun mot de passe, clé d’API, secret, document confidentiel ou donnée personnelle inutile.</p>
        </div>
      ) : null}

      <div className="mt-5">
        {choiceQuestion ? (
          <ConciergeChoiceOptions
            question={question}
            answer={answer}
            fieldId={fieldId}
            describedBy={describedBy}
            hasErrors={visibleErrors.length > 0}
            disabled={isAdvancing}
            onAnswerChange={handleAnswerChange}
          />
        ) : (
          <ConciergeTextAnswer
            question={question}
            answer={answer}
            fieldId={fieldId}
            describedBy={describedBy}
            hasErrors={visibleErrors.length > 0}
            maxLength={maxLength}
            onAnswerChange={setAnswer}
            onShortKeyDown={handleShortKeyDown}
            onLongKeyDown={handleLongKeyDown}
          />
        )}
      </div>

      {isAdvancing ? (
        <div className="mt-4 flex justify-end" role="status" aria-live="polite">
          <div className="max-w-[85%] rounded-lg rounded-tr-sm bg-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow-[0_8px_28px_rgba(8,124,255,0.18)] motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-1">
            <span>{answerLabel(question, advancingAnswer)}</span>
            <LoaderCircle aria-hidden="true" className="ml-2 inline size-3.5 animate-spin motion-reduce:animate-none" />
          </div>
        </div>
      ) : null}

      {answerHasOther(question, answer) ? (
        <div className="mt-4">
          <Label htmlFor={`${fieldId}-other`}>Précisez votre réponse</Label>
          <Input
            id={`${fieldId}-other`}
            value={supplemental}
            onChange={(event) => setSupplemental(event.target.value)}
            onKeyDown={handleShortKeyDown}
            maxLength={160}
            aria-invalid={Boolean(localError)}
            aria-describedby={localError ? errorId : undefined}
            className="mt-2 h-11 bg-background/45"
          />
        </div>
      ) : null}

      {visibleErrors.length > 0 ? (
        <div id={errorId} role="alert" className="mt-4 border-l-2 border-destructive pl-3 text-sm leading-6 text-destructive">
          {visibleErrors.map((error) => <p key={error}>{error}</p>)}
        </div>
      ) : null}

      <div className="mt-7 flex flex-wrap items-center gap-2 border-t border-border pt-4">
        <Button type="button" variant="outline" size="lg" onClick={onBack} disabled={!canGoBack} className="min-h-11">
          <ArrowLeft aria-hidden="true" />
          Retour
        </Button>
        {!question.required ? (
          <Button type="button" variant="ghost" size="lg" onClick={onSkip} className="min-h-11">
            Passer
          </Button>
        ) : null}
        {autoAdvanceQuestion && !answerHasOther(question, answer) ? (
          <p className="ml-auto text-right text-xs leading-5 text-muted-foreground">
            {isAdvancing ? 'Je prépare la suite…' : 'Votre choix vous fait avancer automatiquement.'}
          </p>
        ) : (
          <Button type="button" size="lg" onClick={submit} disabled={isAdvancing} className="ml-auto min-h-11 px-4">
            Continuer
            <ArrowRight aria-hidden="true" />
          </Button>
        )}
      </div>
    </div>
  )
}
