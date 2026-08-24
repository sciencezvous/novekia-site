'use client'

import { FormEvent, useEffect, useState } from 'react'
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  LoaderCircle,
  Mail,
  RotateCcw,
  Search,
  ShieldCheck,
  X,
} from 'lucide-react'
import { trackAuditEvent } from '@/lib/audit-events'
import {
  isPublicAuditResult,
  type PublicAuditResult,
} from '@/lib/audit-contract'
import { getStoredAttribution } from '@/lib/lead-attribution'

export function AuditExperience() {
  const [url, setUrl] = useState('')
  const [result, setResult] = useState<PublicAuditResult | null>(null)
  const [auditLoading, setAuditLoading] = useState(false)
  const [auditError, setAuditError] = useState('')
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [website, setWebsite] = useState('')
  const [reportLoading, setReportLoading] = useState(false)
  const [reportSent, setReportSent] = useState(false)
  const [reportError, setReportError] = useState('')
  const [reportModalOpen, setReportModalOpen] = useState(false)

  useEffect(() => {
    if (!reportModalOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !reportLoading) {
        setReportModalOpen(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [reportModalOpen, reportLoading])

  async function startAudit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (auditLoading) return

    setAuditError('')
    setReportError('')
    setReportSent(false)
    setReportModalOpen(false)
    setResult(null)
    setAuditLoading(true)
    trackAuditEvent('AuditStarted', { source: 'public_audit_v1' })

    try {
      const response = await fetch('/api/audit/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      const payload: unknown = await response.json()

      if (!response.ok) {
        const message =
          payload && typeof payload === 'object' && 'error' in payload
            ? String((payload as { error?: unknown }).error || '')
            : ''
        throw new Error(message || 'Le pré-audit n’a pas pu être terminé.')
      }
      if (!isPublicAuditResult(payload)) {
        throw new Error('Le moteur a renvoyé un résultat incomplet.')
      }

      setResult(payload)
      setReportModalOpen(true)
      trackAuditEvent('AuditCompleted', {
        public_audit_score: payload.public_audit_score,
        coverage: payload.coverage,
        score_version: payload.score_version,
        findings_count: payload.total_findings,
        pages_collected: payload.pages_collected,
      })
    } catch (error) {
      setAuditError(
        error instanceof Error
          ? error.message
          : 'Le pré-audit est momentanément indisponible.'
      )
      trackAuditEvent('AuditFailed', { source: 'public_audit_v1' })
    } finally {
      setAuditLoading(false)
    }
  }

  async function requestReport(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!result || reportLoading) return

    setReportError('')
    setReportLoading(true)

    try {
      const response = await fetch('/api/audit/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          auditId: result.audit_id,
          email,
          consent,
          website,
          attribution: getStoredAttribution(),
        }),
      })
      const payload = (await response.json()) as { success?: boolean; error?: string }
      if (!response.ok || !payload.success) {
        throw new Error(payload.error || 'Le rapport n’a pas pu être envoyé.')
      }

      setReportSent(true)
      trackAuditEvent('EmailSubmitted', {
        public_audit_score: result.public_audit_score,
        coverage: result.coverage,
        score_version: result.score_version,
      })
    } catch (error) {
      setReportError(
        error instanceof Error
          ? error.message
          : 'Le rapport n’a pas pu être envoyé.'
      )
    } finally {
      setReportLoading(false)
    }
  }

  function resetAudit() {
    setResult(null)
    setAuditError('')
    setReportError('')
    setReportSent(false)
    setReportModalOpen(false)
    setEmail('')
    setConsent(false)
    setWebsite('')
    setUrl('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="mx-auto w-full max-w-5xl">
      {!result ? (
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-12">
          <div>
            <div className="inline-flex items-center gap-2 border border-primary/30 bg-primary/5 px-3 py-2 font-mono text-xs uppercase tracking-[0.12em] text-primary">
              <Search aria-hidden="true" className="size-4" />
              Pré-audit public Novekia
            </div>
            <h1 className="mt-7 max-w-3xl text-balance text-4xl font-semibold leading-[0.98] tracking-[-0.045em] sm:text-6xl">
              Votre site est-il correctement compris par{' '}
              <span className="text-primary">Google et les moteurs IA&nbsp;?</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              Entrez votre URL. Le moteur Novekia contrôle un échantillon public,
              mesure des fondamentaux SEO, l’indexabilité, les données structurées
              et des signaux d’entité, puis prépare un compte rendu fondé sur les
              preuves disponibles.
            </p>

            <ul className="mt-7 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 aria-hidden="true" className="size-4 text-primary" />
                Aucun compte à créer
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 aria-hidden="true" className="size-4 text-primary" />
                Score visible avant l’email
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck aria-hidden="true" className="size-4 text-primary" />
                Pages publiques uniquement
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck aria-hidden="true" className="size-4 text-primary" />
                Aucun accès à votre CMS
              </li>
            </ul>
          </div>

          <div className="border border-border bg-background/95 p-5 shadow-2xl shadow-black/10 sm:p-7">
            <div className="flex items-center justify-between gap-4 border-b border-border pb-5">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.12em] text-primary">
                  Étape unique
                </p>
                <h2 className="mt-2 text-xl font-semibold">Quel site analyser&nbsp;?</h2>
              </div>
              <div className="font-mono text-xs text-muted-foreground">01 / 01</div>
            </div>

            <form onSubmit={startAudit} className="mt-6">
              <label htmlFor="audit-url" className="text-sm font-medium">
                Adresse du site
              </label>
              <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                <input
                  id="audit-url"
                  type="text"
                  inputMode="url"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  required
                  maxLength={1000}
                  value={url}
                  onChange={(event) => setUrl(event.target.value)}
                  placeholder="exemple.fr"
                  disabled={auditLoading}
                  className="min-h-14 min-w-0 flex-1 border border-border bg-background px-4 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={auditLoading || !url.trim()}
                  className="inline-flex min-h-14 items-center justify-center gap-2 bg-primary px-5 font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {auditLoading ? (
                    <>
                      <LoaderCircle aria-hidden="true" className="size-5 animate-spin" />
                      Analyse…
                    </>
                  ) : (
                    <>
                      Analyser mon site
                      <ArrowRight aria-hidden="true" className="size-5" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {auditLoading && (
              <div
                className="mt-6 border border-primary/20 bg-primary/5 p-4"
                role="status"
                aria-live="polite"
              >
                <div className="flex gap-3">
                  <LoaderCircle
                    aria-hidden="true"
                    className="mt-0.5 size-5 shrink-0 animate-spin text-primary"
                  />
                  <div>
                    <p className="font-medium">Le moteur examine le site réel.</p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      Collecte bornée, robots.txt, sitemap, indexabilité, structure
                      des pages et données structurées. Cela peut prendre quelques
                      dizaines de secondes.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {auditError && (
              <div
                className="mt-6 border border-destructive/30 bg-destructive/5 p-4 text-sm leading-6 text-destructive"
                role="alert"
              >
                {auditError}
              </div>
            )}

            <p className="mt-5 text-xs leading-5 text-muted-foreground">
              Pré-audit borné fondé sur les seules informations accessibles
              publiquement. Il ne constitue ni une certification, ni un audit
              exhaustif, ni une garantie de classement.
            </p>
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-3xl">
          <section
            className="border border-border bg-background p-5 shadow-2xl shadow-black/10 sm:p-8"
            aria-labelledby="audit-score-title"
          >
            <p className="font-mono text-xs uppercase tracking-[0.12em] text-primary">
              Pré-audit terminé · {result.target_domain}
            </p>

            <div className="mt-5 flex flex-wrap items-baseline gap-x-4 gap-y-2">
              <p className="text-6xl font-semibold tracking-tight text-primary sm:text-7xl">
                {result.public_audit_score}/100
              </p>
              <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                Score du pré-audit public
              </p>
            </div>

            <h1 id="audit-score-title" className="mt-6 text-2xl font-semibold sm:text-3xl">
              Votre compte rendu détaillé est prêt.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              Les constats, preuves disponibles et recommandations ne sont pas
              affichés publiquement sur cette page. Recevez-les directement par email.
            </p>

            <div className="mt-7 h-2 overflow-hidden bg-secondary" aria-hidden="true">
              <div
                className="h-full bg-primary transition-[width] duration-700"
                style={{ width: `${result.public_audit_score}%` }}
              />
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setReportModalOpen(true)}
                className="inline-flex min-h-14 flex-1 items-center justify-center gap-2 bg-primary px-5 font-semibold text-primary-foreground transition hover:opacity-90"
              >
                <Mail aria-hidden="true" className="size-5" />
                {reportSent ? 'Rapport envoyé' : 'Recevoir mon rapport par email'}
              </button>
              <button
                type="button"
                onClick={resetAudit}
                className="inline-flex min-h-14 items-center justify-center gap-2 border border-border px-5 font-medium transition hover:border-primary/60"
              >
                <RotateCcw aria-hidden="true" className="size-4" />
                Auditer un autre site
              </button>
            </div>

            <p className="mt-6 text-xs leading-5 text-muted-foreground">
              Score calculé uniquement sur les contrôles réellement évalués selon
              la méthode {result.score_version}. Il ne constitue ni un score Google,
              ni une certification, ni un score GEO/AEO officiel.
            </p>
          </section>
        </div>
      )}

      {result && reportModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !reportLoading) {
              setReportModalOpen(false)
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="audit-report-dialog-title"
            className="max-h-[92dvh] w-full max-w-xl overflow-y-auto border border-border bg-background p-5 shadow-2xl sm:p-7"
          >
            <div className="flex items-start justify-between gap-5">
              <div>
                <div className="flex items-center gap-2 text-primary">
                  <FileText aria-hidden="true" className="size-5" />
                  <span className="font-mono text-xs uppercase tracking-[0.12em]">
                    Rapport de pré-audit
                  </span>
                </div>
                <h2 id="audit-report-dialog-title" className="mt-3 text-2xl font-semibold">
                  {reportSent ? 'Rapport envoyé.' : 'Recevez le détail de votre pré-audit.'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setReportModalOpen(false)}
                disabled={reportLoading}
                aria-label="Fermer"
                className="inline-flex size-11 shrink-0 items-center justify-center border border-border transition hover:border-primary/60 disabled:opacity-50"
              >
                <X aria-hidden="true" className="size-5" />
              </button>
            </div>

            {reportSent ? (
              <div className="mt-7" role="status" aria-live="polite">
                <CheckCircle2 aria-hidden="true" className="size-9 text-primary" />
                <p className="mt-4 leading-7 text-muted-foreground">
                  Vérifiez votre boîte de réception. Le compte rendu contient la note,
                  les preuves disponibles et les recommandations du pré-audit.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => setReportModalOpen(false)}
                    className="inline-flex min-h-12 items-center justify-center border border-border px-5 font-medium transition hover:border-primary/60"
                  >
                    Fermer
                  </button>
                  <a
                    href="/#contact"
                    className="inline-flex min-h-12 items-center justify-center gap-2 bg-primary px-5 font-semibold text-primary-foreground transition hover:opacity-90"
                  >
                    Améliorer mon site avec Novekia
                    <ArrowRight aria-hidden="true" className="size-5" />
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={requestReport} className="mt-7">
                <p className="text-sm leading-6 text-muted-foreground">
                  Score observé&nbsp;: <strong className="text-foreground">{result.public_audit_score}/100</strong>.
                  Saisissez votre email pour recevoir le compte rendu détaillé.
                </p>

                <label htmlFor="audit-email" className="mt-6 block text-sm font-medium">
                  Email professionnel
                </label>
                <div className="relative mt-2">
                  <Mail
                    aria-hidden="true"
                    className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  />
                  <input
                    id="audit-email"
                    type="email"
                    autoComplete="email"
                    autoFocus
                    required
                    maxLength={254}
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="min-h-14 w-full border border-border bg-background pl-11 pr-4 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="vous@entreprise.fr"
                  />
                </div>

                <div
                  className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden"
                  aria-hidden="true"
                >
                  <label htmlFor="audit-website">Site web</label>
                  <input
                    id="audit-website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={website}
                    onChange={(event) => setWebsite(event.target.value)}
                  />
                </div>

                <label className="mt-4 flex cursor-pointer items-start gap-3 text-xs leading-5 text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(event) => setConsent(event.target.checked)}
                    className="mt-1 size-4 shrink-0 accent-current"
                    required
                  />
                  <span>
                    J’accepte de recevoir ce rapport par email et que Novekia puisse
                    me recontacter au sujet de cet audit. Données traitées selon la
                    politique de confidentialité.
                  </span>
                </label>

                {reportError && (
                  <p className="mt-4 text-sm text-destructive" role="alert">
                    {reportError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={reportLoading || !email.trim() || !consent}
                  className="mt-6 inline-flex min-h-14 w-full items-center justify-center gap-2 bg-primary px-5 font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {reportLoading ? (
                    <LoaderCircle aria-hidden="true" className="size-5 animate-spin" />
                  ) : (
                    <ArrowRight aria-hidden="true" className="size-5" />
                  )}
                  Recevoir mon compte rendu
                </button>

                <p className="mt-4 text-center text-[11px] leading-5 text-muted-foreground">
                  Aucun compte à créer. Le rapport est lié au site audité et à la
                  méthode {result.score_version}.
                </p>
              </form>
            )}
          </section>
        </div>
      )}
    </div>
  )
}