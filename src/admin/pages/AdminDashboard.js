import React from 'react';
import { Link } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { Card, Table, Badge, Row, Col } from 'react-bootstrap';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement);

const stats = [
  { label: 'Commandes du mois', value: '128', icon: 'fa-shopping-cart', type: 'primary', change: '+12%' },
  { label: 'Livres en catalogue', value: '1 247', icon: 'fa-book', type: 'success', change: '+8' },
  { label: 'Utilisateurs actifs', value: '3 542', icon: 'fa-users', type: 'info', change: '+156' },
  { label: 'Chiffre d\'affaires (FC)', value: '2 450 000', icon: 'fa-euro-sign', type: 'warning', change: '+18%' },
  { label: 'Abonnements actifs', value: '892', icon: 'fa-star', type: 'success', change: '+45' },
  { label: 'Livres téléchargés', value: '2 134', icon: 'fa-download', type: 'primary', change: '+234' },
];

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
      label: 'Ventes (×1000 FC)',
      data: [450, 520, 480, 580, 550, 620],
      backgroundColor: 'rgba(26, 22, 104, 0.5)',
      borderColor: '#1a1668',
      borderWidth: 1,
    },
  ],
};

const revenueData = {
  labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
  datasets: [
    {
      label: 'Revenus (×1000 FC)',
      data: [450, 520, 480, 580, 550, 620],
      borderColor: '#029e76',
      backgroundColor: 'rgba(2, 158, 118, 0.1)',
      tension: 0.4,
      fill: true,
    },
  ],
};

const categoryData = {
  labels: ['Poésie', 'Roman', 'Technique', 'Autre'],
  datasets: [
    {
      data: [35, 30, 25, 10],
      backgroundColor: [
        'rgba(0, 102, 204, 0.8)',
        'rgba(26, 22, 104, 0.8)',
        'rgba(2, 158, 118, 0.8)',
        'rgba(0, 174, 255, 0.8)',
      ],
      borderWidth: 2,
      borderColor: '#fff',
    },
  ],
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { position: 'top' },
    title: { display: true, text: 'Activité des 6 derniers mois' },
  },
  scales: {
    y: { beginAtZero: true },
  },
};

const recentOrders = [
  { id: 1001, client: 'Marie Dupont', montant: '165 000 FC', date: '08/02/2025', statut: 'Expédiée' },
  { id: 1002, client: 'Jean Martin', montant: '130 000 FC', date: '07/02/2025', statut: 'En préparation' },
  { id: 1003, client: 'Sophie Bernard', montant: '220 000 FC', date: '06/02/2025', statut: 'Livrée' },
  { id: 1004, client: 'Pierre Leroy', montant: '95 000 FC', date: '05/02/2025', statut: 'En attente' },
];

const statutVariant = {
  'En attente': 'warning',
  'En préparation': 'info',
  'Expédiée': 'primary',
  'Livrée': 'success',
};

function AdminDashboard() {
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
              <div className="admin-stat-change" style={{ fontSize: '0.75rem', color: '#029e76', marginTop: '0.25rem' }}>
                <i className="fa fa-arrow-up me-1"></i>{s.change}
              </div>
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

export default AdminDashboard;
