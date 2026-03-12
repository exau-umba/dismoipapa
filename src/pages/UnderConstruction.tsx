import React from 'react';
import {Link} from 'react-router-dom';

import ucimage from './../assets/images/background/uc.jpg';

const UnderConstruction = ()=>{
    return(
        <>
            <div className="under-construct">
                <div className="inner-box">
                    <div className="logo-header logo-dark">
                        <Link to={"/"} style={{ textDecoration: 'none', color: '#1a1668', fontWeight: '700', fontSize: '1.5rem', whiteSpace: 'nowrap', fontFamily: 'Poppins, sans-serif' }}>
                        <i className="fa fa-book"></i> Dis-moi Papa
                        </Link>
                    </div>	
                    <div className="dz-content">
                        <h2 className="dz-title">Site Is Down <br/>For <span className="text-primary">Maintenance</span></h2>
                        <p>This is the Technical Problems Page.<br /> Or any other page.</p>
                    </div>
                </div>
                <img src={ucimage} className="uc-bg" alt="" />
            </div>
        </>
    )
}
export default UnderConstruction;