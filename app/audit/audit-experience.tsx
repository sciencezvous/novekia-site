'use client'

import { FormEvent, useState } from 'react'
import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  FileText,
  LoaderCircle,
  Mail,
  RotateCcw,
  Search,
  ShieldCheck,
} from 'lucide-react'
import { trackAuditEvent } from '@/lib/audit-events'
import {
  isPublicAuditResult,
  type PublicAuditResult,
} from '@/lib/audit-contract'
import { getStoredAttribution } from '@/lib/lead-attribution'

const CATEGORY_LABELS: Record<string, string> = {
  technical_seo: 'SEO technique',
  on_page_seo: 'SEO on-page',
  geo_readiness: 'GEO / signaux AEO',
  trust_authority: 'Confiance & autorité',
  conversion: 'Conversion',
  performance_observation: 'Performance observée',
  public_hygiene: 'Hygiène publique',
  accessibility_observation: 'Accessibilité observée',
}

const SEVERITY_LABELS: Record<string, string> = {
  critical: 'Critique',
  high: 'Élevée',
  medium: 'Moyenne',
  low: 'Faible',
  info: 'Information',
}

function categoryLabel(value: string) {
  return CATEGORY_LABELS[value] ?? value.replaceAll('_', ' ')
}

function severityLabel(value: string) {
  return SEVERITY_LABELS[value] ?? value
}

function safeEvidenceUrl(value: string | null) {
  if (!value) return null
  try {
    const parsed = new URL(value)
    return ['http:', 'https:'].includes(parsed.protocol) ? parsed.toString() : null
  } catch {
    return null
  }
}

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

  async function startAudit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (auditLoading) return

    setAuditError('')
    setReportError('')
    setReportSent(false)
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
      trackAuditEvent('AuditCompleted', {
        opportunity_index: payload.opportunity_index,
        findings_count: payload.total_findings,
        pages_collected: payload.pages_collected,
      })
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Le pré-audit est momentanément indisponible.'
      setAuditError(message)
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
        opportunity_index: result.opportunity_index,
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
    setEmail('')
    setConsent(false)
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
              Votre site est-il vraiment visible par{' '}
              <span className="text-primary">Google et les moteurs IA&nbsp;?</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              Entrez simplement votre URL. Novekia analyse un échantillon public
              de votre site et recherche des opportunités SEO, GEO, de réponse
              structurée et de conversion.
            </p>

            <ul className="mt-7 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 aria-hidden="true" className="size-4 text-primary" />
                Aucun compte à créer
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 aria-hidden="true" className="size-4 text-primary" />
                Valeur visible avant l’email
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
                      Collecte bornée, robots.txt, sitemap, structure des pages,
                      signaux SEO/GEO, réponses structurées, confiance et conversion.
                      Cela peut prendre quelques dizaines de secondes.
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
              publiquement. Il ne constitue ni une certification ni un audit
              exhaustif et ne garantit aucun classement.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="border border-border bg-background p-5 sm:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.12em] text-primary">
                  Pré-audit terminé · {result.target_domain}
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                  Indice d’opportunité{' '}
                  <span className="text-primary">{result.opportunity_index}/100</span>
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                  Plus cet indice est élevé, plus le moteur a identifié de marge
                  d’amélioration dans l’échantillon public analysé. Ce n’est pas
                  une note de qualité globale du site.
                </p>
              </div>
              <button
                type="button"
                onClick={resetAudit}
                className="inline-flex min-h-11 items-center justify-center gap-2 border border-border px-4 text-sm font-medium transition hover:border-primary/60"
              >
                <RotateCcw aria-hidden="true" className="size-4" />
                Auditer un autre site
              </button>
            </div>

            <div className="mt-7 h-2 overflow-hidden bg-secondary" aria-hidden="true">
              <div
                className="h-full bg-primary transition-[width] duration-700"
                style={{ width: `${result.opportunity_index}%` }}
              />
            </div>

            <div className="mt-7 grid gap-px bg-border sm:grid-cols-3">
              <div className="bg-background p-5">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Couverture
                </p>
                <p className="mt-2 text-2xl font-semibold">{result.coverage_score}/100</p>
              </div>
              <div className="bg-background p-5">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Confiance
                </p>
                <p className="mt-2 text-2xl font-semibold">{result.confidence_score}/100</p>
              </div>
              <div className="bg-background p-5">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Échantillon
                </p>
                <p className="mt-2 text-2xl font-semibold">
                  {result.pages_collected}/{result.pages_planned} pages
                </p>
              </div>
            </div>
          </div>

          <section aria-labelledby="audit-findings-title">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.12em] text-primary">
                  Preuves avant email
                </p>
                <h2 id="audit-findings-title" className="mt-2 text-2xl font-semibold">
                  Premiers constats vérifiés
                </h2>
              </div>
              <p className="hidden text-right text-xs text-muted-foreground sm:block">
                {result.total_findings} constat{result.total_findings > 1 ? 's' : ''}{' '}
                exploitable{result.total_findings > 1 ? 's' : ''} au total
              </p>
            </div>

            <div className="mt-5 grid gap-4">
              {result.findings.length ? (
                result.findings.map((finding, index) => {
                  const evidenceUrl = safeEvidenceUrl(finding.evidence_source_url)
                  return (
                    <article
                      key={finding.id}
                      className="border border-border bg-background p-5 sm:p-7"
                    >
                      <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.1em]">
                        <span className="text-primary">
                          {String(index + 1).padStart(2, '0')} · {categoryLabel(finding.category)}
                        </span>
                        <span className="text-muted-foreground">·</span>
                        <span className="text-muted-foreground">
                          Sévérité {severityLabel(finding.severity)}
                        </span>
                      </div>
                      <h3 className="mt-4 text-xl font-semibold">{finding.title}</h3>
                      <p className="mt-3 leading-7 text-muted-foreground">
                        {finding.finding}
                      </p>

                      {finding.evidence_excerpt && (
                        <div className="mt-5 border-l-2 border-primary bg-secondary/60 p-4">
                          <p className="text-xs font-semibold uppercase tracking-wide">
                            Preuve observée
                          </p>
                          <p className="mt-2 text-sm leading-6 text-muted-foreground">
                            {finding.evidence_excerpt}
                          </p>
                          {evidenceUrl && (
                            <a
                              href={evidenceUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-3 inline-flex max-w-full items-center gap-1.5 break-all text-xs text-primary underline-offset-4 hover:underline"
                            >
                              Voir la source
                              <ExternalLink aria-hidden="true" className="size-3.5 shrink-0" />
                            </a>
                          )}
                        </div>
                      )}
                    </article>
                  )
                })
              ) : (
                <div className="border border-border bg-background p-6">
                  <CheckCircle2 aria-hidden="true" className="size-6 text-primary" />
                  <p className="mt-3 font-semibold">
                    Aucun constat prioritaire n’a été retenu dans cet échantillon.
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Cela ne signifie pas que le site est exempt de points à
                    améliorer : le pré-audit reste volontairement borné.
                  </p>
                </div>
              )}
            </div>
          </section>

          <section
            className="border border-primary/30 bg-primary/5 p-5 sm:p-8"
            aria-labelledby="free-report-title"
          >
            {reportSent ? (
              <div role="status" aria-live="polite">
                <CheckCircle2 aria-hidden="true" className="size-8 text-primary" />
                <h2 id="free-report-title" className="mt-4 text-2xl font-semibold">
                  Rapport envoyé.
                </h2>
                <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
                  Vérifiez votre boîte de réception. Le rapport reprend les
                  constats supplémentaires disponibles, les preuves et les
                  recommandations issues de ce pré-audit.
                </p>
              </div>
            ) : (
              <div className="grid gap-7 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
                <div>
                  <div className="flex items-center gap-2 text-primary">
                    <FileText aria-hidden="true" className="size-5" />
                    <span className="font-mono text-xs uppercase tracking-[0.12em]">
                      Rapport gratuit
                    </span>
                  </div>
                  <h2 id="free-report-title" className="mt-4 text-2xl font-semibold">
                    Recevez le détail par email.
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    L’email n’était pas nécessaire pour voir votre résultat.
                    Il sert maintenant à vous remettre la restitution plus
                    complète disponible pour cet audit.
                  </p>
                </div>

                <form onSubmit={requestReport}>
                  <label htmlFor="audit-email" className="text-sm font-medium">
                    Email professionnel
                  </label>
                  <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                    <div className="relative min-w-0 flex-1">
                      <Mail
                        aria-hidden="true"
                        className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                      />
                      <input
                        id="audit-email"
                        type="email"
                        autoComplete="email"
                        required
                        maxLength={254}
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        className="min-h-14 w-full border border-border bg-background pl-11 pr-4 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                        placeholder="vous@entreprise.fr"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={reportLoading || !email.trim() || !consent}
                      className="inline-flex min-h-14 items-center justify-center gap-2 bg-primary px-5 font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {reportLoading ? (
                        <LoaderCircle aria-hidden="true" className="size-5 animate-spin" />
                      ) : (
                        <ArrowRight aria-hidden="true" className="size-5" />
                      )}
                      Recevoir le rapport
                    </button>
                  </div>

                  <div className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
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
                      J’accepte de recevoir ce rapport par email et que Novekia
                      puisse me recontacter au sujet de cet audit. Données
                      traitées selon la politique de confidentialité.
                    </span>
                  </label>

                  {reportError && (
                    <p className="mt-4 text-sm text-destructive" role="alert">
                      {reportError}
                    </p>
                  )}
                </form>
              </div>
            )}
          </section>

          <p className="text-center text-xs leading-5 text-muted-foreground">
            Le pré-audit analyse un échantillon de données publiques. L’audit
            complet Novekia approfondit le SEO, le GEO, les signaux utiles à
            l’AEO, les preuves par page et la remédiation.
          </p>
        </div>
      )}
    </div>
  )
}
