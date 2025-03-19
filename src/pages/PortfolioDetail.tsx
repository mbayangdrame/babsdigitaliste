import { useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import HeaderFull from '../components/HeaderFull';
import { useState } from 'react';
import niodor from '../img/niodior.jpg';
import goree from '../img/Goree by babsdigitaliste_160.jpg';
import ouakam from '../img/ouakam.jpg';
import monuments from '../img/monuments.jpg';
import niodior1 from '../img/niodior1.jpg';
import niodior2 from '../img/niodior2.jpg';
import niodior3 from '../img/niodor3.jpg';
import niodior5 from '../img/niodor5.jpg';
import goree1 from '../img/Goree1.jpg';
import goree2 from '../img/Goree2.jpg';
import goree3 from '../img/Goree3.jpg';
import goree4 from '../img/Goree4.jpg';
import goree5 from '../img/Goree5.jpg';
import goree6 from '../img/Goree6.jpg';
import goree7 from '../img/goree7.jpg';
import goree8 from '../img/goree8.jpg';
import goree9 from '../img/goree9.jpg';
import oukam1 from '../img/plageOuakam.jpg';
import oukam2 from '../img/plageouakam1.jpg';
import oukam3 from '../img/plageoukam2.jpg';
import oukam4 from '../img/plageoukam3.jpg';
import oukam5 from '../img/plageoukam7.jpg';
import oukam6 from '../img/oukam6.jpg';
//politiques
import dame1 from '../img/premiereDame.jpg';
import dame2 from '../img/dame1.jpg';
import dame3 from '../img/dame2.jpg';
import dame4 from '../img/dame4.jpg';
import sonko from '../img/sonko copy.jpg';
import sonko1 from '../img/sonko.jpg';
import sonko2 from '../img/sonko3.jpg';
import sonko3 from '../img/sonko4.jpg';
import maimouna from '../img/maimaouna1.jpg';
import maimouna1 from '../img/maimouna2.jpg';
import maimouna2 from '../img/maimouna3.jpg';
import maimouna4 from '../img/maimouna4.jpg';

import khady from '../img/khady1.jpg';
import khady1 from '../img/khady2.jpg';
import khad2 from '../img/khady3.jpg';
import khad3 from '../img/khady4.jpg';
import khad4 from '../img/khady4.jpg';

import culture from '../img/culture1.jpg';
import culture1 from '../img/culture2.jpg';
import culture2 from '../img/culture3.jpg';
import culture3 from '../img/culture4.jpg';
import culture4 from '../img/culture5.jpg';
import culture5 from '../img/culture6.jpg';
import culture6 from '../img/culture7.jpg';

import open from '../img/open.jpg';
import open1 from '../img/open2.jpg';
import openn2 from '../img/open3.jpg';
import open3 from '../img/open4.jpg';
import open4 from '../img/open5.jpg';
import open5 from '../img/open6.jpg';
import open6 from '../img/open7.jpg';

import appel from '../img/appel.jpg';
import appel1 from '../img/appel1.jpg';
import appel2 from '../img/appel2.jpg';
import appel3 from '../img/appel3.jpg';
import appel4 from '../img/appel4.jpg';
import appel5 from '../img/appel5.jpg';

import unipro from '../img/uniipro.jpg';
import unipro1 from '../img/unipro1.jpg';
import unipro2 from '../img/unipro9.jpg';
import unipro5 from '../img/unipro5.jpg';
import unipro3 from '../img/unipro3.jpg';
import unipro4 from '../img/unipro4.jpg';
import unipro10 from '../img/unipro10.jpg';

import alibeta from '../img/alibeta.jpg';
import alibeta1 from '../img/alibeta1.jpg';
import alibeta3 from '../img/alibeta3.jpg';
import bamby from '../img/bamby.jpg';
import bamby1 from '../img/bamby1.jpg';
import ibaaku from '../img/ibaaku.jpg';
import ibaaku1 from '../img/ibaaku2.jpg';


import '../css/portfoliodetail.css';
function PortfolioDetail() {
    const { category, id } = useParams();
    const validCategories = ['nature', 'portrait', 'mariage', 'evenement', 'politique', 'cultures'];
    
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

    if (!category || !validCategories.includes(category.toLowerCase()) || !id) {
        return <Navigate to="/portfolio" replace />;
    }

    const categoryImages = {
        nature: [
            {
                url: niodor,
                title: "Niodor",
                description: "Niodior, située dans le delta du Saloum, est une île sénégalaise renommée pour sa beauté naturelle et sa riche culture. Entourée de mangroves et de vastes étendues d'eau, cette île fait partie du patrimoine mondial de l'UNESCO en tant que réserve de biosphère. Les habitants, principalement des Sérères Niominka, vivent en harmonie avec la nature, pratiquant la pêche artisanale et l'agriculture. La vie quotidienne y est marquée par un fort attachement aux traditions et par une résilience face aux défis environnementaux, notamment la montée des eaux. En plus de sa richesse écologique, Niodior est également un haut lieu de transmission culturelle. Les chants, danses et contes traditionnels des Sérères y occupent une place centrale, contribuant à préserver l'héritage oral de cette communauté. Les visiteurs sont souvent émerveillés par l'accueil chaleureux des habitants et par la sérénité qui émane de cette île unique. La beauté sauvage de Niodior et sa culture profondément enracinée en font une destination captivante pour tous ceux qui souhaitent découvrir un Sénégal authentique.",
                album: [
                    niodior1,
                    niodior2,
                    niodior3,
                    niodior5,
                    niodor
                ]
            },
            {
                url: goree,
                title: "iles de Goree",
                description: "L'île de Gorée, située au large de Dakar, au Sénégal, est un lieu chargé d'histoire et de mémoire. Classée au patrimoine mondial de l'UNESCO, elle est tristement célèbre pour son rôle dans la traite négrière, notamment avec la Maison des Esclaves, qui témoigne des souffrances endurées par les captifs avant leur départ vers les Amériques. Aujourd'hui, Gorée est un symbole de paix et de réconciliation. Son ambiance paisible, ses ruelles colorées bordées de maisons coloniales, ses plages et ses musées en font une destination prisée par les visiteurs. L'île est également un centre culturel où se tiennent régulièrement des expositions et des événements artistiques.",
                album: [
                    goree6,
                    goree4,
                    goree5,
                    goree8,
                    goree9,
                    goree3
                ]
            },
            {
                url: ouakam,
                title: "Plage Ouakam ",
                description: "La plage de Ouakam, située à Dakar au pied des Mamelles, est une petite crique pittoresque entourée de falaises et dominée par la majestueuse Mosquée de la Divinité. C'est un lieu prisé des pêcheurs traditionnels, dont les pirogues colorées ajoutent au charme du paysage. Grâce à ses vagues régulières, Ouakam est également un spot apprécié des surfeurs. Son ambiance authentique et paisible en fait une plage idéale pour se détendre, admirer le coucher de soleil ou observer la vie locale.",
                album: [
                    oukam3,
                    oukam1,
                    oukam2,
                    oukam4,
                    oukam5,
                    oukam6
                ]
            },
            {
                url: monuments,
                title: "Monuments de la renaissance ",
                description: "Le Monument de la Renaissance africaine, situé à Dakar sur l'une des collines des Mamelles, est une statue colossale de 52 mètres de haut, représentant un homme, une femme et un enfant tourné vers l'horizon. Inauguré en 2010, il symbolise la renaissance et le progrès du continent africain. Conçu par l'architecte Pierre Goudiaby Atepa et réalisé par une entreprise nord-coréenne, ce monument en bronze est le plus haut d'Afrique. À l'intérieur, un musée retrace l'histoire de l'Afrique et une plateforme au sommet offre une vue panoramique exceptionnelle sur Dakar. C'est un lieu emblématique pour les visiteurs, les cérémonies officielles et les événements culturels.",
                album: [
                    "https://images.unsplash.com/photo-1472214103451-9374bd1c798e",
                    "https://images.unsplash.com/photo-1542224566-6e85f2e6772f",
                    "https://images.unsplash.com/photo-1473773508845-188df298d2d1",
                    "https://images.unsplash.com/photo-1444464666168-49d633b86797",
                    "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07"
                ]
            }
        ],
        portrait: [
            {
                url: "https://images.unsplash.com/photo-1519741497674-611481863552",
                title: "Portraits en Lumière Naturelle",
                description: "Portrait artistique en lumière naturelle",
                album: [
                    "https://images.unsplash.com/photo-1519741497674-611481863552",
                    // Ajoutez d'autres URLs pour l'album
                ]
            },
        ],
        mariage: [
            {
                url: "https://images.unsplash.com/photo-1524863479829-916d8e77f114",
                title: "L'Union Parfaite",
                description: "Moment magique d'un mariage inoubliable",
                album: [
                    "https://images.unsplash.com/photo-1524863479829-916d8e77f114",
                    "https://images.unsplash.com/photo-1519225421980-715cb0215aed",
                    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc",
                    "https://images.unsplash.com/photo-1469371670807-013ccf25f16a"
                ]
            },
            {
                url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed",
                title: "Amour Éternel",
                description: "Célébration de l'amour",
                album: [
                    "https://images.unsplash.com/photo-1519225421980-715cb0215aed",
                    "https://images.unsplash.com/photo-1524863479829-916d8e77f114",
                    "https://images.unsplash.com/photo-1469371670807-013ccf25f16a",
                    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc"
                ]
            },
            {
                url: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a",
                description: "Moments précieux",
                album: [
                    "https://images.unsplash.com/photo-1469371670807-013ccf25f16a",
                    "https://images.unsplash.com/photo-1519225421980-715cb0215aed",
                    "https://images.unsplash.com/photo-1524863479829-916d8e77f114",
                    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc"
                ]
            },
            {
                url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc",
                description: "L'union parfaite",
                album: [
                    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc",
                    "https://images.unsplash.com/photo-1469371670807-013ccf25f16a",
                    "https://images.unsplash.com/photo-1519225421980-715cb0215aed",
                    "https://images.unsplash.com/photo-1524863479829-916d8e77f114"
                ]
            }
        ],
        politique: [
            {
                url: dame1,
                title: "Mdme Premiere Dame",
                description: "Clôture Triomphale du Forum de la PME ! La Première Dame a brillamment souligné, par sa présence, l’importance du travail des PME sénégalaises. La visite des stands a été un moment culminant de son passage au Grand Théâtre. Son intervention a ravivé l’enthousiasme des exposants, qui ont perçu ce geste comme une reconnaissance de leur dévouement à l'innovation et à l'utilisation de leurs activités comme levier majeur de la souveraineté économique. année Un jour mémorable ! MACHALLAH ! Merci infiniment à Madame Marie Khone Faye pour son soutien inestimable ! Un autre temps fort a été la remise de chèques à des entrepreneurs des huit pôles territoriaux et de la diaspora, en présence du Ministre de l’Industrie et du Commerce, Dr. Serigne Guèye DIOP, ainsi que du Secrétaire d’État au Développement des PME-PMI, M. Ibrahima THIAM. Les partenaires de cette édition, ainsi que les sponsors, ont également été distingués pour leur engagement inconditionnel envers l’écosystème des PME. Un succès retentissant à renouveler l’année prochaine !",
                album: [
                    dame1,
                    dame2,
                    dame3,
                    dame4,
                    dame4
                ]
            },
            {
                url: sonko,
                title: "Mr Ousmane Sonko",
                description: "Le 18 février 2025, le Premier ministre Ousmane Sonko a inauguré la 4ᵉ édition du Forum des Petites et Moyennes Entreprises (PME) à Dakar, placée sous le thème 'PME et innovation, leviers de souveraineté'. \n\nLors de son discours, il a mis en avant le rôle central des PME dans l'économie sénégalaise, représentant plus de 99% du tissu économique. Il a annoncé un plan ambitieux visant à augmenter l'encours de crédits accordés aux PME/PMI, passant de 600 milliards FCFA en 2024 à 3000 milliards FCFA d'ici 2028. Dans ce cadre, un pacte de financement de 1000 milliards FCFA sera signé en avril 2025 avec les partenaires financiers pour soutenir efficacement les entreprises.\n\nLe Premier ministre a également insisté sur la nécessité de mettre fin à l'affairisme d'État, déclarant que ces pratiques appartiennent désormais au passé. Il a souligné l'importance du patriotisme économique et a annoncé la préparation d'un projet de loi en ce sens, destiné à renforcer et protéger l'économie nationale.\n\nCe forum, organisé par l'Agence de Développement et d'Encadrement des Petites et Moyennes Entreprises (ADEPME), a réuni divers acteurs du secteur entrepreneurial pour discuter des défis et opportunités liés à l'innovation et au financement.",
                album: [
                    sonko1,
                    sonko2,
                    sonko3,
                    sonko,
                    sonko2
                ]
            },
            {
                url: maimouna,
                title: "Mdme Maimouna Dieye",
                description: "Madame Maïmouna Dièye est une femme politique sénégalaise, actuellement Ministre de la Famille et des Solidarités depuis le 5 avril 2024. Elle est membre du parti PASTEF et a occupé le poste de Présidente du Mouvement National des Femmes de PASTEF pour le Sénégal et la diaspora, ainsi que celui de Vice-coordonnatrice de ce parti pour le département de Dakar.Avant sa carrière politique, Mme Dièye a travaillé pendant 30 ans dans l'industrie pharmaceutique, occupant divers postes en Suisse, en France, au Mali, en Guinée-Bissau et en République de Guinée. Elle est également ceinture noire en karaté et a été trois fois championne du Sénégal.En tant que Ministre de la Famille et des Solidarités, elle s'engage à promouvoir une véritable politique familiale, en plaçant la famille, la femme et la solidarité au centre des priorités. Elle vise notamment à assurer un financement de la santé endogène et innovant, au profit de la femme et de l’enfant, en mettant l'accent sur la prévention.Mme Dièye est également Présidente du Réseau Samadev-international, qui finance des groupements de femmes avec des mécanismes innovants et participatifs dans plusieurs départements du Sénégal.",
                album: [
                    maimouna1,
                    maimouna2,
                    maimouna4,
                    maimouna4,
                    maimouna2
                ]
            },
            {
                url: khady,
                title: "Mdme Khady Diene",
                description: "Vue panoramique naturelle",
                album: [
                    khady1,
                    khady1,
                    khad2,
                    khad3,
                    khad4
                ]
            }
        ],
        evenement: [
            {
                url: unipro,
                title: "Remise de Parchemins à l’UNIPRO",
                description: "La cérémonie de remise de parchemins de l'Université Polytechnique (UNIPRO) marque une étape importante dans le parcours académique des étudiants. Cet événement solennel, qui s'est tenu en présence des autorités universitaires, des enseignants, des familles et des partenaires institutionnels, symbolise l'aboutissement de plusieurs années d'efforts et de persévérance. Lors de cette cérémonie, les diplômés ont reçu leurs parchemins, attestant de leur réussite et de leur engagement dans leur domaine d'étude. Les discours prononcés à cette occasion ont mis en avant l'excellence académique, la rigueur et l'innovation, valeurs fondamentales portées par l'UNIPRO.",
                album: [
                    unipro1,
                    unipro10,
                    unipro3,
                    unipro4,
                    unipro2,
                    unipro5
                ]
            },
            {
                url: alibeta,
                description: "Paysage naturel spectaculaire",
                album: [
                    alibeta1,
                    alibeta3,
                    bamby,
                    bamby1,
                    ibaaku1,
                    ibaaku1
                ]
            },
            {
                url: "https://images.unsplash.com/photo-1426604966848-d7adac402bff",
                description: "Nature sauvage préservée",
                album: [
                    "https://images.unsplash.com/photo-1426604966848-d7adac402bff",
                    "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07",
                    "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d",
                    "https://images.unsplash.com/photo-1502082553048-f009c37129b9",
                    "https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5"
                ]
            },
            {
                url: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e",
                description: "Vue panoramique naturelle",
                album: [
                    "https://images.unsplash.com/photo-1472214103451-9374bd1c798e",
                    "https://images.unsplash.com/photo-1542224566-6e85f2e6772f",
                    "https://images.unsplash.com/photo-1473773508845-188df298d2d1",
                    "https://images.unsplash.com/photo-1444464666168-49d633b86797",
                    "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07"
                ]
            }
        ],
        cultures: [
            {
                url: culture,
                title: "Le Lac des Montagnes",
                description: "Une magnifique vue sur la nature sauvage",
                album: [
                    culture1,
                    culture2,
                    culture3,
                    culture5,
                    culture6,
                    culture4
                ]
            },
            {
                url: open,
                title: "Le Lac des Montagnes",
                description: "Paysage naturel spectaculaire",
                album: [
                    open1,
                    openn2,
                    open3,
                    open4,
                    open5,
                    open6
                ]
            },
            {
                url: appel,
                title: "Celeberation De L'appel Des Layennes",
                description: "La 145ᵉ édition de l'Appel de Seydina Limamou Lahi s'est tenue les 30 et 31 janvier 2025, rassemblant des milliers de fidèles à Yoff, Ngor et Cambérène pour commémorer l'appel du fondateur de la confrérie layène. À cette occasion, des représentants de la Présidence de la République ont été reçus par le Khalife général des Layènes, Serigne Mouhamadou Makhtar Laye, pour exprimer leur soutien et participer aux cérémonies. Cette visite a renforcé les liens entre les autorités étatiques et la communauté layène, illustrant l'importance accordée à cet événement religieux majeur dans la vie spirituelle du Sénégal.",
                album: [
                    appel1,
                    appel2,
                    appel3,
                    appel4,
                    appel5,
                    appel
                ]
            }
        ]
        

    };

    type CategoryKey = keyof typeof categoryImages;
    const categoryKey = category.toLowerCase() as CategoryKey;
    
    if (!categoryImages[categoryKey] || parseInt(id) >= categoryImages[categoryKey].length) {
        console.log('Invalid category or id, redirecting...');
        return <Navigate to="/portfolio" replace />;
    }

    const image = categoryImages[categoryKey][parseInt(id)];

    if (!image) {
        return <Navigate to="/portfolio" replace />;
    }

    const handleImageClick = (photoUrl: string, index: number) => {
        setSelectedImage(photoUrl);
        setCurrentImageIndex(index);
        setShowModal(true);
    };

    const handlePrevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        const newIndex = (currentImageIndex - 1 + image.album.length) % image.album.length;
        setCurrentImageIndex(newIndex);
        setSelectedImage(image.album[newIndex]);
    };

    const handleNextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        const newIndex = (currentImageIndex + 1) % image.album.length;
        setCurrentImageIndex(newIndex);
        setSelectedImage(image.album[newIndex]);
    };

    return (
        <>
            <HeaderFull titre={`${category}`} />
            
            <section className="py-16 text-white portfoliodetails">
                <div className="container mx-auto px-4 md:px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-6xl mx-auto"
                    >
                        <h2 className="text-3xl font-bold mb-8 titleportfolio">{image.title}</h2>
                        <div className="space-y-6">
                            <p className="text-lg paraportfolio leading-relaxed">
                                {image.description}
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            <section className="py-16 portfoliodetails">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {image.album.map((photoUrl, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="aspect-square overflow-hidden relative group rounded-xl"
                            >
                                <img 
                                    src={photoUrl} 
                                    alt={`${image.description} - Photo ${index + 1}`}
                                    className="w-full h-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                                    onClick={() => handleImageClick(photoUrl, index)}
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-start p-6">
                                    
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {showModal && selectedImage && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setShowModal(false);
                    }}
                >
                    <motion.div 
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.5 }}
                        className="relative max-w-7xl max-h-[90vh]"
                    >
                        <img 
                            src={selectedImage} 
                            alt={image.description}
                            className="max-w-full max-h-[90vh] object-contain"
                        />
                    </motion.div>

                    <motion.button 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-4xl p-4 hover:text-gray-300 focus:outline-none"
                        onClick={handlePrevImage}
                    >
                        &#8249;
                    </motion.button>

                    <motion.button 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-4xl p-4 hover:text-gray-300 focus:outline-none"
                        onClick={handleNextImage}
                    >
                        &#8250;
                    </motion.button>

                    <motion.button 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute top-4 right-4 text-white text-3xl p-2 hover:text-gray-300 focus:outline-none"
                        onClick={() => setShowModal(false)}
                    >
                        ×
                    </motion.button>
                </motion.div>
            )}
        </>
    );
}

export default PortfolioDetail;