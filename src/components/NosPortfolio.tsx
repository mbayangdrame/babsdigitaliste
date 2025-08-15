import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Link } from 'react-router-dom';
interface NosPortfolioProps {
  style?: React.CSSProperties;
}

const NosPortfolio=({ style }: NosPortfolioProps) =>{

    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1, 
      });
    
      const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      };
    return  (
        <section ref={ref} id="portfolio" className="py-32 bg-black" style={style}>
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={fadeIn}
            className="text-center mb-20"
          >
            <h2 className="about1 text-xl mb-4 tracking-wider">MON PORTFOLIO</h2>
            <h3 className="text-5xl font-bold mb-6">Travaux récents</h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
            Parcourez notre collection de superbes photographies qui mettent en valeur notre expertise et notre créativité
            </p>
          </motion.div>
          <div className="grid-gallery">
            {[
              {
                src: "/img/ouakamshoot.png",
                title: "Nature",
                category: "nature"
              },
              {
                src: "/img/plagesh.png",
                title: "Shooting",
                category: "shooting"
              },
              {
                src: "/img/mariage.png",
                title: "Mariage",
                category: "mariage"
              },
              {
                src: "/img/events.jpg",
                title: "Événement",
                category: "evenement"
              },
              {
                src: "/img/mode.png",
                title: "Cultures",
                category: "cultures"
              },
              {
                src: "/img/politique.png",
                title: "Politique",
                category: "politique"
              }
            ].map((img, index) => (
              <Link to={`/portfolio/${img.category}`} key={index}>
                <motion.div
                  initial="hidden"
                  animate={inView ? "visible" : "hidden"}
                  variants={fadeIn}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative group overflow-hidden"
                >
                  <img src={img.src} alt={img.title} className="w-full h-full object-cover portfolio9" />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-start p-8 portfolio9">
                    <h3 className="text-3xl font-bold text-white transform -translate-y-10 group-hover:translate-y-0 transition-transform duration-300">
                      {img.title}
                    </h3>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    )
}
export default NosPortfolio;