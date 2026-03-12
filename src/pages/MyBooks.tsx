// @ts-nocheck
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Nav, Tab, Card, Badge, Button, Modal, Form } from 'react-bootstrap';
import PageTitle from '../layouts/PageTitle';
import NewsLetter from '../components/NewsLetter';
import { bookImages } from '../constants/imageUrls';

// Données mockées pour les livres achetés
const purchasedBooks = [
  {
    id: 1,
    titre: 'Le canard',
    auteur: 'Jean Richard MAMBWENI MABIALA',
    image: bookImages[0],
    dateAchat: '15/01/2025',
    prix: '45 000 FC',
    format: 'PDF',
    taille: '2.4 MB',
    disponible: true,
  },
  {
    id: 2,
    titre: 'Gestion de stock des hydrocarbures liquides et/ou liquéfiés',
    auteur: 'Jean Richard MAMBWENI MABIALA',
    image: bookImages[1],
    dateAchat: '10/01/2025',
    prix: '65 000 FC',
    format: 'EPUB',
    taille: '1.8 MB',
    disponible: true,
  },
  {
    id: 3,
    titre: 'Volkan devait vite se marier',
    auteur: 'Jean Richard MAMBWENI MABIALA',
    image: bookImages[2],
    dateAchat: '05/01/2025',
    prix: '55 000 FC',
    format: 'PDF',
    taille: '3.1 MB',
    disponible: true,
  },
];

// Données mockées pour les livres disponibles via abonnement
const subscriptionBooks = [
  {
    id: 4,
    titre: 'Le canard',
    auteur: 'Jean Richard MAMBWENI MABIALA',
    image: bookImages[0],
    categorie: 'Poésie',
    pages: 120,
    disponible: true,
  },
  {
    id: 5,
    titre: 'Gestion de stock des hydrocarbures liquides et/ou liquéfiés',
    auteur: 'Jean Richard MAMBWENI MABIALA',
    image: bookImages[1],
    categorie: 'Technique',
    pages: 450,
    disponible: true,
  },
  {
    id: 6,
    titre: 'Volkan devait vite se marier',
    auteur: 'Jean Richard MAMBWENI MABIALA',
    image: bookImages[2],
    categorie: 'Roman',
    pages: 320,
    disponible: true,
  },
];

// Mock du contenu du livre pour la lecture en ligne
const mockBookContent = `
Chapitre 1 : Le début

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.

Chapitre 2 : Le développement

Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.

Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.
`;

function MyBooks() {
  const [activeTab, setActiveTab] = useState('purchased');
  const [showReader, setShowReader] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [fontSize, setFontSize] = useState(16);
  const [darkMode, setDarkMode] = useState(false);

  const handleReadBook = (book) => {
    setSelectedBook(book);
    setShowReader(true);
  };

  const handleDownload = (book) => {
    // Simulation du téléchargement
    alert(`Téléchargement de "${book.titre}" en cours...`);
  };

  return (
    <>
      <div className="page-content bg-white">
        <PageTitle childPage="Mes Livres" parentPage="Accueil" />
        <section className="content-inner-1 bg-light">
          <div className="container">
            <Tab.Container
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k || 'purchased')}
            >
              <Nav
                variant="tabs"
                className="mb-4"
                style={{ borderBottom: '2px solid #1a1668' }}
              >
                <Nav.Item>
                  <Nav.Link
                    eventKey="purchased"
                    style={{
                      color:
                        activeTab === 'purchased' ? '#1a1668' : '#6c757d',
                      fontWeight:
                        activeTab === 'purchased' ? '600' : 'normal',
                    }}
                  >
                    <i className="fa fa-shopping-bag me-2"></i>
                    Livres achetés ({purchasedBooks.length})
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    eventKey="subscription"
                    style={{
                      color:
                        activeTab === 'subscription' ? '#1a1668' : '#6c757d',
                      fontWeight:
                        activeTab === 'subscription' ? '600' : 'normal',
                    }}
                  >
                    <i className="fa fa-star me-2"></i>
                    Abonnement ({subscriptionBooks.length})
                  </Nav.Link>
                </Nav.Item>
              </Nav>

              <Tab.Content>
                <Tab.Pane eventKey="purchased">
                  <div className="row">
                    {purchasedBooks.length === 0 ? (
                      <div className="col-12 text-center py-5">
                        <i
                          className="fa fa-book-open"
                          style={{
                            fontSize: '4rem',
                            color: '#ccc',
                            marginBottom: '1rem',
                          }}
                        ></i>
                        <p className="text-muted">
                          Aucun livre acheté pour le moment.
                        </p>
                        <Link
                          to="/books-grid-view"
                          className="btn btn-primary btnhover"
                        >
                          Parcourir la boutique
                        </Link>
                      </div>
                    ) : (
                      purchasedBooks.map((book) => (
                        <div
                          className="col-lg-4 col-md-6 m-b30"
                          key={book.id}
                        >
                          <Card
                            className="h-100"
                            style={{
                              border: 'none',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            }}
                          >
                            <div
                              style={{
                                height: '300px',
                                overflow: 'hidden',
                                background: '#f8f9fa',
                              }}
                            >
                              <img
                                src={book.image}
                                alt={book.titre}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                }}
                              />
                            </div>
                            <Card.Body>
                              <h5
                                className="card-title"
                                style={{
                                  fontSize: '1.1rem',
                                  fontWeight: '600',
                                  marginBottom: '0.5rem',
                                }}
                              >
                                {book.titre}
                              </h5>
                              <p className="text-muted small mb-2">
                                {book.auteur}
                              </p>
                              <div className="d-flex justify-content-between align-items-center mb-3">
                                <Badge bg="success">{book.format}</Badge>
                                <span className="text-muted small">
                                  {book.taille}
                                </span>
                              </div>
                              <div className="d-flex gap-2">
                                <Button
                                  variant="primary"
                                  className="btnhover flex-fill"
                                  onClick={() => handleDownload(book)}
                                >
                                  <i className="fa fa-download me-1"></i>
                                  Télécharger
                                </Button>
                                <Button
                                  variant="outline-secondary"
                                  className="btnhover"
                                  onClick={() => handleReadBook(book)}
                                >
                                  <i className="fa fa-eye"></i>
                                </Button>
                              </div>
                              <p className="text-muted small mt-2 mb-0">
                                Acheté le {book.dateAchat}
                              </p>
                            </Card.Body>
                          </Card>
                        </div>
                      ))
                    )}
                  </div>
                </Tab.Pane>

                <Tab.Pane eventKey="subscription">
                  <div className="row">
                    {subscriptionBooks.length === 0 ? (
                      <div className="col-12 text-center py-5">
                        <i
                          className="fa fa-star"
                          style={{
                            fontSize: '4rem',
                            color: '#ccc',
                            marginBottom: '1rem',
                          }}
                        ></i>
                        <p className="text-muted">
                          Aucun livre disponible via votre abonnement.
                        </p>
                        <Link
                          to="/pricing"
                          className="btn btn-primary btnhover"
                        >
                          Voir les abonnements
                        </Link>
                      </div>
                    ) : (
                      subscriptionBooks.map((book) => (
                        <div
                          className="col-lg-4 col-md-6 m-b30"
                          key={book.id}
                        >
                          <Card
                            className="h-100"
                            style={{
                              border: 'none',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            }}
                          >
                            <div
                              style={{
                                height: '300px',
                                overflow: 'hidden',
                                background: '#f8f9fa',
                                position: 'relative',
                              }}
                            >
                              <img
                                src={book.image}
                                alt={book.titre}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                }}
                              />
                              <Badge
                                bg="warning"
                                style={{
                                  position: 'absolute',
                                  top: '10px',
                                  right: '10px',
                                  fontSize: '0.75rem',
                                }}
                              >
                                <i className="fa fa-star me-1"></i>
                                Abonnement
                              </Badge>
                            </div>
                            <Card.Body>
                              <h5
                                className="card-title"
                                style={{
                                  fontSize: '1.1rem',
                                  fontWeight: '600',
                                  marginBottom: '0.5rem',
                                }}
                              >
                                {book.titre}
                              </h5>
                              <p className="text-muted small mb-2">
                                {book.auteur}
                              </p>
                              <div className="d-flex justify-content-between align-items-center mb-3">
                                <Badge bg="info">{book.categorie}</Badge>
                                <span className="text-muted small">
                                  {book.pages} pages
                                </span>
                              </div>
                              <Button
                                variant="primary"
                                className="btnhover w-100"
                                onClick={() => handleReadBook(book)}
                              >
                                <i className="fa fa-book-open me-1"></i>
                                Lire maintenant
                              </Button>
                            </Card.Body>
                          </Card>
                        </div>
                      ))
                    )}
                  </div>
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </div>
        </section>

        {/* Modal de lecture en ligne */}
        <Modal
          show={showReader}
          onHide={() => setShowReader(false)}
          fullscreen
          style={{ zIndex: 9999 }}
        >
          <Modal.Header
            closeButton
            style={{
              borderBottom: '1px solid #eee',
              backgroundColor: darkMode ? '#1a1a1a' : '#fff',
            }}
          >
            <Modal.Title
              style={{ color: darkMode ? '#fff' : '#1a1668' }}
            >
              {selectedBook?.titre}
            </Modal.Title>
            <div className="d-flex gap-2 align-items-center">
              <Form.Select
                size="sm"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                style={{ width: 'auto' }}
              >
                <option value={12}>12px</option>
                <option value={14}>14px</option>
                <option value={16}>16px</option>
                <option value={18}>18px</option>
                <option value={20}>20px</option>
                <option value={24}>24px</option>
              </Form.Select>
              <Button
                variant={darkMode ? 'light' : 'dark'}
                size="sm"
                onClick={() => setDarkMode(!darkMode)}
              >
                <i className={`fa fa-${darkMode ? 'sun' : 'moon'}`}></i>
              </Button>
            </div>
          </Modal.Header>
          <Modal.Body
            style={{
              backgroundColor: darkMode ? '#1a1a1a' : '#fff',
              color: darkMode ? '#e0e0e0' : '#333',
              fontSize: `${fontSize}px`,
              lineHeight: '1.8',
              padding: '2rem',
              maxWidth: '800px',
              margin: '0 auto',
              fontFamily: 'Georgia, serif',
            }}
          >
            <div style={{ whiteSpace: 'pre-wrap', textAlign: 'justify' }}>
              {mockBookContent}
            </div>
          </Modal.Body>
          <Modal.Footer
            style={{
              borderTop: '1px solid #eee',
              backgroundColor: darkMode ? '#1a1a1a' : '#fff',
            }}
          >
            <div className="d-flex justify-content-between w-100 align-items-center">
              <span className="text-muted small">Page 1 sur 10</span>
              <div className="d-flex gap-2">
                <Button variant="outline-secondary" size="sm">
                  <i className="fa fa-chevron-left me-1"></i>
                  Précédent
                </Button>
                <Button variant="outline-secondary" size="sm">
                  Suivant
                  <i className="fa fa-chevron-right ms-1"></i>
                </Button>
              </div>
            </div>
          </Modal.Footer>
        </Modal>

        <NewsLetter subscribeChange="" />
      </div>
    </>
  );
}

export default MyBooks;

