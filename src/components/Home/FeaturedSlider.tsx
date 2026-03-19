import React from "react";
import {Link} from 'react-router-dom';
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
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

function FeaturedSlider() {
	const swiperRef = React.useRef(null)
    const paginationRef = React.useRef(null)
	return (
		<>			
            <Swiper className="swiper-container books-wrapper-2 swiper-three"
                onSwiper={(swiper) => { swiperRef.current = swiper }}
                //parallax= {true}
                centeredSlides={true}
                slidesPerView={"auto"}
                spaceBetween= {90}
                loop={true}
				speed={1000}
                pagination= {{
                    el: ".swiper-pagination-three",
                    clickable: true,
                }}
                //autoplay= {{
                //    delay: 4500,
                //}}
                modules={[Pagination]}
                breakpoints = {{
                    320: {
                        slidesPerView: 1,
                    },
                    1200: {
                        slidesPerView: 1,
                    },
                    1680: {
                        slidesPerView: 1,
                    },
                }}						
            >	
            
                {dataBlog.map((item,ind)=>(
                    <SwiperSlide key={ind}>                       
                        <div className="books-card style-2">
                            <div className="dz-media">
                                <img src={item.image} alt="book" />									
                            </div>
                            <div className="dz-content">
                                <h6 className="sub-title">BEST-SELLER</h6>
                                <h2 className="title book-title-truncate" title={item.title}>{item.title}</h2>
                                <ul className="dz-tags">
                                    {item.tags.map((tag, k) => (
                                    <li key={k}>{tag}</li>
                                    ))}
                                </ul>
                                <p className="text">Des ouvrages incontournables pour développer votre esprit et votre réussite. Une lecture essentielle pour tous.</p>
                                <div className="price">
                                    <span className="price-num">{45 + ind * 5}.0 $</span>
                                    <del>{55 + ind * 5} $</del>
                                    <span className="badge">-20 %</span>
                                </div>
                                <div className="bookcard-footer">
                                    <Link to={"/shop-cart"} className="btn btn-primary btnhover m-t15 m-r10">Acheter</Link>
                                    <Link to={"/books-detail"} className="btn btn-outline-secondary btnhover m-t15">Voir le détail</Link>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                    
                ))}	
                <div className="pagination-align style-2">
                    <div className="swiper-button-prev" onClick={() => swiperRef.current?.slidePrev()} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && swiperRef.current?.slidePrev()}><i className="fa-solid fa-angle-left"></i></div>
                    <div className="swiper-pagination-three" ref={paginationRef}></div>
                    <div className="swiper-button-next" onClick={() => swiperRef.current?.slideNext()} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && swiperRef.current?.slideNext()}><i className="fa-solid fa-angle-right"></i></div>
                </div>									
            </Swiper>			
		</>
	)
}
export default FeaturedSlider;