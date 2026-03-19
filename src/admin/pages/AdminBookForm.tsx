import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { getBook } from '../../api/catalog';
import type { Book } from '../../api/catalog';
import { createBook, updateBook, updateFormat, updateFormatWithFile, listCatalogs, type Catalog } from '../../api/admin';
import { getFriendlyErrorMessage } from '../../utils/errorMessages';
import ErrorMessage from '../../components/ErrorMessage';

interface FormState {
  catalog: string;
  title: string;
  author: string;
  synopsis: string;
  sample_text: string;
  language: string;
  publication_date: string;
  ebook_enabled: boolean;
  ebook_price: string;
  physical_enabled: boolean;
  physical_price: string;
  physical_stock_quantity: string;
}

const emptyForm: FormState = {
  catalog: '',
  title: '',
  author: '',
  synopsis: '',
  sample_text: '',
  language: 'fr',
  publication_date: '',
  ebook_enabled: true,
  ebook_price: '',
  physical_enabled: false,
  physical_price: '',
  physical_stock_quantity: '0',
};

export default function AdminBookForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const [form, setForm] = useState<FormState>(emptyForm);
  const [ebookFormatId, setEbookFormatId] = useState<string | null>(null);
  const [physicalFormatId, setPhysicalFormatId] = useState<string | null>(null);
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const [existingCoverUrl, setExistingCoverUrl] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [epubFile, setEpubFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listCatalogs()
      .then(setCatalogs)
      .catch(() => setCatalogs([]));
  }, []);

  useEffect(() => {
    return () => {
      if (coverPreviewUrl) URL.revokeObjectURL(coverPreviewUrl);
    };
  }, [coverPreviewUrl]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    getBook(id)
      .then((book: Book) => {
        const catalogId = book.catalog ?? '';
        setForm({
          catalog: catalogId,
          title: book.title ?? '',
          author: book.author ?? '',
          synopsis: book.synopsis ?? '',
          sample_text: book.sample_text ?? '',
          language: book.language ?? 'fr',
          publication_date: book.publication_date ? book.publication_date.slice(0, 10) : '',
          ebook_enabled: false,
          ebook_price: '',
          physical_enabled: false,
          physical_price: '',
          physical_stock_quantity: '0',
        });
        const ebookFormat = book.formats?.find((f) => f.format_type === 'ebook');
        const physicalFormat = book.formats?.find((f) => f.format_type === 'physical');
        setEbookFormatId(ebookFormat?.id ?? null);
        setPhysicalFormatId(physicalFormat?.id ?? null);
        setForm((prev) => ({
          ...prev,
          ebook_enabled: Boolean(ebookFormat),
          ebook_price: ebookFormat?.price ?? '',
          physical_enabled: Boolean(physicalFormat),
          physical_price: physicalFormat?.price ?? '',
          physical_stock_quantity: String(physicalFormat?.stock_quantity ?? 0),
        }));
        const cover = book.cover_image;
        if (cover) setExistingCoverUrl(cover);
      })
      .catch((err) => setError(getFriendlyErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: checked }));
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (coverPreviewUrl) URL.revokeObjectURL(coverPreviewUrl);
    setCoverPreviewUrl(null);
    setCoverImage(file || null);
    if (file) setCoverPreviewUrl(URL.createObjectURL(file));
  };

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPdfFile(e.target.files?.[0] || null);
  };
  const handleEpubChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEpubFile(e.target.files?.[0] || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const formatsToCreate: { format_type: 'ebook' | 'physical'; price: string; stock_quantity: number }[] = [];
      if (form.ebook_enabled) {
        formatsToCreate.push({
          format_type: 'ebook',
          price: form.ebook_price || '0',
          // Pas de gestion de stock pour les E-books
          stock_quantity: 0,
        });
      }
      if (form.physical_enabled) {
        formatsToCreate.push({
          format_type: 'physical',
          price: form.physical_price || '0',
          stock_quantity: parseInt(form.physical_stock_quantity, 10) || 0,
        });
      }
      if (formatsToCreate.length === 0) {
        setError('Veuillez activer au moins un format (E-book ou Physique).');
        return;
      }

      if (isEdit && id) {
        await updateBook(
          id,
          {
            catalog: form.catalog || undefined,
            title: form.title,
            author: form.author,
            synopsis: form.synopsis || undefined,
            sample_text: form.sample_text || undefined,
            language: form.language || undefined,
            publication_date: form.publication_date || undefined,
          },
          coverImage || undefined
        );
        if (form.ebook_enabled && ebookFormatId) {
          await updateFormatWithFile(
            ebookFormatId,
            {
              price: form.ebook_price || undefined,
              // Pas de gestion de stock pour les E-books
              stock_quantity: undefined,
            },
            pdfFile || undefined,
            epubFile || undefined
          );
        }
        if (form.physical_enabled && physicalFormatId) {
          await updateFormat(physicalFormatId, {
            price: form.physical_price || undefined,
            stock_quantity: form.physical_stock_quantity !== '' ? parseInt(form.physical_stock_quantity, 10) : undefined,
          });
        }
      } else {
        if (!form.catalog) {
          setError('Veuillez choisir un catalogue.');
          return;
        }
        await createBook(
          {
            catalog: form.catalog,
            title: form.title,
            author: form.author,
            synopsis: form.synopsis || undefined,
            sample_text: form.sample_text || undefined,
            language: form.language || undefined,
            publication_date: form.publication_date || undefined,
            formats: formatsToCreate,
          },
          coverImage || undefined,
          form.ebook_enabled ? pdfFile || undefined : undefined,
          form.ebook_enabled ? epubFile || undefined : undefined
        );
      }
      navigate('/admin/livres');
    } catch (err) {
      setError(getFriendlyErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="text-muted">Chargement du livre…</p>;
  }

  return (
    <>
      <h1 className="admin-page-title">{isEdit ? 'Modifier le livre' : 'Nouveau livre'}</h1>
      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} className="mb-3" />}
      {!isEdit && catalogs.length === 0 && (
        <p className="text-warning mb-3">
          <i className="fa fa-exclamation-triangle me-1" />
          Aucun catalogue. <Link to="/admin/catalogues">Créez d&apos;abord un catalogue</Link> pour pouvoir ajouter un livre.
        </p>
      )}
      <div className="admin-card">
        <Form onSubmit={handleSubmit}>
          {catalogs.length > 0 && (
            <Form.Group className="mb-3">
              <Form.Label>Catalogue *</Form.Label>
              <Form.Select
                name="catalog"
                value={form.catalog}
                onChange={handleChange}
                required={!isEdit}
              >
                <option value="">— Choisir un catalogue —</option>
                {catalogs.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
          )}
          <Form.Group className="mb-3">
            <Form.Label>Image de couverture</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleCoverChange}
            />
            {(coverPreviewUrl || existingCoverUrl) && (
              <div className="mt-2">
                <img
                  src={coverPreviewUrl || existingCoverUrl || ''}
                  alt="Aperçu couverture"
                  style={{ maxWidth: 200, maxHeight: 280, objectFit: 'cover', border: '1px solid #ddd', borderRadius: 4 }}
                />
              </div>
            )}
          </Form.Group>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Titre *</Form.Label>
                <Form.Control name="title" value={form.title} onChange={handleChange} required />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Auteur *</Form.Label>
                <Form.Control name="author" value={form.author} onChange={handleChange} required />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label>Langue</Form.Label>
            <Form.Select name="language" value={form.language} onChange={handleChange}>
              <option value="fr">Français</option>
              <option value="en">English</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Date de publication</Form.Label>
            <Form.Control type="date" name="publication_date" value={form.publication_date} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Résumé (synopsis)</Form.Label>
            <Form.Control as="textarea" rows={3} name="synopsis" value={form.synopsis} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Extrait (sample_text)</Form.Label>
            <Form.Control as="textarea" rows={2} name="sample_text" value={form.sample_text} onChange={handleChange} />
          </Form.Group>
          <h6 className="admin-card-title mt-3">Formats et tarifs</h6>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Check
                  type="switch"
                  id="ebook-enabled"
                  name="ebook_enabled"
                  label="Activer le format E-book"
                  checked={form.ebook_enabled}
                  onChange={handleCheck}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Check
                  type="switch"
                  id="physical-enabled"
                  name="physical_enabled"
                  label="Activer le format Physique"
                  checked={form.physical_enabled}
                  onChange={handleCheck}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Prix E-book ($)</Form.Label>
                <Form.Control
                  type="text"
                  name="ebook_price"
                  value={form.ebook_price}
                  onChange={handleChange}
                  placeholder="45000"
                  disabled={!form.ebook_enabled}
                  required={form.ebook_enabled}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Prix Physique ($)</Form.Label>
                <Form.Control
                  type="text"
                  name="physical_price"
                  value={form.physical_price}
                  onChange={handleChange}
                  placeholder="60000"
                  disabled={!form.physical_enabled}
                  required={form.physical_enabled}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Stock Physique</Form.Label>
                <Form.Control
                  type="number"
                  min={0}
                  name="physical_stock_quantity"
                  value={form.physical_stock_quantity}
                  onChange={handleChange}
                  disabled={!form.physical_enabled}
                />
              </Form.Group>
            </Col>
          </Row>
          {form.ebook_enabled && (
            <>
              <h6 className="admin-card-title mt-3">Fichier(s) du livre</h6>
              <p className="text-muted small mb-2">Ajoutez au moins un fichier PDF ou EPUB pour que le livre soit téléchargeable.</p>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Fichier PDF</Form.Label>
                    <Form.Control
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={handlePdfChange}
                    />
                    {pdfFile && <small className="text-success d-block mt-1">{pdfFile.name}</small>}
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Fichier EPUB</Form.Label>
                    <Form.Control
                      type="file"
                      accept=".epub,application/epub+zip"
                      onChange={handleEpubChange}
                    />
                    {epubFile && <small className="text-success d-block mt-1">{epubFile.name}</small>}
                  </Form.Group>
                </Col>
              </Row>
            </>
          )}
          <div className="admin-form-actions">
            <Button type="submit" className="btn-primary btnhover" disabled={submitting}>
              {submitting ? 'Enregistrement…' : isEdit ? 'Enregistrer' : 'Créer'}
            </Button>
            <Button type="button" variant="outline-secondary" onClick={() => navigate('/admin/livres')}>
              Annuler
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
}
