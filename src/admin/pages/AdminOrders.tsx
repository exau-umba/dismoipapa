import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, Badge, Form } from 'react-bootstrap';
import { listOrders } from '../../api/admin';
import type { AdminOrder } from '../../api/admin';

const statutVariant: Record<string, string> = {
  // payment_status
  'Paid': 'success',
  'paid': 'success',
  'Failed': 'danger',
  'failed': 'danger',
  'Pending': 'warning',
  'pending': 'warning',
  // shipping_status (ou anciens états backend)
  'En attente': 'warning',
  'En préparation': 'info',
  'Expédiée': 'primary',
  'Livrée': 'success',
  'preparation': 'info',
  'shipped': 'primary',
  'delivered': 'success',
};

function formatOrderDate(o: AdminOrder): string {
  const raw = o.order_date ?? o.created_at ?? (o as { date?: string }).date;
  if (!raw) return '—';
  try {
    return new Date(raw).toLocaleDateString('fr-FR');
  } catch {
    return String(raw);
  }
}

function formatOrderClient(o: AdminOrder): string {
  const u = o.user;
  if (typeof u === 'object' && u && 'email' in u) return (u as { email?: string }).email ?? '—';
  if (typeof u === 'string') return u;
  return (o as { client?: string }).client ?? '—';
}

function formatOrderTotal(o: AdminOrder): string {
  const t = o.total_amount ?? o.total;
  if (t === undefined || t === null) return '—';
  const n = typeof t === 'number' ? t : Number(String(t).replace(',', '.'));
  if (!Number.isNaN(n)) {
    return `${n.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} $`;
  }
  return `${String(t)} $`;
}

const mockOrders: AdminOrder[] = [
  {
    id: '1001',
    order_date: '2025-02-08',
    user: 'Marie Dupont',
    total_amount: '165 000 $',
    payment_status: 'Paid',
    shipping_status: 'Livrée',
  },
];

export default function AdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [useMock, setUseMock] = useState(false);

  useEffect(() => {
    setLoading(true);
    listOrders()
      .then((data) => {
        setOrders(Array.isArray(data) && data.length > 0 ? data : mockOrders);
        setUseMock(!Array.isArray(data) || data.length === 0);
      })
      .catch(() => {
        setOrders(mockOrders);
        setUseMock(true);
      })
      .finally(() => setLoading(false));
  }, []);

  const displayOrders = orders.length > 0 ? orders : mockOrders;

  return (
    <>
      <h1 className="admin-page-title">Commandes</h1>
      {useMock && (
        <p className="text-muted small mb-2">Données de démonstration (l’API commandes n’a pas renvoyé de liste).</p>
      )}
      <div className="admin-card">
        <div className="d-flex gap-2 mb-3 flex-wrap">
          <Form.Control type="date" className="w-auto" />
          <Form.Select className="w-auto" aria-label="Statut">
            <option value="">Tous les statuts</option>
            <option>En attente</option>
            <option>En préparation</option>
            <option>Expédiée</option>
            <option>Livrée</option>
          </Form.Select>
        </div>
        {loading ? (
          <p className="text-muted mb-0">Chargement des commandes…</p>
        ) : (
          <Table className="admin-table" responsive>
            <thead>
              <tr>
                <th>N° commande</th>
                <th>Date</th>
                <th>Client</th>
                  <th>Paiement</th>
                  <th>Livraison</th>
                  <th>Total</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayOrders.map((o) => (
                <tr key={o.id}>
                  <td><strong>{String((o as { order_number?: string }).order_number ?? `CMD-${o.id}`)}</strong></td>
                  <td>{formatOrderDate(o)}</td>
                  <td>{formatOrderClient(o)}</td>
                  <td>
                    <Badge bg={statutVariant[String(o.payment_status ?? '')] || 'secondary'}>
                      {o.payment_status || '—'}
                    </Badge>
                  </td>
                  <td>
                    <Badge bg={statutVariant[String(o.shipping_status ?? '')] || 'secondary'}>
                      {o.shipping_status || '—'}
                    </Badge>
                  </td>
                  <td>{formatOrderTotal(o)}</td>
                  <td className="text-end">
                    <Link to={`/admin/commandes/${o.id}`} className="btn btn-sm btn-outline-primary">
                      Détail
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </>
  );
}
