// @ts-nocheck
import React from 'react';
import { Link } from 'react-router-dom';

import PageTitle from './../layouts/PageTitle';
import profile from './../assets/images/profile3.jpg';

const profilePages = [
  { to: '/my-books', icons: 'fa fa-book', name: 'Mes Livres' },
  { to: '/wishlist', icons: 'fa fa-heart', name: 'Mes favoris' },
  { to: '/shop-cart', icons: 'fa fa-shopping-cart', name: 'Panier' },
  { to: '/shop-checkout', icons: 'fa fa-credit-card', name: 'Paiement' },
];

function MyProfile() {
  return (
    <>
      <div className="page-content">
        <PageTitle parentPage="Pages" childPage="Mon profil" />
        <section className="content-inner-1">
          <div className="container">
            <div className="row">
              <div className="col-lg-4 col-md-5">
                <div className="profile-box">
                  <div className="profile-img">
                    <img src={profile} alt="Profil" />
                  </div>
                  <div className="profile-info">
                    <h4 className="title">Nom du lecteur</h4>
                    <p className="text-muted">lecteur@exemple.com</p>
                  </div>
                  <ul className="profile-menu">
                    {profilePages.map((item, i) => (
                      <li key={i}>
                        <Link to={item.to}>
                          <i className={item.icons}></i> {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="col-lg-8 col-md-7">
                <div className="profile-content">
                  <h3 className="title m-b20">Informations personnelles</h3>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Nom complet</label>
                        <input
                          type="text"
                          className="form-control"
                          defaultValue="Nom du lecteur"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Adresse e-mail</label>
                        <input
                          type="email"
                          className="form-control"
                          defaultValue="lecteur@exemple.com"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Téléphone</label>
                        <input
                          type="text"
                          className="form-control"
                          defaultValue="+243 81 000 00 00"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Ville</label>
                        <input
                          type="text"
                          className="form-control"
                          defaultValue="Kinshasa"
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="mb-3">
                        <label
                          htmlFor="exampleFormControlTextarea"
                          className="form-label"
                        >
                          Description
                        </label>
                        <textarea
                          className="form-control"
                          id="exampleFormControlTextarea"
                          rows={5}
                          defaultValue="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
                        ></textarea>
                      </div>
                    </div>
                    <div className="col-12">
                      <button className="btn btn-primary btnhover" type="button">
                        Enregistrer les modifications
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default MyProfile;

