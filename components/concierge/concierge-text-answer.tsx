'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { ConciergeAnswer, ConciergeQuestion } from '@/lib/concierge/types'

type ConciergeTextAnswerProps = {
  question: ConciergeQuestion
  answer: ConciergeAnswer
  fieldId: string
  describedBy?: string
  hasErrors: boolean
  maxLength: number
  onAnswerChange: (answer: ConciergeAnswer) => void
  onShortKeyDown: React.KeyboardEventHandler<HTMLInputElement>
  onLongKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement>
}

export function ConciergeTextAnswer({
  question,
  answer,
  fieldId,
  describedBy,
  hasErrors,
  maxLength,
  onAnswerChange,
  onShortKeyDown,
  onLongKeyDown,
}: ConciergeTextAnswerProps) {
  if (question.answerType === 'long_text') {
    const value = typeof answer === 'string' ? answer : ''
    return (
      <>
        <Textarea
          id={fieldId}
          value={value}
          onChange={(event) => onAnswerChange(event.target.value)}
          onKeyDown={onLongKeyDown}
          maxLength={maxLength}
          rows={6}
          aria-invalid={hasErrors}
          aria-describedby={describedBy}
          className="min-h-36 resize-y bg-background/45"
        />
        <p className="mt-2 text-right font-mono text-[0.65rem] text-muted-foreground">
          {value.length}/{maxLength} · Ctrl/⌘ + Entrée pour continuer
        </p>
      </>
    )
  }

  if (question.answerType === 'range') {
    const value = typeof answer === 'number' ? answer : (question.validation?.min ?? 0)
    return (
      <div className="rounded-md border border-border bg-background/40 p-4">
        <div className="flex items-center justify-between gap-4">
          <Label htmlFor={fieldId}>Valeur</Label>
          <output htmlFor={fieldId} className="font-mono text-sm text-primary">
            {value}
          </output>
        </div>
        <input
          id={fieldId}
          type="range"
          min={question.validation?.min}
          max={question.validation?.max}
          value={value}
          onChange={(event) => onAnswerChange(event.target.valueAsNumber)}
          aria-describedby={describedBy}
          className="mt-4 h-11 w-full accent-primary"
        />
      </div>
    )
  }

  const type = question.answerType === 'email' ? 'email'
    : question.answerType === 'phone' ? 'tel'
      : question.answerType === 'url' ? 'url'
        : question.answerType === 'number' ? 'number'
          : 'text'
  const value = typeof answer === 'number' || typeof answer === 'string' ? answer : ''
  return (
    <Input
      id={fieldId}
      type={type}
      value={value}
      onChange={(event) =>
        onAnswerChange(type === 'number' ? event.target.valueAsNumber : event.target.value)
      }
      onKeyDown={onShortKeyDown}
      min={question.validation?.min}
      max={question.validation?.max}
      maxLength={type === 'number' ? undefined : maxLength}
      aria-invalid={hasErrors}
      aria-describedby={describedBy}
      autoComplete={
        question.id === 'contact.email' ? 'email'
          : question.id === 'contact.phone' ? 'tel'
            : question.id === 'contact.full_name' ? 'name'
              : 'off'
      }
      className="h-11 bg-background/45"
    />
  )
}
