import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { activateAccount } from '../api/auth';
import PageTitle from '../layouts/PageTitle';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const ActivateAccount = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const token = query.get('token');
    if (!token) {
      setStatus('error');
      setMessage('Lien d’activation invalide ou incomplet.');
      return;
    }
    setStatus('loading');
    activateAccount(token)
      .then((res) => {
        setStatus('success');
        setMessage(
          res.detail ||
            'Votre compte a été activé avec succès. Vous pouvez maintenant vous connecter.',
        );
      })
      .catch((err) => {
        setStatus('error');
        if (err instanceof Error) {
          setMessage(err.message);
        } else {
          setMessage(
            'Impossible d’activer votre compte. Le lien est peut‑être expiré ou déjà utilisé.',
          );
        }
      });
  }, [query]);

  const handleGoToLogin = () => {
    navigate('/shop-login');
  };

  return (
    <div className="page-content">
      <PageTitle parentPage="Compte" childPage="Activation" />
      <section className="content-inner shop-account">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6 col-md-8">
              <div className="login-area text-center">
                {status === 'loading' && (
                  <>
                    <h4 className="text-secondary mb-3">Activation de votre compte…</h4>
                    <p>Merci de patienter pendant que nous validons votre lien.</p>
                  </>
                )}
                {status === 'success' && (
                  <>
                    <h4 className="text-success mb-3">Compte activé</h4>
                    <p>{message}</p>
                    <button
                      type="button"
                      className="btn btn-primary btnhover mt-3"
                      onClick={handleGoToLogin}
                    >
                      Aller à la page de connexion
                    </button>
                  </>
                )}
                {status === 'error' && (
                  <>
                    <h4 className="text-danger mb-3">Erreur d’activation</h4>
                    <p>{message}</p>
                    <p className="mt-2">
                      Si le problème persiste, vous pouvez demander un nouveau lien d’activation
                      via la page de connexion.
                    </p>
                    <Link to="/shop-login" className="btn btn-primary btnhover mt-3">
                      Retour à la connexion
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ActivateAccount;

