import React from 'react';
import {Link} from 'react-router-dom';

import { aboutImages } from '../constants/imageUrls';
import logoWhite from './../assets/images/logo-white.png';

//layouts
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
//Components 
import HomeMainSlider2 from '../components/Home2/HomeMainSlider2';
// import ClientsSlider from '../components/Home/ClientsSlider';
// import RecomendedSlider from '../components/Home/RecomendedSlider';
// import BookSaleSlider from '../components/Home/BookSaleSlider';
import CustomerSlider from '../components/Home2/CustomerSlider';
// import OfferSlider from '../components/Home/OfferSlider';
import CounterSection from '../elements/CounterSection';
import NewsLetter from '../components/NewsLetter';
import ClientsSlider from '../components/Home/ClientsSlider';

const iconBlog = [
    {title:'Livraison rapide', iconClass:'flaticon-power'}, 
    {title:'Paiement sécurisé', iconClass:'flaticon-shield '}, 
    {title:'Meilleure qualité', iconClass:'flaticon-like'}, 
    {title:'Satisfait ou remboursé', iconClass:'flaticon-star'}, 
];

const missionBlog = [
    {iconClass:'flaticon-open-book-1', title:'Meilleure librairie' },
    {iconClass:'flaticon-exclusive', title:'Vendeur de confiance' },
    {iconClass:'flaticon-store', title:'Réseau en expansion' },
];

// const pricingCard = [
//     {title:'Lecture seule',price:'45 000',desc:'Lisez en ligne sans télécharger',features:['Lecture illimitée en ligne','Accès à tout le catalogue','Synchronisation multi-appareils','Pas de téléchargement']},
//     {title:'Lecture + Téléchargement',price:'65 000',desc:'Lisez en ligne et téléchargez vos ebooks',features:['Tout de la formule Lecture seule','Téléchargement d\'ebooks (5/mois)','Lecture hors ligne','Conservation de votre bibliothèque']},
//     {title:'Premium illimité',price:'85 000',desc:'Lecture et téléchargements illimités',features:['Tout de la formule Lecture + Téléchargement','Téléchargements illimités','Nouveautés en avant-première','Support prioritaire']},
// ];

function Home2(){
    return(
        <>
            <Header />
            <div className="page-content bg-white">
                <div className="main-slider style-1 slider-white"> 
                    <HomeMainSlider2 />
                </div>    
                {/* <section className="content-inner-1 overlay-white-middle">
                    <div className="container">
                        <div className="row about-style1 align-items-center">
                            <div className="col-lg-6 m-b30 wow fadeInUp" data-wow-delay="0.1s">
                                <div className="row sp10 about-thumb">
                                    <div className="col-sm-6 aos-item ">
                                        <div className="split-box">
                                            <div>
                                                <img className="m-b30" src={aboutImages[0]} alt="/" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="split-box ">
                                            <div>
                                                <img className="m-b20 aos-item" src={aboutImages[1]} alt="/" />
                                            </div>
                                        </div>
                                        <div className="exp-bx aos-item">
                                            <div className="exp-head">
                                                <div className="counter-num">
                                                    <h2><span className="counter">50</span><small>+</small></h2>
                                                </div>
                                                <h6 className="title">Années d'expérience</h6>
                                            </div>
                                            <div className="exp-info">
                                                <ul className="list-check primary">
                                                    <li>BD & graphisme</li>
                                                    <li>Biographie</li>
                                                    <li>Recueils littéraires</li>
                                                    <li>Jeunesse fiction</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6 m-b2 wow fadeInUp" data-wow-delay="0.2s">
                                <div className="about-content px-lg-4">
                                    <div className="section-head style-1">
                                        <h2 className="title">Les livres de Jean Richard MAMBWENI MABIALA</h2>
                                        <p>Découvrez et achetez en ligne les ouvrages de Jean Richard MAMBWENI MABIALA, réunis sur une plateforme dédiée à son univers littéraire.</p>
                                    </div>
                                    <Link to={"/contact-us"} className="btn btn-primary shadow-primary btnhover">Nous contacter</Link>
                                </div>
                            </div>
                        </div>
                        <div className="swiper client-swiper mt-5">
                            <ClientsSlider />
                        </div>
                    </div>   
                </section>    */}
                {/* <section className="content-inner-1 bg-grey reccomend ">
                    <div className="container">
                        <div className="section-head text-center">
                            <h2 className="title">Recommandé pour vous</h2>
                            <p>Découvrez notre sélection de livres soigneusement choisie pour vous. Des best-sellers aux nouveautés, trouvez votre prochaine lecture.</p>
                        </div>
                        <RecomendedSlider />
					</div>
				</section> */}
                <section className="content-inner-1">
                    <div className="container">
                        <div className="row">
                            {iconBlog.map((data, ind)=>(
                                <div className="col-lg-3 col-sm-6" key={ind}>
                                    <div className="icon-bx-wraper style-1 m-b30 text-center">
                                        <div className="icon-bx-sm m-b10">
                                            <i className={`icon-cell ${data.iconClass}`} />
                                        </div>
                                        <div className="icon-content">
                                            <h5 className="dz-title m-b10">{data.title}</h5>
                                            <p>Des services pensés pour vous faciliter l'achat et la lecture.</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div> 
                    </div>
                </section>    
                {/* <section className="content-inner-1">
                    <div className="container">
                        <div className="section-head text-center">
                            <h2 className="title">Notre mission</h2>
                            <p>Une plateforme dédiée pour faire découvrir et diffuser les ouvrages de Jean Richard MAMBWENI MABIALA.</p>
                        </div>
                        <div className="row">
                            {missionBlog.map((data, i)=>(
                                <div className="col-lg-4 col-md-6" key={i}>
                                    <div className="icon-bx-wraper style-3 m-b30">
                                        <div className="icon-lg m-b20">
                                            <i className={`icon-cell ${data.iconClass}`}></i>
                                        </div>
                                        <div className="icon-content">
                                            <h4 className="title">{data.title}</h4>
                                            <p>
                                                {i === 0 && 'Offrir un espace unique où retrouver l’ensemble des livres de l’auteur, en ligne comme en version imprimée.'}
                                                {i === 1 && 'Garantir un achat simple, sécurisé et un suivi direct entre l’auteur et ses lecteurs.'}
                                                {i === 2 && 'Étendre progressivement la présence des ouvrages de l’auteur auprès de nouveaux lecteurs et partenaires.'}
                                            </p>
                                            <Link to={"/about-us"}>En savoir plus <i className="fa-solid fa-angles-right"></i></Link>
                                        </div>
                                    </div>
                                </div>
                            ))}   
                        </div>
                    </div>
                </section>     */}
                {/* <section className="content-inner-1">
					<div className="container">
						<BookSaleSlider />
					</div>
				</section>  */}
                {/* <section className="content-inner-1 bg-grey testimonial-wrapper-2">
                    <div className="container">
                        <div className="testimonial">
                            <div className="section-head text-center">
                                <h2 className="title">Ce que disent nos clients</h2>
                                <p>Découvrez les avis de ceux qui nous font confiance pour leurs lectures.</p>
                            </div>
                        </div>
                    </div>
                    <div className="container">     
                        <CustomerSlider />           
                    </div>
                </section>    */}
                {/* <section className="content-inner-1">
			        <div className="container">                  
                        <OfferSlider />       
                    </div>
                </section>    */}
                {/* <section className="content-inner bg-light">
                    <div className="container">
                        <div className="section-head text-center">
                            <h2 className="title">Nos tarifs</h2>
                            <p>Abonnez-vous pour lire des livres en ligne ou télécharger vos ebooks. Choisissez la formule adaptée à votre façon de lire.</p>
                        </div>
                        <div className="row pricingtable-wraper">
                            {pricingCard.map((data, index)=>(
                                <div className="col-lg-4 col-md-6" key={index}>
                                    <div className="pricingtable-wrapper style-1 m-b30">
                                        <div className="pricingtable-inner">
                                            <div className="pricingtable-title">
                                                <h3 className="title">{data.title}</h3>
                                            </div>
                                            <div className="pricingtable-price"> 
                                                <h2 className="pricingtable-bx">{data.price} FC<small className="pricingtable-type">/mois</small></h2>
                                            </div>
                                            <p className="text">{data.desc}</p>
                                            <ul className="pricingtable-features">
                                                {data.features.map((f, i)=>(<li key={i}>{f}</li>))}
                                            </ul>
                                            <div className="pricingtable-footer"> 
                                                <Link to={"/pricing"} className="btn btn-primary btnhover3">Commencer <i className="fa fa-angle-right m-l10"></i></Link> 
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>         */}
                <section className="content-inner bg-light">
                    <div className="container">
                        <div className="row sp15">
                            <CounterSection />           
                        </div>              
                    </div>
                </section>    
                {/* <NewsLetter subscribeChange={() => 'style-2'} />         */}
            </div>
            <Footer  footerChange="style-1" logoImage={logoWhite} />
        </>
    )
}
export default Home2;