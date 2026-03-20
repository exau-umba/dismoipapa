import React from 'react';
import {Link} from 'react-router-dom';
import {Accordion} from 'react-bootstrap';

const ShopSidebar = ({
    maxPrice = 200,
    onMaxPriceChange = (_value) => {},
    onlyPhysical = false,
    onlyEbook = false,
    onOnlyPhysicalChange = (_checked) => {},
    onOnlyEbookChange = (_checked) => {},
    catalogs = [],
    selectedCatalogId = '',
    onCatalogChange = (_id) => {},
    onReset = () => {},
}) =>{
    return(
        <>
            <div className="shop-filter text-primary">
                <div className="d-flex justify-content-between">
                    <h4 className="title text-primary">Filter Option</h4>
                    <Link to={"#"} className="panel-close-btn text-primary"><i className="flaticon-close"></i></Link>
                </div>
                <Accordion className="accordion-filter text-primary" defaultActiveKey="0">
                    <Accordion.Item eventKey="0" className="text-primary">
                        <Accordion.Header>
                            <span style={{ color: 'var(--primary)' }}>Prix max</span>
                        </Accordion.Header>
                        <Accordion.Body >
                            <div>
                                <input
                                    type="range"
                                    className="form-range text-primary"
                                    min={0}
                                    max={200}
                                    value={maxPrice}
                                    onChange={(e) => onMaxPriceChange(Number(e.target.value))}
                                />
                                <div className="d-flex justify-content-between small text-primary mt-1">
                                    <span>0</span>
                                    <span>{maxPrice} $</span>
                                </div>
                            </div>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item  eventKey="1">
                        <Accordion.Header>
                            <span style={{ color: 'var(--primary)' }}>Formats</span>
                        </Accordion.Header>
                        <Accordion.Body >
                            <div className="widget dz-widget_services">
                                <div className="form-check search-content">
                                    <input className="form-check-input" type="checkbox" id="shopSidebarOnlyPhysical" checked={onlyPhysical} onChange={(e) => onOnlyPhysicalChange(e.target.checked)} />
                                    <label className="form-check-label" htmlFor="shopSidebarOnlyPhysical">Physique</label>
                                </div>
                                <div className="form-check search-content">
                                    <input className="form-check-input" type="checkbox" id="shopSidebarOnlyEbook" checked={onlyEbook} onChange={(e) => onOnlyEbookChange(e.target.checked)} />
                                    <label className="form-check-label" htmlFor="shopSidebarOnlyEbook">E-book</label>
                                </div>
                            </div>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="3">
                        <Accordion.Header><span style={{ color: 'var(--primary)' }}>Catalogue</span></Accordion.Header>
                        <Accordion.Body >
                            <div className="widget dz-widget_services">
                                <div className="form-check search-content">
                                    <input className="form-check-input text-primary" type="checkbox" id="shopSidebarCatalogAll" checked={!selectedCatalogId} onChange={() => onCatalogChange('')} />
                                    <label className="form-check-label text-primary" htmlFor="shopSidebarCatalogAll">Tous les catalogues</label>
                                </div>
                                {catalogs.map((c) => (
                                    <div className="form-check search-content" key={c.id}>
                                        <input className="form-check-input text-primary" type="checkbox" id={`shopSidebarCatalog-${c.id}`} checked={selectedCatalogId === c.id} onChange={() => onCatalogChange(c.id)} />
                                        <label className="form-check-label text-primary" htmlFor={`shopSidebarCatalog-${c.id}`}>{c.name}</label>
                                    </div>
                                ))}
                            </div>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>                                     
                <div className="row filter-buttons">
                    <div>
                        <button type="button" className="btn btn-primary btnhover mt-4 d-block w-100">Filtrage en direct</button>
                        <button type="button" className="btn btn-outline-primary btnhover mt-3 d-block w-100" onClick={onReset}>Réinitialiser</button>
                    </div>
                </div>
            </div>
            
        </>
    )
}
export default ShopSidebar;