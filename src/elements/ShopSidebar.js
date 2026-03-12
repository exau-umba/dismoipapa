import React from 'react';
import {Link} from 'react-router-dom';
import {Accordion} from 'react-bootstrap';

import SlideDragable from './SlideDragable';

const selectYear = [
    { year: 2025, year2: 2026},
    { year: 2027, year2: 2028},
    { year: 2029, year2: 2030},
    { year: 2031, year2: 2032},
    { year: 2033, year2: 2034},
    { year: 2035, year2: 2036},
    { year: 2037, year2: 2038},
    { year: 2039, year2: 2040},
    { year: 2041, year2: 2042},
    { year: 2043, year2: 2044},
    { year: 2045, year2: 2046},
];

const categoryBlog1 = [
    {name:'Poésie'     , name2:'Fables' },
    {name:'Technique'  , name2:'Énergie' },
    {name:'Roman'      , name2:'Fiction' },
];
const publishBlog = [
    {title:'Jean Richard MAMBWENI MABIALA'},
];
const accordionBlog2 = [
    {title:'Best Sales (105)'},
    {title:'Most Commented (21)'},
    {title:'Newest Books (32)'},
    {title:'Featured (129)'},
    {title:'Watch History (23)'},
    {title:'Best Books (44)'},
];

const ShopSidebar = () =>{
    return(
        <>
            <div className="shop-filter">
                <div className="d-flex justify-content-between">
                    <h4 className="title">Filter Option</h4>
                    <Link to={"#"} className="panel-close-btn"><i className="flaticon-close"></i></Link>
                </div>
                <Accordion className="accordion-filter" defaultActiveKey="0">
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>
                            Price Range
                        </Accordion.Header>
                        <Accordion.Body >
                            <div className="range-slider style-1">
                                <div id="slider-tooltips">
								    <SlideDragable />
                                </div>
                            </div>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item  eventKey="1">
                        <Accordion.Header >
                            Shop by Category
                        </Accordion.Header>
                        <Accordion.Body >
                            <div className="widget dz-widget_services d-flex justify-content-between">
                                <div className="">
                                    {categoryBlog1.map((item,ind)=>(
                                        <div className="form-check search-content" key={ind}>
                                            <input className="form-check-input" type="checkbox" value="" id={`shopcategoryCheckBox-${ind+11}`} />
                                            <label className="form-check-label" htmlFor={`shopcategoryCheckBox-${ind+11}`}>
                                                {item.name}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                <div className="">
                                    {categoryBlog1.map((item,ind)=>(
                                        <div className="form-check search-content" key={ind}>
                                            <input className="form-check-input" type="checkbox" value="" id={`shopcategoryCheckBox-${ind+28}`} />
                                            <label className="form-check-label" htmlFor={`shopcategoryCheckBox-${ind+28}`}>
                                                {item.name2}
                                            </label>
                                        </div>
                                    ))}                                    
                                </div>
                            </div>    
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="2">
                        <Accordion.Header>Choose Publisher</Accordion.Header>
                        <Accordion.Body >
                            <div className="widget dz-widget_services">
                                {publishBlog.map((data,ind)=>(
                                    <div className="form-check search-content" key={ind}>
                                        <input className="form-check-input" type="checkbox" value="" id={`publisherCheckBox-${ind+38}`} />
                                        <label className="form-check-label" htmlFor={`publisherCheckBox-${ind+38}`}>
                                            {data.title}
                                        </label>
                                    </div>
                                ))} 
                                
                            </div>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="3">
                        <Accordion.Header>Select Year</Accordion.Header>
                        <Accordion.Body >
                            <div className="widget dz-widget_services col d-flex justify-content-between">
                                <div className="">
                                    {selectYear.map((item,ind)=>(
                                        <div className="form-check search-content" key={ind}>
                                            <input className="form-check-input" type="checkbox" value="" id={`productCheckBox${ind+22}`} />
                                            <label className="form-check-label" htmlFor={`productCheckBox${ind+22}`}>
                                                {item.year}
                                            </label>
                                        </div>
                                    ))} 
                                
                                </div>
                                <div className="">
                                    {selectYear.map((item,ind)=>(
                                        <div className="form-check search-content" key={ind}>
                                            <input className="form-check-input" type="checkbox" value="" id={`productCheckBox${ind+33}`} /> 
                                            <label className="form-check-label" htmlFor={`productCheckBox${ind+33}`}>
                                                {item.year2}
                                            </label>
                                        </div>
                                    ))}                                                        
                                </div>
                            </div>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>                                     
                <Accordion className="accordion-filter accordion-inner" defaultActiveKey="0">
                    {accordionBlog2.map((data, index)=>(
                        <Accordion.Item eventKey={`${index}`}>
                            <Accordion.Header>{data.title}</Accordion.Header>
                            <Accordion.Body>
                                 <ul>
                                    <li><Link to={"#"}>Alone Here</Link></li>
                                    <li><Link to={"#"}>Alien Invassion</Link></li>
                                    <li><Link to={"#"}>Bullo The Cat</Link></li>
                                    <li><Link to={"#"}>Cut That Hair!</Link></li>
                                    <li><Link to={"#"}>Dragon Of The King</Link></li>
                                </ul>              
                            </Accordion.Body>
                        </Accordion.Item>
                    ))}
                </Accordion>

                <div className="row filter-buttons">
                    <div>
                        <Link to={"#"} className="btn btn-secondary btnhover mt-4 d-block">Refine Search</Link>
                        <Link to={"#"} className="btn btn-outline-secondary btnhover mt-3 d-block">Reset Filter</Link>
                    </div>
                </div>
            </div>
            
        </>
    )
}
export default ShopSidebar;