import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, Badge, Form } from 'react-bootstrap';
import { listOrders } from '../../api/admin';
import type { AdminOrder } from '../../api/admin';

const statutVariant: Record<string, string> = {
  'En attente': 'warning',
  'pending': 'warning',
  'En préparation': 'info',
  'preparation': 'info',
  'Expédiée': 'primary',
  'shipped': 'primary',
  'Livrée': 'success',
  'delivered': 'success',
  'paid': 'success',
};

function formatOrderDate(o: AdminOrder): string {
  const raw = o.created_at ?? (o as { date?: string }).date;
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
  const t = o.total;
  if (t === undefined || t === null) return '—';
  if (typeof t === 'number') return `${t} $`;
  return String(t);
}

const mockOrders: AdminOrder[] = [
    { id: '1001', created_at: '2025-02-08', user: 'Marie Dupont', total: '165 000 $', status: 'Expédiée' },
    { id: '1002', created_at: '2025-02-07', user: 'Jean Martin', total: '130 000 $', status: 'En préparation' },
    { id: '1003', created_at: '2025-02-06', user: 'Sophie Bernard', total: '220 000 $', status: 'Livrée' },
    { id: '1004', created_at: '2025-02-05', user: 'Pierre Leroy', total: '95 000 $', status: 'En attente' },
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
  const statusKey = (o: AdminOrder) => (o.status ?? '').toLowerCase();

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
                <th>Total</th>
                <th>Statut</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayOrders.map((o) => (
                <tr key={o.id}>
                  <td><strong>#CMD-{o.id}</strong></td>
                  <td>{formatOrderDate(o)}</td>
                  <td>{formatOrderClient(o)}</td>
                  <td>{formatOrderTotal(o)}</td>
                  <td>
                    <Badge bg={statutVariant[o.status ?? ''] || statutVariant[statusKey(o)] || 'secondary'}>
                      {o.status ?? '—'}
                    </Badge>
                  </td>
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
