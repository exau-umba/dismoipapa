import React from 'react';
import { Link } from 'react-router-dom';

import PageTitle from '../layouts/PageTitle';

function HelpDesk() {
    return (
        <>
            <div className="page-content">
                <PageTitle childPage="Centre d'aide" parentPage="Pages" />
                <div className="section-full content-inner-1 bg-white">
                    <div className="container">
                        <div className="row">
                            {/* <!-- Partie gauche --> */}
                            <div className="col-lg-8 col-md-7 col-sm-12 inner-text">
                                <h2 className="title">Help Desk</h2>
                                <p className="m-b30">
                                    Besoin d’aide ? Notre service d’assistance est là pour répondre à vos questions et vous accompagner, que ce soit dans l’utilisation du site ou dans la résolution d’un problème technique. N’hésitez pas à parcourir cette page pour trouver des conseils pratiques et nos principaux services.
                                </p>
                                <h4 className="title">Service d'urgence</h4>
                                <p>
                                    Si vous rencontrez une urgence relative à votre compte ou à une commande, contactez immédiatement notre équipe. Nous nous engageons à intervenir dans les plus brefs délais pour solutionner toute situation critique ou bloquante que vous pourriez rencontrer lors de votre navigation ou lors d'une transaction sur la plateforme.
                                </p>
                                <p className="m-b30">
                                    Pour une prise en charge rapide, munissez-vous de votre identifiant client et exposez clairement votre demande dans votre message.
                                </p>
                                <h4 className="title">Conseils</h4>
                                <ul className="list-check primary m-b30">
                                    <li>Pensez à consulter la FAQ pour trouver des réponses aux questions fréquentes.</li>
                                    <li>
                                        Assurez-vous que vos informations personnelles sont à jour pour une expérience optimale.
                                    </li>
                                    <li>
                                        En cas de problème d’accès, essayez de réinitialiser votre mot de passe avant de contacter l’assistance.
                                    </li>
                                    <li>
                                        Gardez précieusement vos preuves de paiement en cas de commande.
                                    </li>
                                    <li>
                                        N'hésitez pas à contacter le service client pour toute suggestion ou pour signaler un contenu inapproprié.
                                    </li>
                                    <li>
                                        Protégez vos informations de connexion et ne les partagez jamais avec des tiers.
                                    </li>
                                </ul>
                                <h4 className="title">Santé et sécurité</h4>
                                <p>
                                    La protection de vos données et la sécurité de vos transactions sont notre priorité. Nous mettons tout en œuvre pour assurer un environnement sécurisé, mais il est important de rester vigilant lors de la navigation sur Internet. Méfiez-vous des emails et messages suspects et ne cliquez pas sur les liens douteux.
                                </p>
                                <p className="m-b30">
                                    Si vous pensez que votre compte a été compromis, changez immédiatement votre mot de passe et contactez notre équipe d’assistance.
                                </p>
                                <h4 className="title">Notre aide</h4>
                                <ul className="list-check primary">
                                    <li>Réponses rapides à vos questions via notre formulaire de contact.</li>
                                    <li>Assistance technique pour toute difficulté sur le site ou lors d’un achat.</li>
                                    <li>Accompagnement pour la création et la gestion de compte utilisateur.</li>
                                    <li>Soutien pour vos démarches administratives liées à vos commandes ou abonnements.</li>
                                    <li>Écoute attentive pour recueillir vos suggestions d’amélioration.</li>
                                </ul>
                            </div>
                            <div className="col-lg-4 col-md-5 col-sm-12 m-b30 mt-md-0 mt-4">
                                <aside className="side-bar sticky-top right">
                                    <div className="service_menu_nav widget style-1">
                                        <ul className="menu">
                                            <li className="menu-item"><Link to={"/about-us"}>À propos</Link></li>
                                            <li className="menu-item"><Link to={"/privacy-policy"}>Politique de confidentialité</Link></li>
                                            <li className="menu-item active"><Link to={"/help-desk"}>Centre d'aide</Link></li>
                                            <li className="menu-item"><Link to={"/contact-us"}>Contactez-nous</Link></li>
                                        </ul>
                                    </div>
                                </aside>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default HelpDesk;