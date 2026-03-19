import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageTitle from '../layouts/PageTitle';
import ErrorMessage from '../components/ErrorMessage';
import { listMyOrders, type MyOrder } from '../api/orders';
import { Table, Badge } from 'react-bootstrap';
import { getFriendlyErrorMessage } from '../utils/errorMessages';

const STATUS_VARIANT: Record<string, string> = {
  'En attente': 'warning',
  'En préparation': 'info',
  'Expédiée': 'primary',
  'Livrée': 'success',
  Failed: 'danger',
  Pending: 'warning',
  Paid: 'success',
};

function statusBadgeVariant(status: string | undefined | null) {
  if (!status) return 'secondary';
  return STATUS_VARIANT[String(status)] || 'secondary';
}

export default function MyOrders() {
  const [orders, setOrders] = useState<MyOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    listMyOrders()
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch((err) => setError(getFriendlyErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-content">
      <PageTitle parentPage="Pages" childPage="Mes commandes" />
      <section className="content-inner-1">
        <div className="container">
          {error && (
            <div className="row">
              <div className="col-12">
                <ErrorMessage
                  message={error}
                  onDismiss={() => setError(null)}
                  className="mb-3"
                />
              </div>
            </div>
          )}

          {loading ? (
            <div className="row">
              <div className="col-12 text-center py-5">
                <p>Chargement de vos commandes…</p>
              </div>
            </div>
          ) : orders.length === 0 ? (
            <div className="row">
              <div className="col-12 text-center py-5">
                <i className="fa fa-shopping-cart" style={{ fontSize: 48, color: '#ccc' }} />
                <p className="text-muted mt-3">Aucune commande pour le moment.</p>
                <Link to="/books-grid-view" className="btn btn-primary btnhover">
                  Parcourir la boutique
                </Link>
              </div>
            </div>
          ) : (
            <Table className="admin-table" responsive>
              <thead>
                <tr>
                  <th>N°</th>
                  <th>Date</th>
                  <th>Paiement</th>
                  <th>Livraison</th>
                  <th>Articles</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => {
                  const createdAt = o.order_date
                    ? new Date(o.order_date).toLocaleDateString('fr-FR')
                    : o.created_at
                      ? new Date(o.created_at).toLocaleDateString('fr-FR')
                      : '—';
                  const paymentStatus = o.payment_status ?? undefined;
                  const shippingStatus = o.shipping_status ?? undefined;
                  const total =
                    typeof o.total_amount === 'number'
                      ? o.total_amount
                      : o.total_amount ?? o.total ?? '—';
                  const items = o.items ?? [];
                  return (
                    <tr key={String(o.id)}>
                      <td>
                        <strong>#{o.id}</strong>
                      </td>
                      <td>{createdAt}</td>
                      <td>
                        <Badge bg={statusBadgeVariant(paymentStatus ?? undefined)}>
                          {paymentStatus || '—'}
                        </Badge>
                      </td>
                      <td>
                        <span className="text-start">{o.shipping_address || '—'}</span>
                        {/* <Badge bg={statusBadgeVariant(shippingStatus ?? undefined)}>
                          {shippingStatus || '—'}
                        </Badge> */}
                      </td>
                      <td className="text-start">
                        {items.length === 0 ? (
                          '—'
                        ) : (
                          <ul className="mb-0 ps-3 text-start">
                            {items.map((it) => (
                              <li key={it.id || `${it.format}:${it.quantity}`} className="text-start">
                                {(() => {
                                  const formatName = (it.format_name || '').toLowerCase();
                                  const title = it.book_title || 'Livre';
                                  if (formatName === 'physical') return `${title} x${it.quantity}`;
                                  return `${title} (E-Book)`;
                                })()}
                              </li>
                            ))}
                          </ul>
                        )}
                      </td>
                      <td>{total}$</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </div>
      </section>
    </div>
  );
}

