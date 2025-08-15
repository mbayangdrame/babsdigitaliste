import HeaderFull from "../components/HeaderFull";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Link } from 'react-router-dom';
import { Camera, Heart, Calendar, Star, Sparkles, Zap, Target, Palette, ArrowRight } from 'lucide-react';

import '../css/portfolio.css';
import { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import type { Image } from '../services/api';

const CATEGORIES = [
              {
                src: "/img/nature.jpg",
    title: "Nature & Paysages",
    subtitle: "Capturer la beauté du monde",
    category: "nature",
    icon: <Star className="w-6 h-6" />,
    color: "from-emerald-400 via-teal-500 to-cyan-600",
    bgColor: "bg-gradient-to-br from-emerald-50 to-teal-100",
    description: "Découvrez nos clichés de la nature dans toute sa splendeur",
    stats: "150+ photos",
    featured: true
              },
              {
                src: "/img/shoot.png",
    title: "Shooting Photo",
    subtitle: "Portraits professionnels",
    category: "shooting",
    icon: <Camera className="w-6 h-6" />,
    color: "from-[#009EAA] via-[#007E9C] to-[#005A6B]",
    bgColor: "bg-gradient-to-br from-[#009EAA]/20 to-[#007E9C]/20",
    description: "Sessions photo créatives et portraits artistiques",
    stats: "200+ sessions",
    featured: false
              },
              {
                src: "/img/mariage.png",
    title: "Mariages",
    subtitle: "Moments inoubliables",
    category: "mariage",
    icon: <Heart className="w-6 h-6" />,
    color: "from-rose-400 via-red-500 to-pink-600",
    bgColor: "bg-gradient-to-br from-rose-50 to-red-100",
    description: "Immortaliser vos plus beaux moments de vie",
    stats: "80+ mariages",
    featured: true
              },
              {
                src: "/img/events.jpg",
    title: "Événements",
    subtitle: "Cérémonies & Festivités",
    category: "evenement",
    icon: <Calendar className="w-6 h-6" />,
    color: "from-[#009EAA] via-[#007E9C] to-[#005A6B]",
    bgColor: "bg-gradient-to-br from-[#009EAA]/20 to-[#007E9C]/20",
    description: "Couverture complète de vos événements spéciaux",
    stats: "120+ événements",
    featured: false
              },
              {
                src: "/img/mode.png",
    title: "Mode & Culture",
    subtitle: "Style & Tradition",
    category: "cultures",
    icon: <Palette className="w-6 h-6" />,
    color: "from-amber-400 via-orange-500 to-red-600",
    bgColor: "bg-gradient-to-br from-amber-50 to-orange-100",
    description: "Fusion parfaite entre mode moderne et culture traditionnelle",
    stats: "90+ défilés",
    featured: false
              },
              {
                src: "/img/politique.png",
                title: "Politique",
    subtitle: "Événements officiels",
    category: "politique",
    icon: <Target className="w-6 h-6" />,
    color: "from-slate-400 via-gray-500 to-zinc-600",
    bgColor: "bg-gradient-to-br from-slate-50 to-gray-100",
    description: "Couverture professionnelle des événements politiques",
    stats: "60+ événements",
    featured: false
  }
];

function Portfolio() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  // const { scrollYProgress } = useScroll();
  // const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  // State pour stocker les dates par catégorie
  const [categoryDates, setCategoryDates] = useState<{ [key: string]: string | null }>({});
  const [loadingDates, setLoadingDates] = useState(true);

  useEffect(() => {
    // Charger la date la plus récente pour chaque catégorie
    const fetchDates = async () => {
      setLoadingDates(true);
      const dates: { [key: string]: string | null } = {};
      await Promise.all(
        CATEGORIES.map(async (cat) => {
          try {
            const images = await apiService.getImagesByCategory(cat.category);
            if (images && images.length > 0) {
              // Trier par date décroissante (plus récente d'abord)
              const sorted = images
                .filter((img: Image) => img.event_date)
                .sort((a: Image, b: Image) => (b.event_date || '').localeCompare(a.event_date || ''));
              dates[cat.category] = sorted[0]?.event_date || null;
            } else {
              dates[cat.category] = null;
            }
          } catch {
            dates[cat.category] = null;
          }
        })
      );
      setCategoryDates(dates);
      setLoadingDates(false);
    };
    fetchDates();
  }, []);

  // Utilitaires pour formater la date
  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return null;
    return d.toLocaleDateString('fr-FR');
  };

  // Construction dynamique des catégories avec date
  const categories = CATEGORIES.map(cat => ({
    ...cat,
    event_date: categoryDates[cat.category] || null
  }));

  const featuredCategory = categories.find(cat => cat.featured) || categories[0];

  // Loader si les dates ne sont pas encore chargées
  if (loadingDates) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-2">Chargement des données...</p>
        </div>
      </div>
    );
  }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.1
            }
        }
    };

    const cardVariants = {
        hidden: { 
            opacity: 0, 
            y: 100,
            scale: 0.8,
            rotateX: 45
        },
        visible: { 
            opacity: 1, 
            y: 0,
            scale: 1,
            rotateX: 0,
            transition: {
                duration: 0.8
            }
        }
    };

    return (
        <>
            <HeaderFull 
                titre='Portfolio' 
                paragraphe='Découvrez nos travaux récents et notre expertise dans le domaine de la photographie et du vidéo.' 
            />
            
            {/* Particules de fond animées */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-gradient-to-r from-[#009EAA] to-[#007E9C] rounded-full opacity-20"
                        animate={{
                            x: [0, 100, 0],
                            y: [0, -100, 0],
                            scale: [1, 1.5, 1],
                            opacity: [0.2, 0.5, 0.2],
                        }}
                        transition={{
                            duration: 8 + i * 0.5,
                            repeat: Infinity,
                            delay: i * 0.3,
                        }}
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                    />
                ))}
            </div>

           

            {/* Section Portfolio avec design de carte */}
            <section ref={ref} className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-br from-gray-50 via-white to-gray-100 relative">
                <div className="container mx-auto px-2 sm:px-4 md:px-6">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate={inView ? "visible" : "hidden"}
                        className="
                            grid
                            grid-cols-1
                            md:grid-cols-2
                            lg:grid-cols-3
                            gap-4
                            max-w-6xl
                            mx-auto
                        "
                    >
                        {/* Colonne gauche */}
                        <div className="lg:col-span-2 flex flex-col">
                            <div className="h-64 sm:h-80 md:h-[400px] lg:h-[530px]">
                                {/* Grande image */}
                                <Link to={`/portfolio/${featuredCategory.category}`}>
                                    <motion.div
                                        variants={cardVariants}
                                        whileHover={{ 
                                            y: -20,
                                            scale: 1.02,
                                            rotateY: 5,
                                            transition: { duration: 0.4 }
                                        }}
                                        className="group relative h-full overflow-hidden rounded-3xl shadow-2xl transform perspective-1000"
                    >
                                        {/* Image de fond avec effet de profondeur */}
                                        <div className="relative h-full overflow-hidden">
                                            <img 
                                                src={featuredCategory.src} 
                                                alt={featuredCategory.title} 
                                                className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 group-hover:rotate-1" 
                      />
                                            
                                            {/* Overlay avec gradient dynamique */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700" />
                                            
                                            {/* Tags en haut à gauche */}
                                            <div className="absolute top-6 left-6 flex gap-3">
                                                <span className="px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-lg shadow-lg">
                                                    Nature
                                                </span>
                                                <span className="px-4 py-2 bg-yellow-500 text-black text-sm font-bold rounded-lg shadow-lg">
                                                    POPULAIRE
                                                </span>
                                            </div>
                                            

                                            {/* Icône flottante avec animation */}
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0, rotate: -180 }}
                                                whileHover={{ 
                                                    opacity: 1, 
                                                    scale: 1.2, 
                                                    rotate: 0,
                                                    transition: { duration: 0.5 }
                                                }}
                                                className={`absolute top-6 right-6 p-4 rounded-2xl bg-gradient-to-r ${featuredCategory.color} text-white shadow-2xl backdrop-blur-sm`}
                                            >
                                                {featuredCategory.icon}
                                            </motion.div>

                                            {/* Effet de particules */}
                                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                                {[...Array(8)].map((_, i) => (
                                                    <motion.div
                                                        key={i}
                                                        className="absolute w-1 h-1 bg-[#009EAA] rounded-full"
                                                        animate={{
                                                            x: [0, 100, 0],
                                                            y: [0, -50, 0],
                                                            opacity: [0, 1, 0],
                                                        }}
                                                        transition={{
                                                            duration: 2,
                                                            repeat: Infinity,
                                                            delay: i * 0.3,
                                                        }}
                                                        style={{
                                                            left: `${20 + i * 10}%`,
                                                            top: `${30 + i * 8}%`,
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        {/* Contenu en bas */}
                                        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                                            <motion.div
                                                initial={{ y: 30, opacity: 0 }}
                                                whileHover={{ y: 0, opacity: 1 }}
                                                transition={{ duration: 0.5 }}
                                            >
                                                <h3 className="text-4xl font-black mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-500">
                                                    {featuredCategory.title}
                        </h3>
                                                <p className="text-xl text-gray-200 mb-4 font-semibold">
                                                    {featuredCategory.subtitle}
                                                </p>
                                                {featuredCategory.event_date && (
                                                    <p className="text-base text-gray-300 mb-2">
                                                        Date : {formatDate(featuredCategory.event_date)}
                                                    </p>
                                                )}
                                                <p className="text-base text-gray-300 opacity-0 group-hover:opacity-100 transition-all duration-700 leading-relaxed mb-6">
                                                    {featuredCategory.description}
                                                </p>
                                                
                                                {/* Statistiques */}
                                                <div className="flex items-center gap-6 mb-6">
                                                    <div className="flex items-center gap-2">
                                                        <Camera className="w-5 h-5 text-yellow-400" />
                                                        <span className="text-white font-semibold">{featuredCategory.stats}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Star className="w-5 h-5 text-yellow-400" />
                                                        <span className="text-white font-semibold">Premium</span>
                                                    </div>
                                                </div>
                                                
                                                {/* Bouton CTA avec effet de brillance */}
                                                <motion.div
                                                    initial={{ opacity: 0, x: -30 }}
                                                    whileHover={{ opacity: 1, x: 0 }}
                                                    transition={{ duration: 0.5, delay: 0.2 }}
                                                >
                                                    <span className={`relative inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r ${featuredCategory.color} text-white font-bold shadow-xl overflow-hidden group-hover:shadow-2xl transition-all duration-500`}>
                                                        <span className="relative z-10 flex items-center">
                                                            Découvrir
                                                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                                                        </span>
                                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                                    </span>
                                                </motion.div>
                                            </motion.div>
                                        </div>

                                        {/* Bordure lumineuse */}
                                        <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${featuredCategory.color} opacity-0 group-hover:opacity-30 transition-opacity duration-500 -z-10 blur-xl`} />
                                    </motion.div>
                                </Link>
                            </div>
                            <div className="flex flex-col md:flex-row gap-4 mt-4">
                                {/* Les deux images du bas */}
                                <Link to={`/portfolio/${categories[3].category}`}>
                                    <motion.div
                                        variants={cardVariants}
                                        whileHover={{ 
                                            y: -10,
                                            scale: 1.05,
                                            rotateY: 5,
                                            transition: { duration: 0.4 }
                                        }}
                                        className="group relative h-64 overflow-hidden rounded-2xl shadow-xl transform perspective-1000 flex-1"
                                    >
                                        {/* Image de fond */}
                                        <div className="relative h-full overflow-hidden">
                                            <img 
                                                src={categories[3].src} 
                                                alt={categories[3].title} 
                                                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" 
                                            />
                                            
                                            {/* Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                                            
                                            {/* Icône flottante */}
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0 }}
                                                whileHover={{ 
                                                    opacity: 1, 
                                                    scale: 1.1, 
                                                    transition: { duration: 0.3 }
                                                }}
                                                className={`absolute top-4 right-4 p-2 rounded-xl bg-gradient-to-r ${categories[3].color} text-white shadow-lg`}
                                            >
                                                {categories[3].icon}
                                            </motion.div>

                                            {/* Badge statistiques */}
                                            <div className="absolute top-4 left-4">
                                                <span className="px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                                                    {categories[3].stats}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Contenu */}
                                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                            <motion.div
                                                initial={{ y: 20, opacity: 0 }}
                                                whileHover={{ y: 0, opacity: 1 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <h4 className="text-lg font-bold mb-1 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-300">
                                                    {categories[3].title}
                                                </h4>
                                                <p className="text-sm text-gray-200 mb-3">
                                                    {categories[3].subtitle}
                                                </p>
                                                {categories[3].event_date && (
                                                    <p className="text-xs text-gray-400">
                                                        Date: {formatDate(categories[3].event_date)}
                                                    </p>
                                                )}
                                                
                                                {/* Bouton CTA */}
                                                <motion.div
                                                    initial={{ opacity: 0, x: -20 }}
                                                    whileHover={{ opacity: 1, x: 0 }}
                                                    transition={{ duration: 0.3, delay: 0.1 }}
                                                >
                                                    <span className={`inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r ${categories[3].color} text-white text-sm font-semibold shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                                                        Voir plus
                                                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                                                    </span>
                                                </motion.div>
                                            </motion.div>
                                        </div>

                                        {/* Bordure lumineuse */}
                                        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${categories[3].color} opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10 blur-lg`} />
                                    </motion.div>
                                </Link>
                               
                                <Link to={`/portfolio/${categories[4].category}`}>
                                    <motion.div
                                        variants={cardVariants}
                                        whileHover={{ 
                                            y: -10,
                                            scale: 1.05,
                                            rotateY: 5,
                                            transition: { duration: 0.4 }
                                        }}
                                        className="group relative h-64 overflow-hidden rounded-2xl shadow-xl transform perspective-1000 flex-1"
                                    >
                                        {/* Image de fond */}
                                        <div className="relative h-full overflow-hidden">
                                            <img 
                                                src={categories[4].src} 
                                                alt={categories[4].title} 
                                                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" 
                                            />
                                            
                                            {/* Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                                            
                                            {/* Icône flottante */}
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0 }}
                                                whileHover={{ 
                                                    opacity: 1, 
                                                    scale: 1.1, 
                                                    transition: { duration: 0.3 }
                                                }}
                                                className={`absolute top-4 right-4 p-2 rounded-xl bg-gradient-to-r ${categories[4].color} text-white shadow-lg`}
                                            >
                                                {categories[4].icon}
                                            </motion.div>

                                            {/* Badge statistiques */}
                                            <div className="absolute top-4 left-4">
                                                <span className="px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                                                    {categories[4].stats}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Contenu */}
                                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                            <motion.div
                                                initial={{ y: 20, opacity: 0 }}
                                                whileHover={{ y: 0, opacity: 1 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <h4 className="text-lg font-bold mb-1 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-300">
                                                    {categories[4].title}
                                                </h4>
                                                <p className="text-sm text-gray-200 mb-3">
                                                    {categories[4].subtitle}
                                                </p>
                                                {categories[4].event_date && (
                                                    <p className="text-xs text-gray-400">
                                                        Date: {formatDate(categories[4].event_date)}
                                                    </p>
                                                )}
                                                
                                                {/* Bouton CTA */}
                                                <motion.div
                                                    initial={{ opacity: 0, x: -20 }}
                                                    whileHover={{ opacity: 1, x: 0 }}
                                                    transition={{ duration: 0.3, delay: 0.1 }}
                                                >
                                                    <span className={`inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r ${categories[4].color} text-white text-sm font-semibold shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                                                        Voir plus
                                                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                                                    </span>
                                                </motion.div>
                                            </motion.div>
                                        </div>

                                        {/* Bordure lumineuse */}
                                        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${categories[4].color} opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10 blur-lg`} />
                                    </motion.div>
                                </Link>
                            </div>
                        </div>
                        {/* Colonne droite */}
                        <div className="flex flex-col h-auto md:h-[400px] lg:h-[600px] gap-4 mt-4 md:mt-0">
                            {/* Chaque carte a className="flex-1" */}
                            <Link to={`/portfolio/${categories[1].category}`}>
                                <motion.div
                                    variants={cardVariants}
                                    whileHover={{ 
                                        y: -10,
                                        scale: 1.05,
                                        rotateY: 5,
                                        transition: { duration: 0.4 }
                                    }}
                                    className="group relative h-64 overflow-hidden rounded-2xl shadow-xl transform perspective-1000 flex-1"
                                >
                                    {/* Image de fond */}
                                    <div className="relative h-full overflow-hidden">
                                        <img 
                                            src={categories[1].src} 
                                            alt={categories[1].title} 
                                            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" 
                                        />
                                        
                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                                        
                                        {/* Icône flottante */}
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0 }}
                                            whileHover={{ 
                                                opacity: 1, 
                                                scale: 1.1, 
                                                transition: { duration: 0.3 }
                                            }}
                                            className={`absolute top-4 right-4 p-2 rounded-xl bg-gradient-to-r ${categories[1].color} text-white shadow-lg`}
                                        >
                                            {categories[1].icon}
                                        </motion.div>

                                        {/* Badge statistiques */}
                                        <div className="absolute top-4 left-4">
                                            <span className="px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                                                {categories[1].stats}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Contenu */}
                                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                        <motion.div
                                            initial={{ y: 20, opacity: 0 }}
                                            whileHover={{ y: 0, opacity: 1 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <h4 className="text-lg font-bold mb-1 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-300">
                                                {categories[1].title}
                                            </h4>
                                            <p className="text-sm text-gray-200 mb-3">
                                                {categories[1].subtitle}
                                            </p>
                                            {categories[1].event_date && (
                                                <p className="text-xs text-gray-400">
                                                    Date: {formatDate(categories[1].event_date)}
                                                </p>
                                            )}
                                            
                                            {/* Bouton CTA */}
                                            <motion.div
                                                initial={{ opacity: 0, x: -20 }}
                                                whileHover={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.3, delay: 0.1 }}
                                            >
                                                <span className={`inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r ${categories[1].color} text-white text-sm font-semibold shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                                                    Voir plus
                                                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                                                </span>
                                            </motion.div>
                                        </motion.div>
                                    </div>

                                    {/* Bordure lumineuse */}
                                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${categories[1].color} opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10 blur-lg`} />
                                </motion.div>
                            </Link>
                            <Link to={`/portfolio/${categories[2].category}`}>
                                <motion.div
                                    variants={cardVariants}
                                    whileHover={{ 
                                        y: -10,
                                        scale: 1.05,
                                        rotateY: 5,
                                        transition: { duration: 0.4 }
                                    }}
                                    className="group relative h-64 overflow-hidden rounded-2xl shadow-xl transform perspective-1000 flex-1"
                                >
                                    {/* Image de fond */}
                                    <div className="relative h-full overflow-hidden">
                                        <img 
                                            src={categories[2].src} 
                                            alt={categories[2].title} 
                                            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" 
                                        />
                                        
                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                                        
                                        {/* Icône flottante */}
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0 }}
                                            whileHover={{ 
                                                opacity: 1, 
                                                scale: 1.1, 
                                                transition: { duration: 0.3 }
                                            }}
                                            className={`absolute top-4 right-4 p-2 rounded-xl bg-gradient-to-r ${categories[2].color} text-white shadow-lg`}
                                        >
                                            {categories[2].icon}
                                        </motion.div>

                                        {/* Badge statistiques */}
                                        <div className="absolute top-4 left-4">
                                            <span className="px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                                                {categories[2].stats}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Contenu */}
                                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                        <motion.div
                                            initial={{ y: 20, opacity: 0 }}
                                            whileHover={{ y: 0, opacity: 1 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <h4 className="text-lg font-bold mb-1 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-300">
                                                {categories[2].title}
                                            </h4>
                                            <p className="text-sm text-gray-200 mb-3">
                                                {categories[2].subtitle}
                                            </p>
                                            {categories[2].event_date && (
                                                <p className="text-xs text-gray-400">
                                                    Date: {formatDate(categories[2].event_date)}
                                                </p>
                                            )}
                                            
                                            {/* Bouton CTA */}
                                            <motion.div
                                                initial={{ opacity: 0, x: -20 }}
                                                whileHover={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.3, delay: 0.1 }}
                                            >
                                                <span className={`inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r ${categories[2].color} text-white text-sm font-semibold shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                                                    Voir plus
                                                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                                                </span>
                                            </motion.div>
                                        </motion.div>
                                    </div>

                                    {/* Bordure lumineuse */}
                                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${categories[2].color} opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10 blur-lg`} />
                                </motion.div>
                            </Link>
                            <Link to={`/portfolio/${categories[5].category}`}>
                                <motion.div
                                    variants={cardVariants}
                                    whileHover={{ 
                                        y: -10,
                                        scale: 1.05,
                                        rotateY: 5,
                                        transition: { duration: 0.4 }
                                    }}
                                    className="group relative h-64 overflow-hidden rounded-2xl shadow-xl transform perspective-1000 flex-1"
                                >
                                    {/* Image de fond */}
                                    <div className="relative h-full overflow-hidden">
                                        <img 
                                            src={categories[5].src} 
                                            alt={categories[5].title} 
                                            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" 
                                        />
                                        
                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                                        
                                        {/* Icône flottante */}
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0 }}
                                            whileHover={{ 
                                                opacity: 1, 
                                                scale: 1.1, 
                                                transition: { duration: 0.3 }
                                            }}
                                            className={`absolute top-4 right-4 p-2 rounded-xl bg-gradient-to-r ${categories[5].color} text-white shadow-lg`}
                                        >
                                            {categories[5].icon}
                                        </motion.div>

                                        {/* Badge statistiques */}
                                        <div className="absolute top-4 left-4">
                                            <span className="px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                                                {categories[5].stats}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Contenu */}
                                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                        <motion.div
                                            initial={{ y: 20, opacity: 0 }}
                                            whileHover={{ y: 0, opacity: 1 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <h4 className="text-lg font-bold mb-1 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-300">
                                                {categories[5].title}
                                            </h4>
                                            <p className="text-sm text-gray-200 mb-3">
                                                {categories[5].subtitle}
                                            </p>
                                            {categories[5].event_date && (
                                                <p className="text-xs text-gray-400">
                                                    Date: {formatDate(categories[5].event_date)}
                                                </p>
                                            )}
                                            
                                            {/* Bouton CTA */}
                                            <motion.div
                                                initial={{ opacity: 0, x: -20 }}
                                                whileHover={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.3, delay: 0.1 }}
                                            >
                                                <span className={`inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r ${categories[5].color} text-white text-sm font-semibold shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                                                    Voir plus
                                                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                                                </span>
                                            </motion.div>
                                        </motion.div>
                                    </div>

                                    {/* Bordure lumineuse */}
                                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${categories[5].color} opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10 blur-lg`} />
                                </motion.div>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Section CTA avec effets spectaculaires */}
            <section className="py-24 bg-gradient-to-r from-slate-900 via-[#009EAA]/40 to-slate-900 relative overflow-hidden">
                {/* Effet de particules de fond */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#009EAA]/20 to-[#007E9C]/20" />
                    {[...Array(30)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-[#009EAA] rounded-full"
                            animate={{
                                y: [0, -1000],
                                opacity: [1, 0],
                            }}
                            transition={{
                                duration: 10 + Math.random() * 10,
                                repeat: Infinity,
                                delay: Math.random() * 10,
                            }}
                            style={{
                                left: `${Math.random() * 100}%`,
                                bottom: '-10px',
                            }}
                        />
            ))}
          </div>

                <div className="container mx-auto px-6 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        viewport={{ once: true }}
                    >
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                            className="inline-block mb-8"
                        >
                            <Sparkles className="w-20 h-20 text-white mx-auto" />
                        </motion.div>

                        <h2 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight">
                            Prêt à{" "}
                            <span className="text-white">
                                immortaliser
                            </span>{" "}
                            vos moments ?
                        </h2>
                        
                        <p className="text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                            Transformons vos idées en images magnifiques. Chaque projet est une nouvelle aventure créative.
                        </p>
                        
                        <Link to="/contact">
                            <motion.button
                                whileHover={{ 
                                    scale: 1.1,
                                    boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
                                }}
                                whileTap={{ scale: 0.95 }}
                                className="group relative px-12 py-6 bg-[#009EAA] text-white font-black text-xl rounded-full shadow-2xl overflow-hidden transition-all duration-300 hover:bg-white hover:text-black"
                            >
                                <span className="relative z-10 flex items-center">
                                    <Zap className="w-6 h-6 mr-3" />
                                    contacter nous
                                    <svg className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            </motion.button>
                        </Link>
                    </motion.div>
                </div>
      </section>
        </>
    );
}

export default Portfolio;