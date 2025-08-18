
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import HeaderFull from './HeaderFull';
import { useState, useEffect } from 'react';
import { apiService, Image, Category, getImageUrl } from '../services/api';

import "../css/portfoliodetail.css"

function CategoryPortfolio() {
    const { category } = useParams();
    const navigate = useNavigate();
    const validCategories = ['nature', 'shooting', 'mariage','evenement','politique','cultures',"videos"];
    
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showVideoModal, setShowVideoModal] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);
    const [images, setImages] = useState<Image[]>([]);
    const [albums, setAlbums] = useState<{ [key: string]: Image }>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);

    console.log('Category param:', category);

    // Charger les catégories au montage
    useEffect(() => {
        const loadCategories = async () => {
            const cats = await apiService.getCategories();
            setCategories(cats);
        };
        loadCategories();
    }, []);

    // Charger les images depuis l'API et les organiser par album
    useEffect(() => {
        const loadImages = async () => {
            if (!category) return;
            // Trouver la catégorie correspondante
            const catObj = categories.find(cat => cat.slug === category.toLowerCase());
            if (!catObj) return;
            try {
                setLoading(true);
                setError(null);
                // Utiliser l'id numérique !
                const categoryImages = await apiService.getImagesByCategory(catObj.id);
                setImages(categoryImages);
                
                // Organiser les images par album
                const albumsMap: { [key: string]: Image } = {};
                console.log(categoryImages);
                console.log(albumsMap);
                categoryImages.forEach(image => {
                    if (image.album_name) {
                        // Si l'album n'existe pas encore, on prend la première image
                        if (!albumsMap[image.album_name]) {
                            albumsMap[image.album_name] = image;
                        }
                    } else {
                        // Pour les images sans album, on les traite individuellement
                        const key = `single_${image.id}`;
                        albumsMap[key] = image;
                    }
                });
                setAlbums(albumsMap);
            } catch (err) {
                console.error('Erreur lors du chargement des images:', err);
                setError('Erreur lors du chargement des images depuis l\'API');
            } finally {
                setLoading(false);
            }
        };

        loadImages();
    }, [category, categories]);
    
    if (!category || !validCategories.includes(category.toLowerCase())) {
        console.log('Invalid category, redirecting...');
        return <Navigate to="/portfolio" replace />;
    }

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const handleImageClick = (albumKey: string, image: Image) => {
        if (category?.toLowerCase() === 'videos') {
            // Pour les vidéos, on peut implémenter une logique spécifique plus tard
            console.log('Vidéo cliquée:', image);
        } else {
            // Pour les images, naviguer vers la page de détail avec l'album
            if (image.album_name) {
                navigate(`/portfoliodetail/${category?.toLowerCase()}/${image.album_name}`);
            } else {
                // Pour les images individuelles, utiliser l'ID
                navigate(`/portfoliodetail/${category?.toLowerCase()}/${image.id}`);
            }
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedImage(null);
    };

    return (
       <>
        <HeaderFull titre={` ${category}`} paragraphe="Découvrez nos travaux récents et notre expertise dans le domaine de la photographie et du vidéo." />
       
       <section className="py-32 portfoliodetails">
            <div className="container mx-auto px-6">
                {loading && (
                    <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                        <p className="mt-2">Chargement des images...</p>
                    </div>
                )}
                
                {error && (
                    <div className="text-center py-8 text-red-600">
                        <p>{error}</p>
                        <p className="text-sm mt-2">Impossible de charger les images depuis l'API</p>
                    </div>
                )}
                
                {!loading && !error && images.length === 0 && (
                    <div className="text-center py-8 text-gray-600">
                        <p className="text-lg mb-2">Aucune image trouvée pour cette catégorie</p>
                        <p className="text-sm">La catégorie "{category}" ne contient actuellement aucune image.</p>
                    </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Object.entries(albums).map(([albumKey, image], index) => {
                        const isVideo = category.toLowerCase() === 'videos';
                        const thumbnailUrl = getImageUrl(image.thumbnail_url || image.image_url);
                        


                        return (
                            <motion.div
                                key={albumKey}
                                initial="hidden"
                                animate="visible"
                                variants={fadeIn}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="aspect-square overflow-hidden relative group rounded-xl cursor-pointer"
                                onClick={() => handleImageClick(albumKey, image)}
                            >
                                <img 
                                    src={thumbnailUrl} 
                                    alt={image.title || image.description}
                                    className="w-full h-[542px] object-cover rounded-xl transition-transform duration-300 group-hover:scale-105 thumbnail"
                                    onError={(e) => {
                                        // Vérifier que l'élément existe toujours
                                        if (!e.currentTarget) {
                                            return;
                                        }
                                        
                                        // Essayer d'abord l'image originale si le thumbnail échoue
                                        if (image.thumbnail_url && image.image_url !== image.thumbnail_url) {
                                            const originalUrl = getImageUrl(image.image_url);
                                            e.currentTarget.src = originalUrl;
                                            e.currentTarget.onerror = () => {
                                                // Vérifier à nouveau que l'élément existe
                                                if (e.currentTarget) {
                                                    e.currentTarget.src = '/img/herobabs.jpg';
                                                    e.currentTarget.onerror = null;
                                                }
                                            };
                                        } else {
                                            // Fallback direct vers l'image par défaut
                                            e.currentTarget.src = '/img/herobabs.jpg';
                                            e.currentTarget.onerror = null;
                                        }
                                    }}
                                />
                                <div 
                                    className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-start p-6"
                                >
                                    <div className="text-white w-full">
                                        <h3 className="text-xl font-bold mb-2">{image.title}</h3>
                                        {image.album_name && (
                                            <p className="text-sm text-gray-300 mb-2">Album: {image.album_name}</p>
                                        )}
                                        {isVideo && (
                                            <div className="flex items-center justify-center w-full">
                                                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
        
        <AnimatePresence>
            {showModal && selectedImage && (
                <motion.div
                    className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={closeModal}
                >
                    <motion.div
                        className="relative max-w-4xl max-h-[90vh] overflow-hidden"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.img
                            src={selectedImage}
                            alt="Image agrandie"
                            className="max-h-[90vh] max-w-full object-contain zoomed-image"
                            onClick={(e) => e.stopPropagation()}
                        />
                        <button 
                            className="absolute top-4 right-4 bg-white bg-opacity-50 hover:bg-opacity-100 rounded-full p-2 transition-all duration-300"
                            onClick={closeModal}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </motion.div>
                </motion.div>
            )}

            {showVideoModal && selectedVideoUrl && (
                <motion.div
                    className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowVideoModal(false)}
                >
                    <motion.div
                        className="relative w-full max-w-4xl bg-black"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="video-responsive-wrapper">
                            <iframe
                                src={selectedVideoUrl}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                className="absolute top-0 left-0 w-full h-full"
                            ></iframe>
                        </div>
                        <button 
                            className="absolute -top-3 -right-3 bg-white bg-opacity-70 hover:bg-opacity-100 rounded-full p-2 transition-all duration-300 z-10"
                            onClick={() => setShowVideoModal(false)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>

       </>
    );
}

export default CategoryPortfolio;
