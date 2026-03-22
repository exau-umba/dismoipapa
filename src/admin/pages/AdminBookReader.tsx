import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { getLibraryBookReadUrl } from '../../api/library';
import { getBook } from '../../api/catalog';
import { getFriendlyErrorMessage } from '../../utils/errorMessages';
import ErrorMessage from '../../components/ErrorMessage';
import EpubReader from '../../components/EpubReader';

/**
 * Lecture EPUB dans l’interface admin.
 * Même endpoint que le client : GET /api/library/books/{bookId}/read/
 * (via getLibraryBookReadUrl — token staff / refresh identique au client).
 */
type AdminReaderLocationState = { bookTitle?: string };

export default function AdminBookReader() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const navBookTitle = (location.state as AdminReaderLocationState | null)?.bookTitle;

  const [epubUrl, setEpubUrl] = useState<string | null>(null);
  const [title, setTitle] = useState<string>(navBookTitle ?? 'Lecture du livre');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setTitle(navBookTitle ?? 'Lecture du livre');
    let cancelled = false;
    getBook(String(id))
      .then((book) => {
        if (!cancelled) setTitle(book.title);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [id, navBookTitle]);

  useEffect(() => {
    let cancelled = false;
    let blobUrlToRevoke: string | null = null;

    const load = async () => {
      if (!id) {
        setError('Livre introuvable.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      setEpubUrl(null);
      try {
        const url = await getLibraryBookReadUrl(String(id));
        if (cancelled) {
          URL.revokeObjectURL(url);
          return;
        }
        blobUrlToRevoke = url;
        setEpubUrl(url);
      } catch (err) {
        if (!cancelled) {
          setError(getFriendlyErrorMessage(err));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
      if (blobUrlToRevoke) {
        URL.revokeObjectURL(blobUrlToRevoke);
        blobUrlToRevoke = null;
      }
    };
  }, [id]);

  const handleClose = () => {
    if (epubUrl && epubUrl.startsWith('blob:')) {
      URL.revokeObjectURL(epubUrl);
    }
    navigate(-1);
  };

  const handleDownload = async () => {
    try {
      if (!id) return;
      /* Même flux que la lecture : GET /api/library/books/{id}/read/ */
      const u = await getLibraryBookReadUrl(String(id));
      try {
        const a = document.createElement('a');
        a.href = u;
        a.download = `livre-${id}.epub`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      } finally {
        URL.revokeObjectURL(u);
      }
    } catch (err) {
      setError(getFriendlyErrorMessage(err));
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="admin-page-title mb-0">{title}</h1>
        <Button variant="outline-secondary" size="sm" onClick={() => navigate(-1)}>
          <i className="fa fa-arrow-left me-1" />
          Retour
        </Button>
      </div>

      {error && (
        <ErrorMessage message={error} onDismiss={() => setError(null)} className="mb-3" />
      )}

      {loading && !error && (
        <div className="admin-card">
          <p className="text-muted mb-0">Chargement du livre…</p>
        </div>
      )}

      {!loading && !error && epubUrl && (
        <div
          className="admin-card p-0"
          style={{ overflow: 'hidden', minHeight: 'min(calc(100dvh - 220px), 900px)' }}
        >
          <EpubReader
            epubUrl={epubUrl}
            title={title}
            onClose={handleClose}
            asPage
            onDownload={handleDownload}
          />
        </div>
      )}
    </div>
  );
}
