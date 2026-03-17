import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Collapse, Form } from 'react-bootstrap';
import PageTitle from '../layouts/PageTitle';
import { useCart } from '../context/CartContext';

const inputData = [
    {name1: 'Appartement, bâtiment, etc.', name2:'Ville'},
    {name1: 'Région / Province', name2:'Code postal'},
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

function ShopCheckout() {
    const [accordBtn, setAccordBtn] = useState(false);
    const { items: orderItems, subtotal } = useCart();
    return (
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
                                            <Form.Select aria-label="Pays">
                                                <option value="CD">République démocratique du Congo</option>
                                                <option value="CG">République du Congo</option>
                                                <option value="RW">Rwanda</option>
                                                <option value="BI">Burundi</option>
                                                <option value="UG">Ouganda</option>
                                            </Form.Select>	
                                        </div>
                                        <div className="row">
                                            <SingleInput ChangeClassName="col-md-6" title="Prénom" />
                                            <SingleInput ChangeClassName="col-md-6" title="Nom" />
                                        </div>
                                        <SingleInput title="Société (optionnel)" ChangeClassName="" />
                                        <SingleInput title="Adresse (rue, numéro...)" ChangeClassName="" />
                                        {inputData.map((data, index)=>(
                                            <div className="row" key={index}>
                                                <div className="form-group col-md-6">
                                                    <input type="text" className="form-control" placeholder={data.name1} />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <input type="text" className="form-control" placeholder={data.name2} />
                                                </div>
                                            </div>
                                        ))}                                        
                                        <button className="btn btn-outline-primary btnhover mb-3" type="button" data-bs-toggle="collapse" data-bs-target="#create-an-account">Créer un compte client <i className="fa fa-arrow-circle-o-down"></i></button>
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
                                                
                                                <Form.Select aria-label="Pays de livraison">
                                                    <option value="CD">République démocratique du Congo</option>
                                                    <option value="CG">République du Congo</option>
                                                    <option value="RW">Rwanda</option>
                                                    <option value="BI">Burundi</option>
                                                    <option value="UG">Ouganda</option>
                                                </Form.Select>
                                            </div>
                                            <div className="row">
                                                <SingleInput ChangeClassName="col-md-6" title="Prénom" />
                                                <SingleInput ChangeClassName="col-md-6" title="Nom" />
                                            </div>
                                            <SingleInput title="Société (optionnel)" ChangeClassName="" />
                                            <SingleInput title="Adresse (rue, numéro...)" ChangeClassName="" />
                                            {inputData.map((data, index)=>(
                                                <div className="row" key={index}>
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
                        <div className="row g-4 align-items-start">
                            <div className="col-lg-6">
                                <div className="widget h-100 p-3 p-md-4 bg-white shadow-sm">
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
                                            {orderItems.length === 0 ? (
                                                <tr><td colSpan={3} className="text-center text-muted py-3">Panier vide. <Link to="/books-grid-view">Voir les livres</Link></td></tr>
                                            ) : (
                                                orderItems.map((item) => (
                                                <tr key={item.bookId}>
                                                    <td className="product-item-img"><img src={item.coverImage} alt="" style={{ maxWidth: 60, maxHeight: 90, objectFit: 'contain' }} /></td>
                                                    <td className="product-item-name book-title-truncate" title={item.title}>{item.title} × {item.quantity}</td>
                                                    <td className="product-price">{(parseFloat(item.price || '0') * item.quantity).toFixed(0)} FC</td>
                                                </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <form className="shop-form widget h-100 p-3 p-md-4 bg-white shadow-sm">
                                    <h4 className="widget-title">Total de la commande</h4>
                                    <table className="table-bordered check-tbl mb-4">
                                        <tbody>
                                            <tr>
                                                <td>Sous-total</td>
                                                <td className="product-price">{subtotal.toFixed(0)} FC</td>
                                            </tr>
                                            <tr>
                                                <td>Livraison</td>
                                                <td>À préciser</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Total</strong></td>
                                                <td className="product-price-total"><strong>{subtotal.toFixed(0)} FC</strong></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <h4 className="widget-title">Mode de paiement (simulation)</h4>
                                    <SingleInput title="Nom sur la carte / compte" ChangeClassName="" />
                                    <div className="form-group">
                                        <Form.Select aria-label="Moyen de paiement">
                                            <option value="card">Carte bancaire (simulation)</option>
                                            <option value="mobile">Mobile Money (simulation)</option>
                                        </Form.Select>
                                    </div>
                                    <SingleInput title="Numéro de carte / téléphone" ChangeClassName="" />
                                    <SingleInput title="Référence paiement (optionnel)" ChangeClassName="" />
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