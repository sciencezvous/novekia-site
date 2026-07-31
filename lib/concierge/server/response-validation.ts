import type { ConciergeAIResponse, ConciergeAITask } from '../ai-contract'
import {
  getTaskConfidence,
  validateConciergeAITaskOutput,
} from '../ai-schemas'

export function validateProviderResponse(
  task: ConciergeAITask,
  response: ConciergeAIResponse,
): ConciergeAIResponse {
  if (!response.success || !response.structuredOutput) return response
  const result = validateConciergeAITaskOutput(task, response.structuredOutput)
  if (!result) {
    return {
      ...response,
      success: false,
      output: null,
      structuredOutput: null,
      confidence: null,
      error: {
        code: 'invalid_output',
        message: 'La sortie du fournisseur ne respecte pas le schéma attendu.',
        retryable: false,
      },
    }
  }
  return {
    ...response,
    output: null,
    structuredOutput: result as unknown as Record<string, unknown>,
    confidence: getTaskConfidence(task, result),
  }
}
