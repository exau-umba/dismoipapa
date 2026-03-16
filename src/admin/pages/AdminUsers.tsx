import React, { useState, useEffect } from 'react';
import { Table, Badge, Button, Modal, Form } from 'react-bootstrap';
import { listUsers, updateUser, deleteUser, type AdminUser } from '../../api/admin';
import { getFriendlyErrorMessage } from '../../utils/errorMessages';
import ErrorMessage from '../../components/ErrorMessage';
import ConfirmModal from '../../components/ConfirmModal';

function formatDate(s: string | undefined): string {
  if (!s) return '—';
  try {
    const d = new Date(s);
    return d.toLocaleDateString('fr-FR');
  } catch {
    return s;
  }
}

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editUser, setEditUser] = useState<AdminUser | null>(null);
  const [editForm, setEditForm] = useState({ full_name: '', phone_number: '', shipping_address: '', is_subscriber: false });
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<AdminUser | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listUsers();
      setUsers(data);
    } catch (err) {
      setError(getFriendlyErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleEditClick = (u: AdminUser) => {
    setEditUser(u);
    setEditForm({
      full_name: u.full_name ?? '',
      phone_number: u.phone_number ?? '',
      shipping_address: u.shipping_address ?? '',
      is_subscriber: u.is_subscriber ?? false,
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUser) return;
    setSaving(true);
    setError(null);
    try {
      const updated = await updateUser(editUser.id, editForm);
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
      setEditUser(null);
    } catch (err) {
      setError(getFriendlyErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!confirmDelete) return;
    setDeletingId(confirmDelete.id);
    try {
      await deleteUser(confirmDelete.id);
      setUsers((prev) => prev.filter((u) => u.id !== confirmDelete.id));
      setConfirmDelete(null);
    } catch (err) {
      setError(getFriendlyErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <h1 className="admin-page-title">Utilisateurs</h1>
      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} className="mb-3" />}
      <div className="admin-card">
        {loading ? (
          <p className="text-muted mb-0">Chargement des utilisateurs…</p>
        ) : (
          <Table className="admin-table" responsive>
            <thead>
              <tr>
                <th>Nom</th>
                <th>E-mail</th>
                <th>Rôle</th>
                <th>Inscrit le</th>
                <th>Statut</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-muted text-center py-4">
                    Aucun utilisateur.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.full_name || '—'}</td>
                    <td>{u.email}</td>
                    <td>{u.is_staff ? <Badge bg="primary">Admin</Badge> : <Badge bg="secondary">Client</Badge>}</td>
                    <td>{formatDate(u.date_joined)}</td>
                    <td>
                      {u.is_active !== false ? (
                        <Badge bg="success">Actif</Badge>
                      ) : (
                        <Badge bg="secondary">Inactif</Badge>
                      )}
                    </td>
                    <td className="text-end">
                      <Button size="sm" variant="outline-primary" className="me-1" onClick={() => handleEditClick(u)}>
                        Modifier
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => setConfirmDelete(u)}
                        disabled={deletingId === u.id}
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

      <Modal show={!!editUser} onHide={() => setEditUser(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Modifier l&apos;utilisateur</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleEditSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nom complet</Form.Label>
              <Form.Control
                value={editForm.full_name}
                onChange={(e) => setEditForm((p) => ({ ...p, full_name: e.target.value }))}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Téléphone</Form.Label>
              <Form.Control
                value={editForm.phone_number}
                onChange={(e) => setEditForm((p) => ({ ...p, phone_number: e.target.value }))}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Adresse de livraison</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={editForm.shipping_address}
                onChange={(e) => setEditForm((p) => ({ ...p, shipping_address: e.target.value }))}
              />
            </Form.Group>
            <Form.Check
              type="checkbox"
              label="Abonné"
              checked={editForm.is_subscriber}
              onChange={(e) => setEditForm((p) => ({ ...p, is_subscriber: e.target.checked }))}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setEditUser(null)}>
              Annuler
            </Button>
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? 'Enregistrement…' : 'Enregistrer'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <ConfirmModal
        show={!!confirmDelete}
        title="Supprimer l'utilisateur"
        message={`Voulez-vous vraiment supprimer « ${confirmDelete?.email ?? '' } » ? Cette action est irréversible.`}
        confirmLabel="Supprimer"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmDelete(null)}
        loading={!!deletingId}
      />
    </>
  );
}
