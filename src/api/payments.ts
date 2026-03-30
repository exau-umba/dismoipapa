import { getJson } from './client';

/** Réponse GET /api/payments/transactions/ (admin : toutes ; client : filtrées par utilisateur). */
export interface PaymentTransaction {
  id: string;
  transaction_ref?: string;
  order_id?: string;
  order_number?: string;
  user_id?: string;
  amount?: string;
  currency?: string;
  status?: string;
  provider?: string;
  created_at?: string;
  updated_at?: string;
}

function normalizePaymentTransactionList(data: unknown): PaymentTransaction[] {
  if (data == null) return [];
  if (Array.isArray(data)) return data as PaymentTransaction[];
  if (typeof data === 'object' && Array.isArray((data as { results?: PaymentTransaction[] }).results)) {
    return (data as { results: PaymentTransaction[] }).results;
  }
  return [];
}

export function listPaymentTransactions(): Promise<PaymentTransaction[]> {
  return getJson<PaymentTransaction[] | { results: PaymentTransaction[] } | null>(
    '/api/payments/transactions/',
  ).then((data) => normalizePaymentTransactionList(data ?? null));
}
