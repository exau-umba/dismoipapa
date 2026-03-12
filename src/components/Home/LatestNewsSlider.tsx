import React from "react";
import {Link} from 'react-router-dom';
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
//import "swiper/css";
//import { Navigation, Pagination } from "swiper";

import { blogImages } from '../../constants/imageUrls';

const testBlog = [
	{ image: blogImages[0], title:'Benefits of reading: Smart, Diligent, Happy, Intelligent'},
	{ image: blogImages[1], title:'10 Things you must know to improve your reading skills'},
	{ image: blogImages[2], title:'We Must know why reading is important for children?'},
	{ image: blogImages[3], title:'Benefits of reading: Smart, Diligent, Happy, Intelligent'},
]; 

function LatestNewsSlider() {
	return (
		<>
            <Swiper className="swiper-container  blog-swiper"						
               // speed= {1500}
                //parallax= {true}
                slidesPerView={4}
                spaceBetween= {30}
                loop={true}
                
                autoplay= {{
                    delay: 2500,
                }}								
                   
                modules={[]}
                breakpoints = {{
                    1200: {
                        slidesPerView: 4,
                    },
                    1024: {
                        slidesPerView: 3,
                    },
                    991: {
                        slidesPerView: 2,
                    },
                    600: {
                        slidesPerView: 2,
                    },
                    320: {
                        slidesPerView: 1,
                    },
                }}						
            >	
            
                {testBlog.map((item,ind)=>(
                    <SwiperSlide key={ind}>                       
                        <div className="dz-blog style-1 bg-white m-b30">
                            <div className="dz-media">
                                <Link to={"/blog-detail"}><img src={item.image} alt="blog1" /></Link>
                            </div>
                            <div className="dz-info p-3">
                                <h6 className="dz-title">
                                    <Link to={"/blog-detail"}>{item.title}</Link>
                                </h6>
                                <p className="m-b0">Actualités, conseils de lecture et chroniques de notre librairie.</p>
                                <div className="dz-meta meta-bottom mt-3 pt-3">
                                    <ul className="">
                                        <li className="post-date"><i className="far fa-calendar fa-fw m-r10"></i>24 March, 2022</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}										
            </Swiper>			
		</>
	)
}
export default LatestNewsSlider;