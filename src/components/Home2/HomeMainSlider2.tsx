import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from 'swiper';

import { bookImages } from '../../constants/imageUrls';
import { fetchBooks, type Book } from '../../api/catalog';
import { API_BASE_URL } from '../../api/client';

export default function HomeMainSlider() {
	const [books, setBooks] = useState<Book[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchBooks()
			.then(setBooks)
			.catch(() => setBooks([]))
			.finally(() => setLoading(false));
	}, []);

	const displayBooks = books.length > 0 ? books : [];

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
								{loading ? (
									<div className="text-white">Chargement des livres…</div>
								) : displayBooks.length === 0 ? (
									<div className="text-white">Aucun livre pour le moment.</div>
								) : (
								<Swiper
									className="swiper-container main-swiper-thumb"
									spaceBetween={10}
									slidesPerView={"auto"}
									loop={displayBooks.length > 1}
									speed={1500}
									autoplay={displayBooks.length > 1 ? { delay: 2800 } : false}
									modules={[Autoplay]}
								>
									{displayBooks.map((book, index) => {
										const img = (book.cover_image && (book.cover_image.startsWith('http') ? book.cover_image : `${API_BASE_URL.replace(/\/$/, '')}${book.cover_image.startsWith('/') ? '' : '/'}${book.cover_image}`)) || bookImages[index % bookImages.length];
										const price = book.formats?.[0]?.price ?? '';
										return (
										<SwiperSlide key={book.id}>
											<Link to={`/books-detail/${book.id}`} className="text-decoration-none text-dark">
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
															src={img}
															alt={book.title}
															style={{
																width: '100%',
																height: '100%',
																objectFit: 'cover',
															}}
														/>
													</div>
													<div className="dz-content d-flex flex-column justify-content-between flex-grow-1">
														<div>
															<h6
																className="mb-1 book-title-truncate"
																title={book.title}
																style={{ fontSize: 14, textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}
															>
																{book.title}
															</h6>
															<div style={{ color: '#006af4', fontSize: 12 }}>
																<ul className="mb-2">
																	<li>par {book.author}</li>
																</ul>
															</div>
															<div className="price">
																<span className="price-num">{price ? `${price} FC` : '—'}</span>
															</div>
														</div>
													</div>
												</div>
											</Link>
										</SwiperSlide>
										);
									})}
								</Swiper>
								)}
							</div>
						</div>
					</div>
				</div>
			</section>
						
		</>
	);
}