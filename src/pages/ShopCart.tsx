import React from 'react';
import { Link } from 'react-router-dom';
import PageTitle from '../layouts/PageTitle';
import { useCart } from '../context/CartContext';

function ShopCart() {
  const { items, removeItem, updateQuantity, updateFileFormat, subtotal, totalItems } = useCart();
  const formatLabel = (f: 'pdf' | 'epub' | null) => (f === 'pdf' ? 'PDF (recommandé)' : f === 'epub' ? 'EPUB' : '—');
  const productTypeLabel = (t: 'ebook' | 'physical') => (t === 'ebook' ? 'E-book' : 'Physique');

  return (
    <>
      <div className="page-content">
        <PageTitle parentPage="Boutique" childPage="Panier" />
        <section className="content-inner shop-account">
          <div className="container">
            <div className="row mb-5">
              <div className="col-lg-12">
                {items.length === 0 ? (
                  <div className="text-center py-5">
                    <p className="text-muted mb-3">Votre panier est vide.</p>
                    <Link to="/books-grid-view" className="btn btn-primary btnhover">
                      Voir les livres
                    </Link>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table check-tbl">
                      <thead>
                        <tr>
                          <th style={{ background: 'var(--primary)', color: '#fff' }}>Produit</th>
                          <th style={{ background: 'var(--primary)', color: '#fff' }}>Nom du produit</th>
                          <th style={{ background: 'var(--primary)', color: '#fff' }}>Prix unitaire</th>
                          <th style={{ background: 'var(--primary)', color: '#fff' }}>Quantité</th>
                          <th style={{ background: 'var(--primary)', color: '#fff' }}>Total</th>
                          <th className="text-end" style={{ background: 'var(--primary)', color: '#fff' }}>Supprimer</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((data) => {
                          const lineTotal = parseFloat(data.price || '0') * data.quantity;
                          return (
                            <tr key={data.lineId}>
                              <td className="product-item-img">
                                <Link to={`/books-detail/${data.bookId}`}>
                                  <img src={data.coverImage} alt={data.title} style={{ maxWidth: 80, maxHeight: 120, objectFit: 'contain' }} />
                                </Link>
                              </td>
                              <td className="product-item-name book-title-truncate text-primary" title={data.title}>
                                <Link to={`/books-detail/${data.bookId}`}>{data.title}</Link>
                                <div className="text-muted small mt-1">
                                  Type: <strong>{productTypeLabel(data.productType)}</strong>
                                  {data.productType === 'ebook' ? (
                                    <> • Téléchargement: <strong>{formatLabel(data.fileFormat)}</strong></>
                                  ) : null}
                                </div>
                                {data.productType === 'ebook' && data.fileFormat && (
                                  <div className="mt-1">
                                    <select
                                      className="form-select form-select-sm"
                                      value={data.fileFormat}
                                      onChange={(e) => updateFileFormat(data.lineId, (e.target.value as 'pdf' | 'epub') ?? 'pdf')}
                                      style={{ maxWidth: 220 }}
                                    >
                                      <option value="pdf">PDF (recommandé)</option>
                                      <option value="epub">EPUB</option>
                                    </select>
                                  </div>
                                )}
                              </td>
                              <td className="product-item-price text-primary">{data.price} FC</td>
                              <td className="product-item-quantity">
                                {data.productType === 'ebook' ? (
                                  <span className="text-muted">1</span>
                                ) : (
                                  <div className="quantity btn-quantity style-1 me-3">
                                    <button
                                      className="btn btn-plus"
                                      type="button"
                                      onClick={() => updateQuantity(data.lineId, data.quantity + 1)}
                                    >
                                      <i className="ti-plus"></i>
                                    </button>
                                    <input type="text" className="quantity-input text-primary" value={data.quantity} readOnly />
                                    <button
                                      className="btn btn-minus"
                                      type="button"
                                      onClick={() => updateQuantity(data.lineId, data.quantity - 1)}
                                    >
                                      <i className="ti-minus"></i>
                                    </button>
                                  </div>
                                )}
                              </td>
                              <td className="product-item-totle text-primary">{lineTotal.toFixed(0)} FC</td>
                              <td className="product-item-close">
                                <button
                                  type="button"
                                  className="ti-close border-0 bg-transparent p-0 text-primary"
                                  style={{ cursor: 'pointer', fontSize: '1.2rem' }}
                                  onClick={() => removeItem(data.lineId)}
                                  aria-label="Supprimer"
                                >
                                  {/* &times; */}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
            {items.length > 0 && (
              <div className="row">
                <div className="col-lg-6">
                  <Link to="/books-grid-view" className="btn btn-outline-secondary btnhover">
                    Continuer mes achats
                  </Link>
                </div>
                <div className="col-lg-6">
                  <div className="widget">
                    <h4 className="widget-title">Récapitulatif du panier</h4>
                    <table className="table-bordered check-tbl m-b25 text-primary">
                      <tbody>
                        <tr>
                          <td className="text-primary">Sous-total ({totalItems} article{totalItems > 1 ? 's' : ''})</td>
                          <td className="text-primary">{subtotal.toFixed(0)} FC</td>
                        </tr>
                        <tr>
                          <td className="text-primary">Livraison</td>
                          <td className="text-primary">À préciser à l&apos;étape suivante</td>
                        </tr>
                        <tr>
                          <td className="text-primary"><strong>Total</strong></td>
                          <td className="text-primary"><strong>{subtotal.toFixed(0)} FC</strong></td>
                        </tr>
                      </tbody>
                    </table>
                    <div className="form-group m-b25">
                      <Link to="/shop-checkout" className="btn btn-primary btnhover" type="button">
                        Passer la commande
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}

export default ShopCart;
