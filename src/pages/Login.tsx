import React,{useState} from 'react';
import {Link} from 'react-router-dom';

//Components 
import PageTitle from '../layouts/PageTitle';

function Login(){
    const [forgotPass, setForgotPass] = useState<boolean>(false);
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
                                        <form onSubmit={(e) => e.preventDefault()} className={` col-12 ${forgotPass ? 'd-none' : ''}`}>
                                            <h4 className="text-secondary">CONNEXION</h4>
                                            <p className="font-weight-600">Si vous avez déjà un compte, connectez-vous.</p>
                                            <div className="mb-4">
                                                <label className="label-title">E-MAIL *</label>
                                                <input name="dzName" required={true} className="form-control" placeholder="Votre adresse e-mail" type="email" />
                                            </div>
                                            <div className="mb-4">
                                                <label className="label-title">MOT DE PASSE *</label>
                                                <input name="dzName" required={true} className="form-control " placeholder="Votre mot de passe" type="password" />
                                            </div>
                                            <div className="text-left">
                                                <button type="submit" className="btn btn-primary btnhover me-2">Connexion</button>
                                                <Link to={"#"}  className="m-l5"
                                                    onClick={()=>setForgotPass((prev) => !prev)}
                                                >
                                                    <i className="fas fa-unlock-alt"></i> Mot de passe oublié
                                                </Link> 
                                            </div>
                                        </form>
                                        <form  onSubmit={(e) => e.preventDefault()} className={`  col-12 ${forgotPass ? '' : 'd-none'}`} >
                                            <h4 className="text-secondary">MOT DE PASSE OUBLIÉ ?</h4>
                                            <p className="font-weight-600">Nous vous enverrons un e-mail pour réinitialiser votre mot de passe.</p>
                                            <div className="mb-3">
                                                <label className="label-title">E-MAIL *</label>
                                                <input name="dzName" required={true} className="form-control" placeholder="Votre adresse e-mail" type="email" />
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