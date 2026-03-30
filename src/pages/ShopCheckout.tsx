import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Collapse, Form, Modal, Toast, ToastContainer, Button } from 'react-bootstrap';
import PageTitle from '../layouts/PageTitle';
import { useCart } from '../context/CartContext';
import { getBook } from '../api/catalog';
import { createOrder, getMyOrder, requestWonyapayPayment } from '../api/orders';
import { getFriendlyErrorMessage } from '../utils/errorMessages';
import ErrorMessage from '../components/ErrorMessage';
import { MOBILE_MONEY_METHODS, type MobileMoneyOperatorId } from '../components/PaymentMethodsBlock';

/** Deux chiffres après le 0 initial (ex. 081… → 81). */
const OPERATOR_PREFIXES: Record<MobileMoneyOperatorId, readonly string[]> = {
  vodacom: ['81', '82', '83', '88'],
  orange: ['80', '84', '85', '89'],
  airtel: ['99', '97', '98', '96'],
  africell: ['90', '91'],
};

const OPERATOR_LABEL: Record<MobileMoneyOperatorId, string> = {
  vodacom: 'M-Pesa (Vodacom)',
  orange: 'Orange Money',
  airtel: 'Airtel Money',
  africell: 'Afrimoney (Africell)',
};

type CheckoutToast = {
  id: number;
  message: string;
  variant: 'danger' | 'success' | 'warning';
};

type WonyaModalPhase = 'waiting' | 'success' | 'failed' | 'timeout';

function normalizePaymentStatus(raw: unknown): string {
  return String(raw ?? '').trim();
}

function ShopCheckout() {
  const navigate = useNavigate();

  const [accordBtn, setAccordBtn] = useState(false);
  const { items: orderItems, subtotal, clearCart } = useCart();
  const formatLabel = (f: 'pdf' | 'epub' | null) => (f === 'pdf' ? 'PDF' : f === 'epub' ? 'EPUB' : '');
  const hasPhysical = orderItems.some((i) => i.productType === 'physical');
  const [placingOrder, setPlacingOrder] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
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
  const [mobileOperator, setMobileOperator] = useState<MobileMoneyOperatorId | ''>('');
  const [mobilePhone, setMobilePhone] = useState('');
  const phoneInputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [showWonyaModal, setShowWonyaModal] = useState(false);
  const [wonyaPhase, setWonyaPhase] = useState<WonyaModalPhase>('waiting');
  const [wonyaOrderId, setWonyaOrderId] = useState<string | null>(null);
  const [wonyaPollNonce, setWonyaPollNonce] = useState(0);
  /** Opérateur au moment du paiement (affichage modal après vidage du contexte éventuel). */
  const [paymentModalOperator, setPaymentModalOperator] = useState<MobileMoneyOperatorId | null>(null);

  const isCartEmpty = orderItems.length === 0;

  useEffect(() => {
    setMobilePhone('');
  }, [mobileOperator]);

  const phoneDigits = useMemo(() => {
    const digits = mobilePhone.replace(/\D/g, '').slice(0, 10);
    return Array.from({ length: 10 }, (_, i) => digits[i] ?? '');
  }, [mobilePhone]);

  const paymentDigits = useMemo(() => phoneDigits.join(''), [phoneDigits]);

  const updatePhoneDigit = (index: number, raw: string) => {
    let digit = raw.replace(/\D/g, '').slice(-1);
    if (index === 0 && digit !== '' && digit !== '0') {
      return;
    }
    const next = [...phoneDigits];
    next[index] = digit;
    setMobilePhone(next.join(''));
    if (digit && index < 9) {
      phoneInputRefs.current[index + 1]?.focus();
    }
  };

  const handlePhoneDigitKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !phoneDigits[index] && index > 0) {
      e.preventDefault();
      phoneInputRefs.current[index - 1]?.focus();
    }
  };

  useEffect(() => {
    if (!showWonyaModal || !wonyaOrderId || wonyaPhase !== 'waiting') return;

    let cancelled = false;
    const deadline = Date.now() + 120_000;
    const orderId = wonyaOrderId;

    const pollOnce = async () => {
      if (cancelled) return;
      try {
        const o = await getMyOrder(orderId);
        if (cancelled) return;
        const status = normalizePaymentStatus(o.payment_status);
        if (status === 'Paid') {
          setWonyaPhase('success');
          return;
        }
        if (status === 'Failed' || status === 'Cancelled') {
          setWonyaPhase('failed');
          return;
        }
        if (Date.now() > deadline) {
          setWonyaPhase('timeout');
        }
      } catch {
        if (!cancelled && Date.now() > deadline) {
          setWonyaPhase('timeout');
        }
      }
    };

    const iv = window.setInterval(() => {
      void pollOnce();
    }, 3000);
    void pollOnce();

    return () => {
      cancelled = true;
      window.clearInterval(iv);
    };
  }, [showWonyaModal, wonyaOrderId, wonyaPhase, wonyaPollNonce]);

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

  const validateCheckout = (): string | null => {
    if (isCartEmpty) return 'Votre panier est vide.';
    if (!hasPhysical) return null;
    const requiredFields: Array<keyof typeof billing> = [
      'firstName',
      'lastName',
      'address1',
      'city',
      'region',
      // 'postalCode',
      'email',
      'phone',
    ];
    const missing = requiredFields.find((k) => !billing[k].trim());
    if (missing) return 'Veuillez compléter toutes les informations de livraison requises.';
    return null;
  };

  function validatePaymentPhone(): string | null {
    if (!mobileOperator) {
      return 'Veuillez choisir votre opérateur Mobile Money.';
    }
    if (paymentDigits.length !== 10) {
      return 'Remplissez les 10 cases du numéro (sans indicatif pays).';
    }
    if (paymentDigits[0] !== '0') {
      return 'Le numéro doit commencer par 0.';
    }
    const pair = paymentDigits.slice(1, 3);
    const allowed = OPERATOR_PREFIXES[mobileOperator as MobileMoneyOperatorId];
    if (!allowed.includes(pair)) {
      return `Pour ${OPERATOR_LABEL[mobileOperator as MobileMoneyOperatorId]}, après le 0 le numéro doit commencer par l’un de ces couples : ${allowed.join(', ')}.`;
    }
    return null;
  }

  const paymentPrefixInvalid =
    Boolean(mobileOperator) &&
    paymentDigits.length === 10 &&
    paymentDigits[0] === '0' &&
    !OPERATOR_PREFIXES[mobileOperator as MobileMoneyOperatorId].includes(paymentDigits.slice(1, 3));

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
    const phoneErr = validatePaymentPhone();
    if (phoneErr) {
      setCheckoutError(phoneErr);
      pushToast(phoneErr, 'warning');
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
      if (!createdOrder?.id) {
        throw new Error('Impossible de créer la commande.');
      }

      await requestWonyapayPayment({
        order_id: createdOrder.id,
        phone: paymentDigits,
      });

      clearCart();
      setPaymentModalOperator(mobileOperator as MobileMoneyOperatorId);
      setWonyaOrderId(createdOrder.id);
      setWonyaPhase('waiting');
      setWonyaPollNonce((n) => n + 1);
      setShowWonyaModal(true);
      pushToast('Demande de paiement envoyée. Vérifiez votre téléphone.', 'success');
    } catch (err) {
      const msg = getFriendlyErrorMessage(err);
      setCheckoutError(msg);
      pushToast(msg, 'danger');
    } finally {
      setPlacingOrder(false);
    }
  };

  const closeWonyaModal = () => {
    setShowWonyaModal(false);
    setWonyaOrderId(null);
    setWonyaPhase('waiting');
    setPaymentModalOperator(null);
  };

  const modalOperatorMeta = paymentModalOperator
    ? MOBILE_MONEY_METHODS.find((o) => o.id === paymentModalOperator)
    : undefined;

  const handleRefreshPolling = () => {
    setWonyaPhase('waiting');
    setWonyaPollNonce((n) => n + 1);
  };

  return (
    <>
      <Modal show={showWonyaModal} onHide={() => {}} backdrop="static" keyboard={false} centered>
        <Modal.Header
          closeButton={false}
          className="border-0 pb-0 d-flex flex-column align-items-center text-center gap-2"
        >
          {modalOperatorMeta ? (
            <div className="checkout-mobile-money-card__logo mb-1" style={{ maxWidth: 160 }}>
              <img src={modalOperatorMeta.logoSrc} alt="" aria-hidden />
            </div>
          ) : null}
          <Modal.Title as="h5" className="w-100 mb-0">
            {wonyaPhase === 'success'
              ? 'Paiement confirmé'
              : wonyaPhase === 'failed'
                ? 'Paiement échoué ou annulé'
                : wonyaPhase === 'timeout'
                  ? 'En attente de confirmation'
                  : 'Confirmez votre paiement'}
          </Modal.Title>
          {modalOperatorMeta ? (
            <p className="text-muted small mb-0">{modalOperatorMeta.label}</p>
          ) : null}
        </Modal.Header>
        <Modal.Body className="text-center">
          {wonyaPhase === 'waiting' && (
            <>
              <p className="mb-3">
                Vous allez recevoir une <strong>notification</strong> sur votre téléphone. Saisissez votre{' '}
                <strong>code</strong> pour confirmer le paiement.
              </p>
              <p className="text-muted small mb-3">
                Nous vérifions automatiquement le statut de votre commande…
              </p>
              <div className="spinner-border text-primary" role="status" aria-label="Vérification en cours">
                <span className="visually-hidden">Vérification…</span>
              </div>
            </>
          )}
          {wonyaPhase === 'success' && (
            <>
              <p className="text-success mb-4">Votre paiement a bien été enregistré.</p>
              <div className="d-flex flex-column gap-2">
                <Button variant="primary" onClick={() => navigate('/my-books')}>
                  Télécharger / Mes livres
                </Button>
                <Button variant="outline-secondary" onClick={() => navigate('/my-orders')}>
                  Voir ma commande
                </Button>
                <Button variant="link" className="text-muted" onClick={closeWonyaModal}>
                  Fermer
                </Button>
              </div>
            </>
          )}
          {wonyaPhase === 'failed' && (
            <>
              <p className="text-danger mb-4">
                Le paiement n’a pas abouti ou a été annulé. Vous pouvez réessayer depuis le paiement ou consulter vos
                commandes.
              </p>
              <div className="d-flex flex-column gap-2">
                <Button variant="primary" onClick={() => { closeWonyaModal(); navigate('/shop-checkout'); }}>
                  Réessayer le paiement
                </Button>
                <Button variant="outline-secondary" onClick={() => navigate('/my-orders')}>
                  Mes commandes
                </Button>
              </div>
            </>
          )}
          {wonyaPhase === 'timeout' && (
            <>
              <p className="mb-4">
                Le statut reste <strong>en attente</strong>. La confirmation peut prendre un peu plus de temps côté
                opérateur.
              </p>
              <div className="d-flex flex-column gap-2">
                <Button variant="primary" onClick={handleRefreshPolling}>
                  Rafraîchir
                </Button>
                <Button variant="outline-secondary" onClick={() => navigate('/my-orders')}>
                  Voir mes commandes
                </Button>
                <Button variant="link" className="text-muted" onClick={closeWonyaModal}>
                  Fermer
                </Button>
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>

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

                  <h4 className="widget-title">Paiement</h4>
                  <p className="text-black-50 small mb-3">
                    Choisissez votre opérateur, puis saisissez votre numéro en <strong>10 chiffres</strong> (sans +243) :
                    le premier chiffre est toujours <strong>0</strong>, les deux suivants doivent correspondre à votre
                    opérateur. Une notification vous demandera ensuite votre code.
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
                      </button>
                    ))}
                  </div>
                  {mobileOperator ? (
                    <div className="form-group mb-3">
                      <Form.Label>
                        Numéro {OPERATOR_LABEL[mobileOperator]} (10 chiffres, préfixes valides après 0 :{' '}
                        {OPERATOR_PREFIXES[mobileOperator].join(', ')})
                      </Form.Label>
                      <div className="checkout-phone-digits checkout-phone-digits--10" aria-label="Saisie du numéro">
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
                            className="text-center checkout-phone-digit"
                            aria-label={`Chiffre ${index + 1} sur 10`}
                            disabled={!mobileOperator}
                          />
                        ))}
                      </div>
                      <small className={`d-block mt-2 ${paymentPrefixInvalid ? 'text-danger' : 'text-black-50'}`}>
                        {paymentPrefixInvalid
                          ? `Ce début de numéro ne correspond pas à ${OPERATOR_LABEL[mobileOperator]}.`
                          : `${paymentDigits.length}/10 — premier chiffre : 0 uniquement.`}
                      </small>
                    </div>
                  ) : (
                    <p className="text-muted small mb-3 mb-0">Sélectionnez d’abord un opérateur pour saisir le numéro.</p>
                  )}
                  <div className="form-group">
                    <button
                      className="btn btn-primary btnhover w-100"
                      type="button"
                      disabled={
                        placingOrder ||
                        isCartEmpty ||
                        !mobileOperator ||
                        paymentDigits.length !== 10 ||
                        paymentPrefixInvalid ||
                        paymentDigits[0] !== '0'
                      }
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
