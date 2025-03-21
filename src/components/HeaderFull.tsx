import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import React, { useState } from "react";

import logo from "../img/logobabs.png";

// Définition des types des props
interface HeaderFullProps {
  titre: string;
  paragraphe: string;
}

const HeaderFull: React.FC<HeaderFullProps> = ({ titre, paragraphe }) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <header className="relative">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1603574670812-d24560880210?auto=format&fit=crop&q=80"
          alt="Hero"
          className="w-full h-[69vh] object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/90" />

      {/* Navigation */}
      <nav className="relative z-10 container mx-auto px-6 py-6">
        <div className="flex justify-between items-center">
          <div className="text-3xl tracking-wider">
            <img src={logo} alt="Logo" />
          </div>
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="hidden md:flex space-x-12">
            <Link to="/" className="hover:text-[#009EAA] transition-colors">
              Accueil
            </Link>
            <Link to="/about" className="hover:text-[#009EAA] transition-colors">
              À propos
            </Link>
            <Link to="/services" className="hover:text-[#009EAA] transition-colors">
              Services
            </Link>
            <Link to="/portfolio" className="hover:text-[#009EAA] transition-colors">
              Portfolio
            </Link>
            <Link to="/contact" className="hover:text-[#009EAA] transition-colors">
              Contact
            </Link>
          </div>
        </div>

        {/* Menu mobile */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-black/95 md:hidden">
            <div className="flex flex-col items-center py-8 space-y-6">
              <Link to="/" className="hover:text-[#009EAA] transition-colors text-white">
                Accueil
              </Link>
              <Link to="/about" className="hover:text-[#009EAA] transition-colors text-white">
                À propos
              </Link>
              <Link to="/services" className="hover:text-[#009EAA] transition-colors text-white">
                Services
              </Link>
              <Link to="/portfolio" className="hover:text-[#009EAA] transition-colors text-white">
                Portfolio
              </Link>
              <Link to="/contact" className="hover:text-[#009EAA] transition-colors text-white">
                Contact
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Texte principal */}
      <div
        className={`relative z-10 container mx-auto px-6 h-[60vh] flex items-center justify-center w-full ${
          isMenuOpen ? "mt-60" : ""
        }`}
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 1 }}
          className="max-w-3xl w-full"
        >
          <h3 className="text-6xl font-bold mb-6 leading-tight text-center text-white">
            {titre}
          </h3>
          <p className="text-xl mb-12 text-gray-300 max-w-2xl text-center mx-auto">
            {paragraphe}
          </p>
        </motion.div>
      </div>
    </header>
  );
};

export default HeaderFull;
