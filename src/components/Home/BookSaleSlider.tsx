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

function BookSaleSlider() {
	const swiperRef = React.useRef(null)
    const paginationRef = React.useRef(null)
	return (
		<>
			
            <div className="section-head book-align">
                <h2 className="title mb-0">Livres en promotion</h2>
                <div className="pagination-align style-1">
                    <div className="swiper-button-prev" onClick={() => swiperRef.current?.slidePrev()} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && swiperRef.current?.slidePrev()}><i className="fa-solid fa-angle-left"></i></div>
                     <div className="swiper-pagination-two" ref={paginationRef}></div> 
                    <div className="swiper-button-next" onClick={() => swiperRef.current?.slideNext()} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && swiperRef.current?.slideNext()}><i className="fa-solid fa-angle-right"></i></div>
                </div>
            </div>				
            <Swiper className="swiper-container books-wrapper-3 swiper-four"
                onSwiper={(swiper) => { swiperRef.current = swiper }}
                speed= {1500}
                parallax= {true}
                slidesPerView={5}
                spaceBetween= {30}
                loop={true}
                pagination= {{
                    el: ".swiper-pagination-two",
                    clickable: true,
                }}
                autoplay= {{
                    delay: 3000,
                }}
                modules={[Pagination]}
                breakpoints = {{
                    1200: {
                        slidesPerView: 5,
                    },
                    1191: {
                        slidesPerView: 4,
                    },
                    767: {
                        slidesPerView: 3,
                    },
                    591: {
                        slidesPerView: 2,
                        centeredSlides: true,
                    },
                    320: {
                        slidesPerView: 2,
                        spaceBetween: 15,
                        centeredSlides: true,
                    },
                }}						
            >	
            
                {dataBlog.map((item,ind)=>(
                    <SwiperSlide key={ind}>                       
                        <div className="books-card style-3 wow fadeInUp" data-wow-delay="0.1s">
                            <div className="dz-media">
                                <img src={item.image} alt="book" />									
                            </div>
                            <div className="dz-content">
                                <h5 className="title book-title-truncate" title={item.title}><Link to={"/books-grid-view"}>{item.title}</Link></h5>
                                <ul className="dz-tags">
                                    {item.tags.map((tag, k) => (
                                    <li key={k}><Link to={"/books-grid-view"}>{tag}{k < item.tags.length - 1 ? ',' : ''}</Link></li>
                                    ))}
                                </ul>
                                <div className="book-footer">
                                    <div className="rate">
                                        <i className="flaticon-star"></i> {ind+1}.8
                                    </div>
                                    <div className="price">
                                        <span className="price-num">{ind+2},5 FC</span>
                                        <del>12 FC</del>
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
export default BookSaleSlider;