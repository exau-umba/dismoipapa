import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';

const defaultSettings = {
  nomBoutique: 'Librairie en ligne',
  email: 'contact@librairie.cd',
  telephone: '+243 81 123 45 67',
  adresse: 'Avenue du Commerce, Kinshasa, République démocratique du Congo',
  livraisonGratuite: '50',
  tva: '20',
};

function AdminSettings() {
  const [settings, setSettings] = useState(defaultSettings);

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: sauvegarde API
  };

  return (
    <>
      <h1 className="admin-page-title">Paramètres</h1>
      <div className="admin-card">
        <h5 className="admin-card-title">Informations boutique</h5>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nom de la boutique</Form.Label>
            <Form.Control name="nomBoutique" value={settings.nomBoutique} onChange={handleChange} />
          </Form.Group>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>E-mail de contact</Form.Label>
                <Form.Control type="email" name="email" value={settings.email} onChange={handleChange} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Téléphone</Form.Label>
                <Form.Control name="telephone" value={settings.telephone} onChange={handleChange} />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label>Adresse</Form.Label>
            <Form.Control name="adresse" value={settings.adresse} onChange={handleChange} />
          </Form.Group>
          <h5 className="admin-card-title mt-4">Livraison & fiscalité</h5>
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Seuil livraison gratuite (FC)</Form.Label>
                <Form.Control type="number" name="livraisonGratuite" value={settings.livraisonGratuite} onChange={handleChange} />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>TVA (%)</Form.Label>
                <Form.Control type="number" name="tva" value={settings.tva} onChange={handleChange} />
              </Form.Group>
            </Col>
          </Row>
          <div className="admin-form-actions">
            <Button type="submit" className="btn-primary btnhover">Enregistrer les paramètres</Button>
          </div>
        </Form>
      </div>
    </>
  );
}

export default AdminSettings;
