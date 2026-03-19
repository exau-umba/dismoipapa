import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import PageTitle from './../layouts/PageTitle';
import ErrorMessage from '../components/ErrorMessage';
import { getCurrentUser, type UserProfile } from '../api/auth';
import { getFriendlyErrorMessage } from '../utils/errorMessages';

const profilePages = [
  { to: '/my-books', icons: 'fa fa-book', name: 'Mes Livres' },
  { to: '/my-orders', icons: 'fa fa-shopping-cart', name: 'Mes commandes' },
  { to: '/shop-cart', icons: 'fa fa-shopping-cart', name: 'Panier' },
  { to: '/shop-checkout', icons: 'fa fa-credit-card', name: 'Paiement' },
];

function MyProfile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/shop-login');
      return;
    }
    setLoading(true);
    getCurrentUser()
      .then((u) => {
        setUser(u);
      })
      .catch((err) => {
        console.error(err);
        setError("Impossible de charger votre profil. Veuillez vous reconnecter.");
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const userInitial =
    (user?.full_name?.trim() || user?.email?.trim() || '?').charAt(0).toUpperCase();

  return (
    <>
      <div className="page-content">
        <PageTitle parentPage="Pages" childPage="Mon profil" />
        <section className="content-inner-1">
          <div className="container">
            {loading && (
              <div className="row">
                <div className="col-12 text-center py-5">
                  <p>Chargement du profil…</p>
                </div>
              </div>
            )}
            {error && !loading && (
              <div className="row">
                <div className="col-12">
                  <ErrorMessage message={error} onDismiss={() => setError(null)} className="mb-3" />
                </div>
              </div>
            )}
            <div className="row">
              <div className="col-lg-4 col-md-5">
                <div className="profile-box">
                  <div className="profile-img">
                    <div
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        backgroundColor: '#1a1668',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 32,
                        fontWeight: 600,
                        // margin: '0 auto',
                      }}
                    >
                      {userInitial}
                    </div>
                  </div>
                  <div className="profile-info">
                    <h4 className="title">
                      {user?.full_name || 'Lecteur'}
                    </h4>
                    <p className="text-muted">{user?.email || ''}</p>
                  </div>
                  <ul className="profile-menu">
                    {profilePages.map((item, i) => (
                      <li key={i}>
                        <Link to={item.to}>
                          <i className={item.icons}></i> {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="col-lg-8 col-md-7">
                <div className="profile-content">
                  <h3 className="title m-b20">Informations personnelles</h3>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Nom complet</label>
                        <input
                          type="text"
                          className="form-control"
                          value={user?.full_name || ''}
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Adresse e-mail</label>
                        <input
                          type="email"
                          className="form-control"
                          value={user?.email || ''}
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Téléphone</label>
                        <input
                          type="text"
                          className="form-control"
                          value={user?.phone_number || ''}
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Adresse de livraison</label>
                        <input
                          type="text"
                          className="form-control"
                          value={user?.shipping_address || ''}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default MyProfile;

