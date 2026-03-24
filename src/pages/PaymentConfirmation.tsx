import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PageTitle from '../layouts/PageTitle';

export type PaymentConfirmationState = {
  orderNumber?: string;
  mobileOperator?: string;
};

function PaymentConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state as PaymentConfirmationState | null) ?? {};

  React.useEffect(() => {
    if (!state.orderNumber) {
      navigate('/books-grid-view', { replace: true });
    }
  }, [state.orderNumber, navigate]);

  if (!state.orderNumber) {
    return null;
  }

  const refLabel = state.orderNumber;

  return (
    <>
      <div className="page-content">
        <PageTitle parentPage="Boutique" childPage="Paiement confirmé" />
        <section className="content-inner shop-account">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8 text-center py-5">
                <div className="mb-4 text-success" style={{ fontSize: '4rem' }} aria-hidden>
                  <i className="fa fa-check-circle" />
                </div>
                <h2 className="mb-3">Paiement enregistré</h2>
                <p className="text-black-50 lead mb-4">
                  Votre commande {refLabel ? <strong>{refLabel}</strong> : ''} a bien été prise en compte.
                  Les livres numériques sont disponibles dans votre espace personnel.
                </p>
                <p className="text-black-50 mb-4">
                  Rendez-vous dans <strong>Mon profil</strong>, puis <strong>Mes livres</strong> pour consulter,
                  lire ou télécharger vos achats.
                </p>
                <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center">
                  <Link to="/my-books" className="btn btn-primary btnhover">
                    Mes livres
                  </Link>
                  {/* <Link to="/my-profile" className="btn btn-outline-primary btnhover">
                    Mon profil
                  </Link> */}
                  <Link to="/books-grid-view" className="btn btn-outline-secondary btnhover">
                    Continuer les achats
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default PaymentConfirmation;
