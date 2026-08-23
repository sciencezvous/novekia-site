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

const CATEGORY_IMPACTS: Record<string, string> = {
  technical_seo:
    'Ce point peut compliquer l’exploration, l’indexation ou l’interprétation technique du site.',
  on_page_seo:
    'Ce point peut réduire la clarté de la page pour les moteurs de recherche et les visiteurs.',
  geo_readiness:
    'Ce point peut limiter la capacité des moteurs génératifs à comprendre, reprendre ou citer correctement l’information.',
  trust_authority:
    'Ce point peut affaiblir les signaux publics de confiance et d’autorité disponibles pour les visiteurs et les moteurs.',
  conversion:
    'Ce point peut créer une friction entre la visite du site et la prise de contact ou l’action attendue.',
  performance_observation:
    'Ce signal mérite une mesure plus approfondie avant de conclure sur son impact réel sur l’expérience.',
  public_hygiene:
    'Ce point indique une configuration publique perfectible qui mérite une vérification ciblée.',
  accessibility_observation:
    'Ce point peut rendre certains contenus plus difficiles à utiliser ou à interpréter pour une partie des visiteurs.',
}

function categoryLabel(value: string) {
  return CATEGORY_LABELS[value] ?? value.replaceAll('_', ' ')
}

function severityLabel(value: string) {
  return SEVERITY_LABELS[value] ?? value
}

function categoryImpact(value: string) {
  return (
    CATEGORY_IMPACTS[value] ??
    'Ce constat mérite une vérification ciblée afin d’en mesurer l’impact et de prioriser la correction.'
  )
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

function visibilityScore(result: PublicAuditResult) {
  return Math.max(0, Math.min(100, 100 - result.opportunity_index))
}

function verdict(result: PublicAuditResult) {
  const score = visibilityScore(result)

  if (score >= 90) {
    return {
      title: 'Très bon niveau observé sur l’échantillon.',
      body:
        result.total_findings > 0
          ? 'Votre site présente une base solide. Quelques corrections ciblées peuvent encore améliorer sa visibilité et supprimer les écarts détectés.'
          : 'Aucun écart prioritaire n’a été retenu sur les pages examinées. Ce pré-audit reste borné et ne valide pas l’ensemble du site ni toutes les dimensions SEO, GEO et AEO.',
    }
  }

  if (score >= 75) {
    return {
      title: 'Bon niveau observé — quelques corrections restent utiles.',
      body:
        'La base est saine sur l’échantillon analysé. Les constats ci-dessous indiquent les corrections les plus utiles pour renforcer encore la visibilité du site.',
    }
  }

  if (score >= 55) {
    return {
      title: 'Base exploitable — plusieurs améliorations peuvent renforcer la visibilité.',
      body:
        'Le site dispose de fondations utiles, mais plusieurs écarts vérifiés méritent d’être corrigés et priorisés pour améliorer sa visibilité web et IA.',
    }
  }

  return {
    title: 'Votre site dispose d’une base à renforcer.',
    body:
      'Le pré-audit a identifié plusieurs corrections prioritaires. Elles donnent un plan de départ concret pour renforcer progressivement la visibilité du site.',
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
        visibility_score: visibilityScore(payload),
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
        opportunity_index: result.opportunity_index,
        visibility_score: visibilityScore(result),
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

  const currentVerdict = result ? verdict(result) : null
  const currentVisibilityScore = result ? visibilityScore(result) : null

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
          <section className="border border-border bg-background p-5 sm:p-8" aria-labelledby="audit-verdict-title">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="max-w-3xl">
                <p className="font-mono text-xs uppercase tracking-[0.12em] text-primary">
                  Pré-audit terminé · {result.target_domain}
                </p>
                <div className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-2">
                  <p className="text-5xl font-semibold tracking-tight text-primary sm:text-6xl">
                    {currentVisibilityScore}/100
                  </p>
                  <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                    Score de visibilité observée
                  </p>
                </div>
                <h2 id="audit-verdict-title" className="mt-5 text-2xl font-semibold tracking-tight sm:text-3xl">
                  {currentVerdict?.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
                  {currentVerdict?.body}
                </p>
                <p className="mt-3 text-xs leading-5 text-muted-foreground">
                  100/100 signifie qu’aucun écart pondéré n’a été retenu dans l’échantillon analysé. Ce score n’est pas une certification ni une note exhaustive du site.
                </p>
              </div>
              <button
                type="button"
                onClick={resetAudit}
                className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 border border-border px-4 text-sm font-medium transition hover:border-primary/60"
              >
                <RotateCcw aria-hidden="true" className="size-4" />
                Auditer un autre site
              </button>
            </div>

            <div className="mt-7 h-2 overflow-hidden bg-secondary" aria-hidden="true">
              <div
                className="h-full bg-primary transition-[width] duration-700"
                style={{ width: `${currentVisibilityScore ?? 0}%` }}
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
                  Confiance des constats
                </p>
                {result.total_findings > 0 ? (
                  <p className="mt-2 text-2xl font-semibold">{result.confidence_score}/100</p>
                ) : (
                  <p className="mt-2 text-base font-semibold">Aucun constat à qualifier</p>
                )}
              </div>
              <div className="bg-background p-5">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Échantillon
                </p>
                <p className="mt-2 text-2xl font-semibold">
                  {result.pages_collected}/{result.pages_planned}
                </p>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">pages analysées</p>
              </div>
            </div>
          </section>

          <section aria-labelledby="audit-findings-title">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.12em] text-primary">
                  Pour gagner encore des points
                </p>
                <h2 id="audit-findings-title" className="mt-2 text-2xl font-semibold">
                  Corrections prioritaires et preuves
                </h2>
              </div>
              <p className="hidden text-right text-xs text-muted-foreground sm:block">
                {result.total_findings} correction{result.total_findings > 1 ? 's' : ''}{' '}
                prioritaire{result.total_findings > 1 ? 's' : ''}
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
                          Priorité {String(index + 1).padStart(2, '0')} · {categoryLabel(finding.category)}
                        </span>
                        <span className="text-muted-foreground">·</span>
                        <span className="text-muted-foreground">
                          Sévérité {severityLabel(finding.severity)}
                        </span>
                      </div>

                      <h3 className="mt-4 text-xl font-semibold">{finding.title}</h3>

                      <div className="mt-5 grid gap-4 md:grid-cols-2">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Ce que le moteur a observé
                          </p>
                          <p className="mt-2 text-sm leading-6 text-muted-foreground">
                            {finding.finding}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Pourquoi corriger ce point
                          </p>
                          <p className="mt-2 text-sm leading-6 text-muted-foreground">
                            {categoryImpact(finding.category)}
                          </p>
                        </div>
                      </div>

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
                <div className="border border-border bg-background p-6 sm:p-7">
                  <CheckCircle2 aria-hidden="true" className="size-6 text-primary" />
                  <p className="mt-3 text-lg font-semibold">
                    Aucun écart prioritaire n’a été retenu dans cet échantillon.
                  </p>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                    C’est favorable sur les pages analysées. Le pré-audit reste toutefois volontairement borné : l’audit complet permet d’élargir la couverture et de rechercher des optimisations plus fines.
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
                  Vérifiez votre boîte de réception. Vous y trouverez votre score observé, les preuves et les recommandations associées aux corrections retenues.
                </p>
                <div className="mt-6 border-t border-primary/20 pt-6">
                  <p className="font-semibold">Vous voulez améliorer ce score&nbsp;?</p>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                    L’audit complet Novekia élargit le périmètre, priorise les corrections puis permet de vérifier le résultat après remédiation.
                  </p>
                  <a
                    href="/#contact"
                    className="mt-5 inline-flex min-h-12 items-center justify-center gap-2 bg-primary px-5 font-semibold text-primary-foreground transition hover:opacity-90"
                  >
                    Améliorer ma visibilité avec Novekia
                    <ArrowRight aria-hidden="true" className="size-5" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="grid gap-7 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
                <div>
                  <div className="flex items-center gap-2 text-primary">
                    <FileText aria-hidden="true" className="size-5" />
                    <span className="font-mono text-xs uppercase tracking-[0.12em]">
                      Prochaine étape
                    </span>
                  </div>
                  <h2 id="free-report-title" className="mt-4 text-2xl font-semibold">
                    Recevez le compte rendu et les pistes pour gagner des points.
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    Vous avez vu votre score et les premiers constats avant de donner votre email. Le rapport reprend les preuves et les recommandations disponibles pour ce pré-audit.
                  </p>
                  <p className="mt-4 text-xs leading-5 text-muted-foreground">
                    Le pré-audit reste borné. L’audit complet sert à élargir la couverture, confirmer les priorités et préparer la remédiation.
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
                      Recevoir mon compte rendu
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
                      J’accepte de recevoir ce rapport par email et que Novekia puisse me recontacter au sujet de cet audit. Données traitées selon la politique de confidentialité.
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
            Le score de visibilité observée est dérivé des écarts pondérés retenus sur un échantillon de données publiques. L’audit complet Novekia approfondit le SEO, le GEO, les signaux utiles à l’AEO, les preuves par page, la remédiation et la vérification après correction.
          </p>
        </div>
      )}
    </div>
  )
}
