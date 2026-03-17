import React from 'react';
import { Link } from 'react-router-dom';
import PageTitle from '../layouts/PageTitle';
import { useCart } from '../context/CartContext';

function ShopCart() {
  const { items, removeItem, updateQuantity, subtotal, totalItems } = useCart();

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
                          <th>Produit</th>
                          <th>Nom du produit</th>
                          <th>Prix unitaire</th>
                          <th>Quantité</th>
                          <th>Total</th>
                          <th className="text-end">Supprimer</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((data) => {
                          const lineTotal = parseFloat(data.price || '0') * data.quantity;
                          return (
                            <tr key={data.bookId}>
                              <td className="product-item-img">
                                <Link to={`/books-detail/${data.bookId}`}>
                                  <img src={data.coverImage} alt={data.title} style={{ maxWidth: 80, maxHeight: 120, objectFit: 'contain' }} />
                                </Link>
                              </td>
                              <td className="product-item-name book-title-truncate text-primary" title={data.title}>
                                <Link to={`/books-detail/${data.bookId}`}>{data.title}</Link>
                              </td>
                              <td className="product-item-price text-primary">{data.price} FC</td>
                              <td className="product-item-quantity">
                                <div className="quantity btn-quantity style-1 me-3">
                                  <button
                                    className="btn btn-plus"
                                    type="button"
                                    onClick={() => updateQuantity(data.bookId, data.quantity + 1)}
                                  >
                                    <i className="ti-plus"></i>
                                  </button>
                                  <input type="text" className="quantity-input text-primary" value={data.quantity} readOnly />
                                  <button
                                    className="btn btn-minus"
                                    type="button"
                                    onClick={() => updateQuantity(data.bookId, data.quantity - 1)}
                                  >
                                    <i className="ti-minus"></i>
                                  </button>
                                </div>
                              </td>
                              <td className="product-item-totle text-primary">{lineTotal.toFixed(0)} FC</td>
                              <td className="product-item-close">
                                <button
                                  type="button"
                                  className="ti-close border-0 bg-transparent p-0 text-primary"
                                  style={{ cursor: 'pointer', fontSize: '1.2rem' }}
                                  onClick={() => removeItem(data.bookId)}
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
                    <table className="table-bordered check-tbl m-b25">
                      <tbody>
                        <tr>
                          <td>Sous-total ({totalItems} article{totalItems > 1 ? 's' : ''})</td>
                          <td>{subtotal.toFixed(0)} FC</td>
                        </tr>
                        <tr>
                          <td>Livraison</td>
                          <td>À préciser à l&apos;étape suivante</td>
                        </tr>
                        <tr>
                          <td><strong>Total</strong></td>
                          <td><strong>{subtotal.toFixed(0)} FC</strong></td>
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
