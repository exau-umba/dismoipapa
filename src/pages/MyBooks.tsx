import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Nav, Tab, Card, Badge, Button } from 'react-bootstrap';
import PageTitle from '../layouts/PageTitle';
import { bookImages } from '../constants/imageUrls';
import { downloadLibraryBook, listLibraryEntries, type LibraryEntry } from '../api/library';
import { getFriendlyErrorMessage } from '../utils/errorMessages';
import ErrorMessage from '../components/ErrorMessage';

/** Couverture : ratio livre, image entière visible (object-fit contain). */
function LibraryBookCover(props: {
  src: string;
  alt: string;
  children?: React.ReactNode;
}) {
  const { src, alt, children } = props;
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <div
      className="rounded-top overflow-hidden bg-light border-bottom"
      style={{
        aspectRatio: '2 / 3',
        maxHeight: 440,
        minHeight: 260,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '14px 16px',
        position: 'relative',
      }}
    >
      <img
        src={imgSrc}
        alt={alt}
        loading="lazy"
        decoding="async"
        onError={() => setImgSrc(bookImages[0])}
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          width: 'auto',
          height: 'auto',
          objectFit: 'contain',
          objectPosition: 'center',
          display: 'block',
          boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
        }}
      />
      {children}
    </div>
  );
}

function MyBooks() {
  const [activeTab, setActiveTab] = useState('purchased');
  const [entries, setEntries] = useState<LibraryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingBookId, setDownloadingBookId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    listLibraryEntries()
      .then(setEntries)
      .catch((err) => setError(getFriendlyErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const purchasedBooks = useMemo(
    () => entries.filter((e) => e.access_type === 'purchase'),
    [entries]
  );
  const subscriptionBooks = useMemo(
    () => entries.filter((e) => e.access_type !== 'purchase'),
    [entries]
  );

  const handleDownload = async (bookId: string) => {
    setError(null);
    setDownloadingBookId(bookId);
    try {
      await downloadLibraryBook(bookId);
    } catch (err) {
      setError(getFriendlyErrorMessage(err));
    } finally {
      setDownloadingBookId(null);
    }
  };

  return (
    <>
      <div className="page-content bg-white">
        <PageTitle childPage="Mes Livres" parentPage="Accueil" />
        <section className="content-inner-1 bg-light">
          <div className="container">
            {error && <ErrorMessage message={error} onDismiss={() => setError(null)} className="mb-3" />}
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
                {/* <Nav.Item>
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
                </Nav.Item> */}
              </Nav>

              <Tab.Content>
                <Tab.Pane eventKey="purchased">
                  <div className="row">
                    {loading ? (
                      <div className="col-12 text-center py-5">
                        <p className="text-muted">Chargement de votre bibliothèque…</p>
                      </div>
                    ) : purchasedBooks.length === 0 ? (
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
                            <LibraryBookCover
                              src={book.book_cover || bookImages[0]}
                              alt={book.book_title}
                            />
                            <Card.Body>
                              <h5
                                className="card-title"
                                style={{
                                  fontSize: '1.1rem',
                                  fontWeight: '600',
                                  marginBottom: '0.5rem',
                                }}
                              >
                                {book.book_title}
                              </h5>
                              <p className="text-muted small mb-2">
                                {book.book_author}
                              </p>
                              <div className="d-flex justify-content-between align-items-center mb-3">
                                <Badge bg="success">Achat</Badge>
                                <span className="text-muted small">
                                  {book.ebook_epub_url ? 'EPUB' : 'PDF'}
                                </span>
                              </div>
                              <div className="d-flex gap-2">
                                <Button
                                  variant="primary"
                                  className="btnhover flex-fill"
                                  onClick={() => handleDownload(book.book)}
                                  disabled={downloadingBookId === book.book}
                                >
                                  <i className="fa fa-download me-1"></i>
                                  {downloadingBookId === book.book ? 'Téléchargement…' : 'Télécharger'}
                                </Button>
                                <Link
                                  to={`/reader/${book.book}`}
                                  className="btn btn-outline-secondary btnhover"
                                >
                                  <i className="fa fa-eye"></i>
                                </Link>
                              </div>
                              <p className="text-muted small mt-2 mb-0">
                                Acheté le {new Date(book.added_at).toLocaleDateString('fr-FR')}
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
                    {loading ? (
                      <div className="col-12 text-center py-5">
                        <p className="text-muted">Chargement de votre bibliothèque…</p>
                      </div>
                    ) : subscriptionBooks.length === 0 ? (
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
                        <Link to="/books-grid-view" className="btn btn-primary btnhover">Voir la boutique</Link>
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
                            <LibraryBookCover
                              src={book.book_cover || bookImages[0]}
                              alt={book.book_title}
                            >
                              <Badge
                                bg="warning"
                                style={{
                                  position: 'absolute',
                                  top: '12px',
                                  right: '12px',
                                  fontSize: '0.75rem',
                                  zIndex: 2,
                                }}
                              >
                                <i className="fa fa-star me-1"></i>
                                Abonnement
                              </Badge>
                            </LibraryBookCover>
                            <Card.Body>
                              <h5
                                className="card-title"
                                style={{
                                  fontSize: '1.1rem',
                                  fontWeight: '600',
                                  marginBottom: '0.5rem',
                                }}
                              >
                                {book.book_title}
                              </h5>
                              <p className="text-muted small mb-2">
                                {book.book_author}
                              </p>
                              <div className="d-flex justify-content-between align-items-center mb-3">
                                <Badge bg="info">Abonnement</Badge>
                                <span className="text-muted small">
                                  {book.book_language?.toUpperCase() || '—'}
                                </span>
                              </div>
                              <Link
                                to={`/reader/${book.book}`}
                                className="btn btn-primary btnhover w-100"
                              >
                                <i className="fa fa-book-open me-1"></i>
                                Lire maintenant
                              </Link>
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
      </div>
    </>
  );
}

export default MyBooks;

