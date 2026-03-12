import React,{useState} from 'react';
import {Link} from 'react-router-dom';
import Form from 'react-bootstrap/Form';

import { bookImages, bookTitles } from '../constants/imageUrls';
//Components 
import PageTitle from '../layouts/PageTitle';

const cartDetial = [
    {id:'1', image: bookImages[0], title: bookTitles[0], price:'28.00', number: 0},
    {id:'2', image: bookImages[1], title: bookTitles[1], price:'28.00', number: 0},
    {id:'3', image: bookImages[2], title: bookTitles[2], price:'28.00', number: 0},
    {id:'4', image: bookImages[0], title: bookTitles[0], price:'28.00', number: 0},
    {id:'5', image: bookImages[1], title: bookTitles[1], price:'28.00', number: 0},
    {id:'6', image: bookImages[2], title: bookTitles[2], price:'28.00', number: 0},
];

function ShopCart(){
    const [shopData, setShopData] = useState(cartDetial);
    const handleDeleteClick = (shopId) => {
        const newItem = [...shopData];    
        const index = shopData.findIndex((data)=> data.id === shopId);
        newItem.splice(index, 1);
        setShopData(newItem);
    }
	
	const handleNumPlus = (e) =>{
		let temp = shopData.map((data) => {
            if (e === data.id) {
                return { ...data, number: data.number + 1 };
            }
            return data;
        });
        setShopData(temp);
	}
	const handleNumMinus = (e) =>{

		let temp = shopData.map((data) => {
            if (e === data.id) {
                return { ...data, number: data.number > 0 ? data.number - 1 : data.number };
            }
            return data;
        });
        setShopData(temp);
	}
    return(
        <>
            <div className="page-content">
                <PageTitle  parentPage="Boutique" childPage="Panier" />
                <section className="content-inner shop-account">
                    {/* <!-- Product --> */}
                    <div className="container">
                        <div className="row mb-5">
                            <div className="col-lg-12">
                                <div className="table-responsive">
                                    <table className="table check-tbl">
                                        <thead>
                                            <tr>
                                                <th>Produit</th>
                                                <th>Nom du produit</th>
                                                <th>Prix unitaire</th>
                                                <th>Quantité</th>
                                                <th>Total</th>
                                                <th className="text-end">Supprimer</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {shopData.map((data, index)=>(
                                                <tr key={index}>
                                                    <td className="product-item-img"><img src={data.image} alt="" /></td>
                                                    <td className="product-item-name book-title-truncate" title={data.title}>{data.title}</td>
                                                    <td className="product-item-price">{data.price} FC</td>
                                                    <td className="product-item-quantity">
                                                        <div className="quantity btn-quantity style-1 me-3">
                                                            <button className="btn btn-plus" type="button" 
                                                                onClick={()=> {handleNumPlus(data.id)}}>
                                                                <i className="ti-plus"></i>
                                                            </button>
                                                                <input type="text" className="quantity-input" value={data.number} />
                                                            <button className="btn btn-minus " type="button"
                                                                onClick={()=>{handleNumMinus(data.id)}}>
                                                                <i className="ti-minus"></i>
                                                            </button>    
                                                        </div>
                                                    </td>
                                                    <td className="product-item-totle">{data.price} FC</td>
                                                    <td className="product-item-close">
                                                        <Link to={"#"} className="ti-close" onClick={()=>handleDeleteClick(data.id)}></Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            
                        </div>
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="widget">
                                    <form className="shop-form"> 
                                        <h4 className="widget-title">Livraison</h4>
                                        <div className="form-group">
                                            
                                            <Form.Select aria-label="Type de carte">
                                                <option>Type de carte</option>
                                                <option value="1">Carte avec cashback</option>
                                                <option value="2">Carte voyage</option>
                                                <option value="3">Carte professionnelle</option>
                                            </Form.Select>
                                        </div>	
                                        <div className="row">
                                            <div className="form-group col-lg-6">
                                                <input type="text" className="form-control" placeholder="Numéro de carte" />
                                            </div>
                                            <div className="form-group col-lg-6">
                                                <input type="text" className="form-control" placeholder="Cryptogramme" />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <input type="text" className="form-control" placeholder="Code promo" />
                                        </div>
                                        <div className="form-group">
                                            <Link to={"#"} className="btn btn-primary btnhover" type="button">Appliquer le code</Link>
                                        </div>
                                    </form>	
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="widget">
                                    <h4 className="widget-title">Récapitulatif du panier</h4>
                                    <table className="table-bordered check-tbl m-b25">
                                        <tbody>
                                            <tr>
                                                <td>Sous-total</td>
                                                <td>125 960 FC</td>
                                            </tr>
                                            <tr>
                                                <td>Livraison</td>
                                                <td>Livraison gratuite</td>
                                            </tr>
                                            <tr>
                                                <td>Code promo</td>
                                                <td>28 000 FC</td>
                                            </tr>
                                            <tr>
                                                <td>Total</td>
                                                <td>506 000 FC</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div className="form-group m-b25">
                                        <Link to={"/shop-checkout"} className="btn btn-primary btnhover" type="button">Passer la commande</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <!-- Product END --> */}
                </section>
            
            </div>
        </>
    )
}
export default ShopCart;