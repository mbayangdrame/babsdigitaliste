import React from 'react';
import '../css/Servicescomponent.css';
import imbabs from '../img/site1.jpg'
import imbabs1 from '../img/sonko.jpg'
import service1 from '../img/Créationdecontenusmultimédias.png';
import service2 from '../img/tirage.jpg';
import service3 from '../img/Infographie.png';
import service4 from '../img/Vidéographie.webp'
import service5 from '../img/events.jpg';
import service6 from '../img/photographiie.jpg';
import service7 from '../img/servicepersonnalise.jpg';
const ServicesComponent: React.FC = () => {
  return (
    <>
    <div className="services-wrapper">
      <div className="services-container">
        <div className="services-header">
          <div className="header-left">
            <span className="subtitle">Pourquoi choisir nos services</span>
            <h4 className="title">Nous transformons chaque rêve en réalité</h4>
          </div>
          <div className="header-right">
            <p className="description">
            Chaque image raconte une histoire, chaque cliché capture une émotion unique.
             Avec un regard artistique et une passion pour l'instant parfait, nous donnons
              vie à vos souvenirs en immortalisant les plus beaux moments de votre vie. 
             Faites confiance à notre expertise pour révéler la beauté sous son plus beau jour.
            </p>
          </div>
        </div>

        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#009EAA">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
              </svg>
              <h3>Créativité</h3>
            </div>
            {/* <div className="divider"></div> */}
            <p>Nos idées créatives transforment l'ordinaire en extraordinaire pour marquer les esprits.</p>
          </div>

          <div className="service-card">
            <div className="service-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#009EAA">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
              <h3>Efficacité</h3>
            </div>
            {/* <div className="divider"></div> */}
            <p>Rapidité et précision pour des résultats optimaux, sans compromis sur la qualité.</p>
          </div>

          <div className="service-card">
            <div className="service-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#009EAA">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
              </svg>
              <h3>Professionel</h3>
            </div>
            <p>
                Chaque détail compte, et je veille à ce que mes réalisations répondent aux attentes de mes clients, tant sur le plan esthétique
                </p>
          </div>
        </div>
      </div>
    </div>

    <section className="unique-experience">
      <div className="experience-container">
        <div className="experience-left">
          <img src={imbabs} alt="Session photo avec guitariste" className="main-image" />
          <p className="experience-description">
          Chaque séance est une immersion dans l'art et l'émotion. Nous capturons l'essence de chaque instant avec une approche authentique et créative, transformant vos souvenirs en œuvres intemporelles. Que ce soit une séance portrait ou un moment musical, nous créons une expérience unique, où chaque détail raconte une histoire.
          </p>
        </div>
        
        <div className="experience-right">
          <h2 className="experience-title">
            Nous créons une expérience vraiment unique
          </h2>
          <img src={imbabs1} alt="Session photo portrait" className="secondary-image" />
        </div>
      </div>
    </section>

    <section className="services-showcase">
      <div className="services-header-center">
        <span className="services-subtitle">Nos Services</span>
        <h2 className="services-title">Service que nous vous offrons</h2>
        <p className="services-description">
        Des services sur mesure, alliant créativité et expertise, pour donner vie à vos projets.
        </p>
      </div>

      <div className="services-grid">
        <div className="service-item">
          <div className="service-image-container">
            <img src={service6} alt="Product Photo Advertising" />
            <div className="overlay"></div>
            <h3 className='titleservice'>Photographie</h3>
          </div>
        </div>

        <div className="service-item">
          <div className="service-image-container">
            <img src={service4} alt="Digital Marketing Videos" />
            <div className="overlay"></div>
            <h3>Vidéographie</h3>
          </div>
        </div>

        <div className="service-item">
          <div className="service-image-container">
            <img src={service2} alt="Branding Consultation" />
            <div className="overlay"></div>
            <h3>Tirages</h3>
          </div>
        </div>

        <div className="service-item wide">
          <div className="service-image-container">
            <img src={service3} alt="Company Profile Services" />
            <div className="overlay"></div>
            <h3>Infographie</h3>
          </div>
        </div>

        <div className="service-item wide">
          <div className="service-image-container">
            <img src={service5} alt="Social Media Content Creation" />
            <div className="overlay"></div>
            <h3>Couverture evenemmentiels</h3>
          </div>
        </div>
        <div className="service-item wide">
          <div className="service-image-container">
            <img src={service1} alt="Social Media Content Creation" />
            <div className="overlay"></div>
            <h3>Création de contenus multimédias</h3>
          </div>
        </div>
        <div className="service-item wide">
          <div className="service-image-container">
            <img src={service7} alt="Social Media Content Creation" />
            <div className="overlay"></div>
            <h3>Services personnalisés
            </h3>
          </div>
        </div>
      </div>
    </section>
    
    </>
  );
};

export default ServicesComponent;
