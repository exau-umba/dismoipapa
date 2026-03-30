import React from 'react';
import { Table, Badge } from 'react-bootstrap';
import type { PaymentTransaction } from '../api/payments';

export function paymentStatusBadgeVariant(status: string | undefined): string {
  const s = String(status ?? '').toLowerCase();
  if (s.includes('paid') || s.includes('success')) return 'success';
  if (s.includes('fail') || s.includes('error') || s.includes('cancel')) return 'danger';
  if (s.includes('pend')) return 'warning';
  return 'secondary';
}

export function formatPaymentTransactionDate(iso: string | undefined): string {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('fr-FR');
  } catch {
    return iso;
  }
}

export function formatPaymentTransactionAmount(row: PaymentTransaction): string {
  const a = row.amount;
  const c = row.currency?.trim();
  if (a === undefined || a === null || String(a).trim() === '') {
    return c ? c : '—';
  }
  return c ? `${a} ${c}` : String(a);
}

export function PaymentTransactionsTable({ rows }: { rows: PaymentTransaction[] }) {
  if (rows.length === 0) return null;
  return (
    <div className="table-responsive">
      <Table hover className="admin-table mb-0 align-middle">
        <thead>
          <tr>
            <th>Date</th>
            <th>N° commande</th>
            <th>Montant</th>
            <th>Réf. transaction</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{formatPaymentTransactionDate(row.created_at)}</td>
              <td>
                <strong>{row.order_number ?? '—'}</strong>
              </td>
              <td>{formatPaymentTransactionAmount(row)}</td>
              <td>
                <code className="small text-break">{row.transaction_ref ?? '—'}</code>
              </td>
              <td>
                <Badge bg={paymentStatusBadgeVariant(row.status)}>{row.status ?? '—'}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
