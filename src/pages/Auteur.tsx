import React from 'react';
import { Link } from 'react-router-dom';

import PageTitle from '../layouts/PageTitle';
import NewsLetter from '../components/NewsLetter';
// import { profileImages } from '../constants/imageUrls';

const AUTHOR_NAME = 'Jean Richard MAMBUENI MABIALA';
const AUTHOR_BIO = `Jean Richard MAMBUENI MABIALA est né à Matadi le 08 avril 1967. 
Il a obtenu, après son diplôme d'État des Humanités littéraires à l'Institut Tomisa Luzingu à Matadi (1986), un graduat en Anglais – Culture Africaine à l'Institut Supérieur Pédagogique de Mbanza Ngungu (1991), un graduat en Informatique de Gestion à l'Institut Supérieur de Navigation et de Pêche de Muanda (2007) et une Licence en Géologie à l'Université de Kinshasa (2015). Outre ces études, il a suivi 12 mois de Comptabilité au CIDEP/Matadi et a quitté l'Institut Supérieur de Commerce de Matadi lorsqu'il était en troisième année de Graduat/soir.

Engagé comme inspecteur pétrolier à l'Office Congolais de Contrôle (OCC), Agence de Muanda en 2000, il est présentement Chef de Département Certification et Contrôle de la Production Locale Adjoint dans cet établissement public.

Il a publié notamment :
- « Les dangers de la sismique pétrolière dans une zone à risque volcanique » in Madose : Revue culturelle et scientifique, n° 083, Mwene Ditu, Novembre – Décembre 2022 ;
- Le canard : Recueil des poèmes et fables, Éditions Madose, Mwene Ditu, 2023 ;
- Gestion de stock des hydrocarbures liquides et/ou liquéfiés, Éditions Madose, Mwene Ditu, 2024 ;
- Volkan devait vite se marier : Roman, Éditions Madose, Mwene Ditu, 2026.`;

// const authorBooks = [
//   { image: bookImages[0], title: 'Le canard : Recueil des poèmes et fables', to: '/books-detail' },
//   { image: bookImages[1], title: 'Gestion de stock des hydrocarbures liquides et/ou liquéfiés', to: '/books-detail' },
//   { image: bookImages[2], title: 'Volkan devait vite se marier', to: '/books-detail' },
// ];

function Auteur() {
  return (
    <>
      <div className="page-content bg-white">
        <PageTitle parentPage="Accueil" childPage="L'auteur" />
        <section className="content-inner overlay-white-middle">
          <div className="container">
            <div className="row about-style1 align-items-center">
              <div className="col-lg-4 col-md-5 m-b30">
                <div className="text-center">
                  <div className="rounded overflow-hidden shadow-sm d-inline-block">
                    <img
                      // src={profileImages[0]}
                      src="/images/jrmm.png"
                      alt={AUTHOR_NAME}
                      style={{ maxWidth: '420px', width: '100%', height: 'auto', objectFit: 'cover' }}
                    />
                  </div>
                </div>
              </div>
              <div className="col-lg-8 col-md-7 m-b30">
                <div className="about-content px-lg-4">
                  <div className="section-head style-1" style={{ textAlign: 'justify' }}>
                    <h2 className="title mb-3" style={{ borderBottom: '2px solid #1a1668' }}>{AUTHOR_NAME}</h2>
                    <p className="mb-0 ">
                      {/* {AUTHOR_BIO} */}
                      Jean Richard MAMBUENI MABIALA est né à Matadi le 08 avril 1967.
                      Il a obtenu, après son diplôme d'État des Humanités littéraires à l'Institut Tomisa Luzingu à Matadi (1986),
                      un graduat en Anglais – Culture Africaine à l'Institut Supérieur Pédagogique de Mbanza Ngungu (1991),
                      un graduat en Informatique de Gestion à l'Institut Supérieur de Navigation et de Pêche de Muanda (2007) et une Licence en Géologie à l'Université de Kinshasa (2015).
                      Outre ces études, il a suivi 12 mois de Comptabilité au CIDEP/Matadi et a quitté l'Institut Supérieur de Commerce de Matadi lorsqu'il était en troisième année de Graduat/soir.
                      <br /><br />
                      Engagé comme inspecteur pétrolier à l'Office Congolais de Contrôle (OCC), Agence de Muanda en 2000, il est présentement Chef de Département Certification et Contrôle de la Production Locale Adjoint dans cet établissement public.
                      <br /><br />
                      Il a publié notamment :<br /><br />
                      - « Les dangers de la sismique pétrolière dans une zone à risque volcanique » in Madose : Revue culturelle et scientifique, n° 083, Mwene Ditu, Novembre – Décembre 2022 ;<br />
                      - Le canard : Recueil des poèmes et fables, Éditions Madose, Mwene Ditu, 2023 ;<br />
                      - Gestion de stock des hydrocarbures liquides et/ou liquéfiés, Éditions Madose, Mwene Ditu, 2024 ;<br />
                    </p>
                  </div>
                  <div className="dz-social-icon style-1 mt-3">
                    <ul>
                      <li>
                        <a
                          href="https://www.facebook.com/dismoipapa"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <i className="fa-brands fa-facebook-f"></i>
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://www.youtube.com/@dismoipapa"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <i className="fa-brands fa-youtube"></i>
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://www.linkedin.com/company/dismoipapa"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <i className="fa-brands fa-linkedin"></i>
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://www.instagram.com/dismoipapa"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <i className="fa-brands fa-instagram"></i>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* <section className="content-inner-1 bg-light">
          <div className="container">
            <div className="section-head text-center m-b40">
              <h2 className="title">Ses ouvrages</h2>
              <p>Découvrez les livres de Jean Richard MAMBWENI MABIALA disponibles sur la plateforme.</p>
            </div>
            <div className="row justify-content-center">
              {authorBooks.map((book, i) => (
                <div className="col-lg-4 col-md-6 m-b30" key={i}>
                  <div className="dz-shop-card style-1 text-center h-100">
                    <div className="dz-media" style={{ height: '320px', overflow: 'hidden' }}>
                      <Link to={book.to}>
                        <img
                          src={book.image}
                          alt={book.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </Link>
                    </div>
                    <div className="dz-content">
                      <h5 className="title book-title-truncate" title={book.title}>
                        <Link to={book.to}>{book.title}</Link>
                      </h5>
                      <Link to={book.to} className="btn btn-outline-primary btn-sm btnhover mt-2">
                        Voir le détail
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section> */}
        {/* <NewsLetter subscribeChange={() => {}} /> */}
      </div>
    </>
  );
}

export default Auteur;
