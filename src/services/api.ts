// URL de base de l'API - s'adapte automatiquement à l'environnement
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://localhost:3000/api' 
    : '/api');

// Configuration de l'API pour la production
const API_BASE_URL_FINAL = API_BASE_URL;

export interface Image {
  id: number;
  title: string;
  description: string;
  image_url: string;
  thumbnail_url: string;
  album_name?: string;
  event_date?: string;
  category_name: string;
  category_slug: string;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

// Fonction pour vérifier si une image existe (version rapide - pas de requête réseau)
function checkImageExists(url: string): boolean {
  // Ne plus faire de requête réseau pour optimiser la vitesse
  // La gestion d'erreur se fait directement dans le HTML avec onError
  return true;
}

// Fonction pour obtenir une URL d'image avec fallback automatique (version optimisée)
export function getImageUrlWithFallback(imageUrl: string | null, thumbnailUrl: string | null): string {
  // Privilégier le thumbnail s'il existe, sinon l'image originale
  const preferredUrl = thumbnailUrl || imageUrl;
  
  if (!preferredUrl) {
    return '/img/herobabs.jpg';
  }

  // Construire l'URL complète si ce n'est pas déjà fait
  if (preferredUrl.startsWith('http')) {
    return preferredUrl;
  }
  
  return `${API_BASE_URL_FINAL.replace(/\/api$/, '')}${preferredUrl}`;
}

class ApiService {
  private baseUrl: string;
  private cache: Map<string, any> = new Map();
  private cacheExpiry: Map<string, number> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes en millisecondes

  constructor() {
    this.baseUrl = API_BASE_URL_FINAL;
  }

  // Méthode pour gérer le cache
  private getCached<T>(key: string): T | null {
    const expiry = this.cacheExpiry.get(key);
    if (expiry && Date.now() > expiry) {
      this.cache.delete(key);
      this.cacheExpiry.delete(key);
      return null;
    }
    return this.cache.get(key) || null;
  }

  private setCached<T>(key: string, value: T): void {
    this.cache.set(key, value);
    this.cacheExpiry.set(key, Date.now() + this.CACHE_DURATION);
  }

  // Méthode pour obtenir l'URL d'une image (version synchrone pour compatibilité)
  getImageUrl(imageUrl: string | null): string {
    if (!imageUrl) {
      return '/img/herobabs.jpg';
    }
    
    // Si c'est déjà une URL complète, la retourner
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    
    // Sinon, construire l'URL complète
    return `${API_BASE_URL_FINAL.replace(/\/api$/, '')}${imageUrl}`;
  }

  // Méthode pour obtenir l'URL d'une image avec vérification (version optimisée)
  getImageUrlAsync(imageUrl: string | null, thumbnailUrl: string | null): string {
    return getImageUrlWithFallback(imageUrl, thumbnailUrl);
  }

  // Méthode pour créer un composant image avec gestion d'erreur automatique
  createImageElement(src: string, alt: string, className: string = ''): HTMLImageElement {
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    if (className) img.className = className;
    
    img.onerror = () => {
      img.src = '/img/herobabs.jpg';
      img.onerror = null; // Éviter les boucles infinies
    };
    
    return img;
  }

  // Méthode pour filtrer les images valides
  async filterValidImages(images: Image[]): Promise<Image[]> {
    const validImages: Image[] = [];
    
    for (const image of images) {
      const hasValidImage = await checkImageExists(this.getImageUrl(image.image_url));
      const hasValidThumbnail = await checkImageExists(this.getImageUrl(image.thumbnail_url));
      
      if (hasValidImage || hasValidThumbnail) {
        validImages.push(image);
      }
    }
    
    return validImages;
  }

  // Méthodes existantes...
  async getCategories(): Promise<Category[]> {
    const cacheKey = 'categories';
    const cached = this.getCached<Category[]>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const response = await fetch(`${this.baseUrl}/images/categories`);
      const data = await response.json();
      const result = data.success ? data.data : [];
      this.setCached(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
      return [];
    }
  }

  async getImagesByCategory(categorySlug: string): Promise<Image[]> {
    const cacheKey = `category-${categorySlug}`;
    const cached = this.getCached<Image[]>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const response = await fetch(`${this.baseUrl}/images/category/${categorySlug}`);
      const data = await response.json();
      
      if (data.success && data.data) {
        // Retourner directement les images sans filtrage côté client pour optimiser la vitesse
        this.setCached(cacheKey, data.data);
        return data.data;
      }
      
      return [];
    } catch (error) {
      console.error('Erreur lors de la récupération des images:', error);
      return [];
    }
  }

  async getImagesByAlbum(albumName: string): Promise<Image[]> {
    const cacheKey = `album-${albumName}`;
    const cached = this.getCached<Image[]>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const response = await fetch(`${this.baseUrl}/images/album/${encodeURIComponent(albumName)}`);
      const data = await response.json();
      
      if (data.success && data.data) {
        // Retourner directement les images sans filtrage côté client pour optimiser la vitesse
        this.setCached(cacheKey, data.data);
        return data.data;
      }
      
      return [];
    } catch (error) {
      console.error('Erreur lors de la récupération des images par album:', error);
      return [];
    }
  }

  async login(email: string, password: string): Promise<{ success: boolean; token?: string; message?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      return { success: false, message: 'Erreur de connexion' };
    }
  }

  async uploadImage(formData: FormData, token: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/images`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      return { success: false, message: 'Erreur lors de l\'upload' };
    }
  }

  async uploadMultipleImages(formData: FormData, token: string): Promise<{ success: boolean; message: string; images?: Array<{ id: number; title: string; imageUrl: string; thumbnailUrl: string }> }> {
    try {
      const response = await fetch(`${this.baseUrl}/images/bulk`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de l\'upload multiple:', error);
      return { success: false, message: 'Erreur lors de l\'upload multiple' };
    }
  }
}

export const apiService = new ApiService(); 