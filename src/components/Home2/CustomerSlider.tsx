import React from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";

//Images
import wave from './../../assets/images/testimonial/wave.png';
import { profileImages } from '../../constants/imageUrls';
import { Autoplay } from "swiper";

const clientData = [
	{image: profileImages[0]},
	{image: profileImages[1]},
]
export default function CustomerSlider() {
	return (
		<>
			<Swiper className="swiper-container  testimonial-swiper-2"						
				speed= {1500}
				parallax= {true}
				slidesPerView= {1}
				spaceBetween= {30}
				loop={true}
				autoplay= {{
				   delay: 2000,
				}}
				modules={[ Autoplay ]}
				
			>	
				{clientData.map((d,i)=>(
					<SwiperSlide key={i}>	
                        <div className="testimonial-2">
                            <i className="fa-solid fa-quote-right test-quotes"></i>
                            <img src={wave} className="pattern" alt="/" />
                            <div className="testimonial-pic">
                                <img src={d.image} alt="/" />
                            </div>
                            <div className="testimonial-info">
                                <p className="testimonial-text">
                                    Une expérience d'achat très agréable. Les livres sont bien emballés et livrés rapidement. Je recommande cette librairie à tous les amoureux de la lecture. Le choix est vaste et le service client réactif.
                                </p>
                                <div className="testimonial-detail">
                                    <div className="clearfix">
                                        <h5 className="testimonial-name m-t10 m-b5">Marie Dupont</h5> 
                                        <span className="testimonial-position">Faculté d'économie 2022</span> 
                                    </div>
                                    <div className="dz-rating-bar">
                                        <ul className="dz-rating">
                                            <li><i className="flaticon-star text-primary"></i></li>	
                                            <li><i className="flaticon-star text-primary"></i></li>	
                                            <li><i className="flaticon-star text-primary"></i></li>	
                                            <li><i className="flaticon-star text-primary"></i></li>		
                                            <li><i className="flaticon-star text-muted"></i></li>		
                                        </ul>
                                        <span className="rate">4.8</span>
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