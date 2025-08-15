import React from 'react';
import { motion } from "framer-motion";
import { ArrowRight, Play, Menu, X } from "lucide-react";
import { Link } from 'react-router-dom';
import { useState } from 'react';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showVideoModal, setShowVideoModal] = useState(false);
    
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <header className="relative h-screen">
            <div className="absolute inset-0">
                <img 
                    src="/img/herobabs.jpg"
                    alt="Hero"
                    className="w-full h-full object-cover object-center"
                    style={{ objectPosition: 'center 30%' }}
                />
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/50" />
            
            <nav className="relative z-10 container mx-auto px-6 py-6">
                <div className="flex justify-between items-center">
                    <div className="text-3xl tracking-wider">
                        <img 
                            src="/img/logobabs.png" 
                            alt="babsdigitaliste" 
                            className="w-40 md:w-56 lg:w-64 h-auto"
                        />
                    </div>
                    
                    <button 
                        className="md:hidden text-white"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                    
                    <div className="hidden md:flex space-x-12">
                        <Link to="/" className="hover:text-[#009EAA] transition-colors">Accueil</Link>
                        <Link to="/about" className="hover:text-[#009EAA] transition-colors">À propos</Link>
                        <Link to="/services" className="hover:text-[#009EAA] transition-colors">Services</Link>
                        <Link to="/portfolio" className="hover:text-[#009EAA] transition-colors">Portfolio</Link>
                        <Link to="/contact" className="hover:text-[#009EAA] transition-colors">Contact</Link>
                    </div>
                </div>

                {isMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 right-0 bg-black/95 mt-4">
                        <div className="flex flex-col items-center py-8 space-y-6">
                            <Link to="/" className="hover:text-[#009EAA] transition-colors">Accueil</Link>
                            <Link to="/about" className="hover:text-[#009EAA] transition-colors">À propos</Link>
                            <Link to="/services" className="hover:text-[#009EAA] transition-colors">Services</Link>
                            <Link to="/portfolio" className="hover:text-[#009EAA] transition-colors">Portfolio</Link>
                            <Link to="/contact" className="hover:text-[#009EAA] transition-colors">Contact</Link>
                        </div>
                    </div>
                )}
            </nav>

            <div className={`relative z-10 container mx-auto px-6 h-full flex items-center ${
          isMenuOpen ? "mt-60" : ""
        }`}>
                <motion.div 
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    transition={{ duration: 1 }}
                    className="max-w-3xl"
                >
                    <h2 className="about text-base sm:text-lg md:text-xl mb-4 tracking-wider">BABS</h2>
                    <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold mb-4 md:mb-6 leading-tight">
                        <span className="text-stroke">Photographe</span><br />
                        Vidéaste
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl mb-8 md:mb-12 text-gray-300 max-w-2xl">
                    Nous nous spécialisons dans la transformation de moments en souvenirs intemporels grâce à l'art de la photographie professionnelle
                    </p>
                    <div className="flex flex-row space-x-4 sm:space-x-6 items-start">
                        <Link 
                            to="/portfolio"
                            className="about2 text-black px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold hover:text-[#fff] transition-colors flex items-center space-x-2 text-sm sm:text-base cursor-pointer"
                        >
                            <span>Commencer</span>
                            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                        </Link>
                        <button
                          className="flex items-center space-x-3 sm:space-x-4 group"
                        //   onClick={() => setShowVideoModal(true)}
                        >
                          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-white flex items-center justify-center group-hover:bg-white/10 transition-colors">
                            <Play className="w-5 h-5 sm:w-6 sm:h-6" />
                          </div>
                          <span className="text-base sm:text-lg">Regarder la vidéo</span>
                        </button>
                    </div>
                </motion.div>
            </div>

            {showVideoModal && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
                    onClick={() => setShowVideoModal(false)}
                >
                    <div
                        className="relative bg-black rounded-lg overflow-hidden"
                        onClick={e => e.stopPropagation()}
                        style={{ maxWidth: 800, width: '90%' }}
                    >
                        <button
                            className="absolute top-2 right-2 text-white text-2xl"
                            onClick={() => setShowVideoModal(false)}
                        >
                            ×
                        </button>
                        <video
                            src=""
                            controls
                            autoPlay
                            className="w-full h-auto"
                            style={{ maxHeight: '80vh' }}
                        />
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;