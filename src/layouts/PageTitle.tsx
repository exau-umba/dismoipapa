import React from 'react';
import { Link } from 'react-router-dom';

type PageTitleProps = {
  parentPage: string;
  childPage: string;
  /** Lien du fil d’Ariane parent (défaut : accueil) */
  parentTo?: string;
};

const PageTitle = ({ parentPage, childPage, parentTo = '/' }: PageTitleProps) => {
  return (
    <>
      <div
        className="dz-bnr-inr overlay-secondary-dark dz-bnr-inr-sm"
        style={{ backgroundImage: 'url(/images/bg-page-title.jpg)', height: '100px' }}
      >
        <div className="container">
          <div className="dz-bnr-inr-entry" style={{ height: '100px' }}>
            <h1>{childPage}</h1>
            <nav aria-label="breadcrumb" className="breadcrumb-row">
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to={parentTo}>{parentPage}</Link>
                </li>
                <li className="breadcrumb-item">{childPage}</li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default PageTitle;

