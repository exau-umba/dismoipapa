import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Collapse, Dropdown } from 'react-bootstrap';

import ClientsSlider from '../components/Home/ClientsSlider';
import CounterSection from '../elements/CounterSection';
import NewsLetter from '../components/NewsLetter';
import ErrorMessage from '../components/ErrorMessage';
import { bookImages } from '../constants/imageUrls';
import { fetchBooks, type Book } from '../api/catalog';
import { listCatalogs, type Catalog } from '../api/admin';
import { API_BASE_URL } from '../api/client';
import { getFriendlyErrorMessage } from '../utils/errorMessages';
import { useCart } from '../context/CartContext';

function ShopList() {
    const [accordBtn, setAccordBtn] = useState<boolean>(false);
    const [selectBtn, setSelectBtn] = useState('Newest');
    const [books, setBooks] = useState<Book[]>([]);
    const [catalogs, setCatalogs] = useState<Catalog[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [selections, setSelections] = useState<Record<string, { productType: 'ebook' | 'physical' | ''; fileFormat: 'pdf' | 'epub' | null }>>({});
    const { addItem } = useCart();
    const catalogId = (searchParams.get('catalog') || '').trim();

    useEffect(() => {
        listCatalogs().then(setCatalogs).catch(() => setCatalogs([]));
    }, []);

    useEffect(() => {
        const loadBooks = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchBooks();
                setBooks(data);
            } catch (err) {
                setError(getFriendlyErrorMessage(err));
            } finally {
                setLoading(false);
            }
        };
        loadBooks();
    }, []);

    const handleCatalogCheck = (id: string) => {
        const next = new URLSearchParams(searchParams);
        if (id) next.set('catalog', id);
        else next.delete('catalog');
        setSearchParams(next);
    };

    const filteredBooks = React.useMemo(() => {
        if (!catalogId) return books;
        return books.filter((b) => b.catalog === catalogId);
    }, [books, catalogId]);
    return(
        <>
            <div className="page-content bg-grey">
                <section className="content-inner-1 border-bottom">
                    <div className="container">
                        <div className="d-flex justify-content-between align-items-center">
                            <h4 className="title">Les livres de Jean Richard MAMBWENI MABIALA</h4>
                        </div>
                        <div className="filter-area m-b30">
                            <div className="grid-area">
                                <div className="shop-tab">
                                    <ul className="nav text-center product-filter justify-content-end" role="tablist">
                                        <li className="nav-item">
                                            <Link to={"#"} className="nav-link" >
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M3 5H21C21.2652 5 21.5196 4.89464 21.7071 4.7071C21.8946 4.51957 22 4.26521 22 4C22 3.73478 21.8946 3.48043 21.7071 3.29289C21.5196 3.10536 21.2652 3 21 3H3C2.73478 3 2.48043 3.10536 2.29289 3.29289C2.10536 3.48043 2 3.73478 2 4C2 4.26521 2.10536 4.51957 2.29289 4.7071C2.48043 4.89464 2.73478 5 3 5Z" fill="#AAAAAA"></path>
                                                <path d="M3 13H21C21.2652 13 21.5196 12.8947 21.7071 12.7071C21.8946 12.5196 22 12.2652 22 12C22 11.7348 21.8946 11.4804 21.7071 11.2929C21.5196 11.1054 21.2652 11 21 11H3C2.73478 11 2.48043 11.1054 2.29289 11.2929C2.10536 11.4804 2 11.7348 2 12C2 12.2652 2.10536 12.5196 2.29289 12.7071C2.48043 12.8947 2.73478 13 3 13Z" fill="#AAAAAA"></path>
                                                <path d="M3 21H21C21.2652 21 21.5196 20.8947 21.7071 20.7071C21.8946 20.5196 22 20.2652 22 20C22 19.7348 21.8946 19.4804 21.7071 19.2929C21.5196 19.1054 21.2652 19 21 19H3C2.73478 19 2.48043 19.1054 2.29289 19.2929C2.10536 19.4804 2 19.7348 2 20C2 20.2652 2.10536 20.5196 2.29289 20.7071C2.48043 20.8947 2.73478 21 3 21Z" fill="#AAAAAA"></path>
                                                </svg>
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link to={"/books-grid-view"} className="nav-link">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M3 11H10C10.2652 11 10.5196 10.8946 10.7071 10.7071C10.8946 10.5196 11 10.2652 11 10V3C11 2.73478 10.8946 2.48043 10.7071 2.29289C10.5196 2.10536 10.2652 2 10 2H3C2.73478 2 2.48043 2.10536 2.29289 2.29289C2.10536 2.48043 2 2.73478 2 3V10C2 10.2652 2.10536 10.5196 2.29289 10.7071C2.48043 10.8946 2.73478 11 3 11ZM4 4H9V9H4V4Z" fill="#AAAAAA"></path>
                                                <path d="M14 11H21C21.2652 11 21.5196 10.8946 21.7071 10.7071C21.8946 10.5196 22 10.2652 22 10V3C22 2.73478 21.8946 2.48043 21.7071 2.29289C21.5196 2.10536 21.2652 2 21 2H14C13.7348 2 13.4804 2.10536 13.2929 2.29289C13.1054 2.48043 13 2.73478 13 3V10C13 10.2652 13.1054 10.5196 13.2929 10.7071C13.4804 10.8946 13.7348 11 14 11ZM15 4H20V9H15V4Z" fill="#AAAAAA"></path>
                                                <path d="M3 22H10C10.2652 22 10.5196 21.8946 10.7071 21.7071C10.8946 21.5196 11 21.2652 11 21V14C11 13.7348 10.8946 13.4804 10.7071 13.2929C10.5196 13.1054 10.2652 13 10 13H3C2.73478 13 2.48043 13.1054 2.29289 13.2929C2.10536 13.4804 2 13.7348 2 14V21C2 21.2652 2.10536 21.5196 2.29289 21.7071C2.48043 21.8946 2.73478 22 3 22ZM4 15H9V20H4V15Z" fill="#AAAAAA"></path>
                                                <path d="M14 22H21C21.2652 22 21.5196 21.8946 21.7071 21.7071C21.8946 21.5196 22 21.2652 22 21V14C22 13.7348 21.8946 13.4804 21.7071 13.2929C21.5196 13.1054 21.2652 13 21 13H14C13.7348 13 13.4804 13.1054 13.2929 13.2929C13.1054 13.4804 13 13.7348 13 14V21C13 21.2652 13.1054 21.5196 13.2929 21.7071C13.4804 21.8946 13.7348 22 14 22ZM15 15H20V20H15V15Z" fill="#AAAAAA"></path>
                                                </svg>
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link to={"/books-grid-view-sidebar"} className="nav-link">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M3 22H21C21.2652 22 21.5196 21.8946 21.7071 21.7071C21.8946 21.5196 22 21.2652 22 21V3C22 2.73478 21.8946 2.48043 21.7071 2.29289C21.5196 2.10536 21.2652 2 21 2H3C2.73478 2 2.48043 2.10536 2.29289 2.29289C2.10536 2.48043 2 2.73478 2 3V21C2 21.2652 2.10536 21.5196 2.29289 21.7071C2.48043 21.8946 2.73478 22 3 22ZM13 4H20V11H13V4ZM13 13H20V20H13V13ZM4 4H11V20H4V4Z" fill="#AAAAAA"></path>
                                                </svg>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="category">
                                <div className="filter-category">
                                    <Link to={"#"} className="text-primary" data-bs-toggle="collapse"  
                                        onClick={() => setAccordBtn((prev) => !prev)}
                                    >
                                        <i className="fas fa-list me-2 text-primary"></i>
                                        Categories
                                    </Link>
                                </div>
                                <div className="form-group">
                                    <i className="fas fa-sort-amount-down me-2 text-primary"></i>                                   
                                    <Dropdown>
                                        <Dropdown.Toggle  className="i-false text-primary">{selectBtn} <i className="ms-4 font-14 fa-solid fa-caret-down" /></Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item onClick={()=>setSelectBtn('Newest')}>Newest</Dropdown.Item>
                                            <Dropdown.Item onClick={()=>setSelectBtn('1 Days')}>1 Days</Dropdown.Item>
                                            <Dropdown.Item onClick={()=>setSelectBtn('2 Week')}>2 Week</Dropdown.Item>
                                            <Dropdown.Item onClick={()=>setSelectBtn('3 Week')}>3 Weeks</Dropdown.Item>
                                            <Dropdown.Item onClick={()=>setSelectBtn('1 Month')}>1 Month</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </div>
                        </div>	

                        <Collapse in={accordBtn} className="acod-content">
                            <div>
                                <div className="widget widget_services">
                                    <div className="form-check search-content">
                                        <input className="form-check-input" type="checkbox" id="shopListCatalogAll" checked={!catalogId} onChange={() => handleCatalogCheck('')} />
                                        <label className="form-check-label" htmlFor="shopListCatalogAll">Tous les catalogues</label>
                                    </div>
                                    {catalogs.map((c) => (
                                        <div className="form-check search-content" key={c.id}>
                                            <input className="form-check-input" type="checkbox" id={`shopListCatalog${c.id}`} checked={catalogId === c.id} onChange={() => handleCatalogCheck(c.id)} />
                                            <label className="form-check-label" htmlFor={`shopListCatalog${c.id}`}>{c.name}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Collapse>
                        {error && (
                            <div className="mb-3">
                                <ErrorMessage message={error} onDismiss={() => setError(null)} className="mb-2" />
                                <button
                                    type="button"
                                    className="btn btn-primary btnhover"
                                    onClick={() => {
                                        setLoading(true);
                                        setError(null);
                                        fetchBooks()
                                            .then(setBooks)
                                            .catch((err) => setError(getFriendlyErrorMessage(err)))
                                            .finally(() => setLoading(false));
                                    }}
                                >
                                    Réessayer
                                </button>
                            </div>
                        )}
                        {loading && <div className="col-12 text-center py-5"><p>Chargement des livres…</p></div>}
                        {!loading && !error && filteredBooks.length === 0 && (
                            <div className="col-12 text-center py-5"><p className="text-muted">Aucun livre pour le moment.</p></div>
                        )}
                        {!loading && !error && filteredBooks.length > 0 && (
                        <div className="row ">
                            {filteredBooks.map((book, i) => {
                                const img = (book.cover_image && (book.cover_image.startsWith('http') ? book.cover_image : `${API_BASE_URL.replace(/\/$/, '')}${book.cover_image.startsWith('/') ? '' : '/'}${book.cover_image}`)) || bookImages[i % bookImages.length];
                                const ebookFormat = book.formats?.find((f) => (f.format_type ?? '') === 'ebook') ?? null;
                                const physicalFormat = book.formats?.find((f) => (f.format_type ?? '') === 'physical') ?? null;
                                const ebookPrice = ebookFormat?.price ?? '';
                                const physicalPrice = physicalFormat?.price ?? '';
                                const hasPdf = Boolean(ebookFormat?.pdf_file);
                                const hasEpub = Boolean(ebookFormat?.epub_file);
                                const hasBoth = Boolean(ebookFormat && physicalFormat);
                                const defaultSelection = {
                                    productType: (hasBoth ? '' : ebookFormat ? 'ebook' : physicalFormat ? 'physical' : '') as 'ebook' | 'physical' | '',
                                    fileFormat: (ebookFormat ? (hasPdf ? 'pdf' : hasEpub ? 'epub' : null) : null) as 'pdf' | 'epub' | null,
                                };
                                const selection = selections[book.id] ?? defaultSelection;
                                const selectedPrice = selection.productType === 'ebook'
                                    ? ebookPrice
                                    : selection.productType === 'physical'
                                    ? physicalPrice
                                    : '';
                                const ebookRequiresFileChoice = selection.productType === 'ebook' && (hasPdf || hasEpub);
                                const canAddToCart = Boolean(selection.productType) && (!ebookRequiresFileChoice || selection.fileFormat !== null);
                                return (
                                <div className="col-md-12 col-sm-12" key={book.id}>
                                    <div className="dz-shop-card style-2">
                                        <div className="dz-media">
                                            <Link to={`/books-detail/${book.id}`}><img src={img} alt={book.title} /></Link>
                                        </div>
                                        <div className="dz-content">
                                            <div className="dz-header">
                                                <div>
                                                    <h4 className="title mb-0 book-title-truncate" title={book.title}><Link to={`/books-detail/${book.id}`}>{book.title}</Link></h4>
                                                </div>
                                                <div className="price">
                                                    <div className="small">
                                                        <div className="text-muted">Physique: <span className="text-primary">{physicalPrice ? `${physicalPrice} $` : '—'}</span></div>
                                                        <div className="text-muted">E-book: <span className="text-primary">{ebookPrice ? `${ebookPrice} $` : '—'}</span></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="dz-body">
                                                <div className="dz-rating-box">
                                                    <div>
                                                        <p className="dz-para">{book.synopsis || 'Aucun résumé.'}</p>
                                                    </div>
                                                </div>
                                                <div className="rate">
                                                    <ul className="book-info">
                                                        <li><span>Par </span>{book.author}</li>
                                                        {book.publication_date && <li><span>Année </span>{book.publication_date.slice(0, 4)}</li>}
                                                    </ul>
                                                    <div className="d-flex flex-column flex-lg-row align-items-lg-center gap-2">
                                                        {(ebookFormat || physicalFormat) && (
                                                            <select
                                                                className="form-select form-select-sm"
                                                                style={{ minWidth: 170 }}
                                                                value={selection.productType}
                                                                onChange={(e) => {
                                                                    const nextType = e.target.value as 'ebook' | 'physical' | '';
                                                                    setSelections((prev) => ({
                                                                        ...prev,
                                                                        [book.id]: {
                                                                            productType: nextType,
                                                                            fileFormat: nextType === 'ebook' ? (hasPdf ? 'pdf' : hasEpub ? 'epub' : null) : null,
                                                                        },
                                                                    }));
                                                                }}
                                                            >
                                                                <option value="" disabled>Choisir un format</option>
                                                                {physicalFormat && <option value="physical">Physique</option>}
                                                                {ebookFormat && <option value="ebook">E-book</option>}
                                                            </select>
                                                        )}
                                                        {selection.productType === 'ebook' && ebookFormat && (hasPdf || hasEpub) && (
                                                            <select
                                                                className="form-select form-select-sm"
                                                                style={{ minWidth: 170 }}
                                                                value={selection.fileFormat ?? ''}
                                                                onChange={(e) => {
                                                                    const nextFile = (e.target.value as 'pdf' | 'epub') || null;
                                                                    setSelections((prev) => ({
                                                                        ...prev,
                                                                        [book.id]: {
                                                                            ...selection,
                                                                            fileFormat: nextFile,
                                                                        },
                                                                    }));
                                                                }}
                                                            >
                                                                {hasPdf && <option value="pdf">PDF</option>}
                                                                {hasEpub && <option value="epub">EPUB</option>}
                                                            </select>
                                                        )}
                                                        <button
                                                            type="button"
                                                            className="btn btn-primary btnhover btnhover2"
                                                            disabled={!canAddToCart || !selectedPrice}
                                                            onClick={() => {
                                                                if (!canAddToCart || !selection.productType || !selectedPrice) return;
                                                                addItem({
                                                                    bookId: book.id,
                                                                    title: book.title,
                                                                    coverImage: img,
                                                                    price: selectedPrice,
                                                                    quantity: 1,
                                                                    fileFormat: selection.productType === 'ebook' && (hasPdf || hasEpub) ? selection.fileFormat : null,
                                                                    productType: selection.productType,
                                                                });
                                                            }}
                                                        >
                                                            <i className="flaticon-shopping-cart-1 m-r10"></i> Ajouter
                                                        </button>
                                                        <Link to={`/books-detail/${book.id}`} className="btn btn-outline-primary btnhover btnhover2">Voir le livre</Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                );
                            })}
                        </div>
                        )}
                        <div className="row page mt-0">
                            <div className="col-md-6">
                                <p className="page-text">{loading ? '…' : `Affichage de ${filteredBooks.length} livre(s)`}</p>
                            </div>
                            {/* <div className="col-md-6">
                                <nav aria-label="Blog Pagination">
                                    <ul className="pagination style-1 p-t20">
                                        <li className="page-item"><Link to={"#"} className="page-link prev" >Prev</Link></li>
                                        <li className="page-item"><Link to={"#"} className="page-link active" >1</Link></li>
                                        <li className="page-item"><Link to={"#"} className="page-link">2</Link></li>
                                        <li className="page-item"><Link to={"#"} className="page-link">3</Link></li>
                                        <li className="page-item"><Link to={"#"} className="page-link next" >Next</Link></li>
                                    </ul>
                                </nav>
                            </div> */}
                        </div>    
                    </div>
                </section>
                {/* <div className="bg-white py-5">
			        <div className="container">              
                        <ClientsSlider />            
                    </div>    
                </div>                
                <section className="content-inner">
                    <div className="container">
                        <div className="row sp15">
                            <CounterSection />      
                        </div>   
                    </div>
                </section>   */}
                {/* <NewsLetter subscribeChange={() => {}} />       */}
            </div>
        </>
    )
}
export default ShopList;