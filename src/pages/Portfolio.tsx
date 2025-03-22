import HeaderFull from "../components/HeaderFull";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Link } from 'react-router-dom';
import img1 from '/img/nature.jpg';
import img2 from '/img/politique.png';
import img3 from '/img/shoot.png';
import img4 from '/img/mariage.png';
import img5 from '/img/mode.png';
import img6 from '/img/events.jpg';
import '../css/portfolio.css';

function Portfolio() {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
      });
    
      const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      };

    return (
        <>
            <HeaderFull titre='Portfolio' paragraphe='Découvrez nos travaux récents et notre expertise dans le domaine de la photographie et du vidéo.' />
            <section ref={ref} id="portfolio" className="py-12">
        <div className="container mx-auto px-6 ">
          
          <div className="grid-gallery1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4 md:px-6">
            {[
              {
                src: img1,
                title: "Nature",
                category: "nature"
              },
              {
                src: img3,
                title: "Portrait",
                category: "portrait"
              },
              {
                src: img4,
                title: "Mariage",
                category: "mariage"
              },
              {
                src: img6,
                title: "Événement",
                category: "evenement"
              },
              {
                src: img5,
                title: "Cultures",
                category: "cultures"
              },
              {
                src: img2,
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
                  className="relative group overflow-hidden rounded-lg shadow-lg"
                >
                  <img 
                    src={img.src} 
                    alt={img.title} 
                    className="w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] object-cover transition-transform duration-300 hover:scale-105 rounded-lg" 
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-start p-4 sm:p-6 lg:p-8 rounded-lg">
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white transform -translate-y-20 group-hover:translate-y-0 transition-transform duration-300">
                      {img.title}
                    </h3>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>
        </>
    );
}

export default Portfolio;