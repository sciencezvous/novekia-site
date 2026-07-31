'use client'

import Link from 'next/link'
import type { ConciergeAnswer, ConciergeQuestion } from '@/lib/concierge/types'
import { cn } from '@/lib/utils'

type ConciergeChoiceOptionsProps = {
  question: ConciergeQuestion
  answer: ConciergeAnswer
  fieldId: string
  describedBy?: string
  hasErrors: boolean
  onAnswerChange: (answer: ConciergeAnswer) => void
}

export function ConciergeChoiceOptions({
  question,
  answer,
  fieldId,
  describedBy,
  hasErrors,
  onAnswerChange,
}: ConciergeChoiceOptionsProps) {
  if (question.answerType === 'boolean') {
    return (
      <div className="grid grid-cols-2 gap-2">
        {[
          { value: true, label: 'Oui' },
          { value: false, label: 'Non' },
        ].map((option) => (
          <button
            key={option.label}
            type="button"
            aria-pressed={answer === option.value}
            onClick={() => onAnswerChange(option.value)}
            className={cn(
              'min-h-12 rounded-md border px-4 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring',
              answer === option.value
                ? 'border-primary bg-primary/15 text-foreground'
                : 'border-border bg-background/40 text-muted-foreground hover:border-primary/50 hover:text-foreground',
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    )
  }

  if (question.answerType === 'consent') {
    return (
      <label className="flex cursor-pointer items-start gap-3 rounded-md border border-border bg-background/40 p-4 text-sm leading-6 outline-none transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-ring/50">
        <input
          id={fieldId}
          type="checkbox"
          checked={answer === true}
          onChange={(event) => onAnswerChange(event.target.checked)}
          aria-invalid={hasErrors}
          aria-describedby={describedBy}
          className="mt-0.5 size-5 shrink-0 accent-primary focus-visible:outline-none"
        />
        <span>
          {question.prompt}
          {question.id === 'consent.privacy' ? (
            <>
              {' '}
              <Link
                href="/politique-de-confidentialite"
                target="_blank"
                className="text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Lire la politique
              </Link>
            </>
          ) : null}
        </span>
      </label>
    )
  }

  const multiple = question.answerType === 'multiple_choice'
  return (
    <fieldset className="grid gap-2" aria-describedby={describedBy}>
      <legend className="sr-only">{question.prompt}</legend>
      {question.options?.map((option) => {
        const selected = multiple
          ? Array.isArray(answer) && answer.includes(option.value)
          : answer === option.value
        return (
          <label
            key={option.value}
            className={cn(
              'flex min-h-12 cursor-pointer items-start gap-3 rounded-md border px-3.5 py-3 text-sm leading-5 outline-none transition-colors focus-within:ring-2 focus-within:ring-ring',
              selected
                ? 'border-primary bg-primary/12 text-foreground'
                : 'border-border bg-background/40 text-muted-foreground hover:border-primary/50 hover:text-foreground',
            )}
          >
            <input
              type={multiple ? 'checkbox' : 'radio'}
              name={fieldId}
              value={option.value}
              checked={selected}
              onChange={() => {
                if (!multiple) {
                  onAnswerChange(option.value)
                  return
                }
                const current = Array.isArray(answer) ? answer : []
                onAnswerChange(
                  selected
                    ? current.filter((value) => value !== option.value)
                    : [...current, option.value],
                )
              }}
              className="mt-0.5 size-4 shrink-0 accent-primary focus-visible:outline-none"
            />
            <span>
              <span className="block font-medium text-inherit">{option.label}</span>
              {option.helpText ? (
                <span className="mt-1 block text-xs text-muted-foreground">
                  {option.helpText}
                </span>
              ) : null}
            </span>
          </label>
        )
      })}
    </fieldset>
  )
}
