import type {
  ConciergeAIProvider,
  ConciergeAIRequest,
  ConciergeAIResponse,
} from '../ai-contract'
import type {
  AIInferredField,
  AssistedQualificationSummary,
  ClassifyIntentResult,
  ConciergeAITaskResult,
  ConciergeSolutionCategory,
} from '../ai-schemas'
import {
  conciergeSolutionCategories,
  getTaskConfidence,
  validateConciergeAITaskOutput,
} from '../ai-schemas'

const CYBER_PATTERN = /\b(?:cyber|pentest|audit de s[ée]curit[ée]|vuln[ée]rabilit[ée]|pirat|attaque)\b/i
const INJECTION_PATTERN = /(?:ignore (?:toutes? )?(?:les )?instructions|r[ée]v[èe]le (?:ton|le) prompt|appelle (?:cette )?url|classe-moi forc[ée]ment|dis que mon pentest est autoris[ée])/i
const LEAD_ENGINE_PATTERN = /\b(?:prospection|prospects?|leads?|acquisition b2b|d[ée]veloppement commercial|rendez-vous|d[ée]cideurs?|contacts? commerciaux?|opportunit[ée]s commerciales?)\b|\b(?:identifier|trouver|cibler)\s+(?:des?\s+)?(?:entreprises|prospects?|d[ée]cideurs?|contacts?)\b/i
const SOLUTION_BUILD_PATTERN = /\b(?:cr[ée]er|concevoir|d[ée]velopper|refondre|refaire|construire|impl[ée]menter|int[ée]grer|automatiser|installer|d[ée]ployer)\b/i

function response(
  request: ConciergeAIRequest,
  result: ConciergeAITaskResult,
  startedAt: number,
  warnings: readonly string[] = [],
): ConciergeAIResponse {
  const validated = validateConciergeAITaskOutput(request.task, result)
  if (!validated) {
    return {
      success: false,
      provider: 'deterministic',
      model: null,
      output: null,
      structuredOutput: null,
      confidence: null,
      warnings,
      latencyMs: Date.now() - startedAt,
      inputTokens: null,
      outputTokens: null,
      fallbackUsed: true,
      error: { code: 'invalid_output', message: 'Le fallback déterministe a produit une sortie invalide.', retryable: false },
    }
  }
  return {
    success: true,
    provider: 'deterministic',
    model: null,
    output: null,
    structuredOutput: validated as unknown as Record<string, unknown>,
    confidence: getTaskConfidence(request.task, validated),
    warnings,
    latencyMs: Date.now() - startedAt,
    inputTokens: null,
    outputTokens: null,
    fallbackUsed: true,
    error: null,
  }
}

function inferred<T>(
  value: T,
  rationale: string,
  confidence = 0.6,
  requiresHumanReview = false,
): AIInferredField<T> {
  return { value, provenance: 'inferred', confidence, rationale, requiresHumanReview }
}

function inputText(request: ConciergeAIRequest): string {
  return typeof request.input === 'string' ? request.input.trim() : JSON.stringify(request.input)
}

export function classifyConciergeIntent(request: ConciergeAIRequest): ClassifyIntentResult {
  const text = inputText(request).toLowerCase()
  const cyber = CYBER_PATTERN.test(text)
  if (INJECTION_PATTERN.test(text)) {
    return {
      path: 'unknown',
      solutionsCategory: null,
      confidence: 0.2,
      rationale: 'La description contient une instruction qui ne peut pas servir à orienter le parcours.',
      missingInformation: ['Reformulez uniquement le besoin métier à traiter.'],
      humanReviewRequired: cyber,
    }
  }
  const categories: readonly [ConciergeSolutionCategory, RegExp][] = [
    ['website_seo_geo', /\b(?:site|seo|geo|r[ée]f[ée]rencement|visibilit[ée])\b/i],
    ['business_software', /\b(?:logiciel m[ée]tier|erp|crm|outil interne)\b/i],
    ['web_app_integration', /\b(?:application|api|int[ée]gration|automatisation|workflow)\b/i],
    ['local_ai', /\b(?:ia locale|llm local|rag local|intelligence artificielle priv[ée]e|ollama)\b/i],
    ['ai_infrastructure', /\b(?:gpu|serveur ia|station ia|infrastructure ia|calcul)\b/i],
    ['backup_continuity', /\b(?:sauvegarde|backup|continuit[ée]|reprise)\b/i],
    ['cybersecurity_authorized_audit', CYBER_PATTERN],
  ]
  const category = categories.find(([, pattern]) => pattern.test(text))?.[0] ?? null
  const lead = LEAD_ENGINE_PATTERN.test(text)
  const buildsSolution = Boolean(category) && SOLUTION_BUILD_PATTERN.test(text)
  const information = /\b(?:comprendre|information|services?|que faites-vous|d[ée]couvrir)\b/i.test(text)
  const direct = /\b(?:contacter|rappeler|[ée]changer|parler [àa])\b/i.test(text)
  const secondaryMatches = Number(information) + Number(direct)
  const path = buildsSolution
    ? 'solutions'
    : lead
      ? 'lead_engine'
      : category
        ? 'solutions'
        : secondaryMatches !== 1
          ? 'unknown'
          : information ? 'information' : 'direct_contact'
  const confidence = path === 'unknown' ? 0.35 : category || lead ? 0.72 : 0.62
  return {
    path,
    solutionsCategory: path === 'solutions' ? category : null,
    confidence,
    rationale: path === 'unknown'
      ? 'Plusieurs orientations sont possibles ou la description reste insuffisante.'
      : 'L’orientation repose sur des termes explicites de la description.',
    missingInformation: path === 'unknown' ? ['Précisez l’objectif principal recherché.'] : [],
    humanReviewRequired: cyber,
  }
}

function readSummaryValue(input: Record<string, unknown>, key: string): string | null {
  const value = input[key]
  if (typeof value === 'string') return value.slice(0, 600) || null
  if (value && typeof value === 'object' && 'value' in value) {
    const nested = (value as { value?: unknown }).value
    if (typeof nested === 'string') return nested.slice(0, 600) || null
  }
  return null
}

function readSummaryList(input: Record<string, unknown>, key: string): readonly string[] {
  const value = input[key]
  if (!Array.isArray(value)) return []
  return value.flatMap((item) => {
    if (typeof item === 'string') return [item.slice(0, 600)]
    if (item && typeof item === 'object' && 'value' in item) {
      const nested = (item as { value?: unknown }).value
      return typeof nested === 'string' ? [nested.slice(0, 600)] : []
    }
    return []
  }).slice(0, 10)
}

function summarize(request: ConciergeAIRequest): AssistedQualificationSummary {
  const input = typeof request.input === 'string' ? { objective: request.input } : request.input
  const review = request.context.activePath === 'unknown'
  const serviceValue = readSummaryValue(input, 'recommendedServiceCategory')
  const category = conciergeSolutionCategories.includes(serviceValue as ConciergeSolutionCategory)
    ? serviceValue as ConciergeSolutionCategory
    : null
  const rationale = 'Reprise prudente de la synthèse déterministe, sans ajout de fait.'
  return {
    context: inferred(readSummaryValue(input, 'context'), rationale),
    objective: inferred(readSummaryValue(input, 'objective'), rationale),
    currentSituation: inferred(readSummaryValue(input, 'currentSituation'), rationale),
    target: inferred(readSummaryValue(input, 'target'), rationale),
    mainNeed: inferred(readSummaryValue(input, 'mainNeed'), rationale),
    constraints: readSummaryList(input, 'constraints').map((value) => inferred(value, rationale)),
    timeframe: inferred(readSummaryValue(input, 'timeframe'), rationale),
    positiveSignals: readSummaryList(input, 'positiveSignals').map((value) => inferred(value, rationale)),
    uncertainties: readSummaryList(input, 'uncertainties').map((value) => inferred(value, rationale, 0.55, true)),
    missingInformation: readSummaryList(input, 'missingInformation').map((value) => inferred(value, rationale, 0.65, true)),
    humanReviewPoints: readSummaryList(input, 'humanReviewPoints').map((value) => inferred(value, rationale, 0.7, true)),
    recommendedNovekiaPole: inferred(
      request.context.activePath === 'lead_engine' ? 'lead_engine'
        : request.context.activePath === 'solutions' ? 'solutions'
          : 'human_review',
      'Orientation issue du parcours déterministe confirmé.',
      0.8,
      review,
    ),
    recommendedServiceCategory: inferred(category, category ? rationale : 'Catégorie à confirmer.', category ? 0.65 : 0.35, !category),
    recommendedNextAction: inferred(
      readSummaryValue(input, 'recommendedNextAction') ?? 'Poursuivre avec une revue humaine du cadrage.',
      rationale,
      0.65,
      true,
    ),
  }
}

function executeTask(request: ConciergeAIRequest): ConciergeAITaskResult {
  const text = inputText(request).slice(0, 600)
  switch (request.task) {
    case 'classify_intent':
      return classifyConciergeIntent(request)
    case 'summarize_qualification':
      return summarize(request)
    case 'detect_missing_information': {
      const input = typeof request.input === 'string' ? {} : request.input
      return {
        missingInformation: readSummaryList(input, 'missingInformation').map((value) =>
          inferred(value, 'Information signalée par le cadrage déterministe.', 0.8, true),
        ),
      }
    }
    case 'prepare_human_handoff':
      return {
        summary: inferred(text || 'Cadrage à examiner.', 'Résumé déterministe des informations validées.', 0.6, true),
        importantPoints: [],
        missingInformation: [],
        humanReviewPoints: [inferred('Vérifier le cadrage avant toute décision.', 'La revue humaine reste obligatoire.', 1, true)],
      }
    case 'rewrite_question':
      return {
        question: text || 'Pouvez-vous préciser votre besoin ?',
        confidence: 0.5,
        rationale: 'Le fallback conserve le sens du texte fourni.',
        requiresHumanReview: false,
      }
    case 'extract_structured_answer':
      return {
        fields: text ? [inferred(text, 'Texte fourni repris sans enrichissement.', 0.75)] : [],
        uncertainties: [],
      }
  }
}

export class DeterministicConciergeAIProvider implements ConciergeAIProvider {
  readonly name = 'deterministic' as const

  async execute(request: ConciergeAIRequest): Promise<ConciergeAIResponse> {
    const startedAt = Date.now()
    return response(
      request,
      executeTask(request),
      startedAt,
      ['L’assistance avancée est indisponible ; une règle déterministe a été utilisée.'],
    )
  }
}
