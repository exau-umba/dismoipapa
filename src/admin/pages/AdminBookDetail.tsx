import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Badge, Card, Col, Row, Table } from 'react-bootstrap';
import { API_BASE_URL } from '../../api/client';
import { getBook, type Book, type BookFormat } from '../../api/catalog';
import { listCatalogs } from '../../api/admin';
import { getFriendlyErrorMessage } from '../../utils/errorMessages';
import ErrorMessage from '../../components/ErrorMessage';

function toPublicAssetUrl(value?: string | null): string {
  if (!value) return '';
  if (value.startsWith('http://') || value.startsWith('https://')) return value;
  const base = API_BASE_URL.replace(/\/$/, '');
  return `${base}${value.startsWith('/') ? '' : '/'}${value}`;
}

function formatPrice(v?: string | null): string {
  return v && String(v).trim() ? `${v} $` : '—';
}

function formatDate(v?: string): string {
  if (!v) return '—';
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return v;
  return d.toLocaleDateString('fr-FR');
}

export default function AdminBookDetail() {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [catalogName, setCatalogName] = useState<string>('—');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('Livre introuvable.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    getBook(id)
      .then(setBook)
      .catch((err) => setError(getFriendlyErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!book?.catalog) {
      setCatalogName('—');
      return;
    }
    listCatalogs()
      .then((catalogs) => {
        const current = catalogs.find((c) => c.id === book.catalog);
        setCatalogName(current?.name || book.catalog);
      })
      .catch(() => setCatalogName(book.catalog));
  }, [book?.catalog]);

  const renderFormatType = (formatType?: string) => {
    if (formatType === 'physical') return <Badge bg="primary">Physique</Badge>;
    if (formatType === 'ebook') return <Badge bg="success">E-book</Badge>;
    return <Badge bg="secondary">{formatType || '—'}</Badge>;
  };

  if (loading) {
    return <p className="text-muted mb-0">Chargement du livre...</p>;
  }

  if (error || !book) {
    return (
      <div className="admin-card">
        <ErrorMessage message={error || 'Livre introuvable.'} onDismiss={() => setError(null)} className="mb-3" />
        <Link to="/admin/livres" className="btn btn-outline-secondary btn-sm">
          <i className="fa fa-arrow-left me-1" />
          Retour a la liste
        </Link>
      </div>
    );
  }

  const coverUrl = toPublicAssetUrl(book.cover_image);
  const ebook = book.formats?.find((f) => (f.format_type ?? '') === 'ebook') ?? null;
  const physical = book.formats?.find((f) => (f.format_type ?? '') === 'physical') ?? null;

  return (
    <>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
        <h1 className="admin-page-title mb-0">Detail du livre</h1>
        <div className="d-flex gap-2">
          <Link to={`/admin/livres/${book.id}`} className="btn btn-primary btnhover">
            <i className="fa fa-pen me-1" />
            Modifier
          </Link>
          <Link to="/admin/livres" className="btn btn-outline-secondary btnhover">
            <i className="fa fa-arrow-left me-1" />
            Retour
          </Link>
        </div>
      </div>

      <Row>
        <Col lg={4}>
          <Card className="admin-card mb-3">
            <Card.Body>
              <h5 className="admin-card-title">Couverture</h5>
              {coverUrl ? (
                <img
                  src={coverUrl}
                  alt={book.title}
                  style={{ width: '100%', maxHeight: 420, objectFit: 'contain', borderRadius: 8 }}
                />
              ) : (
                <p className="text-muted mb-0">Aucune image de couverture.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col lg={8}>
          <Card className="admin-card mb-3">
            <Card.Body>
              <h5 className="admin-card-title">{book.title || 'Sans titre'}</h5>
              <p className="mb-2"><strong>Auteur:</strong> {book.author || '—'}</p>
              <p className="mb-2"><strong>Categorie:</strong> {catalogName}</p>
              <p className="mb-2"><strong>Langue:</strong> {book.language || '—'}</p>
              <p className="mb-0"><strong>Publication:</strong> {formatDate(book.publication_date)}</p>
            </Card.Body>
          </Card>

          <Card className="admin-card mb-3">
            <Card.Body>
              <h5 className="admin-card-title">Resume</h5>
              <p className="mb-0">{book.synopsis || 'Aucun resume.'}</p>
            </Card.Body>
          </Card>

          <Card className="admin-card mb-3">
            <Card.Body>
              <h5 className="admin-card-title">Extrait</h5>
              <p className="mb-0">{book.sample_text || 'Aucun extrait.'}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="admin-card">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
            <h5 className="admin-card-title mb-0">Formats</h5>
            <div className="d-flex gap-2">
              <Badge bg={ebook ? 'success' : 'secondary'}>E-book: {ebook ? 'Oui' : 'Non'}</Badge>
              <Badge bg={physical ? 'primary' : 'secondary'}>Physique: {physical ? 'Oui' : 'Non'}</Badge>
            </div>
          </div>
          <Table className="admin-table mb-0" responsive>
            <thead>
              <tr>
                <th>Type</th>
                <th>Prix</th>
                <th>Stock</th>
                <th>Fichier PDF</th>
                <th>Fichier EPUB</th>
              </tr>
            </thead>
            <tbody>
              {(book.formats || []).length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-muted text-center py-4">Aucun format disponible.</td>
                </tr>
              ) : (
                (book.formats || []).map((fmt: BookFormat) => (
                  <tr key={fmt.id}>
                    <td>{renderFormatType(fmt.format_type)}</td>
                    <td>{formatPrice(fmt.price)}</td>
                    <td>{fmt.format_type === 'physical' ? fmt.stock_quantity : '—'}</td>
                    <td>
                      {fmt.pdf_file ? (
                        <a href={toPublicAssetUrl(fmt.pdf_file)} target="_blank" rel="noopener noreferrer">
                          Ouvrir PDF
                        </a>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td>
                      {fmt.epub_file ? (
                        <a href={toPublicAssetUrl(fmt.epub_file)} target="_blank" rel="noopener noreferrer">
                          Ouvrir EPUB
                        </a>
                      ) : (
                        '—'
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </>
  );
}
