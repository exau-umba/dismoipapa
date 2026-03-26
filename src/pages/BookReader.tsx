import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import PageTitle from '../layouts/PageTitle';
import { downloadLibraryBook, getLibraryBookReadUrl } from '../api/library';
import { getBook } from '../api/catalog';
import { getFriendlyErrorMessage } from '../utils/errorMessages';
import ErrorMessage from '../components/ErrorMessage';
import EpubReader from '../components/EpubReader';

type ReaderLocationState = { bookTitle?: string };

export default function BookReader() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const navBookTitle = (location.state as ReaderLocationState | null)?.bookTitle;

  const [epubUrl, setEpubUrl] = useState<string | null>(null);
  const [title, setTitle] = useState<string>(navBookTitle ?? 'Lecture du livre');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /** Titre catalogue (barre du lecteur + en-tête) */
  useEffect(() => {
    if (!id) return;
    if (id === 'demo') {
      setTitle('Livre de démonstration (EPUB)');
      return;
    }
    setTitle(navBookTitle ?? 'Lecture du livre');
    let cancelled = false;
    getBook(String(id))
      .then((book) => {
        if (!cancelled) setTitle(book.title);
      })
      .catch(() => {
        /* garder le titre navigation ou le libellé générique */
      });
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

      if (id === 'demo') {
        if (!cancelled) {
          setEpubUrl('/livres/livre.epub');
          setLoading(false);
        }
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
    if (epubUrl && typeof epubUrl === 'string' && epubUrl.startsWith('blob:')) {
      URL.revokeObjectURL(epubUrl);
    }
    navigate(-1);
  };

  const handleDownload = async () => {
    try {
      if (id === 'demo') {
        const a = document.createElement('a');
        a.href = '/livres/livre.epub';
        a.download = 'livre.epub';
        document.body.appendChild(a);
        a.click();
        a.remove();
        return;
      }
      await downloadLibraryBook(String(id));
    } catch (err) {
      setError(getFriendlyErrorMessage(err));
    }
  };

  return (
    <div className="page-content bg-white">
      <PageTitle parentPage="Mes livres" childPage="Lecture" parentTo="/my-books" />
      <section className="content-inner-1 pt-3 pb-3">
        <div className="container-fluid">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h1 className="h4 mb-0">{title}</h1>
            <Button variant="outline-secondary" size="sm" onClick={() => navigate(-1)}>
              <i className="fa fa-arrow-left me-1" />
              Retour
            </Button>
          </div>

          {error && (
            <ErrorMessage
              message={error}
              onDismiss={() => setError(null)}
              className="mb-3"
            />
          )}

          {loading && !error && (
            <div className="card">
              <div className="card-body">
                <p className="text-muted mb-0">Chargement du livre…</p>
              </div>
            </div>
          )}

          {!loading && !error && epubUrl && (
            <div
              className="card p-0 border-0 shadow-sm"
              style={{
                overflow: 'hidden',
                // Laisser `EpubReader` gérer la hauteur réelle (via visualViewport).
                // Ici on évite juste les écrans trop petits/vides.
                minHeight: 360,
              }}
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
      </section>
    </div>
  );
}
