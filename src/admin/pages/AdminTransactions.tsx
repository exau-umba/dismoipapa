import React, { useEffect, useState } from 'react';
import { listPaymentTransactions, type PaymentTransaction } from '../../api/payments';
import { PaymentTransactionsTable } from '../../components/PaymentTransactionsTable';
import { getFriendlyErrorMessage } from '../../utils/errorMessages';

export default function AdminTransactions() {
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
    <div>
      <h1 className="admin-page-title">Transactions de paiement</h1>
      <p className="text-muted small mb-3">
        GET /api/payments/transactions/ — toutes les transactions de paiement.
      </p>

      {error && <div className="alert alert-danger mb-3">{error}</div>}

      <div className="admin-card">
        {loading ? (
          <p className="text-muted mb-0">Chargement des transactions…</p>
        ) : rows.length === 0 ? (
          <p className="text-muted mb-0">Aucune transaction à afficher.</p>
        ) : (
          <PaymentTransactionsTable rows={rows} />
        )}
      </div>
    </div>
  );
}
