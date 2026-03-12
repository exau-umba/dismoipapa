import React from "react";
//import {Link} from 'react-router-dom';
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
//import "swiper/css";
import { Pagination } from "swiper";

import { profileImages } from '../../constants/imageUrls';

const testBlog = [
	{ image: profileImages[0], title:'Jason Huang'},
	{ image: profileImages[1], title:'Miranda Lee'},
	{ image: profileImages[2], title:'Steve Henry'},
	{ image: profileImages[3], title:'Angela Moss'},
	{ image: profileImages[4], title:'Miranda Lee'},
	{ image: profileImages[0], title:'Jason Huang'},
]; 

function TestimonialSlider() {
	const swiperRef = React.useRef(null)
	return (
		<>
            <div className="container">
				<div className="testimonial">
					<div className="section-head book-align">
						<div>
							<h2 className="title mb-0">Témoignages</h2>
							<p className="m-b0">Ce que nos clients disent de leur expérience d'achat et de lecture.</p>
						</div>
						<div className="pagination-align style-1">
							<div className="testimonial-button-prev swiper-button-prev" onClick={() => swiperRef.current?.slidePrev()} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && swiperRef.current?.slidePrev()}><i className="fa-solid fa-angle-left"></i></div>
							<div className="testimonial-button-next swiper-button-next" onClick={() => swiperRef.current?.slideNext()} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && swiperRef.current?.slideNext()}><i className="fa-solid fa-angle-right"></i></div>
						</div>
					</div>
				</div>
			</div>
            <Swiper className="swiper-container  testimonial-swiper"
                onSwiper={(swiper) => { swiperRef.current = swiper }}
               // speed= {1500}
                //parallax= {true}
                slidesPerView={3}
                spaceBetween= {30}
                loop={true}
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
                    1200: {
                        slidesPerView: 3,
                    },
                }}						
            >	
            
                {testBlog.map((item,ind)=>(
                    <SwiperSlide key={ind}>                       
                        <div className="testimonial-1" >
							<div className="testimonial-info">
								<ul className="dz-rating">
									<li><i className="flaticon-star text-primary"></i></li>	
									<li><i className="flaticon-star text-primary"></i></li>	
									<li><i className="flaticon-star text-primary"></i></li>	
									<li><i className="flaticon-star text-primary"></i></li>	
									<li><i className="flaticon-star text-primary"></i></li>	
								</ul>
								<div className="testimonial-text">
									<p>Excellente librairie. Les livres reçus m'ont beaucoup aidé dans mes études. Je recommande vivement !</p>
								</div>
								<div className="testimonial-detail">
									<div className="testimonial-pic">
										<img src={item.image} alt="" />
									</div>
									<div className="info-right">
										<h6 className="testimonial-name">{item.title}</h6> 
										<span className="testimonial-position">Amateur de livres</span> 
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
export default TestimonialSlider;