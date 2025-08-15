import { useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import HeaderFull from '../components/HeaderFull';
import { useState, useEffect } from 'react';
import { apiService, Image } from '../services/api';

import '../css/portfoliodetail.css';
import { Calendar } from 'lucide-react';

function PortfolioDetail() {
    const { category, id } = useParams();
    const validCategories = ['nature', 'shooting', 'mariage', 'evenement', 'politique', 'cultures', "videos"];
    
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
    const [image, setImage] = useState<Image | null>(null);
    const [albumImages, setAlbumImages] = useState<Image[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const formatDate = (dateStr: string | null | undefined) => {
        if (!dateStr) return null;
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return null;
        return d.toLocaleDateString('fr-FR');
    };

    // Charger l'image et l'album depuis l'API
    useEffect(() => {
        const loadImageAndAlbum = async () => {
            if (!category || !id) return;
            
            try {
                setLoading(true);
                setError(null);
                
                // Vérifier si l'ID est un nom d'album ou un ID d'image
                const isAlbumName = isNaN(parseInt(id));
                
                if (isAlbumName) {
                    // C'est un nom d'album
                    const albumImages = await apiService.getImagesByAlbum(id);
                    if (albumImages.length > 0) {
                        setImage(albumImages[0]); // Première image comme image principale
                        setAlbumImages(albumImages);
                    } else {
                        setError('Album non trouvé');
                    }
                } else {
                    // C'est un ID d'image individuelle
                    const categoryImages = await apiService.getImagesByCategory(category.toLowerCase());
                    const imageIndex = parseInt(id);
                    
                    if (imageIndex >= 0 && imageIndex < categoryImages.length) {
                        const selectedImage = categoryImages[imageIndex];
                        setImage(selectedImage);
                        
                        // Si l'image a un album, charger toutes les images de cet album
                        if (selectedImage.album_name) {
                            const albumImages = await apiService.getImagesByAlbum(selectedImage.album_name);
                            setAlbumImages(albumImages);
                        } else {
                            // Sinon, créer un album avec toutes les images de la catégorie
                            setAlbumImages(categoryImages.slice(0, 12)); // Limiter à 12 images
                        }
                    } else {
                        setError('Image non trouvée');
                    }
                }
            } catch (err) {
                console.error('Erreur lors du chargement de l\'image:', err);
                setError('Erreur lors du chargement de l\'image depuis l\'API');
            } finally {
                setLoading(false);
            }
        };

        loadImageAndAlbum();
    }, [category, id]);

    if (!category || !validCategories.includes(category.toLowerCase()) || !id) {
        return <Navigate to="/portfolio" replace />;
    }

    if (loading) {
        return (
            <>
                <HeaderFull titre={`${category}`} paragraphe="Découvrez nos travaux récents et notre expertise dans le domaine de la photographie et du vidéo." />
                <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                        <p className="mt-2">Chargement de l'image...</p>
                    </div>
                </div>
            </>
        );
    }

    if (error || !image) {
        return (
            <>
                <HeaderFull titre={`${category}`} paragraphe="Découvrez nos travaux récents et notre expertise dans le domaine de la photographie et du vidéo." />
                <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                    <div className="text-center text-red-600">
                        <p>{error || 'Image non trouvée'}</p>
                        <p className="text-sm mt-2">Retournez à la galerie</p>
                    </div>
                </div>
            </>
        );
    }

    const handleImageClick = (image: Image, index: number) => {
        setSelectedImage(apiService.getImageUrl(image.image_url));
        setCurrentImageIndex(index);
        setShowModal(true);
    };

    const handlePrevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        const newIndex = (currentImageIndex - 1 + albumImages.length) % albumImages.length;
        setCurrentImageIndex(newIndex);
        setSelectedImage(apiService.getImageUrl(albumImages[newIndex].image_url));
    };

    const handleNextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        const newIndex = (currentImageIndex + 1) % albumImages.length;
        setCurrentImageIndex(newIndex);
        setSelectedImage(apiService.getImageUrl(albumImages[newIndex].image_url));
    };

    return (
        <>
            <HeaderFull titre={`${category}`} paragraphe="Découvrez nos travaux récents et notre expertise dans le domaine de la photographie et du vidéo." />
            
            <section className="py-16 text-white portfoliodetails">
                <div className="container mx-auto px-4 md:px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-6xl "
                    >
                        <h2 className="text-3xl font-bold mb-8 titleportfolio">{image.title}</h2>
                        <div className="space-y-6">
                        {image.event_date && (
                                <div className="flex items-center">
                                    <Calendar className="w-5 h-5 mr-2 text-gray-400" />
                                    <p className="text-xl text-gray-400 font-semibold">
                                      {formatDate(image.event_date)}
                                    </p>
                                </div>
                            )}
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
                        {albumImages.map((albumImage, index) => (
                            <motion.div
                                key={albumImage.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="aspect-square overflow-hidden relative group rounded-xl"
                                onClick={() => handleImageClick(albumImage, index)}
                            >
                                <img 
                                    src={apiService.getImageUrl(albumImage.thumbnail_url || albumImage.image_url)} 
                                    alt={`${albumImage.title} - Photo ${index + 1}`}
                                    className="w-full h-[542px] object-cover rounded-xl transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                                    onError={(e) => {
                                        // Vérifier que l'élément existe toujours
                                        if (!e.currentTarget) {
                                            return;
                                        }
                                        
                                        // Essayer d'abord l'image originale si le thumbnail échoue
                                        if (albumImage.thumbnail_url && albumImage.image_url !== albumImage.thumbnail_url) {
                                            const originalUrl = apiService.getImageUrl(albumImage.image_url);
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
                            alt={image.title}
                            className="max-w-full max-h-[90vh] object-contain"
                        />
                    </motion.div>

                    {albumImages.length > 1 && (
                        <>
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
                        </>
                    )}

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