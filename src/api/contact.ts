/**
 * API contact - POST /api/contact/
 * https://api.dismoipapa.shop/api/contact/
 */
import { postJson } from './client';

export interface ContactPayload {
  email: string;
  subject: string;
  message: string;
  name: string;
}

/**
 * Envoie un message de contact au backend.
 */
export function sendContactMessage(payload: ContactPayload): Promise<unknown> {
  return postJson<unknown>('/api/contact/', payload);
}
