import React, { useState } from 'react';
import Devis from "../components/Devis";
import HeaderFull from "../components/HeaderFull";
import '../css/Contact.css';
import emailjs from 'emailjs-com';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        message: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        emailjs.send(
            'service_l0ln5kp', 
            'template_08ehgb4', 
            formData,
            'gH_jajNR5D-xRpF0v' 
        ).then(
            (response) => {
                console.log('Email envoyé avec succès:', response);
                toast.success('Message envoyé avec succès ! 🎉', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
                // Réinitialiser le formulaire après envoi
                setFormData({
                    name: '',
                    phone: '',
                    email: '',
                    message: ''
                });
            },
            (error) => {
                console.log('Erreur lors de l\'envoi de l\'email:', error);
                toast.error("Échec de l'envoi du message ❌", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
            }
        );
    };
    

    return (
        <>
            <HeaderFull titre='Contact' paragraphe='Contactez-nous pour toute demande de devis ou pour plus d\informations sur nos services.' />
            <ToastContainer />
            <div className="contact-container">
                <div className="contact-content">
                    <div className="contact-info">
                        <div className="info-item">
                            <div className="icon-wrapper">
                                <svg viewBox="0 0 24 24" fill="white">
                                    <path d="M12 0C7.802 0 4 3.403 4 7.602C4 11.8 7.469 16.812 12 24C16.531 16.812 20 11.8 20 7.602C20 3.403 16.199 0 12 0ZM12 11C10.343 11 9 9.657 9 8C9 6.343 10.343 5 12 5C13.657 5 15 6.343 15 8C15 9.657 13.657 11 12 11Z"/>
                                </svg>
                            </div>
                            <div className="info-content">
                                <h3>ADRESSE</h3>
                                <p>Senegal, Dakar, cite avion</p>
                            </div>
                        </div>

                        <div className="info-item">
                            <div className="icon-wrapper">
                                <svg viewBox="0 0 24 24" fill="white">
                                    <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z"/>
                                </svg>
                            </div>
                            <div className="info-content">
                                <h3>EMAIL</h3>
                                <p>infos@babsdigitaliste.com</p>
                            </div>
                        </div>

                        <div className="info-item">
                            <div className="icon-wrapper">
                                <svg viewBox="0 0 24 24" fill="white">
                                    <path d="M20 15.5C18.8 15.5 17.5 15.3 16.4 14.9C16.3 14.9 16.2 14.9 16.1 14.9C15.8 14.9 15.6 15 15.4 15.2L13.2 17.4C10.4 15.9 8 13.6 6.6 10.8L8.8 8.6C9.1 8.3 9.2 7.9 9 7.6C8.7 6.5 8.5 5.2 8.5 4C8.5 3.5 8 3 7.5 3H4C3.5 3 3 3.5 3 4C3 13.4 10.6 21 20 21C20.5 21 21 20.5 21 20V16.5C21 16 20.5 15.5 20 15.5ZM19 12H21C21 7 17 3 12 3V5C15.9 5 19 8.1 19 12ZM15 12H17C17 9.2 14.8 7 12 7V9C13.7 9 15 10.3 15 12Z"/>
                                </svg>
                            </div>
                            <div className="info-content">
                                <h3>TÉLÉPHONE</h3>
                                <p>+221 77 124 84 67</p>
                            </div>
                        </div>
                    </div>

                    <form className="contact-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input type="text" name="name" placeholder="Nom" 
                                value={formData.name} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <input type="tel" name="phone" placeholder="Téléphone" 
                                value={formData.phone} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <input type="email" name="email" placeholder="Email" 
                                value={formData.email} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <textarea name="message" placeholder="Message..." 
                                value={formData.message} onChange={handleChange}></textarea>
                        </div>
                        <button type="submit" style={{
                            float: 'left',
                            marginBottom: '1rem',
                            backgroundColor: '#007E9C',
                            color: '#fff',
                            padding: '1rem 2rem',
                            borderRadius: '8px'
                        }}>
                            Envoyer
                        </button>
                    </form>
                </div>
            </div>

            <Devis />
        </>
    );
}

export default Contact;
