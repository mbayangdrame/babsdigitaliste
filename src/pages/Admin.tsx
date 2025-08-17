import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { supabase } from '../services/supabaseClient';
import { apiService, Image, Category } from '../services/api';

const Admin: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [images, setImages] = useState<Image[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imageTitle, setImageTitle] = useState<string>('');
  const [imageDescription, setImageDescription] = useState<string>('');
  const [imageAlbum, setImageAlbum] = useState<string>('');
  const [imageEventDate, setImageEventDate] = useState<string>('');
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });

  // Connexion avec Supabase
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginForm.username,
        password: loginForm.password
      });
      if (error) {
        toast.error(error.message);
        setIsLoggedIn(false);
      } else {
        setIsLoggedIn(true);
        fetchAllData();
        toast.success('Connexion réussie !');
      }
    } catch {
      toast.error('Erreur de connexion au serveur');
    }
  };

  // Récupérer toutes les données
  const fetchAllData = async () => {
    await Promise.all([
      fetchImages(),
      fetchCategories()
    ]);
  };

  // Récupérer les images
  const fetchImages = async () => {
    const imgs = await apiService.getImagesByCategory(selectedCategory || '');
    setImages(imgs);
  };

  // Récupérer les catégories
  const fetchCategories = async () => {
    const cats = await apiService.getCategories();
    setCategories(cats);
  };

  // Upload d'images
  const handleBulkUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      toast.error('Veuillez sélectionner des images');
      return;
    }
    if (!selectedCategory) {
      toast.error('Veuillez sélectionner une catégorie');
      return;
    }
    setUploading(true);
    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        // Upload dans le bucket
        const uploadRes = await apiService.uploadImage(file);
        if (uploadRes.success && uploadRes.url) {
          // Insertion dans la table images
          const { error: insertError } = await supabase.from('images').insert([
            {
              title: imageTitle,
              description: imageDescription,
              image_url: uploadRes.url,
              category_slug: selectedCategory,
              album_name: imageAlbum,
              event_date: imageEventDate
            }
          ]);
          if (insertError) {
            toast.error('Erreur lors de l’insertion dans la base');
          }
        } else {
          toast.error(uploadRes.message);
        }
      }
      toast.success('Upload réussi !');
      fetchImages();
      setSelectedFiles(null);
      setSelectedCategory('');
      setImageTitle('');
      setImageDescription('');
      setImageAlbum('');
      setImageEventDate('');
    } catch {
      toast.error('Erreur lors de l’upload');
    } finally {
      setUploading(false);
    }
  };

  // Suppression d'image
  const handleDeleteImage = async (imageId: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) return;
    const { error } = await supabase.from('images').delete().eq('id', imageId);
    if (!error) {
      toast.success('Image supprimée avec succès');
      fetchImages();
    } else {
      toast.error('Erreur lors de la suppression');
    }
  };

  // Affichage du formulaire de login ou du dashboard selon isLoggedIn
  if (!isLoggedIn) {
    return (
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Email"
          value={loginForm.username}
          onChange={e => setLoginForm({ ...loginForm, username: e.target.value })}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={loginForm.password}
          onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
        />
        <button type="submit">Se connecter</button>
      </form>
    );
  }

  return (
    <div>
      <h2>Admin connecté</h2>
      {/* Ajoute ici le dashboard, la gestion des images, catégories, etc. */}
    </div>
  );
};

export default Admin; 