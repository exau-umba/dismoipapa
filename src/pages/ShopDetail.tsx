import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Nav, Tab } from 'react-bootstrap';

import ClientsSlider from '../components/Home/ClientsSlider';
import CounterSection from '../elements/CounterSection';
import NewsLetter from '../components/NewsLetter';
import ErrorMessage from '../components/ErrorMessage';
import ExpandableText from '../components/ExpandableText';
import { useCart } from '../context/CartContext';
import { bookImages } from '../constants/imageUrls';
import profile2 from './../assets/images/profile2.jpg';
import profile4 from './../assets/images/profile4.jpg';
import profile3 from './../assets/images/profile3.jpg';
import profile1 from './../assets/images/profile1.jpg';
import { getBook, fetchBooks, type Book } from '../api/catalog';
import { API_BASE_URL } from '../api/client';
import { getFriendlyErrorMessage } from '../utils/errorMessages';

function CommentBlog({title, image}: {title: string, image: string}){
    return(
        <>
            <div className="comment-body" id="div-comment-3">
                <div className="comment-author vcard">
                    <img src={image} alt="" className="avatar"/>
                    <cite className="fn">{title}</cite> <span className="says">says:</span>
                    <div className="comment-meta">
                        <Link to={"#"}>Janvier 2025</Link>
                    </div>
                </div>
                <div className="comment-content dlab-page-text">
                    <p>Donec suscipit porta lorem eget condimentum. Morbi vitae mauris in leo venenatis varius. Aliquam nunc enim, egestas ac dui in, aliquam vulputate erat.</p>
                </div>
                <div className="reply">
                    <Link to={"#"} className="comment-reply-link"><i className="fa fa-reply"></i> Répondre</Link>
                </div>
            </div>
        </>
    )
}

function ShopDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [book, setBook] = useState<Book | null>(null);
    const [relatedBooks, setRelatedBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(!!id);
    const [error, setError] = useState<string | null>(null);
    const [count, setCount] = useState<number>(1);
    const { addItem } = useCart();
    const [fileFormat, setFileFormat] = useState<'pdf' | 'epub' | null>(null);
    const [productType, setProductType] = useState<'ebook' | 'physical'>('ebook');

    useEffect(() => {
        if (!id) {
            navigate('/books-grid-view', { replace: true });
            return;
        }
        setLoading(true);
        setError(null);
        getBook(id)
            .then(setBook)
            .catch((err) => setError(getFriendlyErrorMessage(err)))
            .finally(() => setLoading(false));
    }, [id, navigate]);

    useEffect(() => {
        const format = book?.formats?.[0];
        const isEbook = (format?.format_type ?? '') === 'ebook';
        const hasPdf = Boolean(format?.pdf_file);
        const hasEpub = Boolean(format?.epub_file);
        if (!isEbook) {
            setFileFormat(null);
            return;
        }
        // Recommandation : PDF par défaut si disponible
        setFileFormat(hasPdf ? 'pdf' : hasEpub ? 'epub' : null);
    }, [book]);

    useEffect(() => {
        const formats = book?.formats || [];
        const hasEbook = formats.some((f) => (f.format_type ?? '') === 'ebook');
        const hasPhysical = formats.some((f) => (f.format_type ?? '') === 'physical');
        // Par défaut : ebook si dispo, sinon physique
        setProductType(hasEbook ? 'ebook' : hasPhysical ? 'physical' : 'ebook');
        setCount(1);
    }, [book]);

    useEffect(() => {
        fetchBooks().then((list) => {
            if (id) setRelatedBooks(list.filter((b) => b.id !== id).slice(0, 3));
            else setRelatedBooks(list.slice(0, 3));
        }).catch(() => setRelatedBooks([]));
    }, [id]);

    if (!id) return null;
    if (loading) return <div className="page-content bg-grey"><div className="container py-5 text-center">Chargement du livre…</div></div>;
    if (error || !book) return <div className="page-content bg-grey"><div className="container py-5"><ErrorMessage message={error || 'Livre non trouvé.'} onDismiss={() => navigate('/books-grid-view')} /><Link to="/books-grid-view" className="btn btn-primary mt-3">Retour aux livres</Link></div></div>;

    const coverUrl = (book.cover_image && (book.cover_image.startsWith('http') ? book.cover_image : `${API_BASE_URL.replace(/\/$/, '')}${book.cover_image.startsWith('/') ? '' : '/'}${book.cover_image}`)) || bookImages[0];
    const publicationYear = book.publication_date ? book.publication_date.slice(0, 4) : '';
    const ebookFormat = book.formats?.find((f) => (f.format_type ?? '') === 'ebook') ?? null;
    const physicalFormat = book.formats?.find((f) => (f.format_type ?? '') === 'physical') ?? null;
    const selectedFormat = productType === 'physical' ? physicalFormat : ebookFormat;
    const price = selectedFormat?.price ?? '';
    const isEbook = productType === 'ebook';
    const hasPdf = Boolean(ebookFormat?.pdf_file);
    const hasEpub = Boolean(ebookFormat?.epub_file);

    const tableDetail = [
        { tablehead: 'Titre', tabledata: book.title },
        { tablehead: 'Auteur', tabledata: book.author },
        { tablehead: 'Langue', tabledata: book.language === 'en' ? 'English' : book.language === 'fr' ? 'Français' : book.language || '—' },
        { tablehead: 'Date de publication', tabledata: book.publication_date ? new Date(book.publication_date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' }) : '—' },
    ];

    return (
        <>
            <div className="page-content bg-grey">
                <section className="content-inner-1">
                    <div className="container">
                        <div className="row book-grid-row style-4 m-b60">
                            <div className="col">
                                <div className="dz-box d-flex flex-row align-items-start">
                                    <div
                                      className="dz-media"
                                      style={{
                                        maxWidth: 220,
                                        aspectRatio: '210/297',
                                        position: 'sticky',
                                        top: 90,
                                        alignSelf: 'flex-start',
                                        flex: '0 0 auto',
                                      }}
                                    >
                                        <img src={coverUrl} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                    </div>
                                    <div className="dz-content" style={{ minWidth: 0, flex: '1 1 auto' }}>
                                        <div className="dz-header">
                                            <h3
                                                className="title"
                                                title={book.title}
                                                style={{ wordBreak: 'break-word', whiteSpace: 'normal' }}
                                            >
                                                {book.title}
                                            </h3>
                                            {/* <div className="shop-item-rating">
                                                <div className="d-lg-flex d-sm-inline-flex d-flex align-items-center">
                                                    <ul className="dz-rating">
                                                        <li><i className="flaticon-star text-primary"></i></li>
                                                        <li><i className="flaticon-star text-primary"></i></li>
                                                        <li><i className="flaticon-star text-primary"></i></li>
                                                        <li><i className="flaticon-star text-primary"></i></li>
                                                        <li><i className="flaticon-star text-muted"></i></li>
                                                    </ul>
                                                    <h6 className="m-b0">4.0</h6>
                                                </div>
                                                <div className="social-area">
                                                    <ul className="dz-social-icon style-3">
                                                        <li className="me-2"><a href="https://www.facebook.com/dexignzone" target="_blank" rel="noreferrer"><i className="fa-brands fa-facebook-f"></i></a></li>
                                                        <li className="me-2"><a href="https://twitter.com/dexignzones" target="_blank" rel="noreferrer"><i className="fa-brands fa-twitter"></i></a></li>
                                                        <li className="me-2"><a href="https://www.whatsapp.com/" target="_blank" rel="noreferrer"><i className="fa-brands fa-whatsapp"></i></a></li>
                                                        <li><a href="https://www.google.com/intl/en-GB/gmail/about/" target="_blank" rel="noreferrer"><i className="fa-solid fa-envelope"></i></a></li>
                                                    </ul>
                                                </div>
                                            </div> */}
                                        </div>
                                        <div className="dz-body">
                                            <div className="book-detail">
                                                <ul className="book-info text-primary">
                                                    <li>
                                                        <div className="writer-info">
                                                            {/* <img src={profile2} alt="book" /> */}
                                                            <div>
                                                                <span className="text-muted">Écrit par </span> <span className="text-primary">{book.author}</span>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li><span className="text-muted">Année</span> <span className="text-primary">{publicationYear || '—'}</span></li>
                                                </ul>
                                            </div>
                                            <p className="text-1" style={{textAlign: 'justify'}}>{book.synopsis || 'Aucun résumé disponible.'}</p>
                                            {book.sample_text && (
                                              <ExpandableText style={{textAlign: 'justify', whiteSpace: 'pre-wrap'}} text={book.sample_text} maxChars={40} className="text-2" />
                                            )}
                                            <div className="book-footer">
                                                <div className="price">
                                                    {price ? <><h5>{price} FC</h5></> : <h5 className="text-muted">Prix sur demande</h5>}
                                                </div>
                                                <div className="product-num">
                                                    {(ebookFormat || physicalFormat) && (
                                                        <div className="me-3 row" style={{ minWidth: 190 }}>
                                                            <label className="d-block small text-muted mb-1">Type</label>
                                                            <select
                                                                className="form-select form-select-sm"
                                                                value={productType}
                                                                onChange={(e) => setProductType(e.target.value as 'ebook' | 'physical')}
                                                            >
                                                                {ebookFormat && <option value="ebook">E-book</option>}
                                                                {physicalFormat && <option value="physical">Physique</option>}
                                                            </select>
                                                        </div>
                                                    )}

                                                    {productType === 'physical' && (
                                                      <div className="quantity btn-quantity style-1 me-3">
                                                          <button className="btn btn-plus" type="button" onClick={() => setCount((prev) => prev + 1)}><i className="ti-plus"></i></button>
                                                          <input className="quantity-input" type="text" value={count} name="demo_vertical2" readOnly />
                                                          <button className="btn btn-minus" type="button" onClick={() => setCount((prev) => Math.max(1, prev - 1))}><i className="ti-minus"></i></button>
                                                      </div>
                                                    )}

                                                    {/* {productType === 'ebook' && ebookFormat && (hasPdf || hasEpub) && (
                                                        <div className="me-3" style={{ minWidth: 190 }}>
                                                            <label className="d-block small text-muted mb-1">Format de téléchargement</label>
                                                            <select
                                                                className="form-select form-select-sm"
                                                                value={fileFormat ?? ''}
                                                                onChange={(e) => setFileFormat((e.target.value as 'pdf' | 'epub') || null)}
                                                            >
                                                                {hasPdf && <option value="pdf">PDF (recommandé)</option>}
                                                                {hasEpub && <option value="epub">EPUB (lecture dans l'app)</option>}
                                                            </select>
                                                        </div>
                                                    )} */}
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary btnhover btnhover2"
                                                        onClick={() => {
                                                            addItem({
                                                                bookId: book.id,
                                                                title: book.title,
                                                                coverImage: coverUrl,
                                                                price: price || '0',
                                                                quantity: productType === 'ebook' ? 1 : Math.max(1, count),
                                                                fileFormat: productType === 'ebook' ? fileFormat : null,
                                                                productType,
                                                            });
                                                            setCount(1);
                                                        }}
                                                    >
                                                        <i className="flaticon-shopping-cart-1"></i> <span>Ajouter au panier</span>
                                                    </button>
                                                    {/* <div className="bookmark-btn style-1 d-none d-sm-block">
                                                        <input className="form-check-input" type="checkbox" id="flexCheckDefault1" />
                                                        <label className="form-check-label" htmlFor="flexCheckDefault1"><i className="flaticon-heart"></i></label>
                                                    </div> */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xl-8">
                                <Tab.Container defaultActiveKey="details">
                                    <div className="product-description tabs-site-button">
                                        <Nav as="ul" className="nav nav-tabs bg-primary text-white">
                                            <Nav.Item as="li"><Nav.Link className="text-white" eventKey="details">Détails du produit</Nav.Link></Nav.Item>
                                            {/* <Nav.Item as="li"><Nav.Link  eventKey="review">Avis clients</Nav.Link></Nav.Item> */}
                                        </Nav>
                                        <Tab.Content>
                                            <Tab.Pane eventKey="details">
                                                <table className="table border book-overview">
                                                    <tbody>
                                                        {tableDetail.map((data, index) => (
                                                            <tr key={index}>
                                                                <th>{data.tablehead}</th>
                                                                <td>{data.tabledata}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="review">
                                                <div className="clear" id="comment-list">
                                                    <div className="post-comments comments-area style-1 clearfix">
                                                        <h4 className="comments-title">4 COMMENTS</h4>
                                                        <div id="comment">
                                                            <ol className="comment-list">
                                                                <li className="comment even thread-even depth-1 comment" id="comment-2">
                                                                    <CommentBlog  title="Michel Poe"  image={profile4} /> 
                                                                    <ol className="children">
                                                                        <li className="comment byuser comment-author-w3itexpertsuser bypostauthor odd alt depth-2 comment" id="comment-3">
                                                                            <CommentBlog  title="Celesto Anderson"  image={profile3} /> 
                                                                        </li>
                                                                    </ol>
                                                                </li>
                                                                <li className="comment even thread-odd thread-alt depth-1 comment" id="comment-4">
                                                                    <CommentBlog  title="Ryan"  image={profile2} />
                                                                </li>
                                                                <li className="comment odd alt thread-even depth-1 comment" id="comment-5">
                                                                    <CommentBlog  title="Stuart"  image={profile1} />
                                                                </li>
                                                            </ol>
                                                        </div>
                                                        <div className="default-form comment-respond style-1" id="respond">
                                                            <h4 className="comment-reply-title" id="reply-title">LEAVE A REPLY 
                                                                <small> 
                                                                    <Link to={"#"} rel="nofollow" id="cancel-comment-reply-link" style={{display:"none"}}>Cancel reply</Link> 
                                                                </small>
                                                            </h4>
                                                            <div className="clearfix">
                                                                <form method="post" id="comments_form" className="comment-form" noValidate>
                                                                    <p className="comment-form-author"><input id="name" placeholder="Author" name="author" type="text" value="" /></p>
                                                                    <p className="comment-form-email">
                                                                        <input id="email" required placeholder="Email" name="email" type="email" value="" />
                                                                    </p>
                                                                    <p className="comment-form-comment">
                                                                        <textarea id="comments" placeholder="Type Comment Here" className="form-control4" name="comment" cols={45} rows={3} required={true}></textarea>
                                                                    </p>
                                                                    <p className="col-md-12 col-sm-12 col-xs-12 form-submit">
                                                                        <button id="submit" type="submit" className="submit btn btn-primary filled">
                                                                        Submit Now <i className="fa fa-angle-right m-l10"></i>
                                                                        </button>
                                                                    </p>
                                                                </form>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                            </Tab.Pane>
                                        </Tab.Content>
                                    </div>
                                </Tab.Container>   
                            </div>
                            <div className="col-xl-4 mt-5 mt-xl-0">
                                <div className="widget">
                                    <h4 className="widget-title">Autres livres</h4>
                                    <div className="row">
                                        {relatedBooks.map((related) => {
                                            const relImg = (related.cover_image && (related.cover_image.startsWith('http') ? related.cover_image : `${API_BASE_URL.replace(/\/$/, '')}${related.cover_image.startsWith('/') ? '' : '/'}${related.cover_image}`)) || bookImages[0];
                                            const relPrice = related.formats?.[0]?.price ?? '';
                                            return (
                                            <div className="col-xl-12 col-lg-6" key={related.id}>
                                                <div className="dz-shop-card style-5">
                                                    <div className="dz-media">
                                                        <Link to={`/books-detail/${related.id}`}><img src={relImg} alt={related.title} /></Link>
                                                    </div>
                                                    <div className="dz-content">
                                                        <h5 className="subtitle book-title-truncate" title={related.title}><Link to={`/books-detail/${related.id}`}>{related.title}</Link></h5>
                                                        <p className="small text-muted">par {related.author}</p>
                                                        <div className="price">
                                                            <span className="price-num">{relPrice ? `${relPrice} FC` : '—'}</span>
                                                        </div>
                                                        <Link to={`/books-detail/${related.id}`} className="btn btn-outline-primary btn-sm btnhover btnhover2">Voir le détail</Link>
                                                    </div>
                                                </div>
                                            </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
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
export default ShopDetail;