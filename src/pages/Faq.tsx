import React from 'react';
import { Accordion } from 'react-bootstrap';

import PageTitle from './../layouts/PageTitle';
import CounterSection from './../elements/CounterSection';
import pic1 from './../assets/images/about/pic1.jpg';
import pic2 from './../assets/images/about/pic2.jpg';

/**
 * Point de vente des livres papier (librairie / partenaire).
 */
const LIEU_LIVRES_PHYSIQUES = {
  etablissement: 'Point de vente — librairie partenaire',
  adresseLigne1: '1, Av. De la paix (Bâtiment SEDEC)',
  reference: 'Réf. Rond-Point FORESCOM',
  telephone: '+243 974 081 025 / +243 898 638 042',
  villeRegion: 'Kinshasa – Gombe, RDC',
  precision:
    'Une sélection des ouvrages papier de Jean Richard MAMBWENI MABIALA y est proposée. Avant de vous déplacer, contactez-nous pour confirmer la disponibilité du titre souhaité et les horaires d’ouverture.',
};

const IMG_LIBRAIRIE_PHYSIQUE = '/images/librairie_physique.jpeg';

/** FAQ — contenu réel en français */
const faqLibrairie = [
  {
    title: 'Qu’est-ce que cette librairie en ligne ?',
    body:
      'Il s’agit de la boutique officielle des ouvrages de Jean Richard MAMBWENI MABIALA. Vous y trouvez le catalogue des livres disponibles en version papier et/ou numérique (e-book), avec des fiches détaillées et des extraits lorsque c’est proposé.',
  },
  {
    title: 'Les livres sont-ils disponibles en plusieurs formats ?',
    body:
      'Oui, selon chaque titre : certains existent en livre physique, d’autres en e-book (PDF et/ou EPUB selon les fichiers proposés). Les prix et la disponibilité sont indiqués sur chaque fiche livre et dans la boutique.',
  },
  {
    title: 'Comment contacter l’auteur ou le support ?',
    body:
      'Utilisez la page « Contact » du site pour envoyer un message. Pour toute question sur une commande ou un problème technique (accès, fichier, compte), précisez votre adresse e-mail et le titre concerné : cela nous permet de vous répondre plus vite.',
  },
  {
    title: 'Où trouver les livres en version papier ?',
    body: `Les livres physiques sont disponibles à notre point de vente : ${LIEU_LIVRES_PHYSIQUES.adresseLigne1}, ${LIEU_LIVRES_PHYSIQUES.reference}. Tél. ${LIEU_LIVRES_PHYSIQUES.telephone}. ${LIEU_LIVRES_PHYSIQUES.villeRegion}. ${LIEU_LIVRES_PHYSIQUES.precision}`,
  },
];

const faqAchats = [
  {
    title: 'Comment passer une commande ?',
    body:
      'Créez un compte ou connectez-vous, ajoutez un livre au panier en choisissant le format (physique ou e-book, et le type de fichier pour l’e-book si plusieurs sont proposés), puis validez votre panier et suivez les étapes de commande jusqu’au paiement.',
  },
  {
    title: 'Puis-je acheter un livre papier et un e-book en même temps ?',
    body:
      'Oui : chaque format est une ligne distincte dans le panier. Vous pouvez ajouter le même titre en physique et en numérique si les deux sont disponibles.',
  },
  {
    title: 'Où retrouver mes e-books après achat ?',
    body:
      'Une fois la commande traitée, vos achats numériques sont accessibles depuis votre espace « Mes livres » (compte connecté), selon les modalités affichées sur le site (lecture ou téléchargement selon le format).',
  },
  {
    title: 'Que se passe-t-il en cas de problème de paiement ou de livraison ?',
    body:
      'Vérifiez vos informations de facturation et contactez-nous via la page Contact ou le canal indiqué dans votre e-mail de confirmation. Pour un livre physique, indiquez votre numéro de commande ; pour un e-book, précisez le format choisi (PDF ou EPUB).',
  },
];

function FaqAccordion({ items, idPrefix }: { items: typeof faqLibrairie; idPrefix: string }) {
  return (
    <Accordion flush>
      {items.map((item, i) => (
        <Accordion.Item eventKey={`${idPrefix}-${i}`} className="card" key={`${idPrefix}-${i}`}>
          <div className="card-header">
            <Accordion.Header as="h3" className="title">
              <span>{item.title}</span>
              <span className="icon">
                <i className="fa fa-angle-left" aria-hidden="true"></i>
              </span>
            </Accordion.Header>
          </div>
          <Accordion.Body>
            <p className="mb-0">{item.body}</p>
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}

function Faq() {
  return (
    <>
      <div className="page-content">
        <PageTitle parentPage="Informations" childPage="FAQ" />
        <section className="main-faq-content content-inner faq-page-section">
          <div className="container">
            <div className="row g-4 g-lg-5 align-items-lg-start">
              <div className="col-lg-6 order-2 order-lg-1">
                <div className="faq-content-box">
                  <div className="section-head">
                    <h2 className="title">La librairie et le catalogue</h2>
                    <p className="mb-0">
                      Retrouvez ici les réponses aux questions les plus fréquentes sur notre boutique, les formats
                      proposés (papier / e-book) et la façon de nous écrire.
                    </p>
                  </div>
                  <div className="faq-accordion mt-4">
                    <FaqAccordion items={faqLibrairie} idPrefix="lib" />
                  </div>
                </div>
              </div>
              <div className="col-lg-6 order-1 order-lg-2">
                <div className="faq-side-panel">
                  <div className="faq-side-panel__photos" aria-hidden="false">
                    <figure className="faq-photo-card">
                      <img src="logo.png" alt="Livres et lecture" />
                    </figure>
                    <figure className="faq-photo-card faq-photo-card--featured">
                      <img
                        src={IMG_LIBRAIRIE_PHYSIQUE}
                        alt={`Librairie — ${LIEU_LIVRES_PHYSIQUES.villeRegion}`}
                      />
                    </figure>
                  </div>
                  <aside className="faq-place-card">
                    <h3 className="faq-place-card__title">Livres papier sur place</h3>
                    <p className="faq-place-card__lead mb-2">{LIEU_LIVRES_PHYSIQUES.etablissement}</p>
                    <address className="faq-place-card__address">
                      {LIEU_LIVRES_PHYSIQUES.adresseLigne1}
                      <br />
                      {LIEU_LIVRES_PHYSIQUES.reference}
                      <br />
                      Tél. {LIEU_LIVRES_PHYSIQUES.telephone}
                      <br />
                      {LIEU_LIVRES_PHYSIQUES.villeRegion}
                    </address>
                    <p className="faq-place-card__note mb-0 mt-3">{LIEU_LIVRES_PHYSIQUES.precision}</p>
                  </aside>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="main-faq-content bg-light content-inner faq-page-section">
          <div className="container">
            <div className="row g-4 g-lg-5 align-items-lg-start">
              <div className="col-lg-6">
                <div className="faq-side-panel faq-side-panel--single">
                  <figure className="faq-photo-card faq-photo-card--large mb-3">
                    <img src="/images/bg-page-title.jpg" alt="Commande et livres" />
                  </figure>
                  <p className="faq-cross-ref mb-0">
                    <span className="faq-cross-ref__label">Livres papier</span>
                    Retrait ou achat sur place : voir la section ci-dessus (photo et coordonnées complètes :{' '}
                    {LIEU_LIVRES_PHYSIQUES.adresseLigne1}, {LIEU_LIVRES_PHYSIQUES.villeRegion}).
                  </p>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="faq-content-box">
                  <div className="section-head">
                    <h2 className="title">Achats, panier et compte</h2>
                    <p className="mb-0">
                      Commande, choix du format au panier, accès aux e-books et conduite à tenir en cas de difficulté :
                      tout ce qu’il faut savoir pour acheter en toute sérénité.
                    </p>
                  </div>
                  <div className="faq-accordion mt-4">
                    <FaqAccordion items={faqAchats} idPrefix="achat" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="content-inner bg-white">
          <div className="container">
            <div className="row sp15">
              <CounterSection />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Faq;
