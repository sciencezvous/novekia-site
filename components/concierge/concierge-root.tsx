'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowLeft, ArrowRight, BookOpen, Cpu, MessageSquare, Search, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { conciergeDefinition, getConciergePageSuggestion } from '@/lib/concierge'
import { CONCIERGE_OPEN_REQUEST_EVENT } from '@/lib/concierge/config'
import type { ConciergePath } from '@/lib/concierge/types'
import { ConciergeErrorBoundary } from './concierge-error-boundary'
import { ConciergeAvatar } from './concierge-avatar'
import { ConciergeConversationContext } from './concierge-conversation-context'
import { ConciergeInformation } from './concierge-information'
import { ConciergeIntentAssistance } from './concierge-intent-assistance'
import { ConciergeLauncher } from './concierge-launcher'
import { ConciergePanel } from './concierge-panel'
import { ConciergeProgress } from './concierge-progress'
import { ConciergeQuestionRenderer } from './concierge-question-renderer'
import { ConciergeSummaryView } from './concierge-summary'
import { useConciergeSession } from './use-concierge-session'

type StaticScreen = 'choices' | 'information' | 'direct_contact' | 'intent_assistance'

const initialChoiceIcons = [Search, Cpu, BookOpen, MessageSquare] as const

function ConciergeRootContent() {
  const pathname = usePathname()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)
  const [staticScreen, setStaticScreen] = useState<StaticScreen>('choices')
  const concierge = useConciergeSession()
  const hasAnswers = Object.keys(concierge.runtime.session.answers).length > 0
  const pageSuggestion = getConciergePageSuggestion(pathname)

  useEffect(() => {
    function handleOpenRequest() {
      setOpen(true)
    }

    window.addEventListener(CONCIERGE_OPEN_REQUEST_EVENT, handleOpenRequest)
    return () => {
      window.removeEventListener(CONCIERGE_OPEN_REQUEST_EVENT, handleOpenRequest)
    }
  }, [])

  function openPanel() {
    setOpen(true)
    concierge.emit('concierge_opened', concierge.runtime)
  }

  function closePanel() {
    concierge.cancelAIRequest()
    concierge.cancelSubmission()
    setOpen(false)
    requestAnimationFrame(() => triggerRef.current?.focus())
  }

  function restart() {
    if (hasAnswers && !window.confirm('Recommencer effacera les réponses saisies dans cette page. Continuer ?')) {
      return
    }
    concierge.restart()
    setStaticScreen('choices')
  }

  function chooseInitialPath(path: Exclude<ConciergePath, 'unknown'>) {
    if (path === 'information') {
      setStaticScreen('information')
      concierge.emit('concierge_path_selected', concierge.runtime, { selectedPath: path })
      return
    }
    if (path === 'direct_contact') {
      setStaticScreen('direct_contact')
      concierge.emit('concierge_path_selected', concierge.runtime, { selectedPath: path })
      return
    }
    concierge.selectPath(path)
  }

  function renderInitialChoices() {
    return (
      <div>
        <div className="flex items-start gap-3 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300">
          <ConciergeAvatar size="sm" state="speaking" className="mt-1" />
          <div className="min-w-0 flex-1 rounded-lg rounded-tl-sm border border-primary/20 bg-primary/[0.06] p-4">
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-primary">Nova</p>
            <h3 className="mt-2.5 text-balance text-xl font-semibold tracking-tight">Parlons de votre objectif.</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {conciergeDefinition.openingMessage.replace('Parlons de votre objectif. ', '')}
            </p>
          </div>
        </div>
        {pageSuggestion ? (
          <p className="mt-4 border-l-2 border-primary pl-3 text-xs leading-5 text-muted-foreground">
            {pageSuggestion} Cette indication ne présélectionne aucun parcours.
          </p>
        ) : null}
        <p className="mb-2 mt-6 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-muted-foreground">
          Réponses rapides
        </p>
        <div className="grid gap-2">
          {conciergeDefinition.initialChoices.map((choice, index) => {
            const Icon = initialChoiceIcons[index]
            return (
              <button
                key={choice.id}
                type="button"
                onClick={() => chooseInitialPath(choice.path)}
                className="group flex min-h-14 items-center gap-3 rounded-md border border-border bg-background/40 px-4 py-3 text-left outline-none transition-[border-color,background-color,transform] hover:-translate-y-0.5 hover:border-primary/60 hover:bg-primary/5 focus-visible:ring-2 focus-visible:ring-ring active:translate-y-0 motion-reduce:transition-none"
              >
                <Icon aria-hidden="true" className="size-5 shrink-0 text-primary" />
                <span className="flex-1 text-sm font-medium">{choice.label}</span>
                <ArrowRight aria-hidden="true" className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
              </button>
            )
          })}
        </div>
        {concierge.runtime.session.aiAssistance.enabled ? (
          <button
            type="button"
            onClick={() => setStaticScreen('intent_assistance')}
            className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-primary/25 px-4 text-sm font-medium text-primary outline-none transition-colors hover:border-primary/55 hover:bg-primary/5 focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Sparkles aria-hidden="true" className="size-4" />
            Décrire mon besoin en une phrase
          </button>
        ) : null}
        <p className="mt-5 text-xs leading-5 text-muted-foreground">
          Les réponses restent en mémoire dans cette page et ne sont transmises qu’après votre action explicite.
        </p>
      </div>
    )
  }

  function renderDirectContact() {
    return (
      <div>
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-primary">Échange humain</p>
        <h3 className="mt-3 text-balance text-2xl font-semibold">Contacter directement Novekia.</h3>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Le formulaire du site permet de décrire votre besoin et de préparer un échange humain. Aucune coordonnée n’est demandée dans l’assistant avant ce clic.
        </p>
        <Link
          href="/#contact"
          onClick={closePanel}
          className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Ouvrir le formulaire de contact
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
        <Button type="button" variant="ghost" size="lg" onClick={() => setStaticScreen('choices')} className="mt-2 min-h-11 w-full">
          <ArrowLeft aria-hidden="true" /> Retour
        </Button>
      </div>
    )
  }

  function renderActiveRuntime() {
    const step = concierge.currentStep
    if (!step) {
      return (
        <div>
          <h3 className="text-lg font-semibold">Une difficulté empêche de poursuivre cette étape.</h3>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">Vous pouvez recommencer ou contacter directement Novekia.</p>
          <Button type="button" onClick={restart} className="mt-5 min-h-11">Recommencer</Button>
        </div>
      )
    }

    if (step.kind === 'system' && step.stepType === 'summary' && concierge.runtime.session.summary) {
      return (
        <ConciergeSummaryView
          summary={concierge.runtime.session.summary}
          onContinue={concierge.continueSystemStep}
          onBack={concierge.goBack}
          onRestart={restart}
          ai={{
            enabled: concierge.runtime.session.aiAssistance.enabled,
            disclosureAcknowledged: concierge.runtime.session.aiAssistance.disclosureAcknowledged,
            status: concierge.runtime.session.aiAssistance.status,
            onRequest: (input) => concierge.requestAI('summarize_qualification', input),
            onDisable: concierge.disableAIAssistance,
            assisted: concierge.assistedSummary,
            onAssistedChange: concierge.setAssistedSummary,
          }}
        />
      )
    }

    if (step.kind === 'system' && step.stepType === 'ready_to_submit' && concierge.runtime.session.summary) {
      return (
        <ConciergeSummaryView
          summary={concierge.runtime.session.summary}
          onContinue={() => undefined}
          onBack={concierge.goBack}
          onRestart={restart}
          onClose={closePanel}
          onSubmit={concierge.submitConcierge}
          submission={concierge.submission}
          final
        />
      )
    }

    if (step.kind !== 'question') return null
    const supplemental = concierge.runtime.session.answers[`${step.id}.__other`]
    return (
      <div>
        <ConciergeProgress progress={concierge.progress} />
        <ConciergeConversationContext
          runtime={concierge.runtime}
          currentSection={step.section}
        />
        <ConciergeQuestionRenderer
          key={`${step.id}:${concierge.validationErrors.some((error) => /secret|mot de passe|clé|jeton/i.test(error)) ? 'redacted' : 'active'}`}
          question={step}
          initialAnswer={concierge.runtime.session.answers[step.id]}
          initialSupplemental={typeof supplemental === 'string' ? supplemental : ''}
          errors={concierge.validationErrors}
          canGoBack={concierge.canGoBack}
          onContinue={concierge.submitAnswer}
          onBack={concierge.goBack}
          onSkip={concierge.skip}
        />
      </div>
    )
  }

  const hasActiveRuntime = concierge.runtime.session.activePath !== 'unknown'
  const avatarState = (
    concierge.runtime.session.aiAssistance.status === 'requesting' ||
    concierge.submission.status === 'submitting'
  ) ? 'thinking' : hasActiveRuntime ? 'listening' : 'idle'

  return (
    <>
      <ConciergeLauncher
        open={open}
        onClick={open ? closePanel : openPanel}
        triggerRef={triggerRef}
      />
      {open ? (
        <ConciergePanel
          onClose={closePanel}
          onRestart={restart}
          avatarState={avatarState}
          hasAnswers={
            hasAnswers &&
            concierge.submission.status !== 'submitted' &&
            concierge.submission.status !== 'submitting'
          }
        >
          <div aria-live="polite" className="sr-only">
            {concierge.validationErrors[0] ?? (
              hasActiveRuntime ? `Étape ${concierge.progress.current} sur ${concierge.progress.total}` : 'Choisissez un objectif.'
            )}
          </div>
          {hasActiveRuntime
            ? renderActiveRuntime()
            : staticScreen === 'information'
              ? (
                  <ConciergeInformation
                    onChooseQualification={() => setStaticScreen('choices')}
                    onBack={() => setStaticScreen('choices')}
                    onNavigate={closePanel}
                  />
                )
              : staticScreen === 'direct_contact'
                ? renderDirectContact()
                : staticScreen === 'intent_assistance'
                  ? (
                      <ConciergeIntentAssistance
                        status={concierge.runtime.session.aiAssistance.status}
                        onAnalyze={(description) => concierge.requestAI('classify_intent', description)}
                        onConfirm={(path) => {
                          concierge.selectPath(path)
                          setStaticScreen('choices')
                        }}
                        onChooseManually={() => setStaticScreen('choices')}
                        onDisable={() => {
                          concierge.disableAIAssistance()
                          setStaticScreen('choices')
                        }}
                      />
                    )
                : renderInitialChoices()}
        </ConciergePanel>
      ) : null}
    </>
  )
}

export function ConciergeRoot() {
  const [mounted, setMounted] = useState(true)
  const [resetKey, setResetKey] = useState(0)
  if (!mounted) return null
  return (
    <ConciergeErrorBoundary
      onClose={() => setMounted(false)}
      onRestart={() => setResetKey((current) => current + 1)}
    >
      <ConciergeRootContent key={resetKey} />
    </ConciergeErrorBoundary>
  )
}
