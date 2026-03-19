import React,{useState} from 'react';
import {Link} from 'react-router-dom';

import { bookImages, bookTitles } from '../constants/imageUrls';
//Components 
import PageTitle from '../layouts/PageTitle';

const wishListData = [
    {id:'1', image: bookImages[0], title: bookTitles[0], price:'28.00', number: 1},
    {id:'2', image: bookImages[1], title: bookTitles[1], price:'28.00', number: 1},
    {id:'3', image: bookImages[2], title: bookTitles[2], price:'28.00', number: 1},
    {id:'4', image: bookImages[0], title: bookTitles[0], price:'28.00', number: 1},
    {id:'5', image: bookImages[1], title: bookTitles[1], price:'28.00', number: 1},
    {id:'6', image: bookImages[2], title: bookTitles[2], price:'28.00', number: 1},
];

function Wishlist(){
    const [wishData, setWishData] = useState(wishListData);
    const handleDeleteClick = (shopId) => {
        const newItem = [...wishData];    
        const index = wishData.findIndex((data)=> data.id === shopId);
        newItem.splice(index, 1);
        setWishData(newItem);
    }
	
	const handleNumPlus = (e) =>{
		let temp = wishData.map((data) => {
            if (e === data.id) {
                return { ...data, number: data.number + 1 };
            }
            return data;
        });
        setWishData(temp);
	}
	const handleNumMinus = (e) =>{

		let temp = wishData.map((data) => {
            if (e === data.id) {
                return { ...data, number: data.number > 0 ? data.number - 1 : data.number };
            }
            return data;
        });
        setWishData(temp);
	}
    return(
        <>
            <div className="page-content">
                <PageTitle  parentPage="Boutique" childPage="Favoris" />
                <section className="content-inner-1">
                    {/* <!-- Product --> */}
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="table-responsive">
                                    <table className="table check-tbl">
                                        <thead>
                                            <tr>
                                                <th>Produit</th>
                                                <th>Nom du produit</th>
                                                <th>Prix unitaire</th>
                                                <th>Quantité</th>
                                                <th>Ajouter au panier</th>
                                                <th>Supprimer</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {wishData.map((data, index)=>(
                                                <tr key={index}>
                                                    <td className="product-item-img"><img src={data.image} alt="" /></td>
                                                    <td className="product-item-name book-title-truncate" title={data.title}>{data.title}</td>
                                                    <td className="product-item-price">{data.price} $</td>
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
                                                    <td className="product-item-totle"><Link to={"/shop-cart"} className="btn btn-primary btnhover">Ajouter au panier</Link></td>
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
                        
                    </div>
                    {/* <!-- Product END --> */}
                </section>
            
            </div>
        </>
    )
}
export default Wishlist;