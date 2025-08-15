// import { Camera, Image as ImageIcon, Award, Users, Mail, Instagram, Facebook, Twitter, Play, ArrowRight } from 'lucide-react';
import  AboutSection from '../components/AboutIndex';
import Header from '../components/Header';
import Nosservices from '../components/Nosservices';
import NosPortfolio from '../components/NosPortfolio';
// import logo from './img/image1.png';

import '../css/aboutindex.css'
import AboutComponent from '../components/AboutCompoonent';
// import PricingSection from '../components/PricingSection';



function Home() {

  return (
    <div className="bg-white text-white">
      
    <Header />
    <AboutSection />
    <Nosservices />
      <NosPortfolio style={{ backgroundColor: 'black' }} />
     
    <AboutComponent />
  

    </div>
  );
}



export default Home;