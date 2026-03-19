// @ts-nocheck
import React from 'react';
import { Link } from 'react-router-dom';

import PageTitle from './../layouts/PageTitle';
import NewsLetter from '../components/NewsLetter';

const pricingCard = [
  {
    title: 'Lecture seule',
    price: '45 000',
    desc: 'Lisez en ligne sans télécharger',
    features: [
      'Lecture illimitée en ligne',
      'Accès à tout le catalogue',
      'Synchronisation multi-appareils',
      'Pas de téléchargement',
    ],
  },
  {
    title: 'Lecture + Téléchargement',
    price: '65 000',
    desc: 'Lisez en ligne et téléchargez vos ebooks',
    features: [
      'Tout de la formule Lecture seule',
      "Téléchargement d'ebooks (5/mois)",
      'Lecture hors ligne',
      'Conservation de votre bibliothèque',
    ],
  },
  {
    title: 'Premium illimité',
    price: '85 000',
    desc: 'Lecture et téléchargements illimités',
    features: [
      'Tout de la formule Lecture + Téléchargement',
      'Téléchargements illimités',
      'Nouveautés en avant-première',
      'Support prioritaire',
    ],
  },
];

function Pricing() {
  return (
    <>
      <div className="page-content">
        <PageTitle childPage="Nos tarifs" parentPage="Accueil" />
        <section className="content-inner-1 bg-light">
          <div className="container">
            <div className="row pricingtable-wraper">
              {pricingCard.map((data, index) => (
                <div className="col-lg-4 col-md-6" key={index}>
                  <div className="pricingtable-wrapper style-1 m-b30">
                    <div className="pricingtable-inner">
                      <div className="pricingtable-title">
                        <h3 className="title">{data.title}</h3>
                      </div>
                      <div className="pricingtable-price">
                        <h2 className="pricingtable-bx">
                          {data.price} $
                          <small className="pricingtable-type">/mois</small>
                        </h2>
                      </div>
                      <p className="text">{data.desc}</p>
                      <ul className="pricingtable-features">
                        {data.features.map((f, i) => (
                          <li key={i}>{f}</li>
                        ))}
                      </ul>
                      <div className="pricingtable-footer">
                        <Link
                          to="/pricing"
                          className="btn btn-primary btnhover3"
                        >
                          Commencer <i className="fa fa-angle-right m-l10"></i>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <NewsLetter subscribeChange={() => {}} />
      </div>
    </>
  );
}

export default Pricing;

