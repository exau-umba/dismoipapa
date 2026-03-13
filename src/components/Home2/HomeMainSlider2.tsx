import React from "react";
import {Link} from 'react-router-dom';
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";

//Images
import { bookImages, bookTitles } from '../../constants/imageUrls';

import { Autoplay } from 'swiper';
import { truncate } from "node:fs";

const homeData2 = [
	{ image: bookImages[0], title: bookTitles[0], price:'9.5' },
	{ image: bookImages[1], title: bookTitles[1], price:'10.4' },
	{ image: bookImages[2], title: bookTitles[2], price:'9.5' },
	{ image: bookImages[3], title: bookTitles[0], price:'10.4' },
];

export default function HomeMainSlider() {
	return (
		<>
			<section
				className="main-slider-hero text-white"
				style={{
					backgroundImage:
						"linear-gradient(rgba(26, 22, 104, 0.6), rgba(0, 106, 244, 0.6)), url(/images/bg-page-title.jpg)",
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					backgroundRepeat: 'no-repeat',
				}}
			>
				<div className="container">
					<div className="banner-content py-5">
						<div className="row align-items-center">
							<div className="col-md-6">
								<div className="swiper-content">
									<div className="content-info">
										<h6 className="mb-2" style={{ color: '#fff' }}>
											Librairie de Jean Richard MAMBWENI MABIALA
										</h6>
										<h1 className="title mb-3" style={{ color: '#fff' }}>
											Découvrez ses ouvrages disponibles ici
										</h1>
										<p className="text mb-4" style={{ color: '#fff' }}>
											Accédez en quelques clics aux principaux ouvrages de l’auteur, en
											version imprimée ou numérique, et suivez les nouvelles parutions.
										</p>
										<div className="content-btn">
											<Link className="btn btn-primary btnhover me-3" to={'/books-grid-view'}>
												Voir tous les livres
											</Link>
											<Link className="btn btn-outline-light btnhover" to={'/auteur'}>
												En savoir plus sur l'auteur
											</Link>
										</div>
									</div>
								</div>
							</div>
							<div className="col-md-6 mb-4 mb-md-0">
								<Swiper
									className="swiper-container main-swiper-thumb"
									spaceBetween={10}
									slidesPerView={"auto"}
									loop={true}
									speed={1500}
									autoplay={{
										delay: 2800,
									}}
									modules={[Autoplay]}
								>
									{homeData2.map((data, index) => (
										<SwiperSlide key={index}>
											<div
												className="books-card d-flex align-items-stretch"
												style={{
													width: 4000,
													height: 180,
													boxSizing: 'border-box',
													backgroundColor: '#fff',
												}}
											>
												<div
													className="dz-media"
													style={{
														width: 120,
														height: '100%',
														overflow: 'hidden',
														borderTopLeftRadius: 6,
														borderTopRightRadius: 6,
														borderBottomLeftRadius: 6,
														borderBottomRightRadius: 6,
													}}
												>
													<img
														src={data.image}
														alt="book"
														style={{
															width: '100%',
															height: '100%',
															objectFit: 'cover',
														}}
													/>
												</div>
												<div
													className="dz-content d-flex flex-column justify-content-between flex-grow-1"
													
												>
													<div>
														<h6
															className="mb-1 book-title-truncate"
															title={data.title}
															style={{ fontSize: 14, textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}
														>
															{data.title}
														</h6>
														<div style={{ color: '#006af4', fontSize: 12 }}>
															<ul className="mb-2">
																<li>par Jean Richard MAMBWENI MABIALA</li>
															</ul>
														</div>
														<div className="price">
															<span className="price-num">{data.price} FC</span>
														</div>
													</div>
													{/* <div className="book-footer d-flex justify-content-between align-items-center mt-1">

														<div className="rate" style={{ fontSize: 10 }}>
															<i className="flaticon-star text-primary"></i>
															<i className="flaticon-star text-primary"></i>
															<i className="flaticon-star text-primary"></i>
															<i className="flaticon-star text-primary"></i>
															<i className="flaticon-star text-primary"></i>
														</div>
													</div> */}
												</div>
											</div>
										</SwiperSlide>
									))}
								</Swiper>
							</div>
						</div>
					</div>
				</div>
			</section>
						
		</>
	)
}