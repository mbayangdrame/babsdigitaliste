import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface SafeImageProps {
  src: string | null;
  thumbnailSrc?: string | null;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  onError?: () => void;
  onLoad?: () => void;
}

const SafeImage: React.FC<SafeImageProps> = ({
  src,
  thumbnailSrc,
  alt,
  className = '',
  fallbackSrc = '/img/herobabs.jpg',
  onError,
  onLoad
}) => {
  const [currentSrc, setCurrentSrc] = useState<string>(fallbackSrc);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const loadImage = async () => {
      if (!src && !thumbnailSrc) {
        setCurrentSrc(fallbackSrc);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setHasError(false);

        // Utiliser la méthode asynchrone pour vérifier l'existence de l'image
        const validUrl = await apiService.getImageUrlAsync(src, thumbnailSrc || null);
        setCurrentSrc(validUrl);
        setIsLoading(false);
      } catch (error) {
        console.warn('Erreur lors du chargement de l\'image:', error);
        setCurrentSrc(fallbackSrc);
        setHasError(true);
        setIsLoading(false);
        onError?.();
      }
    };

    loadImage();
  }, [src, thumbnailSrc, fallbackSrc, onError]);

  const handleImageError = () => {
    if (currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setHasError(true);
      onError?.();
    }
  };

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
    onLoad?.();
  };

  return (
    <div className={`safe-image-container ${className}`}>
      {isLoading && (
        <div className="image-loading">
          <div className="loading-spinner"></div>
        </div>
      )}
      <img
        src={currentSrc}
        alt={alt}
        className={`safe-image ${className} ${isLoading ? 'loading' : ''} ${hasError ? 'error' : ''}`}
        onError={handleImageError}
        onLoad={handleImageLoad}
        style={{
          opacity: isLoading ? 0.5 : 1,
          transition: 'opacity 0.3s ease-in-out'
        }}
      />
    </div>
  );
};

export default SafeImage; 