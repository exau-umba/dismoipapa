import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

//Components 
import PageTitle from '../layouts/PageTitle';
import ErrorMessage from '../components/ErrorMessage';
import { registerUser } from '../api/auth';
import { getFriendlyErrorMessage } from '../utils/errorMessages';

function Registration(){
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [shippingAddress, setShippingAddress] = useState('');
    const [isSubscriber, setIsSubscriber] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const navigate = useNavigate();

    // Si déjà connecté, on redirige vers le profil
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            navigate('/my-profile');
        }
    }, [navigate]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);
        try {
            await registerUser({
                email,
                password,
                full_name: fullName,
                phone_number: phoneNumber,
                shipping_address: shippingAddress,
                is_subscriber: isSubscriber,
            });
            setSuccess("Votre compte a été créé. Veuillez vérifier votre e‑mail pour l'activer.");
            // Rediriger vers la page de connexion après un court délai
            setTimeout(() => navigate('/shop-login'), 2000);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Échec de l'inscription. Veuillez réessayer.");
            }
        } finally {
            setLoading(false);
        }
    };

    return(
        <>
            <div className="page-content">
                <PageTitle  parentPage="Boutique" childPage="Inscription" />               
                <section className="content-inner shop-account">
				
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-lg-6 col-md-6 mb-4">
                                <div className="login-area">
                                    <form onSubmit={handleSubmit}> 
                                        <h4 className="text-primary">Inscription</h4>
                                        <p className="font-weight-600">Si vous n'avez pas encore de compte, créez-en un.</p>
                                        {error && (
                                          <ErrorMessage message={error} onDismiss={() => setError(null)} className="mb-3" />
                                        )}
                                        {success && (
                                          <div className="alert alert-success py-2">
                                            {success}
                                          </div>
                                        )}
                                        <div className="mb-4">
                                            <label className="label-title">Nom complet *</label>
                                            <input
                                              name="fullName"
                                              required={true}
                                              className="form-control"
                                              placeholder="Votre nom complet"
                                              type="text"
                                              value={fullName}
                                              onChange={(e) => setFullName(e.target.value)}
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="label-title">Adresse e-mail *</label>
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
                                            <label className="label-title">Mot de passe *</label>
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
                                        <div className="mb-4">
                                            <label className="label-title">Numéro de téléphone</label>
                                            <input
                                              name="phone"
                                              className="form-control"
                                              placeholder="Votre numéro de téléphone"
                                              type="tel"
                                              value={phoneNumber}
                                              onChange={(e) => setPhoneNumber(e.target.value)}
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="label-title">Adresse de livraison</label>
                                            <textarea
                                              name="shippingAddress"
                                              className="form-control"
                                              placeholder="Votre adresse de livraison"
                                              rows={3}
                                              value={shippingAddress}
                                              onChange={(e) => setShippingAddress(e.target.value)}
                                            />
                                        </div>
                                        {/* <div className="mb-4 form-check">
                                            <input
                                              id="isSubscriber"
                                              type="checkbox"
                                              className="form-check-input"
                                              checked={isSubscriber}
                                              onChange={(e) => setIsSubscriber(e.target.checked)}
                                            />
                                            <label className="form-check-label" htmlFor="isSubscriber">
                                              Je souhaite recevoir les nouveautés et offres (abonnement newsletter)
                                            </label>
                                        </div> */}
                                        <div className="mb-5">
                                            <small>Vos données personnelles sont utilisées pour gérer votre compte et améliorer votre expérience, conformément à notre <Link to={"/privacy-policy"}>politique de confidentialité</Link>.</small>
                                        </div>
                                        <div className="text-left">
                                            <button type="submit" className="btn btn-primary btnhover w-100 me-2" disabled={loading}>
                                              {loading ? "Inscription en cours..." : "S'inscrire"}
                                            </button>
                                        </div>
                                    </form>
                                        <div className="text-center mt-3">
                                            <Link to={"/shop-login"} className="me-2 btn-link">
                                                Vous avez déjà un compte ? Se connecter
                                            </Link>
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
export default Registration;