import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import PageTitle from './../layouts/PageTitle';
import ErrorMessage from '../components/ErrorMessage';
import { changePassword, getCurrentUser, updateCurrentUser, type UserProfile } from '../api/auth';
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

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

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

  useEffect(() => {
    if (!user) return;
    setFullName(user.full_name || '');
    setPhoneNumber(user.phone_number || '');
    setShippingAddress(user.shipping_address || '');
  }, [user]);

  const userInitial =
    (user?.full_name?.trim() || user?.email?.trim() || '?').charAt(0).toUpperCase();

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSavingProfile(true);
    setProfileError(null);
    setProfileSuccess(null);
    try {
      const updated = await updateCurrentUser({
        full_name: fullName.trim(),
        phone_number: phoneNumber.trim(),
        shipping_address: shippingAddress.trim(),
        is_subscriber: user.is_subscriber,
      });
      setUser(updated);
      setProfileSuccess('Informations mises à jour avec succès.');
    } catch (err) {
      setProfileError(getFriendlyErrorMessage(err));
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    setSavingPassword(true);
    setPasswordError(null);
    setPasswordSuccess(null);
    try {
      if (newPassword !== confirmPassword) {
        setPasswordError('Les deux nouveaux mots de passe ne correspondent pas.');
        return;
      }
      if (oldPassword.trim().length === 0) {
        setPasswordError('Veuillez saisir l’ancien mot de passe.');
        return;
      }
      if (newPassword.trim().length === 0) {
        setPasswordError('Veuillez saisir le nouveau mot de passe.');
        return;
      }

      await changePassword(user.id, {
        old_password: oldPassword,
        new_password: newPassword,
      });

      setPasswordSuccess('Mot de passe mis à jour avec succès.');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError(getFriendlyErrorMessage(err));
    } finally {
      setSavingPassword(false);
    }
  }

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
                  <h3 className="title m-b20" id="informations-personnelles">
                    Informations personnelles
                  </h3>

                  <form onSubmit={handleSaveProfile}>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Nom complet</label>
                          <input
                            type="text"
                            className="form-control"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Votre nom"
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
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="Votre téléphone"
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Adresse de livraison</label>
                          <input
                            type="text"
                            className="form-control"
                            value={shippingAddress}
                            onChange={(e) => setShippingAddress(e.target.value)}
                            placeholder="Adresse"
                          />
                        </div>
                      </div>
                    </div>

                    {profileError && (
                      <div className="text-danger small mb-2">{profileError}</div>
                    )}
                    {profileSuccess && (
                      <div className="text-success small mb-2">{profileSuccess}</div>
                    )}

                    <div className="d-flex justify-content-end gap-2 mt-2">
                      <button
                        type="submit"
                        className="btn btn-primary btnhover"
                        disabled={savingProfile || !user}
                      >
                        {savingProfile ? 'Enregistrement…' : 'Enregistrer'}
                      </button>
                    </div>
                  </form>

                  <h3 className="title m-b20 mt-4" id="change-password">
                    Changer mot de passe
                  </h3>

                  <form onSubmit={handleChangePassword}>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Ancien mot de passe</label>
                          <input
                            type="password"
                            className="form-control"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Nouveau mot de passe</label>
                          <input
                            type="password"
                            className="form-control"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Confirmer le nouveau mot de passe</label>
                          <input
                            type="password"
                            className="form-control"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    {passwordError && (
                      <div className="text-danger small mb-2">{passwordError}</div>
                    )}
                    {passwordSuccess && (
                      <div className="text-success small mb-2">{passwordSuccess}</div>
                    )}

                    <div className="d-flex justify-content-end gap-2 mt-2">
                      <button
                        type="submit"
                        className="btn btn-outline-primary btnhover"
                        disabled={savingPassword || !user}
                      >
                        {savingPassword ? 'Mise à jour…' : 'Changer'}
                      </button>
                    </div>
                  </form>
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

