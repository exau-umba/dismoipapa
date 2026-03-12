import React from 'react';
import { Link } from 'react-router-dom';

import PageTitle from '../layouts/PageTitle';
import NewsLetter from '../components/NewsLetter';
import { bookImages, bookTitles, profileImages } from '../constants/imageUrls';

const AUTHOR_NAME = 'Jean Richard MAMBWENI MABIALA';
const AUTHOR_BIO = `Jean Richard MAMBWENI MABIALA est l'auteur de tous les ouvrages proposés sur cette plateforme. Il signe des recueils de poésie et fables, des ouvrages techniques dans le domaine des hydrocarbures, ainsi que des romans. Ses livres sont édités aux éditions MADOSE.`;

const authorBooks = [
  { image: bookImages[0], title: bookTitles[0], to: '/books-detail' },
  { image: bookImages[1], title: bookTitles[1], to: '/books-detail' },
  { image: bookImages[2], title: bookTitles[2], to: '/books-detail' },
];

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
                      src={profileImages[0]}
                      alt={AUTHOR_NAME}
                      style={{ maxWidth: '320px', width: '100%', height: 'auto', objectFit: 'cover' }}
                    />
                  </div>
                </div>
              </div>
              <div className="col-lg-8 col-md-7 m-b30">
                <div className="about-content px-lg-4">
                  <div className="section-head style-1">
                    <h2 className="title mb-3">{AUTHOR_NAME}</h2>
                    <p className="mb-0">{AUTHOR_BIO}</p>
                  </div>
                  <Link to="/contact-us" className="btn btn-primary btnhover shadow-primary mt-3">
                    Contacter l'auteur
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="content-inner-1 bg-light">
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
        </section>
        <NewsLetter subscribeChange={() => {}} />
      </div>
    </>
  );
}

export default Auteur;
