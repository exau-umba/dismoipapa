import React from 'react';
import { Link } from 'react-router-dom';

import bg404 from './../assets/images/quality-media.jpg';

const ErrorPage = () => {

  return (
    <>
      <div
        className="error-page overlay-secondary-dark"
        style={{ backgroundImage: `url('/images/error404.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center' , backgroundRepeat: 'no-repeat'}}
      >
        <div className="error-inner text-center">
          <div className="dz_error" data-text="404">
            404
          </div>
          <h2 className="error-head">
            Désolé, la page que vous recherchez est introuvable.
          </h2>
          <Link
            to="/"
            className="btn btn-primary btn-border btnhover white-border"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </>
  );
};

export default ErrorPage;