import React from 'react';
import { Modal, Button } from 'react-bootstrap';

interface LogoutConfirmModalProps {
  show: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Modal de confirmation avant déconnexion (admin et utilisateurs).
 */
export default function LogoutConfirmModal({ show, onConfirm, onCancel }: LogoutConfirmModalProps) {
  return (
    <Modal show={show} onHide={onCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirmer la déconnexion</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Êtes-vous sûr de vouloir vous déconnecter ?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>
          Annuler
        </Button>
        <Button variant="primary" onClick={onConfirm}>
          Se déconnecter
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
