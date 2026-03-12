import React from 'react';
import {Link} from 'react-router-dom';

//Components 
import PageTitle from '../layouts/PageTitle';

function Registration(){
    return(
        <>
            <div className="page-content">
                <PageTitle  parentPage="Boutique" childPage="Inscription" />               
                <section className="content-inner shop-account">
				
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-lg-6 col-md-6 mb-4">
                                <div className="login-area">
                                    <form onSubmit={(e) => e.preventDefault()}> 
                                        <h4 className="text-secondary">Inscription</h4>
                                        <p className="font-weight-600">Si vous n'avez pas encore de compte, créez-en un.</p>
                                        <div className="mb-4">
                                            <label className="label-title">Nom d'utilisateur *</label>
                                            <input name="dzName" required={true} className="form-control" placeholder="Votre nom d'utilisateur" type="text" />
                                        </div>
                                        <div className="mb-4">
                                            <label className="label-title">Adresse e-mail *</label>
                                            <input name="dzName" required={true} className="form-control" placeholder="Votre adresse e-mail" type="email" />
                                        </div>
                                        <div className="mb-4">
                                            <label className="label-title">Mot de passe *</label>
                                            <input name="dzName" required={true} className="form-control " placeholder="Votre mot de passe" type="password" />
                                        </div>
                                        <div className="mb-5">
                                            <small>Vos données personnelles sont utilisées pour gérer votre compte et améliorer votre expérience, conformément à notre <Link to={"/privacy-policy"}>politique de confidentialité</Link>.</small>
                                        </div>
                                        <div className="text-left">
                                            <button type="submit" className="btn btn-primary btnhover w-100 me-2">S'inscrire</button>
                                        </div>
                                    </form>
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