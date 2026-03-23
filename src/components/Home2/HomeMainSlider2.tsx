import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from 'swiper';

import { bookImages } from '../../constants/imageUrls';
import { fetchBooks, type Book } from '../../api/catalog';
import { listCatalogs } from '../../api/admin';
import { API_BASE_URL } from '../../api/client';

export default function HomeMainSlider() {
	const [books, setBooks] = useState<Book[]>([]);
	const [catalogNames, setCatalogNames] = useState<Record<string, string>>({});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		Promise.all([fetchBooks(), listCatalogs().catch(() => [])])
			.then(([bookList, catalogs]) => {
				setBooks(bookList);
				const map: Record<string, string> = {};
				catalogs.forEach((c) => {
					map[c.id] = c.name;
				});
				setCatalogNames(map);
			})
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
									<Swiper
										className="swiper-container main-swiper-thumb"
										spaceBetween={10}
										slidesPerView={"auto"}
										loop={false}
										speed={1500}
										autoplay={false}
										modules={[Autoplay]}
										aria-hidden="true"
									>
										{Array.from({ length: 3 }).map((_, index) => (
											<SwiperSlide key={`book-skeleton-${index}`}>
												<div className="books-card home-hero-book-card d-flex flex-row align-items-stretch">
													<div className="dz-media home-hero-book-card__cover home-hero-book-skeleton-block flex-shrink-0" />
													<div className="dz-content home-hero-book-card__body flex-grow-1 d-flex flex-column justify-content-center">
														<div className="home-hero-book-skeleton-line home-hero-book-skeleton-line--title" />
														<div className="home-hero-book-skeleton-line home-hero-book-skeleton-line--category" />
														<div className="home-hero-book-card__prices mt-2">
															<div className="home-hero-book-skeleton-line home-hero-book-skeleton-line--price" />
															<div className="home-hero-book-skeleton-line home-hero-book-skeleton-line--price short" />
														</div>
													</div>
												</div>
											</SwiperSlide>
										))}
									</Swiper>
								) : displayBooks.length === 0 ? (
									<div className="text-white">Aucun livre pour le moment.</div>
								) : (
								<Swiper
									className="swiper-container main-swiper-thumb"
									spaceBetween={10}
									slidesPerView={"auto"}
									loop={displayBooks.length > 1}
									speed={1500}
									autoplay={displayBooks.length > 1 ? { delay: 5000, disableOnInteraction: false } : false}
									modules={[Autoplay]}
								>
									{displayBooks.map((book, index) => {
										const img = (book.cover_image && (book.cover_image.startsWith('http') ? book.cover_image : `${API_BASE_URL.replace(/\/$/, '')}${book.cover_image.startsWith('/') ? '' : '/'}${book.cover_image}`)) || bookImages[index % bookImages.length];
										const ebookPrice = book.formats?.find((f) => (f.format_type ?? '') === 'ebook')?.price ?? '';
										const physicalPrice = book.formats?.find((f) => (f.format_type ?? '') === 'physical')?.price ?? '';
										const categoryLabel =
											(book.catalog && catalogNames[book.catalog]) || '';
										return (
										<SwiperSlide key={book.id}>
											<Link to={`/books-detail/${book.id}`} className="text-decoration-none text-dark d-block h-100">
												{/* Disposition wireframe : photo à gauche | titre + Physique + E-book à droite */}
												<div className="books-card home-hero-book-card d-flex flex-row align-items-stretch">
													<div className="dz-media home-hero-book-card__cover flex-shrink-0">
														<img src={img} alt={book.title} />
													</div>
													<div className="dz-content home-hero-book-card__body flex-grow-1 d-flex flex-column justify-content-center">
														<h6
															className="home-hero-book-card__title book-title-truncate mb-0"
															title={book.title}
														>
															{book.title}
														</h6>
														<p
															className="home-hero-book-card__category mb-0"
															title={categoryLabel ? `Catégorie : ${categoryLabel}` : undefined}
														>
															{/* <span className="home-hero-book-card__category-prefix">Catégorie : </span> */}
															{categoryLabel || '—'}
														</p>
														<div className="home-hero-book-card__prices mt-2">
															<div className="home-hero-book-card__price-line">
																Physique :{' '}
																<span className="text-primary fw-bold">
																	{physicalPrice ? `${physicalPrice} $` : '—'}
																</span>
															</div>
															<div className="home-hero-book-card__price-line">
																E-book :{' '}
																<span className="text-primary fw-bold">
																	{ebookPrice ? `${ebookPrice} $` : '—'}
																</span>
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