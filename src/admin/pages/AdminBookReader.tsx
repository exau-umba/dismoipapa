import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { getBooksEpubPreviewUrl, getCatalogBookPreviewUrl } from '../../api/admin';
import { getFriendlyErrorMessage } from '../../utils/errorMessages';
import ErrorMessage from '../../components/ErrorMessage';
import EpubReader from '../../components/EpubReader';

export default function AdminBookReader() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [title, setTitle] = useState<string>('Lecture du livre');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!id) {
        setError('Livre introuvable.');
        setLoading(false);
        return;
      }

      // Mode démo : utiliser le fichier statique
      if (id === 'demo') {
        if (!cancelled) {
          setPreviewUrl('/livres/livre.epub');
          setTitle('Livre de démonstration (EPUB)');
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      setError(null);
      try {
        let url: string | null = null;
        try {
          // Idéal : la route /preview renvoie un blob URL, ce qui évite le CORS
          url = await getCatalogBookPreviewUrl(id);
        } catch {
          // Fallback : utilise l'ancienne URL directe (peut déclencher un CORS côté navigateur)
          url = await getBooksEpubPreviewUrl(id);
        }
        if (!cancelled) {
          setPreviewUrl(url);
          setTitle('Lecture du livre');
        }
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
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleClose = () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
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
      if (!id) return;
      let url: string | null = null;
      try {
        url = await getCatalogBookPreviewUrl(id);
      } catch {
        url = await getBooksEpubPreviewUrl(id);
      }
      if (!url) return;
      const a = document.createElement('a');
      a.href = url;
      a.download = `livre-${id}.epub`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      if (url.startsWith('blob:')) URL.revokeObjectURL(url);
    } catch (err) {
      setError(getFriendlyErrorMessage(err));
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="admin-page-title mb-0">Lecture du livre</h1>
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
        <div className="admin-card">
          <p className="text-muted mb-0">Chargement du livre…</p>
        </div>
      )}

      {!loading && !error && previewUrl && (
        <div className="admin-card p-0" style={{ overflow: 'hidden' }}>
          <EpubReader
            epubUrl={previewUrl}
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

