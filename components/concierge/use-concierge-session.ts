'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import {
  advanceConcierge,
  createClientSessionId,
  createConciergeSession,
  emitConciergeEvent,
  getConciergeProgress,
  getCurrentConciergeStep,
  goBackConcierge,
  recordConciergeAnswer,
  recordConciergeSupplementalAnswer,
  restartConciergeSession,
  skipConciergeQuestion,
  startConciergePath,
  type ConciergeRuntimeState,
} from '@/lib/concierge'
import type { ConciergeAnswer, ConciergePath } from '@/lib/concierge/types'

type SubmitAnswerInput = {
  answer: ConciergeAnswer
  supplemental?: string
}

export function useConciergeSession() {
  const pathname = usePathname()
  const [runtime, setRuntime] = useState<ConciergeRuntimeState>(() =>
    createConciergeSession({
      sessionId: createClientSessionId(),
      sourcePage: pathname,
      referrer: '',
    }),
  )
  const [validationErrors, setValidationErrors] = useState<readonly string[]>([])
  const impressionRuntimeRef = useRef(runtime)

  const emit = useCallback((
    eventName: Parameters<typeof emitConciergeEvent>[0]['eventName'],
    state: ConciergeRuntimeState,
    metadata: Parameters<typeof emitConciergeEvent>[0]['metadata'] = {},
  ) => {
    emitConciergeEvent({
      eventName,
      pseudonymousSessionId: state.session.sessionId,
      path: state.session.activePath,
      stepId: state.session.currentStepId,
      sourcePage: state.session.sourcePage,
      metadata,
    })
  }, [])

  useEffect(() => {
    emit('concierge_impression', impressionRuntimeRef.current)
  }, [emit])

  useEffect(() => {
    if (!runtime.session.currentStepId) return
    emit('concierge_step_viewed', runtime, {
      section: getCurrentConciergeStep(runtime)?.section ?? null,
    })
    if (runtime.session.status === 'reviewing_summary') {
      emit('concierge_summary_viewed', runtime)
    } else if (runtime.session.status === 'collecting_contact') {
      emit('concierge_contact_started', runtime)
    } else if (runtime.session.status === 'ready_to_submit') {
      emit('concierge_submission_ready', runtime)
    }
  }, [emit, runtime])

  const currentStep = useMemo(() => getCurrentConciergeStep(runtime), [runtime])
  const progress = useMemo(() => getConciergeProgress(runtime), [runtime])

  const selectPath = useCallback((path: Exclude<ConciergePath, 'unknown'>) => {
    const result = startConciergePath(runtime, path)
    setValidationErrors(result.errors)
    setRuntime(result.state)
    if (result.ok) {
      emit('concierge_started', result.state)
      emit('concierge_path_selected', result.state, { selectedPath: path })
    } else {
      emit('concierge_error', result.state, { errorCode: 'invalid_flow' })
    }
  }, [emit, runtime])

  const submitAnswer = useCallback(({ answer, supplemental }: SubmitAnswerInput) => {
    let result = recordConciergeAnswer(runtime, answer)
    if (result.ok && supplemental) {
      result = recordConciergeSupplementalAnswer(
        result.state,
        runtime.session.currentStepId ?? '',
        supplemental,
      )
    }

    if (!result.ok) {
      setValidationErrors(result.errors)
      setRuntime(result.state)
      emit('concierge_step_validation_failed', result.state, {
        answerType: currentStep?.kind === 'question' ? currentStep.answerType : null,
        validationResult: 'invalid',
      })
      if (result.state.session.errors.at(-1)?.code === 'secret_detected') {
        emit('concierge_error', result.state, { errorCode: 'secret_detected' })
      }
      return
    }

    const advanced = advanceConcierge(result.state)
    setValidationErrors(advanced.errors)
    setRuntime(advanced.state)
    emit('concierge_step_completed', result.state, {
      answerType: currentStep?.kind === 'question' ? currentStep.answerType : null,
      validationResult: 'valid',
    })
    if (currentStep?.kind === 'question' && currentStep.answerType === 'consent' && answer === true) {
      emit('concierge_consent_granted', advanced.state, {
        consentType: currentStep.id === 'consent.contact' ? 'contact' : 'privacy',
      })
    }
  }, [currentStep, emit, runtime])

  const continueSystemStep = useCallback(() => {
    const result = advanceConcierge(runtime)
    setValidationErrors(result.errors)
    setRuntime(result.state)
    if (!result.ok) emit('concierge_error', result.state, { errorCode: 'transition_impossible' })
  }, [emit, runtime])

  const goBack = useCallback(() => {
    const result = goBackConcierge(runtime)
    setValidationErrors(result.errors)
    if (result.ok) setRuntime(result.state)
  }, [runtime])

  const skip = useCallback(() => {
    const result = skipConciergeQuestion(runtime)
    setValidationErrors(result.errors)
    setRuntime(result.state)
  }, [runtime])

  const restart = useCallback(() => {
    const next = restartConciergeSession(runtime, createClientSessionId())
    setRuntime(next)
    setValidationErrors([])
  }, [runtime])

  return {
    runtime,
    currentStep,
    progress,
    validationErrors,
    canGoBack: runtime.visitedStepIds.length > 1,
    selectPath,
    submitAnswer,
    continueSystemStep,
    goBack,
    skip,
    restart,
    emit,
  }
}
