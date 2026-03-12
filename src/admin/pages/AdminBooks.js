import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Badge } from 'react-bootstrap';

const mockBooks = [
  { id: 1, titre: 'Le canard', auteur: 'Jean Richard MAMBWENI MABIALA', prix: '45 000', stock: 45, categorie: 'Poésie' },
  { id: 2, titre: 'Gestion de stock des hydrocarbures liquides et/ou liquéfiés', auteur: 'Jean Richard MAMBWENI MABIALA', prix: '65 000', stock: 12, categorie: 'Technique' },
  { id: 3, titre: 'Volkan devait vite se marier', auteur: 'Jean Richard MAMBWENI MABIALA', prix: '55 000', stock: 0, categorie: 'Roman' },
];

function AdminBooks() {
  const [books] = useState(mockBooks);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
        <h1 className="admin-page-title mb-0">Livres</h1>
        <Link to="/admin/livres/nouveau" className="btn btn-primary btnhover">
          <i className="fa fa-plus me-1"></i> Ajouter un livre
        </Link>
      </div>
      <div className="admin-card">
        <Table className="admin-table" responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Titre</th>
              <th>Auteur</th>
              <th>Catégorie</th>
              <th>Prix (FC)</th>
              <th>Stock</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((b) => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>{b.titre}</td>
                <td>{b.auteur}</td>
                <td>{b.categorie}</td>
                <td>{b.prix}</td>
                <td>
                  {b.stock === 0 ? <Badge bg="danger">Rupture</Badge> : <Badge bg="success">{b.stock}</Badge>}
                </td>
                <td className="text-end">
                  <Link to={"/admin/livres/" + b.id} className="btn btn-sm btn-outline-primary me-1">Modifier</Link>
                  <Button size="sm" variant="outline-danger">Supprimer</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </>
  );
}

export default AdminBooks;
