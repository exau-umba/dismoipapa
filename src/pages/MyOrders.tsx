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

function formatMoney(value: string | number | undefined | null): string {
  if (value === undefined || value === null) return '—';
  if (typeof value === 'number') {
    return `${value.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} $`;
  }
  const s = String(value).trim();
  if (!s) return '—';
  // Évite d'afficher "xxx $ $" si l'API renvoie déjà le symbole.
  if (s.includes('$')) return s;

  // Tentative de normalisation numérique (ex: "165 000" ou "165.000").
  const cleaned = s.replace(/[^\d.,-]/g, '').replace(/\s+/g, '');
  if (!cleaned) return `${s} $`;
  const normalized = cleaned.includes(',') && !cleaned.includes('.') ? cleaned.replace(',', '.') : cleaned;
  const n = parseFloat(normalized);
  if (Number.isFinite(n)) {
    return `${n.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} $`;
  }
  return `${s} $`;
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
          {/* <div className="row mb-3">
            <div className="col-12">
              <div className="d-flex flex-column flex-md-row gap-2">
                <Link className="btn btn-outline-primary btnhover" to="/my-profile#informations-personnelles">
                  Modifier mes informations
                </Link>
                <Link className="btn btn-primary btnhover" to="/my-profile#change-password">
                  Changer mot de passe
                </Link>
              </div>
            </div>
          </div> */}

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
            <>
              <div className="d-none d-md-block">
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
                      const orderNumber = String((o as { order_number?: string }).order_number ?? `CMD-${o.id}`);
                      const totalDisplay = formatMoney(o.total_amount ?? o.total);
                      const items = o.items ?? [];
                      return (
                        <tr key={String(o.id)}>
                          <td>
                            <strong>{orderNumber}</strong>
                          </td>
                          <td>{createdAt}</td>
                          <td>
                            <Badge bg={statusBadgeVariant(paymentStatus ?? undefined)}>
                              {paymentStatus || '—'}
                            </Badge>
                          </td>
                          <td>
                            <span className="text-start">{o.shipping_address || '—'}</span>
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
                          <td>{totalDisplay}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>

              <div className="d-md-none">
                {orders.map((o) => {
                  const createdAt = o.order_date
                    ? new Date(o.order_date).toLocaleDateString('fr-FR')
                    : o.created_at
                      ? new Date(o.created_at).toLocaleDateString('fr-FR')
                      : '—';
                  const paymentStatus = o.payment_status ?? undefined;
                  const orderNumber = String((o as { order_number?: string }).order_number ?? `CMD-${o.id}`);
                  const totalDisplay = formatMoney(o.total_amount ?? o.total);
                  const shippingAddress = o.shipping_address || '—';
                  const items = o.items ?? [];

                  return (
                    <div key={String(o.id)} className="card mb-3">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start gap-2">
                          <div>
                            <div className="fw-bold">{orderNumber}</div>
                            <div className="text-muted small">{createdAt}</div>
                          </div>
                          <Badge bg={statusBadgeVariant(paymentStatus ?? undefined)}>
                            {paymentStatus || '—'}
                          </Badge>
                        </div>

                        <div className="mt-3">
                          <div className="fw-semibold small text-muted text-uppercase">Livraison</div>
                          <div>{shippingAddress}</div>
                        </div>

                        <div className="mt-3">
                          <div className="fw-semibold small text-muted text-uppercase">Articles</div>
                          {items.length === 0 ? (
                            <div className="text-muted">—</div>
                          ) : (
                            <ul className="mb-0 ps-3">
                              {items.map((it) => (
                                <li key={it.id || `${it.format}:${it.quantity}`}>
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
                        </div>

                        <div className="mt-3 d-flex justify-content-between align-items-center">
                          <div className="fw-semibold">Total</div>
                          <div className="fw-bold">{totalDisplay}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

