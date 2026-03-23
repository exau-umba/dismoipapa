import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Collapse, Form, Modal, Toast, ToastContainer } from 'react-bootstrap';
import PageTitle from '../layouts/PageTitle';
import { useCart } from '../context/CartContext';
import { getBook } from '../api/catalog';
import { createOrder, requestNetikashPayment } from '../api/orders';
import { getFriendlyErrorMessage } from '../utils/errorMessages';
import ErrorMessage from '../components/ErrorMessage';
import type { PaymentConfirmationState } from './PaymentConfirmation';
import { MOBILE_MONEY_METHODS, type MobileMoneyOperatorId } from '../components/PaymentMethodsBlock';

type MobileOperatorId = MobileMoneyOperatorId;
type CheckoutToast = {
  id: number;
  message: string;
  variant: 'danger' | 'success' | 'warning';
};

function validateMobilePayment(operator: string | null, phone: string): string | null {
  if (!operator) return 'Veuillez choisir un opérateur Mobile Money.';
  const digits = phone.replace(/\D/g, '');
  if (digits.length !== 9) {
    return 'Veuillez saisir exactement 9 chiffres pour le numéro Mobile Money.';
  }
  return null;
}

function ShopCheckout() {
  const navigate = useNavigate();
  const redirectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [accordBtn, setAccordBtn] = useState(false);
  const { items: orderItems, subtotal, clearCart } = useCart();
  const formatLabel = (f: 'pdf' | 'epub' | null) => (f === 'pdf' ? 'PDF' : f === 'epub' ? 'EPUB' : '');
  const hasPhysical = orderItems.some((i) => i.productType === 'physical');
  const [placingOrder, setPlacingOrder] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [mobileOperator, setMobileOperator] = useState<MobileOperatorId | ''>('');
  const [mobilePhone, setMobilePhone] = useState('');
  const phoneInputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [toasts, setToasts] = useState<CheckoutToast[]>([]);
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

  useEffect(() => {
    return () => {
      if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
    };
  }, []);

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
    ]
      .filter(Boolean)
      .join(', ');
  }, [billing, hasPhysical]);

  const handleBillingChange = (key: keyof typeof billing, value: string) => {
    setBilling((prev) => ({ ...prev, [key]: value }));
  };

  const pushToast = (message: string, variant: CheckoutToast['variant']) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((prev) => [...prev, { id, message, variant }]);
  };
  const dismissToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const phoneDigits = useMemo(() => {
    const digits = mobilePhone.replace(/\D/g, '').slice(0, 9);
    return Array.from({ length: 9 }, (_, i) => digits[i] ?? '');
  }, [mobilePhone]);

  const updatePhoneDigit = (index: number, raw: string) => {
    const digit = raw.replace(/\D/g, '').slice(-1);
    const next = [...phoneDigits];
    next[index] = digit;
    const merged = next.join('');
    setMobilePhone(merged);

    if (digit && index < 8) {
      phoneInputRefs.current[index + 1]?.focus();
    }
  };

  const handlePhoneDigitKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !phoneDigits[index] && index > 0) {
      e.preventDefault();
      phoneInputRefs.current[index - 1]?.focus();
    }
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
    const validationError = validateCheckout();
    if (validationError) {
      setCheckoutError(validationError);
      pushToast(validationError, 'warning');
      return;
    }
    const paymentError = validateMobilePayment(mobileOperator || null, mobilePhone);
    if (paymentError) {
      setCheckoutError(paymentError);
      pushToast(paymentError, 'warning');
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
      if (createdOrder?.id) {
        await requestNetikashPayment({
          order_id: createdOrder.id,
          phone: mobilePhone.replace(/\D/g, '').slice(0, 9),
          provider_id: mobileOperator as MobileMoneyOperatorId,
        });
      }
      pushToast('Commande créée, demande de paiement envoyée sur votre téléphone.', 'success');

      clearCart();
      setShowPaymentModal(true);

      const orderNumber =
        typeof createdOrder.order_number === 'string' ? createdOrder.order_number : undefined;
      const operatorLabel = MOBILE_MONEY_METHODS.find((o) => o.id === mobileOperator)?.shortLabel ?? '';

      const confirmationState: PaymentConfirmationState = {
        orderId: createdOrder.id,
        orderNumber,
        mobileOperator: operatorLabel,
      };

      if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
      redirectTimerRef.current = setTimeout(() => {
        setShowPaymentModal(false);
        navigate('/confirmation-paiement', { state: confirmationState, replace: true });
      }, 10000);
    } catch (err) {
      const msg = getFriendlyErrorMessage(err);
      setCheckoutError(msg);
      pushToast(msg, 'danger');
    } finally {
      setPlacingOrder(false);
    }
  };

  const selectedOperatorLabel = MOBILE_MONEY_METHODS.find((o) => o.id === mobileOperator)?.label;
  const selectedOperatorLogo = MOBILE_MONEY_METHODS.find((o) => o.id === mobileOperator);

  return (
    <>
      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1080 }}>
        {toasts.map((t) => (
          <Toast
            key={t.id}
            autohide
            delay={5000}
            onClose={() => dismissToast(t.id)}
            bg={t.variant}
          >
            <Toast.Body className={t.variant === 'warning' ? 'text-dark' : 'text-white'}>
              {t.message}
            </Toast.Body>
          </Toast>
        ))}
      </ToastContainer>

      <Modal show={showPaymentModal} onHide={() => {}} backdrop="static" keyboard={false} centered>
        <Modal.Header className="border-0 pb-0 d-flex flex-column align-items-center text-center gap-2">
          {selectedOperatorLogo ? (
            <div className="checkout-mobile-money-card__logo mb-1" style={{ maxWidth: 160 }}>
              <img src={selectedOperatorLogo.logoSrc} alt="" aria-hidden />
            </div>
          ) : null}
          <Modal.Title as="h5" className="w-100">
            Confirmez le paiement sur votre téléphone
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-2">
            Une demande de paiement <strong>Mobile Money</strong>
            {selectedOperatorLabel ? (
              <>
                {' '}
                via <strong>{selectedOperatorLabel}</strong>
              </>
            ) : null}{' '}
            a été initiée sur le numéro indiqué.
          </p>
          <p className="mb-0 text-muted">
            Vérifiez votre téléphone : validez la transaction et saisissez votre <strong>code PIN</strong> sur
            l’application ou le USSD de votre opérateur.
          </p>
          <p className="mt-3 mb-0 small text-muted">
            Redirection automatique vers la confirmation dans quelques secondes…
          </p>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0 justify-content-center">
          <div className="spinner-border text-primary" role="status" aria-label="Chargement">
            <span className="visually-hidden">Chargement…</span>
          </div>
        </Modal.Footer>
      </Modal>

      <div className="page-content">
        <PageTitle parentPage="Boutique" childPage="Paiement" />
        <section className="content-inner-1">
          <div className="container">
            {checkoutError && (
              <ErrorMessage message={checkoutError} onDismiss={() => setCheckoutError(null)} className="mb-3" />
            )}
            <form className="shop-form">
              <div className="row">
                <div className="col-lg-6 col-md-6">
                  <div className="widget">
                    <h4 className="widget-title">Adresse de facturation et livraison</h4>
                    {!hasPhysical ? (
                      <p className="text-muted mb-0">
                        Votre panier contient uniquement des <strong>E-books</strong>. Aucune adresse de livraison
                        n’est requise.
                      </p>
                    ) : (
                      <>
                        <div className="form-group">
                          <Form.Select
                            aria-label="Pays"
                            value={billing.country}
                            onChange={(e) => handleBillingChange('country', e.target.value)}
                            required
                          >
                            <option value="CD">République démocratique du Congo</option>
                            <option value="CG">République du Congo</option>
                            <option value="RW">Rwanda</option>
                            <option value="BI">Burundi</option>
                            <option value="UG">Ouganda</option>
                          </Form.Select>
                        </div>
                        <div className="row">
                          <div className="form-group col-md-6">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Prénom"
                              value={billing.firstName}
                              onChange={(e) => handleBillingChange('firstName', e.target.value)}
                              required
                            />
                          </div>
                          <div className="form-group col-md-6">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Nom"
                              value={billing.lastName}
                              onChange={(e) => handleBillingChange('lastName', e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Société (optionnel)"
                            value={billing.company}
                            onChange={(e) => handleBillingChange('company', e.target.value)}
                          />
                        </div>
                        <div className="form-group">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Adresse (rue, numéro...)"
                            value={billing.address1}
                            onChange={(e) => handleBillingChange('address1', e.target.value)}
                            required
                          />
                        </div>
                        <div className="row">
                          <div className="form-group col-md-6">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Appartement, bâtiment, etc."
                              value={billing.address2}
                              onChange={(e) => handleBillingChange('address2', e.target.value)}
                            />
                          </div>
                          <div className="form-group col-md-6">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Ville"
                              value={billing.city}
                              onChange={(e) => handleBillingChange('city', e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="form-group col-md-6">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Région / Province"
                              value={billing.region}
                              onChange={(e) => handleBillingChange('region', e.target.value)}
                              required
                            />
                          </div>
                          <div className="form-group col-md-6">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Code postal"
                              value={billing.postalCode}
                              onChange={(e) => handleBillingChange('postalCode', e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="form-group col-md-6">
                            <input
                              type="email"
                              className="form-control"
                              placeholder="E-mail"
                              value={billing.email}
                              onChange={(e) => handleBillingChange('email', e.target.value)}
                              required
                            />
                          </div>
                          <div className="form-group col-md-6">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Téléphone"
                              value={billing.phone}
                              onChange={(e) => handleBillingChange('phone', e.target.value)}
                              required
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <button className="btn btn-primary btnhover mb-3" type="button" onClick={() => setAccordBtn(!accordBtn)}>
                    Livrer à une autre adresse <i className="fa fa-arrow-circle-o-down"></i>
                  </button>
                  <Collapse in={accordBtn}>
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
                    <textarea
                      className="form-control"
                      placeholder="Notes pour votre commande (ex. instructions de livraison)"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </form>
            <div className="dz-divider bg-gray-dark text-gray-dark icon-center  my-5">
              <i className="fa fa-circle bg-white text-gray-dark"></i>
            </div>
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
                        <tr>
                          <td colSpan={3} className="text-center text-muted py-3">
                            Panier vide. <Link to="/books-grid-view">Voir les livres</Link>
                          </td>
                        </tr>
                      ) : (
                        orderItems.map((item) => (
                          <tr key={item.lineId}>
                            <td className="product-item-img">
                              <img src={item.coverImage} alt="" style={{ maxWidth: 60, maxHeight: 90, objectFit: 'contain' }} />
                            </td>
                            <td className="product-item-name book-title-truncate text-primary" title={item.title}>
                              {item.title}
                              {item.productType === 'physical' ? ` × ${item.quantity}` : null}
                              <span className="text-muted"> • {item.productType === 'ebook' ? 'E-book' : 'Physique'}</span>
                              {item.productType === 'ebook' && item.fileFormat ? (
                                <span className="text-muted"> • {formatLabel(item.fileFormat)}</span>
                              ) : null}
                            </td>
                            <td className="product-price text-primary">
                              {(parseFloat(item.price || '0') * item.quantity).toFixed(0)} $
                            </td>
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
                        <td className="text-primary">
                          <strong>Total</strong>
                        </td>
                        <td className="product-price-total text-primary">
                          <strong>{subtotal.toFixed(0)} $</strong>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <h4 className="widget-title">Paiement Mobile Money</h4>
                  <p className="text-muted small mb-3">
                    Choisissez votre opérateur, puis indiquez le numéro de téléphone associé au compte Mobile Money.
                  </p>
                  <div className="checkout-mobile-money-grid mb-3" role="group" aria-label="Opérateur Mobile Money">
                    {MOBILE_MONEY_METHODS.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        className={`checkout-mobile-money-card ${mobileOperator === opt.id ? 'is-selected' : ''}`}
                        onClick={() => setMobileOperator(opt.id)}
                        aria-pressed={mobileOperator === opt.id}
                        aria-label={opt.label}
                      >
                        <span className="checkout-mobile-money-card__logo">
                          <img src={opt.logoSrc} alt="" aria-hidden />
                        </span>
                        {/* <span className="checkout-mobile-money-card__label">{opt.shortLabel}</span> */}
                      </button>
                    ))}
                  </div>
                  {mobileOperator ? (
                    <div className="form-group mb-3">
                      <Form.Label>Numéro de téléphone Mobile Money (9 chiffres)</Form.Label>
                      <div className="d-flex gap-2 flex-wrap align-items-center" aria-label="Saisie du numéro Mobile Money">
                        <span
                          className="form-control text-center text-muted"
                          style={{ width: 72, backgroundColor: '#f8f9fa', pointerEvents: 'none' }}
                          aria-hidden
                        >
                          +243
                        </span>
                        {phoneDigits.map((digit, index) => (
                          <Form.Control
                            key={index}
                            ref={(el) => {
                              phoneInputRefs.current[index] = el;
                            }}
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => updatePhoneDigit(index, e.target.value)}
                            onKeyDown={(e) => handlePhoneDigitKeyDown(index, e)}
                            className="text-center"
                            style={{ width: 42, paddingLeft: 0, paddingRight: 0 }}
                            aria-label={`Chiffre ${index + 1} du numéro`}
                          />
                        ))}
                      </div>
                      <small className="text-muted d-block mt-2">Exemple : 820748672</small>
                    </div>
                  ) : null}

                  <div className="form-group">
                    <button
                      className="btn btn-primary btnhover w-100"
                      type="button"
                      disabled={placingOrder || isCartEmpty || !mobileOperator}
                      onClick={handlePlaceOrder}
                    >
                      {placingOrder ? 'Traitement…' : 'Passer la commande et payer'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default ShopCheckout;
