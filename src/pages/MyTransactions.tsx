import React, { useEffect, useState } from 'react';
import { Badge } from 'react-bootstrap';
import PageTitle from '../layouts/PageTitle';
import ErrorMessage from '../components/ErrorMessage';
import {
  PaymentTransactionsTable,
  formatPaymentTransactionAmount,
  formatPaymentTransactionDate,
  paymentStatusBadgeVariant,
} from '../components/PaymentTransactionsTable';
import { listPaymentTransactions, type PaymentTransaction } from '../api/payments';
import { getFriendlyErrorMessage } from '../utils/errorMessages';

export default function MyTransactions() {
  const [rows, setRows] = useState<PaymentTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    listPaymentTransactions()
      .then((data) => {
        if (!cancelled) setRows(data);
      })
      .catch((e) => {
        if (!cancelled) setError(getFriendlyErrorMessage(e));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="page-content">
      <PageTitle parentPage="Pages" childPage="Mes transactions" />
      <section className="content-inner-1">
        <div className="container">
          <p className="text-muted small mb-3">
            Historique de vos paiements (même source que l’admin, filtré sur votre compte).
          </p>

          {error && (
            <ErrorMessage message={error} onDismiss={() => setError(null)} className="mb-3" />
          )}

          {loading ? (
            <p className="text-center py-5 text-muted mb-0">Chargement de vos transactions…</p>
          ) : rows.length === 0 ? (
            <p className="text-center py-5 text-muted mb-0">Aucune transaction pour le moment.</p>
          ) : (
            <>
              <div className="d-none d-md-block">
                <div className="widget bg-white shadow-sm p-3">
                  <PaymentTransactionsTable rows={rows} />
                </div>
              </div>
              <div className="d-md-none">
                {rows.map((row) => (
                  <div key={row.id} className="card mb-3 shadow-sm">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start gap-2">
                        <div>
                          <div className="fw-bold">{row.order_number ?? '—'}</div>
                          <div className="text-muted small mt-1">
                            {formatPaymentTransactionDate(row.created_at)}
                          </div>
                        </div>
                        <Badge bg={paymentStatusBadgeVariant(row.status)}>{row.status ?? '—'}</Badge>
                      </div>
                      <div className="mt-3">
                        <span className="small text-muted text-uppercase">Montant</span>
                        <div className="fw-semibold">{formatPaymentTransactionAmount(row)}</div>
                      </div>
                      <div className="mt-2">
                        <span className="small text-muted text-uppercase">Réf. transaction</span>
                        <div>
                          <code className="small text-break">{row.transaction_ref ?? '—'}</code>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
