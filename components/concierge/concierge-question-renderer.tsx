'use client'

import { useId, useState } from 'react'
import { ArrowLeft, ArrowRight, ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { ConciergeAnswer, ConciergeQuestion } from '@/lib/concierge/types'
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
  if (question.answerType === 'boolean' || question.answerType === 'consent') return false
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
  const visibleErrors = localError ? [localError] : errors
  const describedBy = [question.helpText ? helpId : '', visibleErrors.length ? errorId : '']
    .filter(Boolean)
    .join(' ') || undefined

  function submit() {
    if (answerHasOther(question, answer) && !supplemental.trim()) {
      setLocalError('Précisez votre réponse dans le champ « Autre ».')
      return
    }
    setLocalError('')
    onContinue({ answer, supplemental: supplemental.trim() || undefined })
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

  return (
    <div data-concierge-step-id={question.id}>
      {question.answerType !== 'consent' ? (
        <div>
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-primary">
            {question.required ? 'Réponse requise' : 'Réponse facultative'}
          </p>
          <Label htmlFor={fieldId} className="mt-3 block text-balance text-xl font-semibold leading-7">
            {question.prompt}
          </Label>
        </div>
      ) : (
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-primary">
          Consentement explicite
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
            onAnswerChange={setAnswer}
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
        <Button type="button" size="lg" onClick={submit} className="ml-auto min-h-11 px-4">
          Continuer
          <ArrowRight aria-hidden="true" />
        </Button>
      </div>
    </div>
  )
}
