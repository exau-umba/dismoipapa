import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { Card, Table, Badge, Row, Col } from 'react-bootstrap';
import { fetchBooks } from '../../api/catalog';
import {
  listUsers,
  listOrders,
  listCatalogs,
  type Catalog,
  type AdminOrder,
  type AdminUser,
} from '../../api/admin';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement);

function formatMonthLabelFR(d: Date) {
  return d.toLocaleDateString('fr-FR', { month: 'short' }).replace('.', '');
}

function parseOrderTotal(total: string | number | undefined): number {
  if (total == null) return 0;
  if (typeof total === 'number') return Number.isFinite(total) ? total : 0;
  const cleaned = total.replace(/[^\d.,-]/g, '').replace(/\s+/g, '');
  if (!cleaned) return 0;
  const normalized = cleaned.includes(',') && !cleaned.includes('.') ? cleaned.replace(',', '.') : cleaned;
  const n = parseFloat(normalized);
  return Number.isFinite(n) ? n : 0;
}

function formatOrderDate(o: AdminOrder): string {
  const raw = o.order_date ?? o.created_at ?? (o as { date?: string }).date;
  if (!raw) return '—';
  try {
    return new Date(raw).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return String(raw);
  }
}

function formatOrderClientName(o: AdminOrder, usersById: Record<string, AdminUser>): string {
  if (typeof o.user_full_name === 'string' && o.user_full_name.trim()) {
    return o.user_full_name;
  }
  const u = o.user;
  if (typeof u === 'object' && u && 'full_name' in u) {
    return (u as { full_name?: string }).full_name ?? '—';
  }
  if (typeof u === 'string') {
    const found = usersById[u];
    if (found?.full_name) return found.full_name;
    if (!u.includes('-')) return u;
  }
  return '—';
}

function formatOrderClientEmail(o: AdminOrder, usersById: Record<string, AdminUser>): string {
  if (typeof o.user_email === 'string' && o.user_email.trim()) {
    return o.user_email;
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

function formatOrderNumber(o: AdminOrder): string {
  return String((o as { order_number?: string }).order_number ?? `CMD-${o.id}`);
}

function formatOrderTotalDisplay(o: AdminOrder): string {
  const t = o.total_amount ?? o.total;
  if (t === undefined || t === null) return '—';
  const n = typeof t === 'number' ? t : Number(String(t).replace(/[^\d.,-]/g, '').replace(',', '.'));
  if (!Number.isNaN(n)) {
    return `${n.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} $`;
  }
  return `${String(t)}`;
}

function formatOrderStatus(o: AdminOrder): string {
  if (o.shipping_status) return String(o.shipping_status);
  if (o.payment_status) return String(o.payment_status);
  return String(o.status ?? '—');
}

function getOrderTimestamp(o: AdminOrder): number {
  const raw = o.order_date ?? o.created_at;
  if (!raw) return 0;
  const t = new Date(raw).getTime();
  return Number.isNaN(t) ? 0 : t;
}

const CATEGORY_COLORS = [
  'rgba(0, 102, 204, 0.8)',
  'rgba(26, 22, 104, 0.8)',
  'rgba(2, 158, 118, 0.8)',
  'rgba(0, 174, 255, 0.8)',
  'rgba(255, 159, 64, 0.8)',
  'rgba(153, 102, 255, 0.8)',
];

/** Barres : deux échelles (revenus vs nombre de commandes), sinon les barres « commandes » sont écrasées par l’échelle des montants. */
const barChartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  aspectRatio: 1.85,
  plugins: {
    legend: { position: 'top' as const },
    title: { display: false },
  },
  scales: {
    x: {
      grid: { display: false },
    },
    y: {
      type: 'linear' as const,
      display: true,
      position: 'left' as const,
      beginAtZero: true,
      title: { display: true, text: 'Revenus ($)' },
    },
    y1: {
      type: 'linear' as const,
      display: true,
      position: 'right' as const,
      beginAtZero: true,
      grid: { drawOnChartArea: false },
      title: { display: true, text: 'Nombre de commandes' },
      ticks: {
        precision: 0,
      },
    },
  },
};

const revenueLineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    title: { display: false },
  },
  scales: {
    y: { beginAtZero: true },
  },
};

const statutVariant: Record<string, string> = {
  Paid: 'success',
  paid: 'success',
  Failed: 'danger',
  failed: 'danger',
  Pending: 'warning',
  pending: 'warning',
  'En attente': 'warning',
  'En préparation': 'info',
  Expédiée: 'primary',
  Livrée: 'success',
  preparation: 'info',
  shipped: 'primary',
  delivered: 'success',
};

type RecentOrderRow = {
  id: string;
  orderNumber: string;
  clientName: string;
  clientEmail: string;
  montant: string;
  date: string;
  statut: string;
};

export default function AdminDashboard() {
  const [booksCount, setBooksCount] = useState<number | null>(null);
  const [usersCount, setUsersCount] = useState<number | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrderRow[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [ordersLoaded, setOrdersLoaded] = useState(false);
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [books, setBooks] = useState<Awaited<ReturnType<typeof fetchBooks>>>([]);

  useEffect(() => {
    fetchBooks()
      .then((data) => {
        setBooksCount(data.length);
        setBooks(data);
      })
      .catch(() => {
        setBooksCount(0);
        setBooks([]);
      });
  }, []);

  useEffect(() => {
    listCatalogs()
      .then((data) => setCatalogs(data))
      .catch(() => setCatalogs([]));
  }, []);

  useEffect(() => {
    Promise.all([
      listOrders().catch(() => [] as AdminOrder[]),
      listUsers().catch(() => [] as AdminUser[]),
    ])
      .then(([data, users]) => {
        setUsersCount(users.length);
        const list = Array.isArray(data) ? data : [];
        const usersById: Record<string, AdminUser> = {};
        users.forEach((u) => {
          usersById[u.id] = u;
        });
        setOrders(list);
        const sorted = [...list].sort((a, b) => getOrderTimestamp(b) - getOrderTimestamp(a));
        setRecentOrders(
          sorted.slice(0, 10).map((o) => ({
            id: String(o.id),
            orderNumber: formatOrderNumber(o),
            clientName: formatOrderClientName(o, usersById),
            clientEmail: formatOrderClientEmail(o, usersById),
            montant: formatOrderTotalDisplay(o),
            date: formatOrderDate(o),
            statut: formatOrderStatus(o),
          }))
        );
      })
      .catch(() => {
        setOrders([]);
        setRecentOrders([]);
      })
      .finally(() => setOrdersLoaded(true));
  }, []);

  const monthlyStats = useMemo(() => {
    const now = new Date();
    const months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      return { key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`, date: d };
    });

    const revenue: Record<string, number> = {};
    const counts: Record<string, number> = {};
    months.forEach((m) => {
      revenue[m.key] = 0;
      counts[m.key] = 0;
    });

    orders.forEach((o) => {
      const raw = o.order_date ?? o.created_at;
      if (!raw) return;
      const d = new Date(raw);
      if (Number.isNaN(d.getTime())) return;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!(key in revenue)) return;
      revenue[key] += parseOrderTotal(String(o.total_amount ?? o.total ?? 0));
      counts[key] += 1;
    });

    const labels = months.map((m) => formatMonthLabelFR(m.date));
    return {
      labels,
      revenueValues: months.map((m) => revenue[m.key]),
      orderCounts: months.map((m) => counts[m.key]),
    };
  }, [orders]);

  const barChartData = useMemo(
    () => ({
      labels: monthlyStats.labels,
      datasets: [
        {
          label: 'Nombre de commandes',
          data: monthlyStats.orderCounts,
          yAxisID: 'y1',
          backgroundColor: 'rgba(0, 102, 204, 0.7)',
          borderColor: '#0066cc',
          borderWidth: 1,
        },
        {
          label: 'Revenus ($)',
          data: monthlyStats.revenueValues,
          yAxisID: 'y',
          backgroundColor: 'rgba(26, 22, 104, 0.5)',
          borderColor: '#1a1668',
          borderWidth: 1,
        },
      ],
    }),
    [monthlyStats]
  );

  const revenueLineData = useMemo(
    () => ({
      labels: monthlyStats.labels,
      datasets: [
        {
          label: 'Revenus ($)',
          data: monthlyStats.revenueValues,
          borderColor: '#029e76',
          backgroundColor: 'rgba(2, 158, 118, 0.1)',
          tension: 0.4,
          fill: true,
        },
      ],
    }),
    [monthlyStats]
  );

  const categoryData = useMemo(() => {
    const byId: Record<string, Catalog> = {};
    catalogs.forEach((c) => {
      byId[c.id] = c;
    });

    const counts: Record<string, number> = {};
    books.forEach((b) => {
      const id = b.catalog || 'unknown';
      counts[id] = (counts[id] || 0) + 1;
    });

    const entries = Object.entries(counts)
      .map(([catalogId, count]) => ({
        catalogId,
        count,
        name:
          catalogId === 'unknown'
            ? 'Sans catalogue'
            : byId[catalogId]?.name || 'Catalogue inconnu',
      }))
      .sort((a, b) => b.count - a.count);

    const top = entries.slice(0, 4);
    const restTotal = entries.slice(4).reduce((acc, e) => acc + e.count, 0);

    const labels = top.map((e) => e.name).concat(restTotal > 0 ? ['Autre'] : []);
    const data = top.map((e) => e.count).concat(restTotal > 0 ? [restTotal] : []);

    const colors = labels.map((_, i) => CATEGORY_COLORS[i % CATEGORY_COLORS.length]);

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: colors,
          borderWidth: 2,
          borderColor: '#fff',
        },
      ],
    };
  }, [books, catalogs]);

  const stats = useMemo(
    () => [
      {
        label: 'Total des commandes',
        value: ordersLoaded ? String(orders.length) : '—',
        icon: 'fa-shopping-cart',
        type: 'primary' as const,
        change: '',
      },
      {
        label: 'Livres en catalogue',
        value: booksCount !== null ? String(booksCount) : '—',
        icon: 'fa-book',
        type: 'success' as const,
        change: '',
      },
      {
        label: 'Utilisateurs',
        value: usersCount !== null ? String(usersCount) : '—',
        icon: 'fa-users',
        type: 'info' as const,
        change: '',
      },
      {
        label: 'Livres téléchargés',
        value: '—',
        icon: 'fa-download',
        type: 'primary' as const,
        change: '',
      },
    ],
    [orders.length, ordersLoaded, booksCount, usersCount]
  );

  return (
    <>
      <h1 className="admin-page-title">Tableau de bord</h1>
      <div className="admin-stats-grid">
        {stats.map((s, i) => (
          <div key={i} className="admin-stat-card">
            <div className={`admin-stat-icon ${s.type}`}>
              <i className={`fa-solid ${s.icon}`}></i>
            </div>
            <div style={{ flex: 1 }}>
              <div className="admin-stat-value">{s.value}</div>
              <div className="admin-stat-label">{s.label}</div>
              {s.change && (
                <div
                  className="admin-stat-change"
                  style={{ fontSize: '0.75rem', color: '#029e76', marginTop: '0.25rem' }}
                >
                  <i className="fa fa-arrow-up me-1"></i>
                  {s.change}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <Row className="mb-3">
        <Col lg={8}>
          <Card className="admin-card">
            <Card.Body>
              <h5 className="admin-card-title">Commandes et revenus (6 derniers mois)</h5>
              <Bar data={barChartData} options={barChartOptions} />
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="admin-card">
            <Card.Body>
              <h5 className="admin-card-title">Répartition par catégorie</h5>
              <Doughnut data={categoryData} options={{ responsive: true, maintainAspectRatio: true }} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col lg={12}>
          <Card className="admin-card">
            <Card.Body className="pb-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="admin-card-title mb-0">Évolution des revenus</h5>
              </div>
              <div className="admin-dashboard-revenue-line" style={{ height: 240, position: 'relative' }}>
                <Line data={revenueLineData} options={revenueLineOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-2 mb-4">
        <Col lg={12}>
          <Card className="admin-card admin-dashboard-recent-orders">
            <Card.Body>
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3 pb-2 border-bottom">
                <div>
                  <h5 className="admin-card-title mb-0">Commandes récentes</h5>
                  <p className="text-muted small mb-0 mt-1">
                    Les 10 dernières commandes (les plus récentes en premier).
                  </p>
                </div>
                <Link to="/admin/commandes" className="btn btn-sm btn-outline-primary btnhover">
                  Voir toutes <i className="fa fa-arrow-right ms-1"></i>
                </Link>
              </div>
              {!ordersLoaded ? (
                <p className="text-muted mb-0 py-3">Chargement des commandes…</p>
              ) : recentOrders.length === 0 ? (
                <p className="text-muted mb-0 py-3">Aucune commande pour le moment.</p>
              ) : (
                <div className="table-responsive">
                  <Table className="admin-table mb-0 align-middle">
                    <thead>
                      <tr>
                        <th>N° commande</th>
                        <th>Client</th>
                        <th>Montant</th>
                        <th>Date</th>
                        <th>Statut</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order.id}>
                          <td>
                            <strong>{order.orderNumber}</strong>
                          </td>
                          <td>
                            <div className="fw-semibold">{order.clientName}</div>
                            <div className="small text-muted">{order.clientEmail}</div>
                          </td>
                          <td>{order.montant}</td>
                          <td className="text-nowrap">{order.date}</td>
                          <td>
                            <Badge bg={statutVariant[order.statut] || 'secondary'}>{order.statut}</Badge>
                          </td>
                          <td className="text-end">
                            <Link
                              to={`/admin/commandes/${order.id}`}
                              className="btn btn-sm btn-outline-primary btnhover"
                            >
                              Détail
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
