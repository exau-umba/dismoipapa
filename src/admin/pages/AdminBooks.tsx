import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Badge } from 'react-bootstrap';
import { fetchBooks } from '../../api/catalog';
import type { Book } from '../../api/catalog';
import { deleteBook, listCatalogs, type Catalog } from '../../api/admin';
import { getFriendlyErrorMessage } from '../../utils/errorMessages';
import ErrorMessage from '../../components/ErrorMessage';
import ConfirmModal from '../../components/ConfirmModal';

export default function AdminBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [catalogsById, setCatalogsById] = useState<Record<string, Catalog>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; title: string } | null>(null);

  const loadBooks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchBooks();
      setBooks(data);
    } catch (err) {
      setError(getFriendlyErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  useEffect(() => {
    listCatalogs()
      .then((list) => {
        const map: Record<string, Catalog> = {};
        list.forEach((c) => {
          map[c.id] = c;
        });
        setCatalogsById(map);
      })
      .catch(() => setCatalogsById({}));
  }, []);

  const handleDeleteClick = (b: Book) => {
    setConfirmDelete({ id: b.id, title: b.title || 'Ce livre' });
  };

  const handleDeleteConfirm = async () => {
    if (!confirmDelete) return;
    setDeletingId(confirmDelete.id);
    try {
      await deleteBook(confirmDelete.id);
      setBooks((prev) => prev.filter((b) => b.id !== confirmDelete.id));
      setConfirmDelete(null);
    } catch (err) {
      setError(getFriendlyErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  };

  const mainFormat = (b: Book) => (b.formats && b.formats.length > 0 ? b.formats[0] : null);
  const getCatalogLabel = (catalogId: string) => catalogsById[catalogId]?.name ?? '—';
  const priceStr = (b: Book) => {
    const f = mainFormat(b);
    return f?.price ?? '—';
  };
  const stockNum = (b: Book) => {
    const f = mainFormat(b);
    return f?.stock_quantity ?? 0;
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
        <h1 className="admin-page-title mb-0">Livres</h1>
        <div className="d-flex gap-2">
          <Link
            to="/admin/livres/lecture/demo"
            className="btn btn-outline-secondary btn-sm"
          >
            <i className="fa fa-book-open me-1" />
            Tester le lecteur EPUB
          </Link>
          <Link to="/admin/livres/nouveau" className="btn btn-primary btnhover">
            <i className="fa fa-plus me-1"></i> Ajouter un livre
          </Link>
        </div>
      </div>
      {error && (
        <ErrorMessage message={error} onDismiss={() => setError(null)} className="mb-3" />
      )}
      <div className="admin-card">
        {loading ? (
          <p className="text-muted mb-0">Chargement des livres…</p>
        ) : (
          <Table className="admin-table" responsive>
            <thead>
              <tr>
                <th>Titre</th>
                <th>Auteur</th>
                <th>Catalogue</th>
                <th>Prix (FC)</th>
                <th>Stock</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-muted text-center py-4">
                    Aucun livre. <Link to="/admin/livres/nouveau">Ajouter un livre</Link>
                  </td>
                </tr>
              ) : (
                books.map((b) => (
                  <tr key={b.id}>
                    <td>{b.title}</td>
                    <td>{b.author}</td>
                    <td>{getCatalogLabel(b.catalog)}</td>
                    <td>{priceStr(b)}</td>
                    <td>
                      {stockNum(b) === 0 ? (
                        <Badge bg="danger">Rupture</Badge>
                      ) : (
                        <Badge bg="success">{stockNum(b)}</Badge>
                      )}
                    </td>
                    <td className="text-end">
                      <Link
                        to={`/admin/livres/lecture/${b.id}`}
                        className="btn btn-sm btn-outline-secondary me-1"
                        title="Prévisualiser (EPUB)"
                      >
                        <i className="fa fa-book-open me-1" /> Lire
                      </Link>
                      <Link to={`/admin/livres/${b.id}`} className="btn btn-sm btn-outline-primary me-1">
                        Modifier
                      </Link>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => handleDeleteClick(b)}
                        disabled={deletingId === b.id}
                      >
                        Supprimer
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        )}
      </div>
      <ConfirmModal
        show={!!confirmDelete}
        title="Supprimer le livre"
        message={`Voulez-vous vraiment supprimer « ${confirmDelete?.title ?? '' } » ? Cette action est irréversible.`}
        confirmLabel="Supprimer"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmDelete(null)}
        loading={!!deletingId}
      />

    </>
  );
}
