import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, Badge, Form } from 'react-bootstrap';
import { listOrders, listUsers } from '../../api/admin';
import type { AdminOrder, AdminUser } from '../../api/admin';

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

function getOrderRawDate(o: AdminOrder): string | null {
  const raw = o.order_date ?? o.created_at ?? (o as { date?: string }).date;
  return typeof raw === 'string' && raw.trim() ? raw : null;
}

function getOrderDateForInput(o: AdminOrder): string {
  const raw = getOrderRawDate(o);
  if (!raw) return '';
  try {
    return new Date(raw).toISOString().slice(0, 10);
  } catch {
    return '';
  }
}

function normalizeStatus(s: unknown): string {
  return String(s ?? '').trim().toLowerCase();
}

function formatOrderClient(o: AdminOrder, usersById: Record<string, AdminUser>): string {
  if (typeof (o as { user_full_name?: string }).user_full_name === 'string') {
    return (o as { user_full_name?: string }).user_full_name ?? '—';
  }
  const u = o.user;
  if (typeof u === 'object' && u && 'full_name' in u) {
    return (u as { full_name?: string }).full_name ?? '—';
  }
  if (typeof u === 'string') {
    // `user` peut être un UUID. On enrichit avec /api/users/{id}/ si possible.
    const found = usersById[u];
    if (found?.full_name) return found.full_name;
    // Sinon, si ce n'est pas un UUID, on l'affiche tel quel.
    if (!u.includes('-')) return u;
  }
  return '—';
}

function formatOrderClientEmail(o: AdminOrder, usersById: Record<string, AdminUser>): string {
  if (typeof (o as { user_email?: string }).user_email === 'string') {
    return (o as { user_email?: string }).user_email ?? '—';
  }
  const u = o.user;
  if (typeof u === 'object' && u && 'email' in u) {
    return (u as { email?: string }).email ?? '—';
  }
  if (typeof u === 'string') {
    const found = usersById[u];
    if (found?.email) return found.email;
  }
  return '—';
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
  const [usersById, setUsersById] = useState<Record<string, AdminUser>>({});
  const [loading, setLoading] = useState(true);
  const [useMock, setUseMock] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

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

    listUsers()
      .then((users) => {
        const map: Record<string, AdminUser> = {};
        users.forEach((u) => {
          map[u.id] = u;
        });
        setUsersById(map);
      })
      .catch(() => setUsersById({}));
  }, []);

  const displayOrders = orders.length > 0 ? orders : mockOrders;
  const filteredOrders = displayOrders.filter((o) => {
    const dateOk = !selectedDate || getOrderDateForInput(o) === selectedDate;
    const statusOk =
      !selectedStatus ||
      normalizeStatus(o.payment_status) === normalizeStatus(selectedStatus);
    return dateOk && statusOk;
  });
  const availableStatuses = Array.from(
    new Set(displayOrders.map((o) => String(o.payment_status ?? '').trim()).filter(Boolean))
  );

  return (
    <>
      <h1 className="admin-page-title">Commandes</h1>
      {useMock && (
        <p className="text-muted small mb-2">Données de démonstration (l’API commandes n’a pas renvoyé de liste).</p>
      )}
      <div className="admin-card">
        <div className="d-flex gap-2 mb-3 flex-wrap">
          <Form.Control
            type="date"
            className="w-auto"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <Form.Select
            className="w-auto"
            aria-label="Statut"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">Tous les statuts</option>
            {availableStatuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
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
                  <th>Total</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((o) => (
                <tr key={o.id}>
                  <td><strong>{String((o as { order_number?: string }).order_number ?? `CMD-${o.id}`)}</strong></td>
                  <td>{formatOrderDate(o)}</td>
                  <td>
                    <div className="fw-semibold">{formatOrderClient(o, usersById)}</div>
                    <div className="small text-muted">{formatOrderClientEmail(o, usersById)}</div>
                  </td>
                  <td>
                    <Badge bg={statutVariant[String(o.payment_status ?? '')] || 'secondary'}>
                      {o.payment_status || '—'}
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
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-muted py-4">
                    Aucune commande ne correspond aux filtres.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </div>
    </>
  );
}
