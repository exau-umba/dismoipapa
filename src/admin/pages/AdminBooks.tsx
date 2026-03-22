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

  const getFormat = (b: Book, type: 'ebook' | 'physical') =>
    b.formats?.find((f) => (f.format_type ?? '') === type) ?? null;
  const getCatalogLabel = (catalogId: string) => catalogsById[catalogId]?.name ?? '—';
  const priceCell = (b: Book) => {
    const ebook = getFormat(b, 'ebook');
    const physical = getFormat(b, 'physical');
    return (
      <div className="d-flex flex-column gap-1">
        <small>
          <strong>E-book:</strong> {ebook?.price ?? '—'}
        </small>
        <small>
          <strong>Physique:</strong> {physical?.price ?? '—'}
        </small>
      </div>
    );
  };
  const stockCell = (b: Book) => {
    const physical = getFormat(b, 'physical');
    const ebook = getFormat(b, 'ebook');
    if (!physical && ebook) return <Badge bg="info">E-book uniquement</Badge>;
    if (!physical && !ebook) return <Badge bg="secondary">—</Badge>;
    if ((physical?.stock_quantity ?? 0) <= 0) return <Badge bg="danger">Rupture</Badge>;
    return <Badge bg="success">{physical?.stock_quantity}</Badge>;
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
                {/* <th>Auteur</th> */}
                <th>Catalogue</th>
                <th>Prix ($)</th>
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
                    {/* <td>{b.author}</td> */}
                    <td>{getCatalogLabel(b.catalog)}</td>
                    <td>{priceCell(b)}</td>
                    <td>{stockCell(b)}</td>
                    <td className="text-end">
                      <Link
                        to={`/admin/livres/${b.id}/detail`}
                        className="btn btn-sm btn-outline-dark me-1"
                        title="Voir détail"
                        aria-label={`Voir le détail de ${b.title}`}
                      >
                        <i className="fa fa-eye" />
                      </Link>
                      <Link
                        to={`/admin/livres/lecture/${b.id}`}
                        state={{ bookTitle: b.title }}
                        className="btn btn-sm btn-outline-secondary me-1"
                        title="Lire l’EPUB (bibliothèque)"
                        aria-label={`Lire ${b.title}`}
                      >
                        <i className="fa fa-book-open" />
                      </Link>
                      <Link
                        to={`/admin/livres/${b.id}`}
                        className="btn btn-sm btn-outline-primary me-1"
                        title="Modifier"
                        aria-label={`Modifier ${b.title}`}
                      >
                        <i className="fa fa-pen" />
                      </Link>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => handleDeleteClick(b)}
                        disabled={deletingId === b.id}
                        title="Supprimer"
                        aria-label={`Supprimer ${b.title}`}
                      >
                        <i className="fa fa-trash" />
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
