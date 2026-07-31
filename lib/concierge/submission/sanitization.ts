import { containsObviousSecret } from '../ai-sanitization'
import {
  MAX_SUBMISSION_ANSWERS,
  MAX_SUBMISSION_DEPTH,
  MAX_SUBMISSION_TOTAL_CHARACTERS,
  type SubmissionValidationIssue,
} from './contracts'

const PROTOTYPE_KEYS = new Set(['__proto__', 'constructor', 'prototype'])
const CONTROL_CHARACTER_PATTERN = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/
const HTML_PATTERN = /<\/?(?:script|style|iframe|object|embed|form|svg|math|[a-z][a-z0-9-]*(?:\s+[^>]*)?)>/i
const URL_PATTERN = /https?:\/\/[^\s]+/gi
const REPEATED_CONTENT_PATTERN = /(.)\1{24,}|\b([\p{L}\p{N}]{3,})(?:\s+\2){9,}/iu
const BASE64_PATTERN = /\b[A-Za-z0-9+/]{180,}={0,2}\b/

export function normalizeSubmissionText(value: string, maxLength: number): string {
  return value
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '')
    .replace(/\r\n?/g, '\n')
    .replace(/[\t ]+/g, ' ')
    .trim()
    .slice(0, maxLength)
}

export function inspectSubmissionPayload(value: unknown): SubmissionValidationIssue | null {
  let valueCount = 0
  let stringCharacters = 0
  const seen = new WeakSet<object>()

  function inspect(current: unknown, depth: number): SubmissionValidationIssue | null {
    if (depth > MAX_SUBMISSION_DEPTH) {
      return { code: 'INVALID_REQUEST', message: 'La demande est trop imbriquée.' }
    }
    valueCount += 1
    if (valueCount > 600) {
      return { code: 'INVALID_REQUEST', message: 'La demande contient trop de valeurs.' }
    }

    if (typeof current === 'string') {
      stringCharacters += current.length
      if (stringCharacters > MAX_SUBMISSION_TOTAL_CHARACTERS) {
        return { code: 'INVALID_REQUEST', message: 'Le contenu transmis est trop long.' }
      }
      if (CONTROL_CHARACTER_PATTERN.test(current)) {
        return { code: 'INVALID_REQUEST', message: 'Le contenu contient des caractères non autorisés.' }
      }
      if (containsObviousSecret(current) || BASE64_PATTERN.test(current)) {
        return {
          code: 'SECRET_DETECTED',
          message: 'Retirez toute clé, tout jeton ou mot de passe avant de reformuler.',
        }
      }
      return null
    }

    if (current === null || typeof current === 'boolean') return null
    if (typeof current === 'number') {
      return Number.isFinite(current)
        ? null
        : { code: 'INVALID_REQUEST', message: 'Une valeur numérique est invalide.' }
    }
    if (typeof current !== 'object') {
      return { code: 'INVALID_REQUEST', message: 'Un type de donnée est invalide.' }
    }
    if (seen.has(current)) {
      return { code: 'INVALID_REQUEST', message: 'La demande contient une structure récursive.' }
    }
    seen.add(current)

    if (Array.isArray(current)) {
      if (current.length > 30) {
        return { code: 'INVALID_REQUEST', message: 'Un tableau contient trop de valeurs.' }
      }
      for (const item of current) {
        const issue = inspect(item, depth + 1)
        if (issue) return issue
      }
      return null
    }

    const entries = Object.entries(current as Record<string, unknown>)
    if (entries.length > MAX_SUBMISSION_ANSWERS + 30) {
      return { code: 'INVALID_REQUEST', message: 'Un objet contient trop de champs.' }
    }
    for (const [key, item] of entries) {
      if (PROTOTYPE_KEYS.has(key)) {
        return { code: 'INVALID_REQUEST', message: 'Une clé interdite est présente.' }
      }
      const issue = inspect(item, depth + 1)
      if (issue) return issue
    }
    return null
  }

  return inspect(value, 0)
}

export function inspectFreeText(value: string): SubmissionValidationIssue | null {
  if (HTML_PATTERN.test(value)) {
    return { code: 'INVALID_REQUEST', message: 'Retirez le code HTML ou le script du contenu.' }
  }
  if (REPEATED_CONTENT_PATTERN.test(value)) {
    return { code: 'INVALID_REQUEST', message: 'Le contenu semble anormalement répétitif.' }
  }
  const links = value.match(URL_PATTERN)?.length ?? 0
  if (links > 5) {
    return { code: 'INVALID_REQUEST', message: 'Le contenu contient trop de liens.' }
  }
  return null
}

export function escapeEmailHtml(value: string): string {
  const characters: Readonly<Record<string, string>> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return value.replace(/[&<>"']/g, (character) => characters[character])
}
