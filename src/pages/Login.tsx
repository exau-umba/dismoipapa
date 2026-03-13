import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

//Components 
import PageTitle from '../layouts/PageTitle';
import { loginUser, requestPasswordReset } from '../api/auth';

function Login() {
  const [forgotPass, setForgotPass] = useState<boolean>(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  // Si déjà connecté, on redirige vers le profil / mes livres
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      navigate('/my-profile');
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await loginUser(email, password);
      navigate('/my-books');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Échec de la connexion. Veuillez réessayer.");
      }
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
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Impossible d'envoyer l'e‑mail de réinitialisation.");
      }
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
                                              <div className="alert alert-danger py-2">
                                                {error}
                                              </div>
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
                                              <div className="alert alert-danger py-2">
                                                {error}
                                              </div>
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