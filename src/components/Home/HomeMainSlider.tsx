import React,{useState} from "react";
import {Link} from 'react-router-dom';
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";

//Images
import bgwave from './../../assets/images/background/waveelement.png';
import partner1 from './../../assets/images/partner/partner-1.png';
import partner2 from './../../assets/images/partner/partner-2.png';
import partner3 from './../../assets/images/partner/partner-3.png';
import group from './../../assets/images/Group.png';
import { bookImages, bannerBookImages, bookTitles } from '../../constants/imageUrls';



//import { EffectFade, Autoplay , Parallax, Pagination} from "swiper";


import SwiperCore, {EffectFade, Autoplay, FreeMode, Parallax,Thumbs, Pagination} from 'swiper';
SwiperCore.use([Parallax,Thumbs, FreeMode,Autoplay, Pagination, EffectFade ]);


const homeData1 = [
	{ image: bannerBookImages[0], title: bookTitles[0], datatitle: 'BEST-SELLER', price:'9.5', mainprice:'12.0', offer:'25%' },
	{ image: bannerBookImages[1], title: bookTitles[1], datatitle: 'MEILLEUR MANAGEMENT', price:'10.4', mainprice:'15.25', offer:'33%' },
];

const homeData2 = [
	{ image: bookImages[0], title: bookTitles[0], price:'9.5' },
	{ image: bookImages[1], title: bookTitles[1], price:'10.4' },
	{ image: bookImages[2], title: bookTitles[2], price:'9.5' },
	{ image: bookImages[3], title: bookTitles[0], price:'10.4' },
];

export default function HomeMainSlider() {
	const [thumbsSwiper, setThumbsSwiper] = useState(null);	
	const paginationRef = React.useRef(null)   	
	return (
		<>
			<Swiper className="swiper-container main-swiper "						
				speed= {1500}
				parallax= {true}
				//spaceBetween= {10}
				//freeMode={true}
				effect={"fade"}
				slidesPerView= {"auto"}
				loop={false}                
				//watchSlidesProgress= {true}
				pagination= {{
					el: ".swiper-pagination-five",
					clickable: true,
				}}
				autoplay= {{
					delay: 1500,
				}}
				thumbs={{swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null}}
				modules={[ Autoplay, Pagination, Parallax ]}
				
			>	
				{homeData1.map((data, index)=>(
					<SwiperSlide className="bg-blue" key={index} style={{backgroundImage: 'url('+ bgwave +')'}}>
						<div className="container">
							<div className="banner-content">
								<div className="row">
									<div className="col-md-6">
										<div className="swiper-content">
											<div className="content-info">
												<h6 className="sub-title" data-swiper-parallax="-10">{data.datatitle}</h6>
												<h1 className="title mb-0 book-title-truncate" data-swiper-parallax="-20" title={data.title}>{data.title}</h1>
												<ul className="dz-tags" data-swiper-parallax="-30">
													<li><Link to={"#"}>Poésie</Link></li>
													<li><Link to={"#"}>Fables</Link></li>
													<li><Link to={"#"}>Technique</Link></li>
													<li><Link to={"#"}>Roman</Link></li>
												</ul>
												<p className="text mb-0" data-swiper-parallax="-40">Découvrez des ouvrages qui ont marqué des générations. Des classiques du développement personnel et du business.</p>
												<div className="price" data-swiper-parallax="-50">
													<span className="price-num">{data.price} FC</span>
													<del>{data.mainprice} FC</del>
													<span className="badge badge-danger">-{data.offer}</span>
												</div>
												<div className="content-btn" data-swiper-parallax="-60">
													<Link className="btn btn-primary btnhover" to={"/books-grid-view"}>Acheter</Link>
													<Link className="btn border btnhover ms-4 text-white" to={"/books-detail"}>Voir le détail</Link>
												</div>
											</div>
											<div className="partner">
												<p>Nos partenaires</p>
												<div className="brand-logo">
													<img src={partner1} alt="client" />
													<img  className="mid-logo" src={partner2} alt="client" />
													<img src={partner3} alt="client" />
												</div>
											</div>
										</div>
									</div>
									<div className="col-md-6">
										<div className="banner-media" data-swiper-parallax="-100">
											<img src={data.image} alt="banner-media" />
										</div>
										<img className="pattern" src={group} data-swiper-parallax="-100" alt="dots" />
									</div>
								</div>
							</div>
						</div>
					</SwiperSlide>
				))}	
				<div className="container swiper-pagination-wrapper">
					<div className="swiper-pagination-five" ref={paginationRef}></div>
				</div>
			</Swiper>
					
			
			<div ref={paginationRef} className="swiper-pagination-about about-pagination swiper-pagination-clickable swiper-pagination-bullets" ></div>
					
			<Swiper className="swiper-container main-swiper-thumb"
				 onSwiper={setThumbsSwiper}
				//onSwiper={(e)=>console.log(e.swiper)}
				spaceBetween= {10}
				slidesPerView= {"auto"}
				//slidesPerView= {"auto"}
				//slidesPerView= {1}
				loop={true}
				speed={1500}
				//freeMode={true}
				//effect={"fade"}				
				watchSlidesProgress= {true}
				autoplay={{
					delay: 2800,
				}}
				modules={[ EffectFade, Autoplay,Pagination]}
			>
				{homeData2.map((data, index)=>(
					<SwiperSlide key={index}>
						<div className="books-card">
							<div className="dz-media">
								<img src={data.image} alt="book" />									
							</div>
							<div className="dz-content">
								<h5 className="title mb-0 book-title-truncate" title={data.title}>{data.title}</h5>
								<div className="dz-meta">
									<ul>
										<li>par Jean Richard MAMBWENI MABIALA</li>
									</ul>
								</div>
								<div className="book-footer">
									<div className="price">
										<span className="price-num">{data.price} FC</span>
									</div>
									<div className="rate">
										<i className="flaticon-star text-primary"></i>
										<i className="flaticon-star text-primary"></i>
										<i className="flaticon-star text-primary"></i>
										<i className="flaticon-star text-primary"></i>
										<i className="flaticon-star text-primary"></i>
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