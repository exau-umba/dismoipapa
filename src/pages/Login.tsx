import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

//Components 
import PageTitle from '../layouts/PageTitle';
import ErrorMessage from '../components/ErrorMessage';
import { getCurrentUser, loginUser, requestPasswordReset } from '../api/auth';
import { getFriendlyErrorMessage } from '../utils/errorMessages';

/** Chemins internes autorisés pour la redirection après connexion */
const ALLOWED_NEXT_PATHS = ['/my-profile', '/my-books', '/my-orders', '/shop-cart', '/wishlist', '/shop-checkout', '/confirmation-paiement', '/admin'];

function getRedirectPath(next: string | null): string {
  if (!next) return '/my-profile';
  try {
    const path = decodeURIComponent(next);
    if (!path.startsWith('/')) return '/my-profile';
    const allowed = ALLOWED_NEXT_PATHS.some(
      (p) => path === p || path.startsWith(p + '?') || path.startsWith(p + '/')
    );
    if (allowed) return path;
  } catch {
    // ignore invalid next
  }
  return '/my-profile';
}

/** Détermine la page de redirection après connexion : admin -> /admin, sinon next ou /my-profile */
async function getRedirectAfterLogin(next: string | null): Promise<string> {
  try {
    const user = await getCurrentUser();
    if (user?.is_staff) return '/admin';
  } catch {
    // token invalide ou API indisponible, on utilise next
  }
  return getRedirectPath(next);
}

function Login() {
  const [forgotPass, setForgotPass] = useState<boolean>(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const nextParam = searchParams.get('next');

  // Si déjà connecté, on redirige : admin -> /admin, sinon page demandée ou profil
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    getRedirectAfterLogin(nextParam).then((path) => {
      navigate(path, { replace: true });
    });
  }, [navigate, nextParam]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await loginUser(email, password);
      const path = await getRedirectAfterLogin(nextParam);
      navigate(path, { replace: true });
    } catch (err) {
      setError(getFriendlyErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setResetMessage(null);
    setError(null);
    try {
      await requestPasswordReset(resetEmail);
      setResetMessage(
        "Si un compte existe avec cet e‑mail, un lien de réinitialisation vous a été envoyé."
      );
    } catch (err) {
      setError(getFriendlyErrorMessage(err));
    }
  };

  return(
        <>
            <div className="page-content">
                <PageTitle  parentPage="Boutique" childPage="Connexion" />               
                <section className="content-inner shop-account">                    
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-6 col-md-6 mb-4">
                                <div className="login-area">
                                    <div className="tab-content">
                                        <h4>NOUVEAU CLIENT</h4>
                                        <p>En créant un compte, vous pourrez passer commande plus rapidement, enregistrer plusieurs adresses, suivre vos commandes et plus encore.</p>
                                        <Link to={"/shop-registration"} className="btn btn-primary btnhover m-r5 button-lg radius-no">CRÉER UN COMPTE</Link>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6 mb-4">
                                <div className="login-area">
                                    <div className="tab-content nav">
                                        <form onSubmit={handleLogin} className={` col-12 ${forgotPass ? 'd-none' : ''}`}>
                                            <h4 className="text-primary">CONNEXION</h4>
                                            <p className="font-weight-600">Si vous avez déjà un compte, connectez-vous.</p>
                                            {error && !forgotPass && (
                                              <ErrorMessage message={error} onDismiss={() => setError(null)} className="mb-3" />
                                            )}
                                            <div className="mb-4">
                                                <label className="label-title">E-MAIL *</label>
                                                <input
                                                  name="email"
                                                  required={true}
                                                  className="form-control"
                                                  placeholder="Votre adresse e-mail"
                                                  type="email"
                                                  value={email}
                                                  onChange={(e) => setEmail(e.target.value)}
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label className="label-title">MOT DE PASSE *</label>
                                                <input
                                                  name="password"
                                                  required={true}
                                                  className="form-control "
                                                  placeholder="Votre mot de passe"
                                                  type="password"
                                                  value={password}
                                                  onChange={(e) => setPassword(e.target.value)}
                                                />
                                            </div>
                                            <div className="text-left">
                                                <button type="submit" className="btn btn-primary btnhover me-2" disabled={loading}>
                                                  {loading ? 'Connexion…' : 'Connexion'}
                                                </button>
                                                <Link to={"#"}  className="m-l5"
                                                    onClick={()=>setForgotPass((prev) => !prev)}
                                                >
                                                    <i className="fas fa-unlock-alt"></i> Mot de passe oublié
                                                </Link> 
                                            </div>
                                        </form>
                                        <form  onSubmit={handleForgotPassword} className={`  col-12 ${forgotPass ? '' : 'd-none'}`} >
                                            <h4 className="text-secondary">MOT DE PASSE OUBLIÉ ?</h4>
                                            <p className="font-weight-600">Nous vous enverrons un e-mail pour réinitialiser votre mot de passe.</p>
                                            {error && forgotPass && (
                                              <ErrorMessage message={error} onDismiss={() => setError(null)} className="mb-3" />
                                            )}
                                            {resetMessage && (
                                              <div className="alert alert-success py-2">
                                                {resetMessage}
                                              </div>
                                            )}
                                            <div className="mb-3">
                                                <label className="label-title">E-MAIL *</label>
                                                <input
                                                  name="resetEmail"
                                                  required={true}
                                                  className="form-control"
                                                  placeholder="Votre adresse e-mail"
                                                  type="email"
                                                  value={resetEmail}
                                                  onChange={(e) => setResetEmail(e.target.value)}
                                                />
                                            </div>
                                            <div className="text-left"> 
                                                <Link to={"#"} className="btn btn-outline-secondary btnhover m-r10 active"
                                                    onClick={()=>setForgotPass((prev) => !prev)}
                                                >Retour</Link>
                                                <button type="submit" className="btn btn-primary btnhover">Envoyer</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>                    
                </section>
            </div>
        </>
    )
}
export default Login;