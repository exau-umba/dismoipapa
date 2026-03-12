import React,{useState} from 'react';
//import {Link} from 'react-router-dom';
import { Collapse, Form } from 'react-bootstrap';

//Components 
import PageTitle from '../layouts/PageTitle';

import { bookImages, bookTitles } from '../constants/imageUrls';

const orderItem = [
    { image: bookImages[0], title: bookTitles[0], price:'28.00' },
    { image: bookImages[1], title: bookTitles[1], price:'26.00' },
    { image: bookImages[2], title: bookTitles[2], price:'30.00' },
    { image: bookImages[0], title: bookTitles[0], price:'36.00' },
    { image: bookImages[1], title: bookTitles[1], price:'27.00' }
];

const inputData = [
    {name1: 'Appartement, bâtiment, etc.', name2:'Ville'},
    {name1: 'Région / Département', name2:'Code postal'},
    {name1: 'E-mail', name2:'Téléphone'},
];

const SingleInput = ({title, ChangeClassName}: {title: string, ChangeClassName: string}) =>{
    return(
        <>
            <div className={`form-group ${ChangeClassName || ''}`}>
                <input type="text" className="form-control" placeholder={title} />
            </div>
        </>
    )
}

function ShopCheckout(){
    const [accordBtn, setAccordBtn] = useState<boolean>(false);
    return(
        <>
            <div className="page-content">
                <PageTitle  parentPage="Boutique" childPage="Paiement" />               
                <section className="content-inner-1">
				{/* <!-- Product --> */}
                    <div className="container">
                        <form className="shop-form">
                            <div className="row">
                                <div className="col-lg-6 col-md-6">
                                    <div className="widget">
                                        <h4 className="widget-title">Adresse de facturation et livraison</h4>
                                        <div className="form-group">
                                            <Form.Select aria-label="Åland Islands">
                                                <option>Åland Islands</option>
                                                <option value="1">Afghanistan</option>
                                                <option value="2">Albania</option>
                                                <option value="3">Algeria</option>
                                                <option value="4">Andorra</option>
                                                <option value="5">Angola</option>
                                                <option value="6">Anguilla</option>
                                                <option value="7">Antarctica</option>
                                                <option value="8">Antigua and Barbuda</option>
                                                <option value="9">Argentina</option>
                                                <option value="10">Armenia</option>
                                                <option value="11">Aruba</option>
                                                <option value="12">Australia</option>
                                            </Form.Select>	
                                        </div>
                                        <div className="row">
                                            <SingleInput ChangeClassName="col-md-6" title="Prénom" />
                                            <SingleInput ChangeClassName="col-md-6" title="Nom" />
                                        </div>
                                        <SingleInput title="Société (optionnel)" ChangeClassName="" />
                                        <SingleInput title="Adresse" ChangeClassName="" />
                                        {inputData.map((data, index)=>(
                                            <div className="row">
                                                <div className="form-group col-md-6">
                                                    <input type="text" className="form-control" placeholder={data.name1} />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <input type="text" className="form-control" placeholder={data.name2} />
                                                </div>
                                            </div>
                                        ))}                                        
                                        <button className="btn btn-primary btnhover mb-3" type="button" data-bs-toggle="collapse" data-bs-target="#create-an-account">Créer un compte <i className="fa fa-arrow-circle-o-down"></i></button>
                                        <div id="create-an-account" className="collapse">
                                            <p>Créez un compte en renseignant les informations ci-dessous. Déjà client ? Connectez-vous en haut de page.</p>
                                            <div className="form-group">
                                                <input type="password" className="form-control" placeholder="Mot de passe" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6">
                                    <button className="btn btn-primary btnhover mb-3" type="button" 
                                        onClick={() => setAccordBtn(!accordBtn)}>Livrer à une autre adresse <i className="fa fa-arrow-circle-o-down"></i>
                                    </button>
                                    <Collapse in={accordBtn} >
                                        <div>
                                            <p>Déjà client ? Renseignez vos coordonnées ci-dessous. Nouveau client ? Passez à la section Facturation & Livraison.</p>
                                            <div className="form-group">
                                                
                                                <Form.Select aria-label="Åland Islands">
                                                    <option>Åland Islands</option>
                                                    <option value="1">Afghanistan</option>
                                                    <option value="2">Albania</option>
                                                    <option value="3">Algeria</option>
                                                    <option value="4">Andorra</option>
                                                    <option value="5">Angola</option>
                                                    <option value="6">Anguilla</option>
                                                    <option value="7">Antarctica</option>
                                                    <option value="8">Antigua and Barbuda</option>
                                                    <option value="9">Argentina</option>
                                                    <option value="10">Armenia</option>
                                                    <option value="11">Aruba</option>
                                                    <option value="12">Australia</option>
                                                </Form.Select>
                                            </div>
                                            <div className="row">
                                                <SingleInput ChangeClassName="col-md-6" title="Prénom" />
                                                <SingleInput ChangeClassName="col-md-6" title="Nom" />
                                            </div>
                                            <SingleInput title="Société (optionnel)" ChangeClassName="" />
                                            <SingleInput title="Adresse" ChangeClassName="" />
                                            {inputData.map((data, index)=>(
                                                <div className="row">
                                                    <div className="form-group col-md-6">
                                                        <input type="text" className="form-control" placeholder={data.name1} />
                                                    </div>
                                                    <div className="form-group col-md-6">
                                                        <input type="text" className="form-control" placeholder={data.name2} />
                                                    </div>
                                                </div>
                                            ))}
                                            
                                            <p>Créez un compte en renseignant les informations ci-dessous. Déjà client ? Connectez-vous en haut de page.</p>
                                        </div>    
                                    </Collapse>
                                    <div className="form-group">
                                        <textarea className="form-control" placeholder="Notes pour votre commande (ex. instructions de livraison)"></textarea>
                                    </div>
                                
                                </div>
                            </div>
                        </form>
                        <div className="dz-divider bg-gray-dark text-gray-dark icon-center  my-5"><i className="fa fa-circle bg-white text-gray-dark"></i></div>
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="widget">
                                    <h4 className="widget-title">Votre commande</h4>
                                    <table className="table-bordered check-tbl">
                                        <thead className="text-center">
                                            <tr>
                                                <th>IMAGE</th>
                                                <th>PRODUIT</th>
                                                <th>TOTAL</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orderItem.map((item, ind)=>(
                                                <tr key={ind}>
                                                    <td className="product-item-img"><img src={item.image} alt="" /></td>
                                                    <td className="product-item-name book-title-truncate" title={item.title}>{item.title}</td>
                                                    <td className="product-price">{item.price} FC</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <form className="shop-form widget">
                                    <h4 className="widget-title">Total de la commande</h4>
                                    <table className="table-bordered check-tbl mb-4">
                                        <tbody>
                                            <tr>
                                                <td>Sous-total</td>
                                                <td className="product-price">125 960 FC</td>
                                            </tr>
                                            <tr>
                                                <td>Livraison</td>
                                                <td>Livraison gratuite</td>
                                            </tr>
                                            <tr>
                                                <td>Code promo</td>
                                                <td className="product-price">28 000 FC</td>
                                            </tr>
                                            <tr>
                                                <td>Total</td>
                                                <td className="product-price-total">506 000 FC</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <h4 className="widget-title">Mode de paiement</h4>
                                    <SingleInput title="Nom sur la carte" ChangeClassName="" />
                                    <div className="form-group">
                                        <Form.Select aria-label="Credit Card Type">
                                            <option>Type de carte</option>
                                            <option value="1">Carte avec cashback</option>
                                            <option value="2">Carte voyage</option>
                                            <option value="3">Carte professionnelle</option>
                                        </Form.Select>
                                    </div>
                                    <SingleInput title="Numéro de carte" ChangeClassName="" />
                                    <SingleInput title="Cryptogramme" ChangeClassName="" />
                                    <div className="form-group">
                                        <button className="btn btn-primary btnhover" type="button">Passer la commande</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    {/* <!-- Product END --> */}
                </section>
                
            </div>
        </>
    )
}
export default ShopCheckout;