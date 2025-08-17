/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import { Edit, Trash2, Upload, Eye, Calendar, Folder, Tag, Plus, X, Save, Image as ImageIcon, TrendingUp } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';
import { apiService } from '../services/api';
import { supabase } from '../services/supabaseClient';

interface Image {
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

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image_count: number;
}

interface Album {
  album_name: string;
  image_count: number;
  created_at: string;
  category_name?: string;
  category_slug?: string;
}

interface AlbumDetail {
  id: number;
  title: string;
  description: string;
  category_name: string;
  category_slug: string;
  image_count: number;
  created_at: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Fonction utilitaire pour les requêtes avec CORS
const fetchWithCORS = async (url: string, options: RequestInit = {}) => {
  // Ne pas forcer Content-Type pour FormData (laissera le navigateur le définir automatiquement)
  const isFormData = options.body instanceof FormData;
  
  const defaultHeaders: Record<string, string> = {
    'Accept': 'application/json',
    'Origin': window.location.origin
  };

  // Ajouter Content-Type seulement si ce n'est pas FormData
  if (!isFormData) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  // Fusionner avec les headers existants
  const finalHeaders = {
    ...defaultHeaders,
    ...options.headers
  };

  const config: RequestInit = {
    ...options,
    headers: finalHeaders,
    credentials: 'include'
  };

  return fetch(url, config);
};

const Admin: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState<string | null>(localStorage.getItem('adminToken'));
  const [images, setImages] = useState<Image[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imageTitle, setImageTitle] = useState<string>('');
  const [imageDescription, setImageDescription] = useState<string>('');
  const [imageAlbum, setImageAlbum] = useState<string>('');
  const [imageEventDate, setImageEventDate] = useState<string>('');
  const [editingImage, setEditingImage] = useState<Image | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);
  const [showAlbumModal, setShowAlbumModal] = useState(false);
  const [albumImages, setAlbumImages] = useState<Image[]>([]);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [activeSection, setActiveSection] = useState<'dashboard' | 'galerie' | 'albums' | 'categories'>('dashboard');
  const [showSidebar, setShowSidebar] = useState(false);

  // États pour les statistiques
  const [stats, setStats] = useState({
    totalImages: 0,
    totalAlbums: 0,
    totalCategories: 0,
    featuredImages: 0,
    recentUploads: 0
  });

  const [loginForm, setLoginForm] = useState({
    username: '',
    password: ''
  });

  // Ajout d'un nouvel état pour la modale d'ajout de photos à un album
  const [showAddToAlbumModal, setShowAddToAlbumModal] = useState(false);
  const [addToAlbumName, setAddToAlbumName] = useState<string | null>(null);
  const [addToAlbumFiles, setAddToAlbumFiles] = useState<FileList | null>(null);
  const [addToAlbumUploading, setAddToAlbumUploading] = useState(false);

  useEffect(() => {
    if (token) {
      verifyToken();
    }
  }, [token]);

  useEffect(() => {
    if (images.length > 0 || categories.length > 0) {
      calculateStats();
    }
  }, [images, categories]);

  const verifyToken = async () => {
    try {
      const response = await fetchWithCORS(`${API_BASE_URL}/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setIsLoggedIn(true);
        fetchAllData();
      } else {
        localStorage.removeItem('adminToken');
        setToken(null);
        setIsLoggedIn(false);
      }
    } catch (error) {
      localStorage.removeItem('adminToken');
      setToken(null);
      setIsLoggedIn(false);
    }
  };

  const fetchAllData = async () => {
    await Promise.all([
      fetchImages(),
      fetchCategories(),
      fetchAlbums()
    ]);
    calculateStats();
  };

  const calculateStats = () => {
    const totalImages = images.length;
    const totalAlbums = new Set(images.map(img => img.album_name).filter(Boolean)).size;
    const totalCategories = categories.length;
    const featuredImages = images.filter(img => img.is_featured).length;
    const recentUploads = images.filter(img => {
      const uploadDate = new Date(img.created_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return uploadDate > weekAgo;
    }).length;

    setStats({
      totalImages,
      totalAlbums,
      totalCategories,
      featuredImages,
      recentUploads
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginForm.username,
        password: loginForm.password
      });
      if (error) {
        toast.error(error.message);
        setIsLoggedIn(false);
      } else {
        setIsLoggedIn(true);
        toast.success('Connexion réussie !');
        fetchAllData();
      }
    } catch (err) {
      toast.error('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    toast.info('Déconnexion réussie');
  };

  const fetchImages = async () => {
    const imgs = await apiService.getImagesByCategory(selectedCategory || '');
    setImages(imgs);
  };

  const fetchCategories = async () => {
    const cats = await apiService.getCategories();
    setCategories(cats);
  };

  const fetchAlbums = async () => {
    try {
      const response = await fetchWithCORS(`${API_BASE_URL}/images/albums`);
      const data = await response.json();
      if (data.success) {
        setAlbums(data.data);
      } else {
        console.error('Albums fetch failed:', data.message);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des albums:', error);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(e.target.files);
  };

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
        const uploadRes = await apiService.uploadImage(file);
        if (uploadRes.success && uploadRes.url) {
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
            toast.error('Erreur lors de l\'insertion dans la base');
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
      toast.error('Erreur lors de l\'upload');
    } finally {
      setUploading(false);
    }
  };

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

  const handleEditImage = (image: Image) => {
    setEditingImage(image);
    setNewImageFile(null);
    setShowEditModal(true);
  };

  const handleUpdateImage = async () => {
    if (!editingImage) return;

    try {
      let response;
      
      if (newImageFile) {
        // Si une nouvelle image est sélectionnée, utiliser FormData
        const formData = new FormData();
        formData.append('image', newImageFile);
        formData.append('title', editingImage.title);
        formData.append('description', editingImage.description || '');
        formData.append('album_name', editingImage.album_name || '');
        formData.append('event_date', editingImage.event_date || '');
        // Trouver l'ID de catégorie basé sur le nom
        const category = categories.find(cat => cat.name === editingImage.category_name);
        formData.append('category_id', category?.id.toString() || '1');

        response = await fetchWithCORS(`${API_BASE_URL}/images/${editingImage.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });
      } else {
        // Sinon, utiliser JSON pour les autres champs
        response = await fetchWithCORS(`${API_BASE_URL}/images/${editingImage.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(editingImage)
        });
      }

      const data = await response.json();

      if (data.success) {
        toast.success('Image modifiée avec succès');
        setShowEditModal(false);
        setEditingImage(null);
        setNewImageFile(null);
        fetchImages();
      } else {
        toast.error(data.message || 'Erreur lors de la modification');
      }
    } catch (error) {
      toast.error('Erreur lors de la modification');
    }
  };

  const handleViewAlbum = async (albumName: string) => {
    try {
      const response = await fetchWithCORS(`${API_BASE_URL}/images/album/${encodeURIComponent(albumName)}`);
      const data = await response.json();
      
      if (data.success) {
        setAlbumImages(data.data);
        setSelectedAlbum(albumName);
        setShowAlbumModal(true);
      } else {
        toast.error('Erreur lors du chargement de l\'album');
      }
    } catch (error) {
      toast.error('Erreur lors du chargement de l\'album');
    }
  };

  // Fonction pour ouvrir la modale d'ajout de photos à un album
  const handleOpenAddToAlbum = (albumName: string) => {
    setAddToAlbumName(albumName);
    setAddToAlbumFiles(null);
    setShowAddToAlbumModal(true);
  };

  // Fonction pour uploader les images dans l'album
  const handleAddToAlbumUpload = async () => {
    if (!addToAlbumFiles || !addToAlbumName) {
      toast.error('Veuillez sélectionner des images');
      return;
    }
    setAddToAlbumUploading(true);
    try {
      const formData = new FormData();
      for (let i = 0; i < addToAlbumFiles.length; i++) {
        formData.append('images', addToAlbumFiles[i]);
      }
      // On récupère la catégorie du premier élément de l'album
      const albumImages = images.filter(img => (img.album_name || 'Sans album') === addToAlbumName);
      const category = albumImages[0]?.category_name;
      const categoryObj = categories.find(cat => cat.name === category);
      formData.append('category_id', categoryObj?.id?.toString() || '1');
      formData.append('album_name', addToAlbumName);
      // Les autres champs sont vides ou par défaut
      formData.append('title', '');
      formData.append('description', '');
      formData.append('event_date', '');
      const response = await fetchWithCORS(`${API_BASE_URL}/images/bulk`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Images ajoutées à l\'album !');
        fetchImages();
        setShowAddToAlbumModal(false);
        setAddToAlbumFiles(null);
        setAddToAlbumName(null);
      } else {
        toast.error(data.message || 'Erreur lors de l\'upload');
      }
    } catch (error) {
      toast.error('Erreur lors de l\'upload');
    } finally {
      setAddToAlbumUploading(false);
    }
  };

  // Nouveau composant pour le formulaire d'upload d'images avec état local
  const ImageUploadForm: React.FC<{
    categories: Category[];
    token: string | null;
    fetchImages: () => void;
  }> = ({ categories, token, fetchImages }) => {
    const [imageTitle, setImageTitle] = useState('');
    const [imageAlbum, setImageAlbum] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [imageEventDate, setImageEventDate] = useState('');
    const [imageDescription, setImageDescription] = useState('');
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
    const [uploading, setUploading] = useState(false);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSelectedFiles(e.target.files);
    };

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
        const formData = new FormData();
        for (let i = 0; i < selectedFiles.length; i++) {
          formData.append('images', selectedFiles[i]);
        }
        formData.append('category_id', selectedCategory);
        formData.append('title', imageTitle);
        formData.append('description', imageDescription);
        formData.append('album_name', imageAlbum);
        formData.append('event_date', imageEventDate);
        const response = await fetchWithCORS(`${API_BASE_URL}/images/bulk`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });
        const data = await response.json();
        if (data.success) {
          toast.success(data.message);
          fetchImages();
          setSelectedFiles(null);
          setSelectedCategory('');
          setImageTitle('');
          setImageDescription('');
          setImageAlbum('');
          setImageEventDate('');
          const fileInput = document.getElementById('fileInput') as HTMLInputElement;
          if (fileInput) fileInput.value = '';
        } else {
          toast.error(data.message || 'Erreur lors de l\'upload');
        }
      } catch (error) {
        toast.error('Erreur lors de l\'upload');
      } finally {
        setUploading(false);
      }
    };

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Ajouter des Images</h2>
            <p className="text-sm text-gray-600">Uploadez vos photos et organisez-les</p>
          </div>
          <button className="bg-[#009EAA] text-white px-4 py-2 rounded-lg hover:bg-[#007E9C] transition-colors">
            <Upload className="h-4 w-4 inline mr-2" />
            Upload Rapide
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-[#009EAA] w-5 h-5" />
            <input
              type="text"
              value={imageTitle}
              onChange={(e) => setImageTitle(e.target.value)}
              placeholder="Titre de l'image"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009EAA] focus:border-transparent transition-all duration-200 text-gray-900"
            />
          </div>
          <div className="relative">
            <Folder className="absolute left-3 top-1/2 -translate-y-1/2 text-[#009EAA] w-5 h-5" />
            <input
              type="text"
              value={imageAlbum}
              onChange={(e) => setImageAlbum(e.target.value)}
              placeholder="Nom de l'album"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009EAA] focus:border-transparent transition-all duration-200 text-gray-900"
            />
          </div>
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-[#009EAA] w-5 h-5 pointer-events-none" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-10 pr-8 py-2 border-2 border-[#009EAA] bg-[#f5f7fa] text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009EAA] focus:border-[#009EAA] transition-all duration-200 appearance-none"
            >
              <option value="">Sélectionner une catégorie</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {/* Flèche personnalisée */}
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#009EAA] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-[#009EAA] w-5 h-5" />
            <input
              type="date"
              value={imageEventDate}
              onChange={(e) => setImageEventDate(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009EAA] focus:border-transparent transition-all duration-200 text-gray-900"
            />
          </div>
        </div>
        <div className="mb-6 relative">
          <Edit className="absolute left-3 top-4 text-[#009EAA] w-5 h-5" />
          <textarea
            value={imageDescription}
            onChange={(e) => setImageDescription(e.target.value)}
            placeholder="Description de l'image"
            rows={3}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009EAA] focus:border-transparent transition-all duration-200 text-gray-900"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Upload className="absolute left-3 top-1/2 -translate-y-1/2 text-[#009EAA] w-5 h-5" />
            <input
              id="fileInput"
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="w-full pl-10 pr-4 py-2 border-2 border-dashed border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009EAA] focus:border-transparent transition-all duration-200 hover:border-[#009EAA] text-gray-900"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleBulkUpload}
              disabled={uploading || !selectedFiles || !selectedCategory}
              className="w-full bg-[#009EAA] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#007E9C] disabled:opacity-50 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Upload en cours...</span>
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5" />
                  <span>Upload Images</span>
                </>
              )}
            </button>
          </div>
        </div>
        {selectedFiles && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700 font-medium">
              {selectedFiles.length} image(s) sélectionnée(s)
            </p>
          </div>
        )}
      </div>
    );
  };

  if (!isLoggedIn) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-72 h-72 bg-[#009EAA] rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
            <div className="absolute top-0 right-0 w-72 h-72 bg-[#007E9C] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-[#00B4CC] rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-blob animation-delay-4000"></div>
          </div>

          {/* Main Content */}
          <div className="relative z-10 flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md w-full"
            >
              {/* Login Card */}
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="mx-auto h-20 w-20 bg-gradient-to-r from-[#009EAA] via-[#007E9C] to-[#00B4CC] rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                    <Upload className="h-10 w-10 text-white" />
                  </div>
                  <h2 className="text-4xl font-bold text-white mb-3 tracking-tight">
                    Administration
                  </h2>
                  <p className="text-gray-300 text-lg">
                    Connectez-vous pour gérer votre portfolio
                  </p>
                </div>

                {/* Login Form */}
                <form className="space-y-6" onSubmit={handleLogin}>
                  <div className="space-y-4">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        required
                        className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009EAA] focus:border-transparent backdrop-blur-sm transition-all duration-300"
                        placeholder="Nom d'utilisateur"
                        value={loginForm.username}
                        onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                      />
                    </div>
                    
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <input
                        type="password"
                        required
                        className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009EAA] focus:border-transparent backdrop-blur-sm transition-all duration-300"
                        placeholder="Mot de passe"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-[#009EAA] via-[#007E9C] to-[#00B4CC] text-white py-4 px-6 rounded-xl font-semibold hover:from-[#007E9C] hover:via-[#009EAA] hover:to-[#007E9C] focus:outline-none focus:ring-2 focus:ring-[#009EAA] focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Connexion en cours...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                        <span>Se connecter</span>
                      </div>
                    )}
                  </button>
                </form>

                {/* Footer */}
                <div className="mt-8 text-center">
                  <p className="text-gray-400 text-sm">
                    Accès sécurisé à votre espace d'administration
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        <ToastContainer />
      </>
    );
  }

  // Composant Dashboard (statistiques + upload)
  const DashboardSection = ({ stats, children }: { stats: { totalImages: number; totalAlbums: number; totalCategories: number; featuredImages: number; recentUploads: number }, children: React.ReactNode }) => (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300"
        >
          <div className="flex items-center">
            <div className="h-12 w-12 bg-gradient-to-r from-[#009EAA] to-[#007E9C] rounded-lg flex items-center justify-center">
              <ImageIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Images</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalImages}</p>
              <p className="text-xs text-green-600">+{stats.recentUploads} cette semaine</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300"
        >
          <div className="flex items-center">
            <div className="h-12 w-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <Folder className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Albums</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalAlbums}</p>
              <p className="text-xs text-blue-600">Organisés</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300"
        >
          <div className="flex items-center">
            <div className="h-12 w-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
              <Tag className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Catégories</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCategories}</p>
              <p className="text-xs text-purple-600">Actives</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300"
        >
          <div className="flex items-center">
            <div className="h-12 w-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En Vedette</p>
              <p className="text-2xl font-bold text-gray-900">{stats.featuredImages}</p>
              <p className="text-xs text-orange-600">Sélectionnées</p>
            </div>
          </div>
        </motion.div>
        </div>

      {/* Graphiques et analyses rapides */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Activité Récente</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Nouvelles images</span>
              <span className="text-sm font-semibold text-green-600">+{stats.recentUploads}</span>
      </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Images en vedette</span>
              <span className="text-sm font-semibold text-blue-600">{stats.featuredImages}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Albums créés</span>
              <span className="text-sm font-semibold text-purple-600">{stats.totalAlbums}</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par Catégorie</h3>
          <div className="space-y-3">
            {categories.slice(0, 5).map((category) => (
              <div key={category.id} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{category.name}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-[#009EAA] h-2 rounded-full" 
                      style={{ width: `${(category.image_count / stats.totalImages) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{category.image_count}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Upload Section (enfant) */}
      {children}
    </div>
  );

  // Composant Galerie avec pagination et cartes modernes
  const GalerieSection = ({ images, handleEditImage, handleDeleteImage, handleViewAlbum }: { images: Image[], handleEditImage: (img: Image) => void, handleDeleteImage: (id: number) => void, handleViewAlbum: (albumName: string) => void }) => {
    const [page, setPage] = useState(1);
    const [filterCategory, setFilterCategory] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const imagesPerPage = 12;

    // Filtrage des images
    const filteredImages = images.filter(img => {
      const matchesCategory = !filterCategory || img.category_name === filterCategory;
      const matchesSearch = !searchTerm || 
        img.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        img.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (img.album_name && img.album_name.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch;
    });

    const totalPages = Math.ceil(filteredImages.length / imagesPerPage);
    const paginatedImages = filteredImages.slice((page - 1) * imagesPerPage, page * imagesPerPage);

    // Réinitialiser la page quand les filtres changent
    useEffect(() => {
      setPage(1);
    }, [filterCategory, searchTerm]);

    return (
      <div>
        {/* Filtres et recherche */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Rechercher par titre, description ou album..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009EAA] focus:border-transparent text-gray-900"
                />
              </div>
            </div>
            <div className="md:w-64">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009EAA] focus:border-transparent text-gray-900"
              >
                <option value="">Toutes les catégories</option>
                {Array.from(new Set(images.map(img => img.category_name))).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <span>{filteredImages.length} image(s) trouvée(s)</span>
            {filterCategory && (
              <button
                onClick={() => setFilterCategory('')}
                className="text-[#009EAA] hover:text-[#007E9C] font-medium"
              >
                Effacer le filtre
              </button>
            )}
          </div>
        </div>

        {/* Grille d'images */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {paginatedImages.map((img: Image, index) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group hover:shadow-lg transition-all duration-300"
            >
              <div className="relative">
                <img 
                  src={`${(import.meta.env.VITE_API_URL || '/api').replace(/\/api$/, '')}${img.thumbnail_url}`} 
                  alt={img.title} 
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" 
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 flex space-x-2">
                    <button
                      onClick={() => handleEditImage(img)}
                      className="bg-[#009EAA] text-white p-2 rounded-lg hover:bg-[#007E9C] transition-colors"
                      title="Éditer"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteImage(img.id)}
                      className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    {img.album_name && (
                      <button
                        onClick={() => handleViewAlbum(img.album_name || '')}
                        className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
                        title="Voir album"
                      >
                        <Folder className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
                {img.is_featured && (
                  <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-semibold">
                    ⭐ Vedette
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 truncate">{img.title || 'Sans titre'}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{img.description || 'Aucune description'}</p>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">{img.category_name}</span>
                  {img.event_date && (
                    <span className="flex items-center text-gray-600">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(img.event_date).toLocaleDateString('fr-FR')}
                    </span>
                  )}
                </div>
                {img.album_name && (
                  <div className="flex items-center text-xs text-gray-500 mb-3">
                    <Folder className="h-3 w-3 mr-1" />
                    <span className="truncate">{img.album_name}</span>
                </div>
                )}
                <div className="text-xs text-gray-400">
                  Ajouté le {new Date(img.created_at).toLocaleDateString('fr-FR')}
              </div>
            </div>
            </motion.div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-8">
    <button
      onClick={() => setPage(page - 1)}
      disabled={page === 1}
              className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition-colors"
      aria-label="Précédent"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
    </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }
              
              return (
      <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg font-semibold transition-all duration-200
                    ${page === pageNum
            ? 'bg-[#009EAA] text-white shadow-lg scale-110'
            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'}`}
                  aria-current={page === pageNum ? 'page' : undefined}
      >
                  {pageNum}
      </button>
              );
            })}
            
    <button
      onClick={() => setPage(page + 1)}
      disabled={page === totalPages}
              className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition-colors"
      aria-label="Suivant"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </div>
)}
      </div>
    );
  };

  // Composant Albums avec pagination et cartes modernes
  const AlbumsSection = ({ albums, images, onAddPhotosToAlbum }: { albums: Album[], images: Image[], onAddPhotosToAlbum: (albumName: string) => void }) => {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const albumsPerPage = 8;

    // Créer un map des images par album pour avoir les détails
    const albumsMap = new Map<string, Image[]>();
    images.forEach(image => {
      const albumName = image.album_name || 'Sans album';
      if (!albumsMap.has(albumName)) albumsMap.set(albumName, []);
      albumsMap.get(albumName)!.push(image);
    });

    // Filtrer les albums
    const filteredAlbums = albums.filter(album => 
      !searchTerm || album.album_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredAlbums.length / albumsPerPage);
    const paginatedAlbums = filteredAlbums.slice((page - 1) * albumsPerPage, page * albumsPerPage);

    // Réinitialiser la page quand la recherche change
    useEffect(() => {
      setPage(1);
    }, [searchTerm]);

    return (
      <div>
        {/* Header avec statistiques */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Gestion des Albums</h2>
              <p className="text-gray-600">Organisez vos photos en albums thématiques</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-[#009EAA]">{albums.length}</div>
                <div className="text-sm text-gray-600">Albums créés</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">{images.filter(img => img.album_name).length}</div>
                <div className="text-sm text-gray-600">Photos organisées</div>
              </div>
            </div>
          </div>
        </div>

        {/* Barre de recherche */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Rechercher un album..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009EAA] focus:border-transparent text-gray-900"
            />
          </div>
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <span>{filteredAlbums.length} album(s) trouvé(s)</span>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-[#009EAA] hover:text-[#007E9C] font-medium"
              >
                Effacer la recherche
              </button>
            )}
          </div>
        </div>

        {/* Grille d'albums */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {paginatedAlbums.map((album, index) => {
            const albumImages = albumsMap.get(album.album_name) || [];
            const coverImage = albumImages[0];
            
            return (
              <motion.div
                key={album.album_name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group hover:shadow-lg transition-all duration-300"
              >
                <div className="relative">
                  {coverImage ? (
                    <img 
                      src={`${(import.meta.env.VITE_API_URL || '/api').replace(/\/api$/, '')}${coverImage.thumbnail_url}`} 
                      alt={album.album_name} 
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <Folder className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <button
                        onClick={() => onAddPhotosToAlbum(album.album_name)}
                        className="bg-[#009EAA] text-white px-4 py-2 rounded-lg hover:bg-[#007E9C] transition-colors font-semibold flex items-center space-x-2"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Ajouter des photos</span>
                      </button>
                    </div>
                  </div>

                  {/* Badge nombre d'images */}
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-gray-900 px-2 py-1 rounded-full text-xs font-semibold">
                    {album.image_count} photo{album.image_count > 1 ? 's' : ''}
                  </div>
                </div>

              <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 truncate">{album.album_name}</h3>
                  
                  {coverImage && (
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                        {coverImage.category_name}
                      </span>
                      {coverImage.event_date && (
                        <span className="flex items-center text-gray-600">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(coverImage.event_date).toLocaleDateString('fr-FR')}
                        </span>
                  )}
                </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>Créé le {new Date(album.created_at).toLocaleDateString('fr-FR')}</span>
                    <div className="flex items-center space-x-1">
                      <Folder className="h-3 w-3" />
                      <span>Album</span>
              </div>
                  </div>

                  {/* Miniatures des images */}
                  {albumImages.length > 0 && (
                    <div className="mt-3 flex space-x-1">
                      {albumImages.slice(0, 4).map((img, idx) => (
                        <div key={idx} className="w-8 h-8 rounded overflow-hidden">
                          <img 
                            src={`${(import.meta.env.VITE_API_URL || '/api').replace(/\/api$/, '')}${img.thumbnail_url}`} 
                            alt="" 
                            className="w-full h-full object-cover"
                          />
            </div>
          ))}
                      {albumImages.length > 4 && (
                        <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-600 font-semibold">
                          +{albumImages.length - 4}
        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-8">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition-colors"
              aria-label="Précédent"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }
              
              return (
              <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg font-semibold transition-all duration-200
                    ${page === pageNum
                    ? 'bg-[#009EAA] text-white shadow-lg scale-110'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'}`}
                  aria-current={page === pageNum ? 'page' : undefined}
              >
                  {pageNum}
              </button>
              );
            })}
            
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition-colors"
              aria-label="Suivant"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    );
  };

  // Composant Catégories avec cartes modernes
  const CategoriesSection = ({ categories, images }: { categories: Category[], images: Image[] }) => {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [categoryImages, setCategoryImages] = useState<Image[]>([]);

    const handleCategoryClick = (categorySlug: string) => {
      const filteredImages = images.filter(img => img.category_slug === categorySlug);
      setCategoryImages(filteredImages);
      setSelectedCategory(categorySlug);
    };

    const getCategoryColor = (index: number) => {
      const colors = [
        'from-blue-500 to-blue-600',
        'from-green-500 to-green-600',
        'from-purple-500 to-purple-600',
        'from-orange-500 to-orange-600',
        'from-pink-500 to-pink-600',
        'from-indigo-500 to-indigo-600',
        'from-teal-500 to-teal-600'
      ];
      return colors[index % colors.length];
    };

    return (
      <div>
        {/* Header avec statistiques */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Gestion des Catégories</h2>
              <p className="text-gray-600">Organisez vos photos par thèmes et styles</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-[#009EAA]">{categories.length}</div>
                <div className="text-sm text-gray-600">Catégories actives</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">{images.length}</div>
                <div className="text-sm text-gray-600">Photos classées</div>
              </div>
            </div>
          </div>
        </div>

        {/* Grille des catégories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {categories.map((cat, index) => {
            const categoryImages = images.filter(img => img.category_slug === cat.slug);
            const recentImages = categoryImages.slice(0, 3);
            
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => handleCategoryClick(cat.slug)}
              >
                {/* Header de la catégorie */}
                <div className={`bg-gradient-to-r ${getCategoryColor(index)} p-6 text-white`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center">
                        <Tag className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{cat.name}</h3>
                        <p className="text-white/80 text-sm">{cat.image_count} photos</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{cat.image_count}</div>
                      <div className="text-xs text-white/80">images</div>
                    </div>
                  </div>
                </div>

                {/* Contenu de la catégorie */}
                <div className="p-6">
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{cat.description}</p>
                  
                  {/* Miniatures des images récentes */}
                  {recentImages.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {recentImages.map((img, idx) => (
                        <div key={idx} className="aspect-square rounded-lg overflow-hidden">
                          <img 
                            src={`${(import.meta.env.VITE_API_URL || '/api').replace(/\/api$/, '')}${img.thumbnail_url}`} 
                            alt="" 
                            className="w-full h-full object-cover"
                          />
        </div>
      ))}
                      {categoryImages.length > 3 && (
                        <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-600 font-semibold">
                          +{categoryImages.length - 3}
    </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-20 bg-gray-50 rounded-lg flex items-center justify-center mb-4">
                      <p className="text-gray-400 text-sm">Aucune image</p>
                    </div>
                  )}

                  {/* Statistiques de la catégorie */}
                  <div className="space-y-2 text-xs text-gray-500">
                    <div className="flex justify-between">
                      <span>Images en vedette</span>
                      <span className="font-semibold text-yellow-600">
                        {categoryImages.filter(img => img.is_featured).length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Albums créés</span>
                      <span className="font-semibold text-blue-600">
                        {new Set(categoryImages.map(img => img.album_name).filter(Boolean)).size}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Dernière activité</span>
                      <span className="font-semibold text-green-600">
                        {categoryImages.length > 0 
                          ? new Date(Math.max(...categoryImages.map(img => new Date(img.created_at).getTime()))).toLocaleDateString('fr-FR')
                          : 'Aucune'
                        }
                      </span>
                    </div>
                  </div>

                  {/* Bouton d'action */}
                  <button className="w-full mt-4 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm">
                    Voir toutes les images
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Modal pour afficher les images d'une catégorie */}
        <AnimatePresence>
          {selectedCategory && categoryImages.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedCategory(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {categories.find(cat => cat.slug === selectedCategory)?.name}
                    </h3>
                    <p className="text-gray-600">{categoryImages.length} image(s)</p>
                  </div>
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {categoryImages.map((image, index) => (
                    <motion.div
                      key={image.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-50 rounded-xl overflow-hidden group"
                    >
                      <div className="relative">
                        <img
                          src={`${(import.meta.env.VITE_API_URL || '/api').replace(/\/api$/, '')}${image.thumbnail_url}`}
                          alt={image.title}
                          className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 flex space-x-2">
                            <button
                              onClick={() => {
                                setEditingImage(image);
                                setShowEditModal(true);
                                setSelectedCategory(null);
                              }}
                              className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteImage(image.id)}
                              className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="p-3">
                        <h4 className="font-semibold text-gray-900 text-sm mb-1 truncate">
                          {image.title || 'Sans titre'}
                        </h4>
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {image.description || 'Aucune description'}
                        </p>
                        {image.event_date && (
                          <div className="mt-2 flex items-center text-xs text-gray-500">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(image.event_date).toLocaleDateString('fr-FR')}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 overflow-x-hidden">
        {/* Sidebar desktop : toujours visible à partir de md */}
        <div className="hidden md:block fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl">
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center justify-center h-16 px-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-gradient-to-r from-[#009EAA] to-[#007E9C] rounded-lg flex items-center justify-center">
                  <Upload className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Babs Admin</span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
              <div className="space-y-1">
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Gestion
                </div>
                <button onClick={() => setActiveSection('dashboard')} className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeSection === 'dashboard' ? 'text-[#009EAA] bg-[#009EAA]/10' : 'text-gray-600 hover:text-[#009EAA] hover:bg-gray-50'}`}>
                  <Upload className="h-4 w-4 mr-3" />
                  Dashboard
                </button>
                <button onClick={() => setActiveSection('galerie')} className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeSection === 'galerie' ? 'text-[#009EAA] bg-[#009EAA]/10' : 'text-gray-600 hover:text-[#009EAA] hover:bg-gray-50'}`}>
                  <Eye className="h-4 w-4 mr-3" />
                  Galerie
                </button>
                <button onClick={() => setActiveSection('albums')} className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeSection === 'albums' ? 'text-[#009EAA] bg-[#009EAA]/10' : 'text-gray-600 hover:text-[#009EAA] hover:bg-gray-50'}`}>
                  <Folder className="h-4 w-4 mr-3" />
                  Albums
                </button>
                <button onClick={() => setActiveSection('categories')} className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeSection === 'categories' ? 'text-[#009EAA] bg-[#009EAA]/10' : 'text-gray-600 hover:text-[#009EAA] hover:bg-gray-50'}`}>
                  <Tag className="h-4 w-4 mr-3" />
                  Catégories
                </button>
              </div>

              <div className="space-y-1 pt-4">
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Système
                </div>
                <button className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-[#009EAA] hover:bg-gray-50 rounded-lg transition-colors">
                  <Calendar className="h-4 w-4 mr-3" />
                  Calendrier
                </button>
                <button className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-[#009EAA] hover:bg-gray-50 rounded-lg transition-colors">
                  <svg className="h-4 w-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Paramètres
                </button>
              </div>
            </nav>

            {/* User Profile */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-gradient-to-r from-[#009EAA] to-[#007E9C] rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-white">A</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">Administrateur</p>
                  <p className="text-xs text-gray-500 truncate">admin@babsdigitaliste.com</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar mobile/tablette : slide-in, hamburger visible uniquement en dessous de md */}
          {showSidebar && (
            <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={() => setShowSidebar(false)} />
          )}
          <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 md:hidden ${showSidebar ? 'translate-x-0' : '-translate-x-full'}`}>
            {/* Bouton fermer mobile */}
            <button
              className="absolute top-4 right-4 bg-gray-100 rounded-full p-2"
              onClick={() => setShowSidebar(false)}
              aria-label="Fermer le menu"
            >
              <X className="w-6 h-6 text-gray-700" />
            </button>
            {/* Logo */}
            <div className="flex items-center justify-center h-16 px-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-gradient-to-r from-[#009EAA] to-[#007E9C] rounded-lg flex items-center justify-center">
                  <Upload className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Babs Admin</span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
              <div className="space-y-1">
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Gestion
                </div>
                <button onClick={() => setActiveSection('dashboard')} className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeSection === 'dashboard' ? 'text-[#009EAA] bg-[#009EAA]/10' : 'text-gray-600 hover:text-[#009EAA] hover:bg-gray-50'}`}>
                  <Upload className="h-4 w-4 mr-3" />
                  Dashboard
                </button>
                <button onClick={() => setActiveSection('galerie')} className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeSection === 'galerie' ? 'text-[#009EAA] bg-[#009EAA]/10' : 'text-gray-600 hover:text-[#009EAA] hover:bg-gray-50'}`}>
                  <Eye className="h-4 w-4 mr-3" />
                  Galerie
                </button>
                <button onClick={() => setActiveSection('albums')} className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeSection === 'albums' ? 'text-[#009EAA] bg-[#009EAA]/10' : 'text-gray-600 hover:text-[#009EAA] hover:bg-gray-50'}`}>
                  <Folder className="h-4 w-4 mr-3" />
                  Albums
                </button>
                <button onClick={() => setActiveSection('categories')} className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeSection === 'categories' ? 'text-[#009EAA] bg-[#009EAA]/10' : 'text-gray-600 hover:text-[#009EAA] hover:bg-gray-50'}`}>
                  <Tag className="h-4 w-4 mr-3" />
                  Catégories
                </button>
              </div>

              <div className="space-y-1 pt-4">
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Système
                </div>
                <button className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-[#009EAA] hover:bg-gray-50 rounded-lg transition-colors">
                  <Calendar className="h-4 w-4 mr-3" />
                  Calendrier
                </button>
                <button className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-[#009EAA] hover:bg-gray-50 rounded-lg transition-colors">
                  <svg className="h-4 w-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Paramètres
                </button>
              </div>
            </nav>

            {/* User Profile */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-gradient-to-r from-[#009EAA] to-[#007E9C] rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-white">A</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">Administrateur</p>
                  <p className="text-xs text-gray-500 truncate">admin@babsdigitaliste.com</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Bouton hamburger mobile/tablette */}
          <button
            className="fixed top-4 left-4 z-50 md:hidden bg-white/80 rounded-full p-2 shadow-lg"
            onClick={() => setShowSidebar(true)}
            aria-label="Ouvrir le menu"
          >
            <svg className="w-7 h-7 text-[#009EAA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Main Content */}
        <div className="md:ml-64 pt-16 md:pt-0 px-2 sm:px-4">
          {/* Top Header */}
          <div className="bg-white shadow-sm border-b border-gray-200">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                  <p className="text-sm text-gray-600">Bienvenue dans votre espace d'administration</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <svg className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Rechercher..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009EAA] focus:border-transparent text-black"
                    />
                  </div>
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h6v-2H4v2zM4 15h6v-2H4v2zM4 11h6V9H4v2zM4 7h6V5H4v2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="p-6">
            {activeSection === 'dashboard' && (
              <DashboardSection stats={stats}>
                <ImageUploadForm
                  categories={categories}
                  token={token}
                  fetchImages={fetchImages}
                />
              </DashboardSection>
            )}
            {activeSection === 'galerie' && (
              <GalerieSection images={images} handleEditImage={handleEditImage} handleDeleteImage={handleDeleteImage} handleViewAlbum={handleViewAlbum} />
            )}
            {activeSection === 'albums' && (
              <AlbumsSection albums={albums} images={images} onAddPhotosToAlbum={handleOpenAddToAlbum} />
            )}
            {activeSection === 'categories' && (
              <CategoriesSection categories={categories} images={images} />
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && editingImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl max-w-full sm:max-w-lg w-full max-h-[95vh] overflow-y-auto border border-[#009EAA] px-2 sm:px-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header avec image de fond floutée et overlay */}
              <div className="relative h-40 rounded-t-3xl overflow-hidden flex items-center justify-center">
                <img
                  src={`${(import.meta.env.VITE_API_URL || '/api').replace(/\/api$/, '')}${editingImage.image_url}`}
                  alt={editingImage.title}
                  className="absolute inset-0 w-full h-full object-cover blur-md scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#009EAA]/80 via-[#007E9C]/70 to-[#00B4CC]/80" />
                {/* Avatar rond */}
                <div className="relative z-10 flex flex-col items-center justify-center w-full">
                  <div className="-mb-12">
                    <img
                      src={`${(import.meta.env.VITE_API_URL || '/api').replace(/\/api$/, '')}${editingImage.thumbnail_url}`}
                      alt={editingImage.title}
                      className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover bg-white"
                    />
                  </div>
                </div>
                {/* Bouton fermer */}
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setNewImageFile(null);
                  }}
                  className="absolute top-4 right-4 text-white bg-black/30 hover:bg-black/50 rounded-full p-2 transition"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Formulaire */}
              <form className="px-8 pt-16 pb-8 space-y-6">
                {/* Input fichier */}
                <div className="flex flex-col items-center">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Changer l'image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNewImageFile(e.target.files?.[0] || null)}
                    className="w-full max-w-xs px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009EAA] text-gray-900 bg-white/60 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {newImageFile && (
                    <p className="text-sm text-green-600 mt-2">Nouvelle image sélectionnée : {newImageFile.name}</p>
                  )}
                </div>

                {/* Inputs designés */}
                <div className="space-y-5">
                  {/* Titre */}
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-[#009EAA] w-5 h-5" />
                    <input
                      type="text"
                      value={editingImage.title}
                      onChange={(e) => setEditingImage({ ...editingImage, title: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-white/60 focus:outline-none focus:ring-2 focus:ring-[#009EAA] text-gray-900"
                      placeholder="Titre"
                    />
                  </div>
                  {/* Description */}
                  <div className="relative">
                    <Edit className="absolute left-3 top-4 text-[#009EAA] w-5 h-5" />
                    <textarea
                      value={editingImage.description}
                      onChange={(e) => setEditingImage({ ...editingImage, description: e.target.value })}
                      rows={3}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-white/60 focus:outline-none focus:ring-2 focus:ring-[#009EAA] text-gray-900"
                      placeholder="Description"
                    />
                  </div>
                  {/* Album */}
                  <div className="relative">
                    <Folder className="absolute left-3 top-1/2 -translate-y-1/2 text-[#009EAA] w-5 h-5" />
                    <input
                      type="text"
                      value={editingImage.album_name || ''}
                      onChange={(e) => setEditingImage({ ...editingImage, album_name: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-white/60 focus:outline-none focus:ring-2 focus:ring-[#009EAA] text-gray-900"
                      placeholder="Album"
                    />
                  </div>
                  {/* Date événement */}
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-[#009EAA] w-5 h-5" />
                    <input
                      type="date"
                      value={editingImage.event_date || ''}
                      onChange={(e) => setEditingImage({ ...editingImage, event_date: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-white/60 focus:outline-none focus:ring-2 focus:ring-[#009EAA] text-gray-900"
                    />
                  </div>
                </div>

                {/* Boutons */}
                <div className="flex justify-end space-x-4 mt-8">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setNewImageFile(null);
                    }}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl bg-white/70 hover:bg-gray-100 transition-colors font-semibold shadow"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    onClick={handleUpdateImage}
                    className="px-6 py-3 bg-gradient-to-r from-[#009EAA] via-[#007E9C] to-[#00B4CC] text-white rounded-xl hover:from-[#007E9C] hover:to-[#009EAA] transition-all duration-200 flex items-center space-x-2 font-semibold shadow-lg"
                  >
                    <Save className="h-4 w-4" />
                    <span>Sauvegarder</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Album Modal */}
      <AnimatePresence>
        {showAlbumModal && selectedAlbum && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAlbumModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedAlbum}</h3>
                  <p className="text-gray-600">{albumImages.length} image{albumImages.length > 1 ? 's' : ''}</p>
                </div>
                <button
                  onClick={() => setShowAlbumModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {albumImages.map((image, index) => (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-50 rounded-xl overflow-hidden group"
                  >
                    <div className="relative">
                      <img
                        src={`${(import.meta.env.VITE_API_URL || '/api').replace(/\/api$/, '')}${image.thumbnail_url}`}
                        alt={image.title}
                        className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 flex space-x-2">
                          <button
                            onClick={() => {
                              setEditingImage(image);
                              setShowEditModal(true);
                              setShowAlbumModal(false);
                            }}
                            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteImage(image.id)}
                            className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="p-3">
                      <h4 className="font-semibold text-gray-900 text-sm mb-1 truncate">
                        {image.title || 'Sans titre'}
                      </h4>
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {image.description || 'Aucune description'}
                      </p>
                      {image.event_date && (
                        <div className="mt-2 flex items-center text-xs text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(image.event_date).toLocaleDateString('fr-FR')}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modale d'ajout de photos à un album */}
      <AnimatePresence>
        {showAddToAlbumModal && addToAlbumName && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddToAlbumModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl max-w-full sm:max-w-lg w-full max-h-[95vh] overflow-y-auto border border-[#009EAA] px-2 sm:px-8"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between py-6">
                <h2 className="text-xl font-bold text-gray-900">Ajouter des photos à l'album <span className="text-[#009EAA]">{addToAlbumName}</span></h2>
                <button onClick={() => setShowAddToAlbumModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <form className="space-y-6" onSubmit={e => { e.preventDefault(); handleAddToAlbumUpload(); }}>
                <div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={e => setAddToAlbumFiles(e.target.files)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009EAA] text-gray-900 bg-white/60 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {addToAlbumFiles && (
                    <p className="text-sm text-blue-700 mt-2">{addToAlbumFiles.length} image(s) sélectionnée(s)</p>
                  )}
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowAddToAlbumModal(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl bg-white/70 hover:bg-gray-100 transition-colors font-semibold shadow"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={addToAlbumUploading || !addToAlbumFiles}
                    className="px-6 py-3 bg-gradient-to-r from-[#009EAA] via-[#007E9C] to-[#00B4CC] text-white rounded-xl hover:from-[#007E9C] hover:to-[#009EAA] transition-all duration-200 flex items-center space-x-2 font-semibold shadow-lg disabled:opacity-50"
                  >
                    {addToAlbumUploading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Ajout en cours...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="h-5 w-5" />
                        <span>Ajouter</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ToastContainer />
    </>
  );
};

export default Admin; 