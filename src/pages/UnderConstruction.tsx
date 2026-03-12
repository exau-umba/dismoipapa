import React from 'react';
import { Link } from 'react-router-dom';

const UnderConstruction = () => {

  return (
    <>
      <div className="under-construct">
        <div className="inner-box">
          <div className="logo-header logo-dark">
            <Link
              to="/"
              style={{
                textDecoration: 'none',
                color: '#1a1668',
                fontWeight: '700',
                fontSize: '1.5rem',
                whiteSpace: 'nowrap',
                fontFamily: 'Poppins, sans-serif',
              }}
            >
              <img src="/logo.png" alt="Dis-moi Papa" /> Dis-moi Papa
            </Link>
          </div>
          <div className="dz-content">
            <h2 className="dz-title">
              Le site est en <span className="text-primary">maintenance</span>
            </h2>
            <p>
              Le site est en maintenance pour des raisons techniques.
              <br />
              Veuillez réessayer plus tard.
            </p>
          </div>
        </div>
        <div
          className="uc-bg"
          style={{
            backgroundImage: `url('/images/maintenance.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        ></div>
      </div>
    </>
  );
};

export default UnderConstruction;