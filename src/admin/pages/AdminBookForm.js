import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';

function AdminBookForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    titre: isEdit ? 'Think and Grow Rich' : '',
    auteur: isEdit ? 'Jean Richard MAMBWENI MABIALA' : '',
    isbn: isEdit ? '978-1234567890' : '',
    categorie: isEdit ? 'Business' : '',
    prix: isEdit ? '12.50' : '',
    stock: isEdit ? '45' : '',
    description: isEdit ? 'Un classique du développement personnel.' : '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/admin/livres');
  };

  return (
    <>
      <h1 className="admin-page-title">{isEdit ? 'Modifier le livre' : 'Nouveau livre'}</h1>
      <div className="admin-card">
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Titre *</Form.Label>
                <Form.Control name="titre" value={form.titre} onChange={handleChange} required />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Auteur *</Form.Label>
                <Form.Control name="auteur" value={form.auteur} onChange={handleChange} required />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>ISBN</Form.Label>
                <Form.Control name="isbn" value={form.isbn} onChange={handleChange} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Catégorie</Form.Label>
                <Form.Select name="categorie" value={form.categorie} onChange={handleChange}>
                  <option value="">-- Choisir --</option>
                  <option value="Roman">Roman</option>
                  <option value="Business">Business</option>
                  <option value="Thriller">Thriller</option>
                  <option value="Action">Action</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Prix (euros) *</Form.Label>
                <Form.Control type="number" step="0.01" name="prix" value={form.prix} onChange={handleChange} required />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Stock</Form.Label>
                <Form.Control type="number" name="stock" value={form.stock} onChange={handleChange} />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" rows={3} name="description" value={form.description} onChange={handleChange} />
          </Form.Group>
          <div className="admin-form-actions">
            <Button type="submit" className="btn-primary btnhover">{isEdit ? 'Enregistrer' : 'Créer'}</Button>
            <Button type="button" variant="outline-secondary" onClick={() => navigate('/admin/livres')}>Annuler</Button>
          </div>
        </Form>
      </div>
    </>
  );
}

export default AdminBookForm;
