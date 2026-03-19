import React from "react";
import {Link} from 'react-router-dom';
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";

import { bookImages, bookTitles } from '../../constants/imageUrls';
import { Autoplay } from "swiper";

const dataBlog = [
	{ image: bookImages[0], title: bookTitles[0], price:'18 780 $' },
	{ image: bookImages[1], title: bookTitles[1], price:'20 500 $' },
	{ image: bookImages[2], title: bookTitles[2], price:'25 500 $' },
	{ image: bookImages[3], title: bookTitles[0], price:'16 700 $' },
	{ image: bookImages[4], title: bookTitles[1], price:'19 250 $' },
	{ image: bookImages[5], title: bookTitles[2], price:'27 300 $' },
	{ image: bookImages[6], title: bookTitles[0], price:'24 890 $' },
];

export default function RecomendedSlider() {
	
	return (
		<>
			<Swiper className="swiper-container  swiper-two"						
				speed= {1500}
				//parallax= {true}
				slidesPerView= {5}
				spaceBetween= {30}
				loop={true}
				autoplay= {{
				   delay: 2500,
				}}
				modules={[ Autoplay ]}
				breakpoints = {{
					1200: {
                        slidesPerView: 5,
                    },
                    1024: {
                        slidesPerView: 4,
                    },
                    991: {
                        slidesPerView: 3,
                    },
                    767: {
                        slidesPerView: 3,
                        centeredSlides: true,
                    },
                    320: {
                        slidesPerView: 2,
                        spaceBetween: 15,
                        centeredSlides: true,
                    },
				}}
			>	
				{dataBlog.map((d,i)=>(
					<SwiperSlide key={i}>						
                        <div className="books-card style-1 wow fadeInUp" data-wow-delay="0.1s">
                            <div className="dz-media">
                                <img src={d.image} alt="book" />									
                            </div>
                            <div className="dz-content">
                                <h4 className="title book-title-truncate" title={d.title}>{d.title}</h4>
                                <span className="price">{d.price}</span>
                                <Link to={"/shop-cart"} className="btn btn-secondary btnhover btnhover2"><i className="flaticon-shopping-cart-1 m-r10"></i> Ajouter au panier</Link>
                            </div>
                        </div>						
					</SwiperSlide>
				))}				
			</Swiper>
		</>
	)
}