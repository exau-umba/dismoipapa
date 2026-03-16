import React, { useState, useEffect } from 'react';
import { Form, Button, Table } from 'react-bootstrap';
import { listCatalogs, createCatalog, type Catalog } from '../../api/admin';
import { getFriendlyErrorMessage } from '../../utils/errorMessages';
import ErrorMessage from '../../components/ErrorMessage';

export default function AdminCatalogs() {
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadCatalogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listCatalogs();
      setCatalogs(data);
    } catch (err) {
      setError(getFriendlyErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCatalogs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setError(null);
    setSubmitting(true);
    try {
      await createCatalog({ name: name.trim(), description: description.trim() || undefined });
      setName('');
      setDescription('');
      await loadCatalogs();
    } catch (err) {
      setError(getFriendlyErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <h1 className="admin-page-title">Catalogues</h1>
      <p className="text-muted mb-3">
        Les catalogues permettent de classer les livres. Créez un catalogue avant d&apos;ajouter des livres.
      </p>
      {error && (
        <ErrorMessage message={error} onDismiss={() => setError(null)} className="mb-3" />
      )}

      <div className="admin-card mb-4">
        <h5 className="admin-card-title mb-3">Nouveau catalogue</h5>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nom *</Form.Label>
            <Form.Control
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ex. Romans, Poésie, Technique"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description du catalogue (optionnel)"
            />
          </Form.Group>
          <Button type="submit" variant="primary" className="btnhover" disabled={submitting}>
            {submitting ? 'Création…' : 'Créer le catalogue'}
          </Button>
        </Form>
      </div>

      <div className="admin-card">
        <h5 className="admin-card-title mb-3">Liste des catalogues</h5>
        {loading ? (
          <p className="text-muted mb-0">Chargement…</p>
        ) : catalogs.length === 0 ? (
          <p className="text-muted mb-0">Aucun catalogue. Créez-en un ci-dessus pour pouvoir ajouter des livres.</p>
        ) : (
          <Table className="admin-table" responsive>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {catalogs.map((c) => (
                <tr key={c.id}>
                  <td><strong>{c.name}</strong></td>
                  <td>{c.description || '—'}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </>
  );
}
