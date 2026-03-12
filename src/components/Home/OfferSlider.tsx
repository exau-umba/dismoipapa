import React from "react";
import {Link} from 'react-router-dom';
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
//import "swiper/css";
import { Pagination } from "swiper";

import { bookImages, bookTitles, bookTags } from '../../constants/imageUrls';

const dataBlog = [
	{ image: bookImages[0], title: bookTitles[0], tags: bookTags[0] },
	{ image: bookImages[1], title: bookTitles[1], tags: bookTags[1] },
	{ image: bookImages[2], title: bookTitles[2], tags: bookTags[2] },
	{ image: bookImages[3], title: bookTitles[0], tags: bookTags[0] },
	{ image: bookImages[4], title: bookTitles[1], tags: bookTags[1] },
	{ image: bookImages[5], title: bookTitles[2], tags: bookTags[2] },
]; 

function OfferSlider() {
	const swiperRef = React.useRef(null)
	return (
		<>
					
            <div className="section-head book-align">
                <h2 className="title mb-0">Offres spéciales</h2>
                <div className="pagination-align style-1">
                    <div className="book-button-prev swiper-button-prev" onClick={() => swiperRef.current?.slidePrev()} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && swiperRef.current?.slidePrev()}><i className="fa-solid fa-angle-left"></i></div>
                    <div className="book-button-next swiper-button-next" onClick={() => swiperRef.current?.slideNext()} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && swiperRef.current?.slideNext()}><i className="fa-solid fa-angle-right"></i></div>
                </div>
            </div>	
            <Swiper className="swiper-container  book-swiper"
                onSwiper={(swiper) => { swiperRef.current = swiper }}
               // speed= {1500}
                //parallax= {true}
                slidesPerView={3}
                spaceBetween= {30}
                //loop={true}
                // pagination= {{
                //     el: ".swiper-pagination-two",
                //     clickable: true,
                // }}
                autoplay= {{
                    delay: 4000,
                }}
                modules={[Pagination]}
                breakpoints = {{
                    360: {
                        slidesPerView: 1,
                    },
                    600: {
                        slidesPerView: 1,
                    },
                    767: {
                        slidesPerView: 2,
                    },
                    991: {
                        slidesPerView: 2,
                    },
                    1200: {
                        slidesPerView: 3,
                    },
                    1680: {
                        slidesPerView: 3,
                    }
                }}						
            >	
            
                {dataBlog.map((item,ind)=>(
                    <SwiperSlide key={ind}>                       
                        <div className="dz-card style-2">
                            <div className="dz-media">
                                <Link to={"/books-detail"}><img src={item.image} alt="/" /></Link>
                            </div>
                            <div className="dz-info">
                                <h4 className="dz-title book-title-truncate" title={item.title}><Link to={"/books-detail"}>{item.title}</Link></h4>
                                <div className="dz-meta">
                                    <ul className="dz-tags">
                                        {item.tags.map((tag, k) => (
                                        <li key={k}><Link to={"/books-detail"} className={k < item.tags.length - 1 ? "me-1" : ""}>{tag}{k < item.tags.length - 1 ? ',' : ''}</Link></li>
                                        ))}
                                    </ul>
                                </div>
                                <p>Découvrez nos offres limitées sur une sélection de livres. Des romans et essais à prix réduits.</p>
                                <div className="bookcard-footer">
                                    <Link to={"/shop-cart"} className="btn btn-primary m-t15 btnhover btnhover2"><i className="flaticon-shopping-cart-1 m-r10"></i> Ajouter au panier</Link>
                                    <div className="price-details">
                                        50 000 FC <del>62 500 FC</del>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}										
            </Swiper>			
		</>
	)
}
export default OfferSlider;