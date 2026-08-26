'use client'

import { FormEvent, useEffect, useState, type CSSProperties } from 'react'
import {
  ArrowRight,
  BadgeCheck,
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
  type PublicAuditFinding,
  type PublicAuditResult,
} from '@/lib/audit-contract'
import { getStoredAttribution } from '@/lib/lead-attribution'

const CATEGORY_CARDS = [
  {
    key: 'accessibility_indexability',
    short: 'ACCÈS',
    label: 'Google peut-il lire vos pages ?',
    description: 'Accès public, règles d’exploration et capacité d’indexation.',
  },
  {
    key: 'on_page_seo',
    short: 'CONTENU',
    label: 'Vos pages expliquent-elles clairement leur sujet ?',
    description: 'Titres, contenu visible et signaux utiles à la compréhension des pages.',
  },
  {
    key: 'structured_data_entity',
    short: 'ENTREPRISE',
    label: 'Votre entreprise est-elle bien comprise ?',
    description: 'Identité, données structurées et informations qui décrivent votre activité.',
  },
  {
    key: 'technical_integrity',
    short: 'TECH',
    label: 'Le site est-il techniquement cohérent ?',
    description: 'Cohérence des ressources et protections publiques réellement contrôlées.',
  },
] as const

const SCAN_STAGES = [
  'Connexion au site',
  'Lecture des pages publiques',
  'Vérification de la visibilité Google',
  'Compréhension de l’entreprise et du contenu',
  'Vérification des preuves',
] as const

const SEVERITY_LABELS: Record<string, string> = {
  critical: 'Priorité critique',
  high: 'Priorité élevée',
  medium: 'Priorité moyenne',
  low: 'Priorité faible',
  info: 'Information',
}

const CONFIDENCE_LABELS: Record<string, string> = {
  high: 'Preuve solide',
  medium: 'Preuve moyenne',
  low: 'Preuve limitée',
}

const VERIFICATION_LABELS: Record<string, string> = {
  verified: 'Confirmé',
  confirmed: 'Confirmé',
  probable: 'À confirmer',
  needs_review: 'À confirmer',
  unverified: 'Non vérifié',
  not_verified: 'Non vérifié',
  not_measured: 'Non mesuré',
  inconclusive: 'Non conclu',
}

function findingSeverityLabel(finding: PublicAuditFinding) {
  return SEVERITY_LABELS[finding.severity.toLowerCase()] || finding.severity
}

function findingConfidenceLabel(finding: PublicAuditFinding) {
  return CONFIDENCE_LABELS[finding.confidence.toLowerCase()] || finding.confidence
}

function findingVerificationLabel(finding: PublicAuditFinding) {
  const status = finding.verification_status.toLowerCase()
  return VERIFICATION_LABELS[status] || finding.verification_status.replaceAll('_', ' ')
}

export function AuditExperience() {
  const [url, setUrl] = useState('')
  const [result, setResult] = useState<PublicAuditResult | null>(null)
  const [auditLoading, setAuditLoading] = useState(false)
  const [auditStage, setAuditStage] = useState(0)
  const [auditError, setAuditError] = useState('')
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [website, setWebsite] = useState('')
  const [reportLoading, setReportLoading] = useState(false)
  const [reportSent, setReportSent] = useState(false)
  const [reportError, setReportError] = useState('')
  const [reportModalOpen, setReportModalOpen] = useState(false)

  useEffect(() => {
    if (!auditLoading) return

    setAuditStage(0)
    const interval = window.setInterval(() => {
      setAuditStage((current) => Math.min(current + 1, SCAN_STAGES.length - 1))
    }, 1350)

    return () => window.clearInterval(interval)
  }, [auditLoading])

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
    trackAuditEvent('AuditStarted', { source: 'public_audit_v2' })

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
        public_audit_score: payload.public_audit_score,
        coverage: payload.coverage,
        result_state: payload.result_state,
        review_findings: payload.review_findings,
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
      trackAuditEvent('AuditFailed', { source: 'public_audit_v2' })
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
        result_state: result.result_state,
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

  function trackDeepAuditIntent() {
    if (!result) return
    trackAuditEvent('DeepAuditClicked', {
      public_audit_score: result.public_audit_score,
      coverage: result.coverage,
      result_state: result.result_state,
      findings_count: result.total_findings,
      source: 'audit_report_success',
    })
  }

  const confidenceDisplay = result
    ? result.confidence_score > 0
      ? `${result.confidence_score}%`
      : 'non calculée'
    : ''

  const resultStateLabel = result?.result_state === 'partial' ? 'PARTIEL' : 'CONCLUSIF'
  const partialResult = result?.result_state === 'partial'

  const limitedResult = Boolean(
    result &&
      result.confidence_score === 0 &&
      result.total_findings === 0 &&
      result.positive_observations.length === 0
  )

  return (
    <div className="audit-app mx-auto w-full max-w-6xl">
      {!result ? (
        <div className="audit-welcome-grid">
          <section className="audit-welcome-copy" aria-labelledby="audit-main-title">
            <div className="audit-kicker">
              <span className="audit-kicker-dot" aria-hidden="true" />
              ANALYSE GRATUITE · GOOGLE · MOTEURS IA
            </div>

            <h1 id="audit-main-title" className="audit-main-title">
              Votre site est-il vraiment <span>compris par Google et les IA&nbsp;?</span>
            </h1>

            <p className="audit-lead">
              Entrez simplement l’adresse de votre site. Novekia analyse ce qui est
              visible publiquement, montre les problèmes réellement observés et explique
              ce qui mérite d’être corrigé en priorité.
            </p>

            <div className="audit-trust-row" aria-label="Garanties du pré-audit">
              <span><ShieldCheck aria-hidden="true" /> Aucun accès privé</span>
              <span><BadgeCheck aria-hidden="true" /> Preuves vérifiables</span>
              <span><CheckCircle2 aria-hidden="true" /> Résultat immédiat</span>
            </div>

            <div className="audit-proof-note">
              <strong>Une règle simple :</strong> chaque alerte doit être reliée à ce que
              le moteur a réellement observé. Ce qui n’est pas vérifiable est signalé comme tel.
            </div>
          </section>

          <section className="audit-command-panel" aria-label="Lancer le pré-audit">
            <div className={`audit-live-scanner${auditLoading ? ' is-active' : ''}`} aria-hidden="true">
              <div className="audit-radar-grid" />
              <div className="audit-radar-ring audit-radar-ring-one" />
              <div className="audit-radar-ring audit-radar-ring-two" />
              <div className="audit-radar-ring audit-radar-ring-three" />
              <div className="audit-radar-beam" />
              <div className="audit-radar-core">
                <Search className="size-7" />
                <span>{auditLoading ? 'SCAN' : 'READY'}</span>
              </div>
              <span className="audit-radar-label audit-radar-label-a">SEO</span>
              <span className="audit-radar-label audit-radar-label-b">INDEX</span>
              <span className="audit-radar-label audit-radar-label-c">ENTITY</span>
              <span className="audit-radar-label audit-radar-label-d">DATA</span>
            </div>

            <div className="audit-command-copy">
              <p className="audit-command-overline">ANALYSE PUBLIQUE NOVEKIA</p>
              <h2>{auditLoading ? 'Analyse en cours…' : 'Analysez votre site maintenant.'}</h2>
              <p>
                {auditLoading
                  ? SCAN_STAGES[auditStage]
                  : 'Une URL suffit. Aucun compte, aucun accès à votre site.'}
              </p>
            </div>

            <form onSubmit={startAudit} className="audit-url-form">
              <label htmlFor="audit-url">Adresse du site</label>
              <div className="audit-url-row">
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
                  placeholder="votre-site.fr"
                  disabled={auditLoading}
                />
                <button type="submit" disabled={auditLoading || !url.trim()}>
                  {auditLoading ? (
                    <>
                      <LoaderCircle aria-hidden="true" className="size-5 animate-spin" />
                      Analyse en cours
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
              <div className="audit-stage-track" role="status" aria-live="polite">
                <div className="audit-stage-progress" style={{ width: `${((auditStage + 1) / SCAN_STAGES.length) * 100}%` }} />
                <div className="audit-stage-list">
                  {SCAN_STAGES.map((stage, index) => (
                    <span key={stage} className={index <= auditStage ? 'is-done' : ''}>
                      {index < auditStage ? '✓' : index === auditStage ? '●' : '○'} {stage}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {auditError && (
              <div className="audit-error" role="alert">
                {auditError}
              </div>
            )}

            <p className="audit-legal-note">
              Analyse d’un échantillon public du site. Ce résultat ne remplace pas un audit
              complet et ne garantit aucun classement dans Google ou un moteur IA.
            </p>
          </section>
        </div>
      ) : (
        <div className="audit-results-shell">
          <section className="audit-result-hero" aria-labelledby="audit-score-title">
            <div className="audit-result-topline">
              <div>
                <span className="audit-result-status"><span /> ANALYSE TERMINÉE · {resultStateLabel}</span>
                <p>{result.target_domain}</p>
              </div>
              <div className="audit-result-pages">
                <BadgeCheck aria-hidden="true" />
                {result.pages_collected}/{result.pages_planned} pages · couverture {result.coverage}%
              </div>
            </div>

            <div className="audit-score-layout">
              <div
                className="audit-score-orb"
                style={{ '--audit-score-angle': `${result.public_audit_score * 3.6}deg` } as CSSProperties}
              >
                <div className="audit-score-orb-inner">
                  <span>score mesuré</span>
                  <strong>{result.public_audit_score}</strong>
                  <small>/100</small>
                </div>
              </div>

              <div className="audit-result-summary">
                <p className="audit-result-eyebrow">RÉSULTAT EN CLAIR · {resultStateLabel}</p>
                <h1 id="audit-score-title">
                  {limitedResult
                    ? 'Aucun problème démontré sur cet échantillon.'
                    : 'Voici ce que le moteur a réellement trouvé.'}
                </h1>
                <p>{result.summary}</p>

                <div className="audit-result-metrics">
                  <span><strong>{resultStateLabel}</strong> état de conclusion</span>
                  <span><strong>{confidenceDisplay}</strong> confiance des constats</span>
                  <span><strong>{result.review_findings}</strong> signal{result.review_findings > 1 ? 'aux' : ''} à confirmer</span>
                </div>

                {(partialResult || limitedResult) && (
                  <div className="audit-limit-note">
                    <ShieldCheck aria-hidden="true" />
                    <span>
                      {partialResult
                        ? `Résultat PARTIEL : ${result.review_findings} signal(aux) restent à confirmer ou la couverture est incomplète. Le score reste limité aux contrôles effectivement évalués ; il n’exprime pas une certitude globale.`
                        : 'Le score concerne seulement les contrôles réellement mesurés. Une absence de problème détecté ne signifie pas que tout le site est parfait.'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="audit-signal-board" aria-labelledby="audit-signals-title">
            <div className="audit-section-heading">
              <div>
                <p>4 QUESTIONS CLÉS</p>
                <h2 id="audit-signals-title">Ce que le moteur a réellement mesuré</h2>
              </div>
              <span>méthode {result.score_version}</span>
            </div>

            <div className="audit-signal-grid">
              {CATEGORY_CARDS.map((category) => {
                const score = result.category_scores[category.key] ?? 0
                const coverage = result.category_coverage[category.key] ?? 0
                return (
                  <article key={category.key} className="audit-signal-card">
                    <div className="audit-signal-card-top">
                      <span>{category.short}</span>
                      <strong>{score}<small>/100</small></strong>
                    </div>
                    <h3>{category.label}</h3>
                    <p>{category.description}</p>
                    <div className="audit-signal-bar" aria-hidden="true">
                      <span style={{ width: `${score}%` }} />
                    </div>
                    <div className="audit-signal-coverage">contrôles réalisés {coverage}%</div>
                  </article>
                )
              })}
            </div>
          </section>

          <section className="audit-evidence-zone" aria-labelledby="audit-evidence-title">
            <div className="audit-section-heading">
              <div>
                <p>PREUVES</p>
                <h2 id="audit-evidence-title">Ce qui est confirmé ou reste à vérifier</h2>
              </div>
              <span>aucune donnée privée requise</span>
            </div>

            {result.positive_observations.length > 0 && (
              <div className="audit-positive-grid">
                {result.positive_observations.slice(0, 4).map((observation) => (
                  <div key={observation} className="audit-positive-card">
                    <CheckCircle2 aria-hidden="true" />
                    <span>{observation}</span>
                  </div>
                ))}
              </div>
            )}

            {result.findings.length > 0 ? (
              <div className="audit-findings-list">
                {result.findings.slice(0, 3).map((finding) => (
                  <article key={finding.id} className="audit-finding-card">
                    <div className="audit-finding-meta">
                      <span>{findingSeverityLabel(finding)}</span>
                      <span>{findingConfidenceLabel(finding)}</span>
                      <span>{findingVerificationLabel(finding)}</span>
                    </div>
                    <h3>{finding.title}</h3>
                    <p>{finding.finding}</p>
                    {finding.evidence_excerpt && (
                      <div className="audit-evidence-excerpt">
                        <strong>CE QUE NOUS AVONS OBSERVÉ</strong>
                        <code>{finding.evidence_excerpt}</code>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            ) : (
              <div className="audit-empty-finding">
                <BadgeCheck aria-hidden="true" />
                <div>
                  <strong>Aucun problème démontré sur les contrôles réalisés.</strong>
                  <p>
                    Cela signifie uniquement que les points vérifiés n’ont pas produit de
                    défaut démontré. Les éléments non mesurables restent sans conclusion.
                  </p>
                </div>
              </div>
            )}
          </section>

          <section className="audit-conversion-panel">
            <div>
              <p>VOTRE RAPPORT GRATUIT</p>
              <h2>Recevez les priorités à corriger, expliquées simplement.</h2>
              <span>
                Le PDF détaille le problème, son impact, le niveau de certitude,
                les pages concernées et la correction recommandée.
              </span>
            </div>
            <div className="audit-conversion-actions">
              <button type="button" onClick={() => setReportModalOpen(true)}>
                <Mail aria-hidden="true" />
                {reportSent ? 'Rapport disponible' : 'Recevoir le rapport gratuit'}
                <ArrowRight aria-hidden="true" />
              </button>
              <button type="button" className="secondary" onClick={resetAudit}>
                <RotateCcw aria-hidden="true" />
                Analyser un autre site
              </button>
            </div>
          </section>

          <p className="audit-result-disclaimer">
            État {resultStateLabel} sur le périmètre mesuré. Le score résume uniquement les contrôles réellement
            effectués sur l’échantillon ; la confiance des constats est une métrique distincte. Il ne s’agit ni
            d’un score Google, ni d’une certification, ni d’une promesse de classement.
          </p>
        </div>
      )}

      {result && reportModalOpen && (
        <div
          className="audit-modal-backdrop"
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
            className="audit-report-dialog"
          >
            <div className="audit-dialog-heading">
              <div>
                <div className="audit-dialog-kicker">
                  <FileText aria-hidden="true" />
                  RAPPORT DE PRÉ-AUDIT
                </div>
                <h2 id="audit-report-dialog-title">
                  {reportSent ? 'Votre pré-audit a été envoyé.' : 'Recevez le détail de votre analyse.'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setReportModalOpen(false)}
                disabled={reportLoading}
                aria-label="Fermer"
                className="audit-dialog-close"
              >
                <X aria-hidden="true" />
              </button>
            </div>

            {reportSent ? (
              <div className="audit-report-success" role="status" aria-live="polite">
                <CheckCircle2 aria-hidden="true" />
                <p>
                  Le pré-audit a été envoyé par email à <strong>{email}</strong>. Le PDF est joint au
                  message reçu. Vous pouvez ensuite demander à Novekia de vérifier et prioriser les corrections.
                </p>
                <div>
                  <button type="button" onClick={() => setReportModalOpen(false)}>
                    Fermer
                  </button>
                  <a href="/audit-approfondi" onClick={trackDeepAuditIntent}>
                    Faire vérifier les corrections prioritaires
                    <ArrowRight aria-hidden="true" />
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={requestReport} className="audit-report-form">
                <p>
                  Résultat mesuré&nbsp;: <strong>{result.public_audit_score}/100</strong> · état{' '}
                  <strong>{resultStateLabel}</strong> · couverture {result.coverage}%. Indiquez votre email
                  professionnel pour recevoir le rapport détaillé et conserver les preuves de cette analyse.
                </p>

                <label htmlFor="audit-email">Email professionnel</label>
                <div className="audit-email-field">
                  <Mail aria-hidden="true" />
                  <input
                    id="audit-email"
                    type="email"
                    autoComplete="email"
                    autoFocus
                    required
                    maxLength={254}
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="vous@entreprise.fr"
                  />
                </div>

                <div className="audit-honeypot" aria-hidden="true">
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

                <label className="audit-consent-row">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(event) => setConsent(event.target.checked)}
                    required
                  />
                  <span>
                    J’accepte de recevoir ce rapport par email et que Novekia puisse me
                    recontacter au sujet de cette analyse. Données traitées selon la politique
                    de confidentialité.
                  </span>
                </label>

                {reportError && <p className="audit-report-error" role="alert">{reportError}</p>}

                <button
                  type="submit"
                  disabled={reportLoading || !email.trim() || !consent}
                  className="audit-report-submit"
                >
                  {reportLoading ? (
                    <LoaderCircle aria-hidden="true" className="animate-spin" />
                  ) : (
                    <ArrowRight aria-hidden="true" />
                  )}
                  Recevoir mon rapport gratuit
                </button>

                <p className="audit-report-footnote">
                  Aucun compte à créer. Rapport lié au domaine audité et à la méthode
                  {` ${result.score_version}`}.
                </p>
              </form>
            )}
          </section>
        </div>
      )}
    </div>
  )
}