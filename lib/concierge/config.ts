import type { ConciergePath } from './types'

export const CONCIERGE_EVENT_NAME = 'novekia:concierge-event' as const
export const CONTACT_CONSENT_VERSION = 'contact-consent-2026-07-v1' as const
export const PRIVACY_POLICY_VERSION = 'privacy-policy-2026-07-12-v1' as const

export const conciergeSectionLabels: Readonly<Record<string, string>> = {
  context: 'Contexte',
  target: 'Cible',
  current_prospecting: 'Prospection actuelle',
  objective: 'Objectif',
  constraints: 'Contraintes',
  website_seo_geo: 'Site web, SEO et GEO',
  business_software: 'Logiciel métier',
  web_app_integration: 'Application et intégrations',
  local_ai: 'Intelligence artificielle locale',
  ai_infrastructure: 'Infrastructure IA',
  backup_continuity: 'Sauvegarde et continuité',
  cybersecurity_authorized_audit: 'Cybersécurité autorisée',
  other: 'Autre besoin',
  summary: 'Synthèse',
  contact: 'Coordonnées',
  consent: 'Consentements',
  submission: 'Demande prête',
  orientation: 'Orientation',
}

export const conciergePathLabels: Readonly<Record<ConciergePath, string>> = {
  lead_engine: 'Lead Engine Studio',
  solutions: 'Novekia Solutions',
  information: 'Services Novekia',
  direct_contact: 'Contact Novekia',
  unknown: 'À déterminer',
}

export const technicalSolutionPaths = [
  '/solutions',
  '/creation-site-web-seo-geo',
  '/logiciels-metiers-sur-mesure',
  '/applications-web-integrations',
  '/intelligence-artificielle-locale',
  '/infrastructures-serveurs-ia',
] as const

export function getConciergePageSuggestion(pathname: string): string | null {
  if (pathname === '/lead-engine-studio') {
    return 'Vous consultez actuellement Lead Engine Studio.'
  }

  if (technicalSolutionPaths.some((path) => pathname.startsWith(path))) {
    return 'Vous consultez actuellement une solution Novekia.'
  }

  return null
}
