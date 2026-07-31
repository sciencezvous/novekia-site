import { conciergeDefinition, getFlowByPath } from './flows'
import type {
  ConciergeAnswer,
  ConciergeAnswers,
  ConciergePath,
  ConciergeSession,
  ConciergeSummary,
  ProvenancedField,
} from './types'

function answerToText(answer: ConciergeAnswer | undefined): string | null {
  if (typeof answer === 'string') return answer.trim() || null
  if (typeof answer === 'number') return String(answer)
  if (typeof answer === 'boolean') return answer ? 'Oui' : 'Non'
  if (Array.isArray(answer)) return answer.length > 0 ? answer.join(', ') : null
  return null
}

function declared(value: string | null): ProvenancedField<string> | null {
  return value ? { value, provenance: 'declared' } : null
}

function systemGenerated<T>(value: T): ProvenancedField<T> {
  return { value, provenance: 'system_generated' }
}

function firstAnswer(answers: ConciergeAnswers, ids: readonly string[]): string | null {
  for (const id of ids) {
    const value = answerToText(answers[id])
    if (value) return value
  }
  return null
}

function joinAnswers(answers: ConciergeAnswers, ids: readonly string[]): string | null {
  const values = ids.flatMap((id) => {
    const value = answerToText(answers[id])
    const other = answerToText(answers[`${id}.__other`])
    return [value, other].filter((item): item is string => Boolean(item))
  })
  return values.length > 0 ? values.join(' · ') : null
}

const solutionCategoryLabels: Readonly<Record<string, string>> = {
  website_seo_geo: 'Site web, SEO et GEO',
  business_software: 'Logiciel métier',
  web_app_integration: 'Application, intégration ou automatisation',
  local_ai: 'Intelligence artificielle locale',
  ai_infrastructure: 'Station ou serveur IA',
  backup_continuity: 'Sauvegarde et continuité',
  cybersecurity_authorized_audit: 'Cybersécurité et audit autorisé',
  other: 'Autre besoin',
}

function getQuestionLabel(path: ConciergePath, questionId: string): string {
  const flow = getFlowByPath(path, conciergeDefinition)
  const question = flow?.steps.find((step) => step.id === questionId)
  return question?.kind === 'question' ? question.label : questionId
}

function declaredList(value: string | null): readonly ProvenancedField<string>[] {
  return value ? [{ value, provenance: 'declared' }] : []
}

export function createConciergeSummary(session: ConciergeSession): ConciergeSummary {
  const answers = session.answers
  const qualification = session.qualificationResult
  const missing = qualification?.missingInformation ?? []
  const risks = qualification?.risks ?? []

  if (session.activePath === 'lead_engine') {
    return {
      selectedPath: { value: 'lead_engine', provenance: 'declared' },
      company: declared(firstAnswer(answers, ['lead.company_name'])),
      contactRole: declared(firstAnswer(answers, ['lead.respondent_role'])),
      context: declared(joinAnswers(answers, ['lead.sector', 'lead.offer'])),
      objective: declared(firstAnswer(answers, ['lead.main_objective'])),
      currentSituation: declared(
        joinAnswers(answers, [
          'lead.current_prospecting',
          'lead.sales_team',
          'lead.crm_tools',
          'lead.current_volume',
        ]),
      ),
      target: declared(
        joinAnswers(answers, [
          'lead.target_customer',
          'lead.target_company_profile',
          'lead.target_geography',
          'lead.target_roles',
        ]),
      ),
      mainNeed: declared(firstAnswer(answers, ['lead.offer'])),
      constraints: declaredList(
        joinAnswers(answers, [
          'lead.regulatory_constraints',
          'lead.refused_channels',
          'lead.human_review_points',
        ]),
      ),
      timeframe: declared(firstAnswer(answers, ['lead.timeframe'])),
      indicativeBudget: declared(firstAnswer(answers, ['lead.indicative_budget'])),
      positiveSignals: (qualification?.positiveSignals ?? []).map(systemGenerated),
      uncertainties: [],
      missingInformation: missing.map((id) =>
        systemGenerated(getQuestionLabel(session.activePath, id)),
      ),
      humanReviewPoints: risks.map(systemGenerated),
      recommendedNovekiaPole: systemGenerated('Lead Engine Studio'),
      recommendedServiceCategory: systemGenerated('Prospection et qualification B2B'),
      recommendedNextAction: systemGenerated(
        qualification?.recommendedNextAction ?? 'Compléter le cadrage avant un échange humain.',
      ),
    }
  }

  const categoryValue = answerToText(answers['solutions.need_category'])
  const categoryLabel = categoryValue
    ? (solutionCategoryLabels[categoryValue] ?? categoryValue)
    : null
  const branchPrefix = categoryValue ? `solutions.${categoryValue}.` : null
  const branchAnswers = branchPrefix
    ? Object.entries(answers)
        .filter(([key, value]) => key.startsWith(branchPrefix) && answerToText(value))
        .map(([, value]) => answerToText(value))
        .filter((value): value is string => Boolean(value))
        .join(' · ')
    : ''

  return {
    selectedPath: {
      value: session.activePath,
      provenance: 'declared',
    },
    company: declared(
      firstAnswer(answers, ['solutions.company_name', 'contact.company']),
    ),
    contactRole: declared(firstAnswer(answers, ['contact.role'])),
    context: declared(firstAnswer(answers, ['solutions.sector'])),
    objective: declared(firstAnswer(answers, ['solutions.project_description'])),
    currentSituation: declared(firstAnswer(answers, ['solutions.current_state'])),
    target: declared(firstAnswer(answers, ['solutions.expected_users'])),
    mainNeed: declared(
      [categoryLabel, branchAnswers].filter(Boolean).join(' · ') || null,
    ),
    constraints: declaredList(
      joinAnswers(answers, [
        'solutions.constraints',
        'solutions.data_sensitivity',
        'solutions.human_review_need',
      ]),
    ),
    timeframe: declared(firstAnswer(answers, ['solutions.timeframe'])),
    indicativeBudget: declared(firstAnswer(answers, ['solutions.budget_range'])),
    positiveSignals: (qualification?.positiveSignals ?? []).map(systemGenerated),
    uncertainties: [],
    missingInformation: missing.map((id) =>
      systemGenerated(getQuestionLabel(session.activePath, id)),
    ),
    humanReviewPoints: risks.map(systemGenerated),
    recommendedNovekiaPole: systemGenerated(
      session.activePath === 'solutions' ? 'Novekia Solutions' : 'À déterminer',
    ),
    recommendedServiceCategory: categoryLabel
      ? systemGenerated(categoryLabel)
      : null,
    recommendedNextAction: systemGenerated(
      qualification?.recommendedNextAction ?? 'Compléter le cadrage avant un échange humain.',
    ),
  }
}
