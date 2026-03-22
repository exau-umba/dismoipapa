// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import PageTitle from '../layouts/PageTitle';
import { downloadLibraryBook, getLibraryBookReadUrl } from '../api/library';
import { getFriendlyErrorMessage } from '../utils/errorMessages';
import ErrorMessage from '../components/ErrorMessage';
import EpubReader from '../components/EpubReader';

export default function BookReader() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [epubUrl, setEpubUrl] = useState<string | null>(null);
  const [title, setTitle] = useState<string>('Lecture du livre');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let blobUrlToRevoke: string | null = null;

    const load = async () => {
      if (!id) {
        setError('Livre introuvable.');
        setLoading(false);
        return;
      }

      // Mode démo : utiliser le fichier public
      if (id === 'demo') {
        if (!cancelled) {
          setEpubUrl('/livres/livre.epub');
          setTitle('Livre de démonstration (EPUB)');
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
        setTitle('Lecture du livre');
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
      <PageTitle childPage="Lecture" parentPage="Mes livres" />
      <section className="content-inner-1 pt-3 pb-3">
        <div className="container-fluid">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h1 className="h4 mb-0">Lecture du livre</h1>
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
            <div className="card p-0" style={{ overflow: 'hidden' }}>
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

