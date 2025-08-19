import { supabase } from './supabaseClient';

export interface Image {
  id: number;
  title: string;
  description: string;
  image_url: string;
  thumbnail_url: string;
  album_name?: string;
  event_date?: string;
  category_name: string;
  category_id: number;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image_count: number;
}

class ApiService {
  // Authentification avec Supabase
  async login(email: string, password: string): Promise<{ success: boolean; session?: unknown; message?: string }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        return { success: false, message: error.message };
      }
      return { success: true, session: data.session };
    } catch {
      return { success: false, message: 'Erreur de connexion' };
    }
  }

  // Récupérer les catégories depuis Supabase
  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase.from('categories').select('*');
    if (error) {
      console.error('Erreur Supabase:', error);
      return [];
    }
    return data || [];
  }

  // Récupérer les images par catégorie
  async getImagesByCategory(categoryId: number): Promise<Image[]> {
    const { data, error } = await supabase
      .from('images')
      .select('*')
      .eq('category_id', categoryId);
    if (error) {
      console.error('Erreur Supabase:', error);
      return [];
    }
    return data || [];
  }

  // Récupérer les images par album
  async getImagesByAlbum(albumName: string): Promise<Image[]> {
    const { data, error } = await supabase
      .from('images')
      .select('*')
      .eq('album_name', albumName);
    if (error) {
      console.error('Erreur Supabase:', error);
      return [];
    }
    return data || [];
  }

  // Upload d'une image dans Supabase Storage
  async uploadImage(file: File): Promise<{ success: boolean; message: string; url?: string }> {
    // Générer un nom unique pour chaque fichier
    const uniqueName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from('images') // nom du bucket
      .upload(`public/${uniqueName}`, file);
    if (error) {
      console.error('Erreur upload Supabase:', error);
      return { success: false, message: error.message };
    }
    return { success: true, message: 'Upload réussi', url: data?.path };
  }

  // Upload multiple images (exemple simplifié)
  async uploadMultipleImages(files: File[]): Promise<{ success: boolean; message: string; images?: Array<{ url: string }> }> {
    const results: Array<{ url: string }> = [];
    for (const file of files) {
      const { data, error } = await supabase.storage.from('images').upload(`public/${file.name}`, file);
      if (error) {
        console.error('Erreur upload multiple Supabase:', error);
        return { success: false, message: error.message };
      }
      if (data?.path) {
        results.push({ url: data.path });
      }
    }
    return { success: true, message: 'Upload multiple réussi', images: results };
  }

  // Récupérer toutes les images
  async getAllImages(): Promise<Image[]> {
    const { data, error } = await supabase.from('images').select('*');
    if (error) return [];
    return data || [];
  }
}

export const apiService = new ApiService();

export function getImageUrl(path: string) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  // Supprime tous les / initiaux et le préfixe 'public/'
  const cleanPath = path.replace(/^\/+/, '').replace(/^public\//, '');
  return `https://klvrhlxerqhofvjgkcma.supabase.co/storage/v1/object/public/images/${cleanPath}`;
}