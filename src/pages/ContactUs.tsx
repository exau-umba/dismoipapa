import React, {useRef} from 'react';
import emailjs from '@emailjs/browser';
import Swal from 'sweetalert2';	

import PageTitle from '../layouts/PageTitle';
import CounterSection from '../elements/CounterSection';
import NewsLetter from '../components/NewsLetter';

import bg2 from './../assets/images/background/bg2.jpg';

const ContactUs = () =>{
    const form = useRef<HTMLFormElement>(null);
	const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		//emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', form.current, 'YOUR_USER_ID')
		emailjs.sendForm('service_gfykn6i', 'template_iy1pb0b', form.current, 'HccoOtZS6GHw-N-m6')
		  .then((result) => {
			  console.log(result.text);
		  }, (error) => {
			  console.log(error.text);
		  });
		  form.current?.reset()
		  Swal.fire({
			title: 'Message envoyé !',
			text: 'Votre formulaire a bien été envoyé.',
			icon: 'success',
			confirmButtonText: 'OK'
		  });
	};
    return(
        <>
            <div className="page-content">
                <PageTitle parentPage="Accueil" childPage="Contact" />    
                <div className="content-inner-2 pt-0">
                    <div className="map-iframe">
                        <iframe
                          src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d7956.232148101352!2d15.331696000000003!3d-4.389366999999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2scd!4v1773347696139!5m2!1sen!2scd"
                          style={{border:'0', width:'100%', minHeight:'100%', marginBottom: '-8px'}}
                          allowFullScreen
                          title="Localisation Dis-moi Papa"
                        ></iframe>
                    </div>
                </div>
                <section className="contact-wraper1" style={{backgroundImage: 'url('+ bg2 +')'}}>	
                    <div className="container" >
                        <div className="row">
                            <div className="col-lg-5">
                                <div className="contact-info">
                                    <div className="section-head text-white style-1">
                                        <h3 className="title text-white">Contactez-nous</h3>
                                        <p>Une question, une suggestion ? N'hésitez pas à nous écrire.</p>
                                    </div>
                                    <ul className="no-margin">
                                        <li className="icon-bx-wraper text-white left m-b30">
                                            <div className="icon-md">
                                                <span className="icon-cell text-primary">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-map-pin"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                                </span>
                                            </div>
                                            <div className="icon-content">
                                                <h5 className=" dz-tilte text-white">Notre adresse</h5>
                                                <p>Avenue du Commerce, Kinshasa, République démocratique du Congo</p>
                                            </div>
                                        </li>
                                        <li className="icon-bx-wraper text-white left m-b30">
                                            <div className="icon-md">
                                                <span className="icon-cell text-primary">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-mail"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                                </span>
                                            </div>
                                            <div className="icon-content">
                                                <h5 className="dz-tilte text-white">Notre e-mail</h5>
                                                <p>contact@dismoipapa.com</p>
                                            </div>
                                        </li>
                                        <li className="icon-bx-wraper text-white left m-b30">
                                            <div className="icon-md">
                                                <span className="icon-cell text-primary">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-phone"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                                </span>
                                            </div>
                                            <div className="icon-content">
                                                <h5 className="dz-tilte text-white">Téléphone</h5>
                                                <p>+243 82 987 65 43</p>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-lg-7 m-b40">
                                <div className="contact-area1 m-r20 m-md-r0">
                                    <div className="section-head style-1">
                                        <h6 className="sub-title text-primary">CONTACT</h6>
                                        <h3 className="title m-b20">Écrivez-nous</h3>
                                    </div>
                                    <form className="dz-form dzForm" ref={form} onSubmit={sendEmail}>
                                        <input type="hidden" className="form-control" name="dzToDo" defaultValue="Contact" />
                                        <div className="dzFormMsg"></div>		
                                        <div className="input-group">
                                            <input required type="text" className="form-control" name="dzName" placeholder="Nom complet" />
                                        </div>
                                        <div className="input-group">
                                            <input required type="text" className="form-control" name="dzEmail" placeholder="Adresse e-mail" />
                                        </div>
                                        <div className="input-group">
                                            <input required type="text" className="form-control" name="dzPhoneNumber" placeholder="Téléphone" />
                                        </div>
                                        <div className="input-group">
                                            <textarea required name="dzMessage" rows={5} className="form-control" placeholder="Votre message"></textarea>
                                        </div>
                                        <div>
                                            <button name="submit" type="submit" value="submit" className="btn w-100 btn-primary btnhover">ENVOYER</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="content-inner">
                    <div className="container">
                        <div className="row sp15">
                            <CounterSection />      
                        </div>   
                    </div>
                </section>  
                <NewsLetter subscribeChange={() => {}} />
            </div>
        </>
    )
}
export default ContactUs;