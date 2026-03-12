import React from 'react';
import { Link } from 'react-router-dom';

function heartToggle() {
  const heartBlaste = document.querySelector('.heart');
  if (heartBlaste) {
    heartBlaste.classList.toggle('heart-blast');
  }
}

const accordList = [
  { name: 'Architecture' },
  { name: 'Art' },
  { name: 'Action' },
  { name: 'Biographie' },
  { name: 'Corps, esprit & spiritualité' },
  { name: 'Business & Économie' },
  { name: 'Jeunesse fiction' },
  { name: 'Jeunesse documentaire' },
  { name: 'BD & graphisme' },
  { name: 'Cuisine' },
  { name: 'Loisirs créatifs' },
  { name: 'Design' },
  { name: 'Drame' },
  { name: 'Éducation' },
  { name: 'Famille & relations' },
  { name: 'Fiction' },
  { name: 'Langues étrangères' },
  { name: 'Jeux' },
  { name: 'Jardinage' },
  { name: 'Santé & bien-être' },
  { name: 'Histoire' },
  { name: 'Maison' },
  { name: 'Humour' },
  { name: 'Recueils littéraires' },
  { name: 'Mathématiques' },
  { name: 'Médical' },
  { name: 'Nature' },
  { name: 'Arts du spectacle' },
  { name: 'Animaux' },
  { name: 'Voir plus' },
];

type FooterProps = {
  footerChange?: string;
  logoImage?: string;
};

function Footer({ footerChange = '', logoImage }: FooterProps) {
  const d = new Date();

  return (
    <>
      <footer className={`site-footer ${footerChange}`}>
        {/* <div className="footer-category">
          <div className="container">
            <div className="category-toggle">
              <Link
                to={'#'}
                className={`toggle-btn ${accordBtn ? 'active' : ''}`}
                onClick={() => setAccordBtn(!accordBtn)}
              >
                Catégories de livres
              </Link>
              <div className="toggle-items row">
                <Collapse in={accordBtn} className="footer-col-book">
                  <ul>
                    {accordList.map((data, ind) => (
                      <li key={ind}>
                        <Link to={'/books-grid-view'}>{data.name}</Link>
                      </li>
                    ))}
                  </ul>
                </Collapse>
              </div>
            </div>
          </div>
        </div> */}
        <div className="footer-top">
          <div className="container">
            <div className="row">
              <div
                className="col-xl-3 col-lg-12 wow fadeInUp"
                data-wow-delay="0.1s"
              >
                <div className="widget widget_about">
                  <div className="footer-logo logo-white">
                    <Link
                      to={'/'}
                      style={{
                        textDecoration: 'none',
                        color: '#fff',
                        fontWeight: '700',
                        fontSize: '1.5rem',
                        whiteSpace: 'nowrap',
                        fontFamily: 'Poppins, sans-serif',
                      }}
                    >
                      Dis-moi Papa
                    </Link>
                  </div>
                  <p className="text">
                    Librairie en ligne – Découvrez notre sélection de livres et
                    commandez en quelques clics.
                  </p>
                  <div className="dz-social-icon style-1">
                    <ul>
                      <li>
                        <a
                          href="https://www.facebook.com/dexignzone"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <i className="fa-brands fa-facebook-f"></i>
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://www.youtube.com/channel/UCGL8V6uxNNMRrk3oZfVct1g"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <i className="fa-brands fa-youtube"></i>
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://www.linkedin.com/showcase/3686700/admin/"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <i className="fa-brands fa-linkedin"></i>
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://www.instagram.com/website_templates__/"
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
              <div
                className="col-xl-2 col-lg-3 col-md-4 col-sm-4 col-4 wow fadeInUp"
                data-wow-delay="0.2s"
              >
                <div className="widget widget_services">
                  <h5 className="footer-title">Liens utiles</h5>
                  <ul>
                    <li>
                      <Link to={'/auteur'}>L'auteur</Link>
                    </li>
                    <li>
                      <Link to={'/about-us'}>À propos</Link>
                    </li>
                    <li>
                      <Link to={'/contact-us'}>Contact</Link>
                    </li>
                    <li>
                      <Link to={'/privacy-policy'}>
                        Politique de confidentialité
                      </Link>
                    </li>
                    <li>
                      <Link to={'/pricing'}>Tarifs</Link>
                    </li>
                    <li>
                      <Link to={'/faq'}>FAQ</Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div
                className="col-xl-2 col-lg-3 col-sm-4 col-4 wow fadeInUp"
                data-wow-delay="0.3s"
              >
                <div className="widget widget_services">
                  <h5 className="footer-title">Boutique</h5>
                  <ul>
                    <li>
                      <Link to={'/'}>Accueil</Link>
                    </li>
                    <li>
                      <Link to={'/services'}>Services</Link>
                    </li>
                    <li>
                      <Link to={'/books-detail'}>Détail d'un livre</Link>
                    </li>
                    <li>
                      <Link to={'/blog-detail'}>Article du blog</Link>
                    </li>
                    <li>
                      <Link to={'/books-grid-view'}>Boutique</Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div
                className="col-xl-2 col-lg-3 col-md-4 col-sm-4 col-4 wow fadeInUp"
                data-wow-delay="0.4s"
              >
                <div className="widget widget_services">
                  <h5 className="footer-title">Ressources</h5>
                  <ul>
                    <li>
                      <Link to={'/services'}>Téléchargements</Link>
                    </li>
                    <li>
                      <Link to={'/help-desk'}>Centre d'aide</Link>
                    </li>
                    <li>
                      <Link to={'/shop-cart'}>Panier</Link>
                    </li>
                    <li>
                      <Link to={'/shop-login'}>Connexion</Link>
                    </li>
                    <li>
                      <Link to={'/about-us'}>Partenaires</Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div
                className="col-xl-3 col-lg-3 col-md-12 col-sm-12 wow fadeInUp"
                data-wow-delay="0.5s"
              >
                <div className="widget widget_getintuch">
                  <h5 className="footer-title">Nous contacter</h5>
                  <ul>
                    <li>
                      <i className="flaticon-placeholder"></i>
                      <span>
                        Avenue du Commerce, Kinshasa, République démocratique du
                        Congo
                      </span>
                    </li>
                    <li>
                      <i className="flaticon-phone"></i>
                      <span>
                        +243 81 123 45 67
                        <br />
                        +243 82 987 65 43
                      </span>
                    </li>
                    <li>
                      <i className="flaticon-email"></i>
                      <span>
                        support@dismoipapa.com
                        <br />
                        info@dismoipapa.com
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="container">
            <div className="row fb-inner">
              <div className="col-lg-6 col-md-12 text-start">
                <p className="copyright-text">
                  Librairie en ligne – © {d.getFullYear()} Tous droits
                  réservés
                </p>
              </div>
              <div className="col-lg-6 col-md-12 text-end">
                <p>
                  Réalisé avec{' '}
                  <span className="heart" onClick={heartToggle}></span> par
                  <a
                    href="https://dexignzone.com/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {' '}
                    DexignZone
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;

