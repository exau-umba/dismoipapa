import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Table, Badge, Form } from 'react-bootstrap';

const mockOrders = [
  { id: 1001, date: '08/02/2025', client: 'Marie Dupont', total: '165 000 FC', statut: 'Expédiée' },
  { id: 1002, date: '07/02/2025', client: 'Jean Martin', total: '130 000 FC', statut: 'En préparation' },
  { id: 1003, date: '06/02/2025', client: 'Sophie Bernard', total: '220 000 FC', statut: 'Livrée' },
  { id: 1004, date: '05/02/2025', client: 'Pierre Leroy', total: '95 000 FC', statut: 'En attente' },
];

const statutVariant = {
  'En attente': 'warning',
  'En préparation': 'info',
  'Expédiée': 'primary',
  'Livrée': 'success',
};

function AdminOrders() {
  const [orders] = useState(mockOrders);

  return (
    <>
      <h1 className="admin-page-title">Commandes</h1>
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
            {orders.map((o, i) => (
              <tr key={i}>
                <td><strong>#CMD-{o.id}</strong></td>
                <td>{o.date}</td>
                <td>{o.client}</td>
                <td>{o.total}</td>
                <td><Badge bg={statutVariant[o.statut] || 'secondary'}>{o.statut}</Badge></td>
                <td className="text-end">
                  <Link to={'/admin/commandes/' + o.id} className="btn btn-sm btn-outline-primary">Détail</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </>
  );
}

export default AdminOrders;
