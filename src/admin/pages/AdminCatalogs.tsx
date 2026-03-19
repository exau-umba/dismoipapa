import React, { useState, useEffect } from 'react';
import { Form, Button, Table, Modal } from 'react-bootstrap';
import { listCatalogs, createCatalog, updateCatalog, deleteCatalog, type Catalog } from '../../api/admin';
import { getFriendlyErrorMessage } from '../../utils/errorMessages';
import ErrorMessage from '../../components/ErrorMessage';

export default function AdminCatalogs() {
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCatalog, setEditingCatalog] = useState<Catalog | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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
      setShowCreateModal(false);
      await loadCatalogs();
    } catch (err) {
      setError(getFriendlyErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const openCreateModal = () => {
    setName('');
    setDescription('');
    setShowCreateModal(true);
  };

  const openEditModal = (catalog: Catalog) => {
    setEditingCatalog(catalog);
    setName(catalog.name || '');
    setDescription(catalog.description || '');
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCatalog || !name.trim()) return;
    setError(null);
    setSubmitting(true);
    try {
      await updateCatalog(editingCatalog.id, {
        name: name.trim(),
        description: description.trim() || undefined,
      });
      setEditingCatalog(null);
      setName('');
      setDescription('');
      await loadCatalogs();
    } catch (err) {
      setError(getFriendlyErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (catalog: Catalog) => {
    const confirmed = window.confirm(`Supprimer le catalogue « ${catalog.name} » ?`);
    if (!confirmed) return;
    setError(null);
    setDeletingId(catalog.id);
    try {
      await deleteCatalog(catalog.id);
      await loadCatalogs();
    } catch (err) {
      setError(getFriendlyErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
        <h1 className="admin-page-title mb-0">Catalogues</h1>
        <Button variant="primary" className="btnhover" onClick={openCreateModal}>
          <i className="fa fa-plus me-1" />
          Ajouter un catalogue
        </Button>
      </div>
      {error && (
        <ErrorMessage message={error} onDismiss={() => setError(null)} className="mb-3" />
      )}

      <div className="admin-card">
        <h5 className="admin-card-title mb-3">Liste des catalogues</h5>
        {loading ? (
          <p className="text-muted mb-0">Chargement…</p>
        ) : catalogs.length === 0 ? (
          <p className="text-muted mb-0">Aucun catalogue. Ajoutez-en un pour pouvoir classer les livres.</p>
        ) : (
          <Table className="admin-table" responsive>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Description</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {catalogs.map((c) => (
                <tr key={c.id}>
                  <td><strong>{c.name}</strong></td>
                  <td>{c.description || '—'}</td>
                  <td className="text-end">
                    <Button
                      size="sm"
                      variant="outline-primary"
                      className="me-2"
                      onClick={() => openEditModal(c)}
                    >
                      Modifier
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      disabled={deletingId === c.id}
                      onClick={() => handleDelete(c)}
                    >
                      {deletingId === c.id ? 'Suppression…' : 'Supprimer'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>

      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} centered>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Ajouter un catalogue</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nom *</Form.Label>
              <Form.Control
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ex. Romans, Poésie, Technique"
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description du catalogue (optionnel)"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={() => setShowCreateModal(false)}>
              Annuler
            </Button>
            <Button type="submit" variant="primary" className="btnhover" disabled={submitting}>
              {submitting ? 'Création…' : 'Créer'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={!!editingCatalog} onHide={() => setEditingCatalog(null)} centered>
        <Form onSubmit={handleEditSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Modifier le catalogue</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nom *</Form.Label>
              <Form.Control
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={() => setEditingCatalog(null)}>
              Annuler
            </Button>
            <Button type="submit" variant="primary" className="btnhover" disabled={submitting}>
              {submitting ? 'Enregistrement…' : 'Enregistrer'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
