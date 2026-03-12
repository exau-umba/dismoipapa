import React from 'react';
import {Link} from 'react-router-dom';
import CountUp from 'react-countup';


//Components 
import PageTitle from '../layouts/PageTitle';
import TestimonialSlider from '../components/Home/TestimonialSlider';
import ClientsSlider from '../components/Home/ClientsSlider';
import NewsLetter from '../components/NewsLetter';

//element
import CounterSection from '../elements/CounterSection';

import { aboutImages } from '../constants/imageUrls';


const missionBlog = [
    {iconClass:'flaticon-open-book-1', title:'Meilleure librairie' },
    {iconClass:'flaticon-exclusive', title:'Vendeur de confiance' },
    {iconClass:'flaticon-store', title:'Réseau en expansion' },
];

function AboutUs(){
    return(
        <>
            <div className="page-content bg-white">
               <PageTitle  parentPage="Accueil" childPage="À propos" />
               <section className="content-inner overlay-white-middle">
                    <div className="container">
                        <div className="row about-style1 align-items-center">
                            <div className="col-lg-6 m-b30">
                                <div className="row sp10 about-thumb">
                                    <div className="col-sm-6 aos-item" >
                                        <div className="split-box">
                                            <div>
                                                <img className="m-b30" src={aboutImages[0]} alt="" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="split-box ">
                                            <div>
                                                <img className="m-b20 aos-item" src={aboutImages[1]} alt=""  />
                                            </div>
                                        </div>
                                        <div className="exp-bx aos-item" >
                                            <div className="exp-head">
                                                <div className="counter-num">
                                                    <h2><span className="counter"> <CountUp end={50} /></span><small>+</small></h2>
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
                            <div className="col-lg-6 m-b30 aos-item">
                                <div className="about-content px-lg-4">
                                    <div className="section-head style-1">
                                        <h2 className="title">Votre librairie de référence</h2>
                                        <p>Nous sélectionnons pour vous les meilleurs ouvrages, des classiques aux dernières sorties. Une équipe passionnée pour vous conseiller.</p>
                                    </div>
                                    <Link to={"/contact-us"} className="btn btn-primary btnhover shadow-primary">Nous contacter</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="content-inner-1 bg-light">
                    <div className="container">
                        <div className="section-head text-center">
                            <h2 className="title">Notre mission</h2>
                            <p>Rendre la lecture accessible à tous avec une offre variée, des conseils personnalisés et un service de qualité.</p>
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
                                            <p>Découvrez notre histoire et nos engagements pour nos lecteurs.</p>
                                            <Link to={"/about-us"}>En savoir plus <i className="fa-solid fa-angles-right"></i></Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
                <section className="content-inner-1 testimonial-wrapper">
					<TestimonialSlider />	
				</section>	
                <section className="content-inner bg-light">
                    <div className="container">
				        <div className="row sp15">
                            <CounterSection /> 
                         </div>
                    </div>        
                </section>
                <div className="py-5">
			        <div className="container">
                         <ClientsSlider />       
                    </div>
                </div>    
                <NewsLetter subscribeChange={() => {}} />             
            </div>
        </>
    )
}
export default AboutUs;