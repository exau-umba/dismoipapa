import React, { useState } from 'react';
import { Table, Badge, Button } from 'react-bootstrap';

const mockUsers = [
  { id: 1, nom: 'Dupont', email: 'marie.dupont@email.fr', role: 'Client', inscrit: '15/01/2025', actif: true },
  { id: 2, nom: 'Martin', email: 'jean.martin@email.fr', role: 'Client', inscrit: '10/01/2025', actif: true },
  { id: 3, nom: 'Bernard', email: 'sophie.bernard@email.fr', role: 'Client', inscrit: '05/01/2025', actif: false },
];

function AdminUsers() {
  const [users] = useState(mockUsers);

  return (
    <>
      <h1 className="admin-page-title">Utilisateurs</h1>
      <div className="admin-card">
        <Table className="admin-table" responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Nom</th>
              <th>E-mail</th>
              <th>Rôle</th>
              <th>Inscrit le</th>
              <th>Statut</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.nom}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.inscrit}</td>
                <td>
                  {u.actif ? <Badge bg="success">Actif</Badge> : <Badge bg="secondary">Inactif</Badge>}
                </td>
                <td className="text-end">
                  <Button size="sm" variant="outline-primary" className="me-1">Modifier</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </>
  );
}

export default AdminUsers;
