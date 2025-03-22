import React from 'react';
import { motion } from 'framer-motion';
import img1 from '/img/babsAbout.jpg';
import img2 from '/img/site1.jpg';
import '../css/aboutindex.css'
const AboutSection = () => {
  return (
    <section className="bg-black text-white py-16 px-4 md:px-12" id="about">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 items-center gap-12">
        {/* Images */}
        <motion.div 
          className="grid grid-cols-2 gap-8 relative"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <img 
            src={img1} 
            alt="Photographer 1" 
            className="w-full h-[500px] object-cover rounded-lg imge" 

          />
          <img 
            src={img2} 
            alt="Photographer 2" 
            className="w-full h-[500px] object-cover rounded-lg mt-12 imge" 
          />
        </motion.div>

        {/* Text Content */}
        <motion.div 
          className="text-left"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <p className=" uppercase tracking-widest mb-2 about1">APROPOS</p>
          <h2 className="text-4xl font-bold mb-4">Nous créons uniquement des expériences visuelles authentiques</h2>
          <p className="text-gray-400 mb-4">
          BabsDigitaliste est une identité créative portée par Babacar Diallo, passionné par les technologies et les arts numériques. Je propose des services en infographie, photographie, vidéographie et création de contenus multimédias. Mon objectif est de transformer vos idées en projets uniques et impactants, tout en mettant en avant créativité et professionnalisme. Suivez-moi pour découvrir des réalisations inspirantes et collaborer sur des projets qui feront la différence.
            {/* Mauris sem quam, euismod ac nisi vel, sagittis volutpat ipsum. Nulla molestie, lorem ut facilisis dignissim, ante tortor posuere urna. */}
          </p>
          {/* <p className="text-gray-400 mb-6">
            Maecenas mattis interdum varius. Duis feugiat velit quis mi elementum suscipit. Nulla nec nisi facilisis.
          </p> */}
          <div className="flex items-center gap-4">
            <p className="about1 font-bold text-xl">5+ Ans</p>
            <p className="text-xl">Expérience professionnelle</p>
          </div>
          <motion.button 
            className="mt-6 border about1 px-6 py-2 text-yellow-600  hover:text-black transition"
            whileHover={{ scale: 1.1 }}
          >
            Read More
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
