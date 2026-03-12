import React,{ useRef } from 'react';
import emailjs from '@emailjs/browser';

import { backgroundImages } from '../constants/imageUrls';

function NewsLetter({subscribeChange}: {subscribeChange: () => void}){
    const form = useRef<HTMLFormElement>(null);
    // const emailJsPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY; // ou process.env.REACT_APP_... si CRA pur
	const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		//emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', form.current, 'YOUR_USER_ID')
		// emailjs.sendForm('gmail', 'YOUR_TEMPLATE_ID', form.current, '')
		emailjs.sendForm('gmail', 'YOUR_TEMPLATE_ID', form.current, 'FAKE_KEY_FOR_DEV_ONLY')
		  .then((result) => {
			  console.log(result.text);
		  }, (error) => {
			  console.log(error.text);
		  });
		  form.current?.reset()
	};	
    return(
        <>
            <section className={`py-5 newsletter-wrapper ${subscribeChange}`} style={{backgroundImage: 'url('+ backgroundImages.newsletter +')', backgroundSize: 'cover' }}>
                <div className="container">
                    <div className="subscride-inner">
                        <div className="row style-1 justify-content-xl-between justify-content-lg-center align-items-center text-xl-start text-center">
                            <div className="col-xl-7 col-lg-12 ">
                                <div className="section-head mb-0">
                                    <h2 className="title text-white my-lg-3 mt-0">Inscrivez-vous à notre newsletter pour recevoir les nouveautés</h2>
                                </div>
                            </div>
                            <div className="col-xl-5 col-lg-6 " >
                                <form className="dzSubscribe style-1"  ref={form} onSubmit={sendEmail}>
                                    <div className="dzSubscribeMsg"></div>
                                    <div className="form-group">
                                        <div className="input-group mb-0">
                                            <input name="dzEmail" required={true} type="email" className="form-control bg-transparent text-white" placeholder="Votre adresse e-mail" />
                                            <div className="input-group-addon">
                                                <button name="submit" value="Submit" type="submit" className="btn btn-primary btnhover">
                                                    <span>S'INSCRIRE</span>
                                                    <i className="fa-solid fa-paper-plane"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
export default NewsLetter;