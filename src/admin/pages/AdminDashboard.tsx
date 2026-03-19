import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { Card, Table, Badge, Row, Col } from 'react-bootstrap';
import { fetchBooks } from '../../api/catalog';
import { listUsers, listOrders, listCatalogs, type Catalog } from '../../api/admin';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement);

const chartData = {
  labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
  datasets: [
    {
      label: 'Commandes',
      data: [65, 78, 90, 81, 96, 128],
      backgroundColor: 'rgba(0, 102, 204, 0.7)',
      borderColor: '#0066cc',
      borderWidth: 1,
    },
    {
      label: 'Ventes (×1000 $)',
      data: [450, 520, 480, 580, 550, 620],
      backgroundColor: 'rgba(26, 22, 104, 0.5)',
      borderColor: '#1a1668',
      borderWidth: 1,
    },
  ],
};

function formatMonthLabelFR(d: Date) {
  return d.toLocaleDateString('fr-FR', { month: 'short' }).replace('.', '');
}

function parseOrderTotal(total: string | number | undefined): number {
  if (total == null) return 0;
  if (typeof total === 'number') return Number.isFinite(total) ? total : 0;
  // ex: "165 000 $", "165000", "165000.00"
  const cleaned = total.replace(/[^\d.,-]/g, '').replace(/\s+/g, '');
  if (!cleaned) return 0;
  // si virgule décimale -> remplacer par point
  const normalized = cleaned.includes(',') && !cleaned.includes('.') ? cleaned.replace(',', '.') : cleaned;
  const n = parseFloat(normalized);
  return Number.isFinite(n) ? n : 0;
}

const CATEGORY_COLORS = [
  'rgba(0, 102, 204, 0.8)',
  'rgba(26, 22, 104, 0.8)',
  'rgba(2, 158, 118, 0.8)',
  'rgba(0, 174, 255, 0.8)',
  'rgba(255, 159, 64, 0.8)',
  'rgba(153, 102, 255, 0.8)',
];

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { position: 'top' as const },
    title: { display: true, text: 'Activité des 6 derniers mois' },
  },
  scales: {
    y: { beginAtZero: true },
  },
};

const statutVariant: Record<string, string> = {
  'En attente': 'warning',
  'En préparation': 'info',
  'Expédiée': 'primary',
  'Livrée': 'success',
};

export default function AdminDashboard() {
  const [booksCount, setBooksCount] = useState<number | null>(null);
  const [usersCount, setUsersCount] = useState<number | null>(null);
  const [recentOrders, setRecentOrders] = useState<{ id: string | number; client: string; montant: string; date: string; statut: string }[]>([]);
  const [orders, setOrders] = useState<Awaited<ReturnType<typeof listOrders>>>([]);
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
    listUsers()
      .then((data) => setUsersCount(data.length))
      .catch(() => setUsersCount(0));
  }, []);

  useEffect(() => {
    listCatalogs()
      .then((data) => setCatalogs(data))
      .catch(() => setCatalogs([]));
  }, []);

  useEffect(() => {
    listOrders()
      .then((data) => {
        setOrders(Array.isArray(data) ? data : []);
        const list = Array.isArray(data) ? data.slice(0, 4) : [];
        setRecentOrders(
          list.map((o) => ({
            id: o.id,
            client: typeof o.user === 'string' ? o.user : (o as { client?: string }).client ?? '—',
            montant: typeof o.total === 'number' ? `${o.total} $` : String(o.total ?? '—'),
            date: o.created_at ? new Date(o.created_at).toLocaleDateString('fr-FR') : '—',
            statut: (o.status as string) ?? '—',
          }))
        );
      })
      .catch(() => {
        setOrders([]);
        setRecentOrders([
          { id: 1001, client: 'Marie Dupont', montant: '165 000 $', date: '08/02/2025', statut: 'Expédiée' },
          { id: 1002, client: 'Jean Martin', montant: '130 000 $', date: '07/02/2025', statut: 'En préparation' },
          { id: 1003, client: 'Sophie Bernard', montant: '220 000 $', date: '06/02/2025', statut: 'Livrée' },
          { id: 1004, client: 'Pierre Leroy', montant: '95 000 $', date: '05/02/2025', statut: 'En attente' },
        ]);
      });
  }, []);

  const revenueData = useMemo(() => {
    // 6 derniers mois (inclus mois courant)
    const now = new Date();
    const months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      return { key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`, date: d };
    });

    const sums: Record<string, number> = {};
    months.forEach((m) => { sums[m.key] = 0; });

    orders.forEach((o) => {
      if (!o.created_at) return;
      const d = new Date(o.created_at);
      if (Number.isNaN(d.getTime())) return;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!(key in sums)) return;
      sums[key] += parseOrderTotal(o.total);
    });

    const labels = months.map((m) => formatMonthLabelFR(m.date));
    const values = months.map((m) => sums[m.key]);

    return {
      labels,
      datasets: [
        {
          label: 'Revenus ($)',
          data: values,
          borderColor: '#029e76',
          backgroundColor: 'rgba(2, 158, 118, 0.1)',
          tension: 0.4,
          fill: true,
        },
      ],
    };
  }, [orders]);

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

  const stats = [
    { label: 'Total les commandes', value: '128', icon: 'fa-shopping-cart', type: 'primary' as const, change: '+12%' },
    { label: 'Livres en catalogue', value: booksCount !== null ? String(booksCount) : '—', icon: 'fa-book', type: 'success' as const, change: '' },
    { label: 'Utilisateurs', value: usersCount !== null ? String(usersCount) : '—', icon: 'fa-users', type: 'info' as const, change: '' },
    // { label: "Chiffre d'affaires ($)", value: '2 450 000', icon: 'fa-euro-sign', type: 'warning' as const, change: '+18%' },
    // { label: 'Abonnements actifs', value: '892', icon: 'fa-star', type: 'success' as const, change: '+45' },
    { label: 'Livres téléchargés', value: '2 134', icon: 'fa-download', type: 'primary' as const, change: '+234' },
  ];

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
                <div className="admin-stat-change" style={{ fontSize: '0.75rem', color: '#029e76', marginTop: '0.25rem' }}>
                  <i className="fa fa-arrow-up me-1"></i>{s.change}
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
              <h5 className="admin-card-title">Évolution des ventes</h5>
              <Bar data={chartData} options={chartOptions} />
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

      <Row className="mb-3">
        <Col lg={12}>
          <Card className="admin-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="admin-card-title mb-0">Évolution des revenus</h5>
              </div>
              <Line data={revenueData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={12}>
          <Card className="admin-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="admin-card-title mb-0">Commandes récentes</h5>
                <Link to="/admin/commandes" className="btn btn-sm btn-outline-primary btnhover">
                  Voir toutes <i className="fa fa-arrow-right ms-1"></i>
                </Link>
              </div>
              <Table className="admin-table mb-0">
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
                      <td><strong>#CMD-{order.id}</strong></td>
                      <td>{order.client}</td>
                      <td>{order.montant}</td>
                      <td>{order.date}</td>
                      <td><Badge bg={statutVariant[order.statut] || 'secondary'}>{order.statut}</Badge></td>
                      <td className="text-end">
                        <Link to={`/admin/commandes/${order.id}`} className="btn btn-sm btn-outline-primary btnhover">
                          Détail
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
