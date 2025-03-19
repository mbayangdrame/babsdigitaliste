import { motion } from "framer-motion";
import { useInView } from 'react-intersection-observer';
import '../css/service.css'
import IMG1 from '../img/_25A0015.jpg';
import IMG2 from '../img/IMG_31872.jpg';
import IMG3 from '../img/DSC09801.jpg';
import IMG4 from '../img/evenemennts.jpg';
function Nosservices() {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
      });
    
      const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      };
    return (
        <section id="services" className="py-32">
        <div className="container mx-auto px-6">
          <motion.div 
            ref={ref}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={fadeIn}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="about1 text-xl mb-4 tracking-wider">Nos services</h2>
            <h3 className="text-5xl font-bold mb-6 text-black">Ce que nous offrons</h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
            Découvrez notre gamme complète de services photographiques conçus pour capturer vos moments spéciaux
            </p>
          </motion.div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                image: IMG1,
                title: "Shooting",
                desc: "Séances photos pour capturer vos moments spéciaux"
              },
              {
                image: IMG2,
                title: "Vidéo",
                desc: "Production vidéo  pour tous vos projets"
              },
              {
                image: IMG4,
                title: "Evennement",
                desc: "Couverture complète de vos évènements spéciaux"
              },
              {
                image: IMG3,
                title: "Voyage",
                desc: "Photographie de voyage et documentaire"
              }
            ].map((service, index) => (
              <motion.div
                key={index}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                variants={fadeIn}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative group overflow-hidden rounded-lg"
              >
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="w-full h-[400px] object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
                  <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
                  <p className="text-gray-300">{service.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
  
    )
}
export default Nosservices;