import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Collapse, Form } from 'react-bootstrap';
import PageTitle from '../layouts/PageTitle';
import { useCart } from '../context/CartContext';
import { getBook } from '../api/catalog';
import { createOrder, simulateOrderPayment } from '../api/orders';
import { getFriendlyErrorMessage } from '../utils/errorMessages';
import ErrorMessage from '../components/ErrorMessage';

function ShopCheckout() {
    const [accordBtn, setAccordBtn] = useState(false);
    const { items: orderItems, subtotal, clearCart } = useCart();
    const formatLabel = (f: 'pdf' | 'epub' | null) => (f === 'pdf' ? 'PDF' : f === 'epub' ? 'EPUB' : '');
    const hasPhysical = orderItems.some((i) => i.productType === 'physical');
    const [placingOrder, setPlacingOrder] = useState(false);
    const [checkoutError, setCheckoutError] = useState<string | null>(null);
    const [checkoutSuccess, setCheckoutSuccess] = useState<string | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'mobile'>('card');
    const [billing, setBilling] = useState({
      firstName: '',
      lastName: '',
      company: '',
      address1: '',
      address2: '',
      city: '',
      region: '',
      postalCode: '',
      email: '',
      phone: '',
      country: 'CD',
    });
    const [note, setNote] = useState('');

    const isCartEmpty = orderItems.length === 0;

    const shippingAddress = useMemo(() => {
      if (!hasPhysical) return 'E-book - aucune livraison physique';
      return [
        `${billing.firstName} ${billing.lastName}`.trim(),
        billing.company,
        billing.address1,
        billing.address2,
        `${billing.postalCode} ${billing.city}`.trim(),
        billing.region,
        billing.country,
        `Email: ${billing.email}`,
        `Tel: ${billing.phone}`,
      ].filter(Boolean).join(', ');
    }, [billing, hasPhysical]);

    const handleBillingChange = (key: keyof typeof billing, value: string) => {
      setBilling((prev) => ({ ...prev, [key]: value }));
    };

    const validateCheckout = (): string | null => {
      if (isCartEmpty) return 'Votre panier est vide.';
      if (!hasPhysical) return null;
      const requiredFields: Array<keyof typeof billing> = [
        'firstName',
        'lastName',
        'address1',
        'city',
        'region',
        'postalCode',
        'email',
        'phone',
      ];
      const missing = requiredFields.find((k) => !billing[k].trim());
      if (missing) return 'Veuillez compléter toutes les informations de livraison requises.';
      return null;
    };

    const resolveFormatId = async (bookId: string, productType: 'ebook' | 'physical') => {
      const book = await getBook(bookId);
      const format = (book.formats || []).find((f) => f.format_type === productType);
      if (!format?.id) throw new Error('Format introuvable pour un article du panier.');
      return format.id;
    };

    const handlePlaceOrder = async () => {
      setCheckoutError(null);
      setCheckoutSuccess(null);
      const validationError = validateCheckout();
      if (validationError) {
        setCheckoutError(validationError);
        return;
      }
      setPlacingOrder(true);
      try {
        const items = await Promise.all(
          orderItems.map(async (item) => ({
            format: await resolveFormatId(item.bookId, item.productType),
            quantity: item.productType === 'ebook' ? 1 : item.quantity,
          }))
        );
        const createdOrder = await createOrder({
          shipping_address: shippingAddress,
          items,
        });
        // Paiement simulé (best effort) selon papa_dis_moi.json
        if (createdOrder?.id) {
          try {
            await simulateOrderPayment(createdOrder.id);
          } catch {
            // Le paiement peut échouer sans bloquer la création de commande.
          }
        }
        clearCart();
        setCheckoutSuccess(`Commande créée avec succès${createdOrder?.id ? ` (#${createdOrder.id})` : ''}.`);
      } catch (err) {
        setCheckoutError(getFriendlyErrorMessage(err));
      } finally {
        setPlacingOrder(false);
      }
    };

    return (
        <>
            <div className="page-content">
                <PageTitle  parentPage="Boutique" childPage="Paiement" />               
                <section className="content-inner-1">
				{/* <!-- Product --> */}
                    <div className="container">
                        {checkoutError && (
                          <ErrorMessage message={checkoutError} onDismiss={() => setCheckoutError(null)} className="mb-3" />
                        )}
                        {checkoutSuccess && (
                          <div className="alert alert-success mb-3" role="alert">
                            {checkoutSuccess}
                          </div>
                        )}
                        <form className="shop-form">
                            <div className="row">
                                <div className="col-lg-6 col-md-6">
                                    <div className="widget">
                                        <h4 className="widget-title">Adresse de facturation et livraison</h4>
                                        {!hasPhysical ? (
                                          <p className="text-muted mb-0">
                                            Votre panier contient uniquement des <strong>E-books</strong>. Aucune adresse de livraison n’est requise.
                                          </p>
                                        ) : (
                                          <>
                                            <div className="form-group">
                                                <Form.Select aria-label="Pays" value={billing.country} onChange={(e) => handleBillingChange('country', e.target.value)} required>
                                                    <option value="CD">République démocratique du Congo</option>
                                                    <option value="CG">République du Congo</option>
                                                    <option value="RW">Rwanda</option>
                                                    <option value="BI">Burundi</option>
                                                    <option value="UG">Ouganda</option>
                                                </Form.Select>	
                                            </div>
                                            <div className="row">
                                                <div className="form-group col-md-6">
                                                  <input type="text" className="form-control" placeholder="Prénom" value={billing.firstName} onChange={(e) => handleBillingChange('firstName', e.target.value)} required />
                                                </div>
                                                <div className="form-group col-md-6">
                                                  <input type="text" className="form-control" placeholder="Nom" value={billing.lastName} onChange={(e) => handleBillingChange('lastName', e.target.value)} required />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                              <input type="text" className="form-control" placeholder="Société (optionnel)" value={billing.company} onChange={(e) => handleBillingChange('company', e.target.value)} />
                                            </div>
                                            <div className="form-group">
                                              <input type="text" className="form-control" placeholder="Adresse (rue, numéro...)" value={billing.address1} onChange={(e) => handleBillingChange('address1', e.target.value)} required />
                                            </div>
                                            <div className="row">
                                              <div className="form-group col-md-6">
                                                <input type="text" className="form-control" placeholder="Appartement, bâtiment, etc." value={billing.address2} onChange={(e) => handleBillingChange('address2', e.target.value)} />
                                              </div>
                                              <div className="form-group col-md-6">
                                                <input type="text" className="form-control" placeholder="Ville" value={billing.city} onChange={(e) => handleBillingChange('city', e.target.value)} required />
                                              </div>
                                            </div>
                                            <div className="row">
                                              <div className="form-group col-md-6">
                                                <input type="text" className="form-control" placeholder="Région / Province" value={billing.region} onChange={(e) => handleBillingChange('region', e.target.value)} required />
                                              </div>
                                              <div className="form-group col-md-6">
                                                <input type="text" className="form-control" placeholder="Code postal" value={billing.postalCode} onChange={(e) => handleBillingChange('postalCode', e.target.value)} required />
                                              </div>
                                            </div>
                                            <div className="row">
                                              <div className="form-group col-md-6">
                                                <input type="email" className="form-control" placeholder="E-mail" value={billing.email} onChange={(e) => handleBillingChange('email', e.target.value)} required />
                                              </div>
                                              <div className="form-group col-md-6">
                                                <input type="text" className="form-control" placeholder="Téléphone" value={billing.phone} onChange={(e) => handleBillingChange('phone', e.target.value)} required />
                                              </div>
                                            </div>
                                          </>
                                        )}
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6">
                                    <button className="btn btn-primary btnhover mb-3" type="button" 
                                        onClick={() => setAccordBtn(!accordBtn)}>Livrer à une autre adresse <i className="fa fa-arrow-circle-o-down"></i>
                                    </button>
                                    <Collapse in={accordBtn} >
                                        <div>
                                            {!hasPhysical ? (
                                              <p className="text-muted mb-0">Aucune livraison pour les E-books.</p>
                                            ) : (
                                              <>
                                                <p>Adresse calculée pour cette commande :</p>
                                                <div className="form-group">
                                                  <textarea className="form-control" rows={4} readOnly value={shippingAddress} />
                                                </div>
                                              </>
                                            )}
                                        </div>    
                                    </Collapse>
                                    <div className="form-group">
                                        <textarea className="form-control" placeholder="Notes pour votre commande (ex. instructions de livraison)" value={note} onChange={(e) => setNote(e.target.value)}></textarea>
                                    </div>
                                
                                </div>
                            </div>
                        </form>
                        <div className="dz-divider bg-gray-dark text-gray-dark icon-center  my-5"><i className="fa fa-circle bg-white text-gray-dark"></i></div>
                        <div className="row g-4 align-items-start">
                            <div className="col-lg-6">
                                <div className="widget h-100 p-3 p-md-4 bg-white shadow-sm">
                                    <h4 className="widget-title">Votre commande</h4>
                                    <table className="table-bordered check-tbl">
                                        <thead className="text-center">
                                            <tr>
                                                <th style={{ background: 'var(--primary)', color: '#fff' }}>IMAGE</th>
                                                <th style={{ background: 'var(--primary)', color: '#fff' }}>PRODUIT</th>
                                                <th style={{ background: 'var(--primary)', color: '#fff' }}>TOTAL</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orderItems.length === 0 ? (
                                                <tr><td colSpan={3} className="text-center text-muted py-3">Panier vide. <Link to="/books-grid-view">Voir les livres</Link></td></tr>
                                            ) : (
                                                orderItems.map((item) => (
                                                <tr key={item.lineId}>
                                                    <td className="product-item-img"><img src={item.coverImage} alt="" style={{ maxWidth: 60, maxHeight: 90, objectFit: 'contain' }} /></td>
                                                    <td className="product-item-name book-title-truncate text-primary" title={item.title}>
                                                      {item.title}
                                                      {item.productType === 'physical' ? ` × ${item.quantity}` : null}
                                                      <span className="text-muted"> • {item.productType === 'ebook' ? 'E-book' : 'Physique'}</span>
                                                      {item.productType === 'ebook' && item.fileFormat ? <span className="text-muted"> • {formatLabel(item.fileFormat)}</span> : null}
                                                    </td>
                                                    <td className="product-price text-primary">{(parseFloat(item.price || '0') * item.quantity).toFixed(0)} $</td>
                                                </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <form className="shop-form widget h-100 p-3 p-md-4 bg-white shadow-sm">
                                    <h4 className="widget-title">Total de la commande</h4>
                                    <table className="table-bordered check-tbl mb-4">
                                        <tbody>
                                            <tr>
                                                <td className="text-primary">Sous-total</td>
                                                <td className="product-price text-primary">{subtotal.toFixed(0)} $</td>
                                            </tr>
                                            <tr>
                                                <td className="text-primary">Livraison</td>
                                                <td className="text-primary">À préciser</td>
                                            </tr>
                                            <tr>
                                                <td className="text-primary"><strong>Total</strong></td>
                                                <td className="product-price-total text-primary"><strong>{subtotal.toFixed(0)} $</strong></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <h4 className="widget-title">Mode de paiement (simulation)</h4>
                                    <div className="form-group">
                                        <Form.Select aria-label="Moyen de paiement" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as 'card' | 'mobile')}>
                                            <option value="card">Carte bancaire (simulation)</option>
                                            <option value="mobile">Mobile Money (simulation)</option>
                                        </Form.Select>
                                    </div>
                                    <div className="form-group">
                                        <button className="btn btn-primary btnhover w-100" type="button" disabled={placingOrder || isCartEmpty} onClick={handlePlaceOrder}>
                                          {placingOrder ? 'Création de la commande…' : 'Passer la commande'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    {/* <!-- Product END --> */}
                </section>
                
            </div>
        </>
    )
}
export default ShopCheckout;