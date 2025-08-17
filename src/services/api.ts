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
  async getImagesByCategory(categorySlug: string): Promise<Image[]> {
    const { data, error } = await supabase
      .from('images')
      .select('*')
      .eq('category_slug', categorySlug);
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
    const { data, error } = await supabase.storage
      .from('images') // nom du bucket
      .upload(`public/${file.name}`, file);
    if (error) {
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
        return { success: false, message: error.message };
      }
      if (data?.path) {
        results.push({ url: data.path });
      }
    }
    return { success: true, message: 'Upload multiple réussi', images: results };
  }
}

export const apiService = new ApiService(); 