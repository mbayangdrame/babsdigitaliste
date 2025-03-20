import { useState } from 'react';
import '../css/devis.css';

function Devis() {
    const [activeForm, setActiveForm] = useState<string | null>(null);

    return (
        <>
            
            <div className="devis-container">
                <div className="devis-header">
                    <span className="devis-subtitle">TRAVAILLONS ENSEMBLE</span>
                    <h1 className="devis-title">DEMANDEZ VOTRE DEVIS</h1>
                    <p className="devis-description">
                        Remplissez le formulaire, en nous détaillant votre projet. Après étude, nous vous ferons 
                        parvenir une proposition dans les meilleurs délais.
                    </p>
                </div>

                <div className="devis-types">
                    <div className="devis-cards">
                        <div 
                            className={`devis-card ${activeForm === 'photos' ? 'active' : ''}`}
                            onClick={() => setActiveForm('photos')}
                        >
                            <div className="devis-card-icon">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20 4h-3.17L15 2H9L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h4.05l1.83-2h4.24l1.83 2H20v12zM12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3z"/>
                                </svg>
                            </div>
                            <span>Devis Photos</span>
                        </div>

                        <div 
                            className={`devis-card ${activeForm === 'videos' ? 'active' : ''}`}
                            onClick={() => setActiveForm('videos')}
                        >
                            <div className="devis-card-icon">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2z"/>
                                </svg>
                            </div>
                            <span>Devis Vidéos</span>
                        </div>
                    </div>

                    {activeForm && (
                        <div className="devis-form-container">
                            <form className="devis-form">
                                <div className="form-group">
                                    <input type="text" placeholder="Nom" required />
                                </div>
                                <div className="form-group">
                                    <input type="number" placeholder="Téléphone" required />
                                </div>
                                <div className="form-group">
                                    <input type="email" placeholder="Email" required />
                                </div>
                                <div className="form-group">
                                    <textarea 
                                        placeholder={`Décrivez votre projet ${activeForm === 'photos' ? 'photo' : 'vidéo'}...`} 
                                        required
                                    ></textarea>
                                </div>
                                <button type="submit" style={{float: 'left', marginBottom: '1rem'}}>Envoyer</button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default Devis;