const BLOCKED_KEY_NAMES = new Set([
  'email',
  'phone',
  'telephone',
  'mobile',
  'fullname',
  'contactname',
  'contact',
  'consent',
  'consentedat',
  'address',
  'adresse',
  'postalcode',
  'birthdate',
  'password',
  'apikey',
  'token',
  'secret',
  'ip',
  'useragent',
])

const PROTOTYPE_KEYS = new Set(['__proto__', 'constructor', 'prototype'])
const EMAIL_PATTERN = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i
const PHONE_PATTERN = /\+?\d[\d\s().-]{7,}\d/
const HTML_PATTERN = /<\/?(?:script|style|iframe|object|embed|form|svg|math|[a-z][a-z0-9-]*\s+[^>]*)>/i
const CONTROL_CHARACTER_PATTERN = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/

const SECRET_PATTERNS = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/i,
  /\bsk-[a-z0-9_-]{20,}\b/i,
  /\bBearer\s+[a-z0-9._~+/=-]{20,}/i,
  /\b(?:password|motdepasse)\s*[=:]\s*\S{4,}/i,
  /\bAKIA[A-Z0-9]{16}\b/,
  /\beyJ[a-zA-Z0-9_-]{12,}\.[a-zA-Z0-9_-]{12,}\.[a-zA-Z0-9_-]{12,}\b/,
  /\b[A-Za-z0-9+/]{160,}={0,2}\b/,
] as const

export const MAX_AI_REQUEST_BYTES = 32 * 1024
export const MAX_AI_STRING_CHARACTERS = 12_000
export const MAX_AI_CONTEXT_VALUES = 100
export const MAX_AI_OBJECT_DEPTH = 6

export type PayloadInspectionCode =
  | 'INVALID_REQUEST'
  | 'PERSONAL_DATA_DETECTED'
  | 'SECRET_DETECTED'

export type PayloadInspectionResult =
  | { valid: true; stringCharacters: number; valueCount: number }
  | { valid: false; code: PayloadInspectionCode; message: string }

function normalizedKey(key: string): string {
  return key.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '').toLowerCase()
}

export function containsObviousSecret(value: string): boolean {
  return SECRET_PATTERNS.some((pattern) => pattern.test(value))
}

function looksLikePhone(value: string): boolean {
  const match = value.match(PHONE_PATTERN)?.[0]
  if (!match) return false
  return match.replace(/\D/g, '').length >= 9
}

export function inspectAIRequestPayload(value: unknown): PayloadInspectionResult {
  let stringCharacters = 0
  let valueCount = 0
  const seen = new WeakSet<object>()

  function inspect(current: unknown, depth: number, parentKey = ''): PayloadInspectionResult | null {
    if (depth > MAX_AI_OBJECT_DEPTH) {
      return { valid: false, code: 'INVALID_REQUEST', message: 'La requête est trop imbriquée.' }
    }

    valueCount += 1
    if (valueCount > MAX_AI_CONTEXT_VALUES) {
      return { valid: false, code: 'INVALID_REQUEST', message: 'La requête contient trop de valeurs.' }
    }

    if (typeof current === 'string') {
      stringCharacters += current.length
      if (stringCharacters > MAX_AI_STRING_CHARACTERS) {
        return { valid: false, code: 'INVALID_REQUEST', message: 'Le contenu transmis est trop long.' }
      }
      if (CONTROL_CHARACTER_PATTERN.test(current)) {
        return { valid: false, code: 'INVALID_REQUEST', message: 'Le contenu contient des caractères non autorisés.' }
      }
      const technicalIdentifier = ['requestid', 'sessionid'].includes(normalizedKey(parentKey))
      if (!technicalIdentifier && containsObviousSecret(current)) {
        return { valid: false, code: 'SECRET_DETECTED', message: 'Un secret semble présent. Reformulez sans clé, jeton ni mot de passe.' }
      }
      if (!technicalIdentifier && (EMAIL_PATTERN.test(current) || looksLikePhone(current))) {
        return { valid: false, code: 'PERSONAL_DATA_DETECTED', message: 'Retirez les coordonnées personnelles avant d’utiliser l’assistance.' }
      }
      return null
    }

    if (current === null || typeof current === 'boolean') return null
    if (typeof current === 'number') {
      return Number.isFinite(current)
        ? null
        : { valid: false, code: 'INVALID_REQUEST', message: 'Une valeur numérique est invalide.' }
    }
    if (typeof current !== 'object') {
      return { valid: false, code: 'INVALID_REQUEST', message: 'Le type de contenu transmis est invalide.' }
    }

    if (seen.has(current)) {
      return { valid: false, code: 'INVALID_REQUEST', message: 'La requête contient une structure récursive.' }
    }
    seen.add(current)

    if (Array.isArray(current)) {
      if (current.length > MAX_AI_CONTEXT_VALUES) {
        return { valid: false, code: 'INVALID_REQUEST', message: 'Un tableau contient trop de valeurs.' }
      }
      for (const item of current) {
        const issue = inspect(item, depth + 1, parentKey)
        if (issue) return issue
      }
      return null
    }

    const record = current as Record<string, unknown>
    for (const key of Object.keys(record)) {
      if (PROTOTYPE_KEYS.has(key)) {
        return { valid: false, code: 'INVALID_REQUEST', message: 'Une clé interdite est présente.' }
      }
      if (BLOCKED_KEY_NAMES.has(normalizedKey(key))) {
        return { valid: false, code: 'PERSONAL_DATA_DETECTED', message: 'La requête contient un champ qui ne doit pas être envoyé au modèle.' }
      }
      const issue = inspect(record[key], depth + 1, key)
      if (issue) return issue
    }
    return null
  }

  const issue = inspect(value, 0)
  return issue ?? { valid: true, stringCharacters, valueCount }
}

export function stripUrlQueryStrings<T>(value: T): T {
  if (typeof value === 'string') {
    try {
      const parsed = new URL(value)
      parsed.search = ''
      parsed.hash = ''
      return parsed.toString() as T
    } catch {
      return value
    }
  }
  if (Array.isArray(value)) {
    return value.map((item) => stripUrlQueryStrings(item)) as T
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, item]) => [
        key,
        stripUrlQueryStrings(item),
      ]),
    ) as T
  }
  return value
}

export function containsUnsafeStructuredOutput(value: unknown): boolean {
  if (typeof value === 'string') {
    return HTML_PATTERN.test(value) || CONTROL_CHARACTER_PATTERN.test(value) || containsObviousSecret(value)
  }
  if (Array.isArray(value)) return value.some(containsUnsafeStructuredOutput)
  if (value && typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>).some(
      ([key, item]) => PROTOTYPE_KEYS.has(key) || containsUnsafeStructuredOutput(item),
    )
  }
  return false
}
