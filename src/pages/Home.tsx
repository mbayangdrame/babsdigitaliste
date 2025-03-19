// import { Camera, Image as ImageIcon, Award, Users, Mail, Instagram, Facebook, Twitter, Play, ArrowRight } from 'lucide-react';
import  AboutSection from '../components/AboutIndex';
import Header from '../components/Header';
import Nosservices from '../components/Nosservices';
import NosPortfolio from '../components/NosPortfolio';
// import logo from './img/image1.png';

import '../css/aboutindex.css'
import AboutComponent from '../components/AboutCompoonent';



function Home() {

  return (
    <div className="bg-white text-white">
      
    <Header />
    <AboutSection />
    <Nosservices />
    {/* <div className='portfolio'> */}
    {/* <div className="bg-black w-full" style={{ backgroundColor: 'black' }}> */}
      <NosPortfolio style={{ backgroundColor: 'black' }} />
    {/* </div> */}
    {/* </div> */}
    <AboutComponent />

    </div>
  );
}



export default Home;