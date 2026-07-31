import { Resend } from 'resend'
import type {
  ConfirmationEmailStatus,
  RecomputedConciergeSubmission,
} from './contracts'
import {
  buildInternalConciergeEmail,
  buildVisitorConfirmationEmail,
  type ConciergeEmailMessage,
} from './email-payload'

export type ConciergeResendConfig = {
  enabled: boolean
  explicitlyDisabled: boolean
  apiKey: string | null
  from: string | null
  internalTo: string | null
}

export type ConciergeEmailTransport = {
  send: (message: ConciergeEmailMessage) => Promise<{ success: boolean }>
}

export type ConciergeDeliveryResult =
  | {
      success: true
      confirmationEmail: ConfirmationEmailStatus
      warnings: readonly string[]
    }
  | { success: false }

const EMAIL_TIMEOUT_MS = 12_000

export function getConciergeResendConfig(): ConciergeResendConfig {
  const apiKey = process.env.RESEND_API_KEY?.trim() || null
  const from = process.env.CONTACT_FROM?.trim() || null
  const internalTo = process.env.CONTACT_TO?.trim() || null
  const explicitlyDisabled = process.env.CONCIERGE_SUBMISSION_ENABLED === 'false'
  return {
    explicitlyDisabled,
    enabled: !explicitlyDisabled && Boolean(apiKey && from && internalTo),
    apiKey,
    from,
    internalTo,
  }
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T | null> {
  let timeout: ReturnType<typeof setTimeout> | undefined
  try {
    return await Promise.race([
      promise,
      new Promise<null>((resolve) => {
        timeout = setTimeout(() => resolve(null), timeoutMs)
      }),
    ])
  } finally {
    if (timeout) clearTimeout(timeout)
  }
}

export function createResendTransport(apiKey: string): ConciergeEmailTransport {
  const resend = new Resend(apiKey)
  return {
    async send(message) {
      try {
        const result = await resend.emails.send(
            {
              from: message.from,
              to: message.to,
              replyTo: message.replyTo,
              subject: message.subject,
              html: message.html,
              text: message.text,
            },
            { idempotencyKey: message.idempotencyKey },
          )
        return { success: Boolean(result && !result.error) }
      } catch {
        return { success: false }
      }
    },
  }
}

export async function deliverConciergeSubmission(
  submission: RecomputedConciergeSubmission,
  config: ConciergeResendConfig,
  transport?: ConciergeEmailTransport,
  options: { timeoutMs?: number } = {},
): Promise<ConciergeDeliveryResult> {
  if (!config.enabled || !config.apiKey || !config.from || !config.internalTo) {
    return { success: false }
  }

  const sender = transport ?? createResendTransport(config.apiKey)
  const addresses = { from: config.from, internalTo: config.internalTo }
  const internal = await withTimeout(
    sender.send(buildInternalConciergeEmail(submission, addresses)),
    options.timeoutMs ?? EMAIL_TIMEOUT_MS,
  )
  if (!internal?.success) return { success: false }

  const confirmation = await withTimeout(
    sender.send(buildVisitorConfirmationEmail(submission, addresses)),
    options.timeoutMs ?? EMAIL_TIMEOUT_MS,
  )
  if (!confirmation?.success) {
    return {
      success: true,
      confirmationEmail: 'failed',
      warnings: [
        'La demande a été transmise, mais l’e-mail de confirmation n’a pas pu être envoyé.',
      ],
    }
  }

  return { success: true, confirmationEmail: 'sent', warnings: [] }
}
