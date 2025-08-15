const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { uploadSingle, uploadMultiple, handleUploadError, deleteFile, createThumbnail } = require('../middleware/upload');
const path = require('path');
const fs = require('fs');

// Middleware de cache pour les routes publiques
const cacheMiddleware = (duration = 300) => { // 5 minutes par défaut
  return (req, res, next) => {
    res.set({
      'Cache-Control': `public, max-age=${duration}`,
      'ETag': `"${Date.now()}"`,
      'Last-Modified': new Date().toUTCString()
    });
    next();
  };
};

// Middleware de diagnostic pour les erreurs
const diagnosticMiddleware = (req, res, next) => {
  console.log(`🔍 Requête API: ${req.method} ${req.path}`);
  console.log(`📋 Headers:`, {
    origin: req.headers.origin,
    'user-agent': req.headers['user-agent'],
    'content-type': req.headers['content-type']
  });
  
  // Intercepter les erreurs 403
  const originalSend = res.send;
  res.send = function(data) {
    if (res.statusCode === 403) {
      console.error(`❌ Erreur 403 détectée sur ${req.method} ${req.path}`);
      console.error(`📋 Données de réponse:`, data);
    }
    return originalSend.call(this, data);
  };
  
  next();
};

// Appliquer le middleware de diagnostic à toutes les routes
router.use(diagnosticMiddleware);

// Route de test simple pour diagnostiquer les erreurs 403
router.get('/test', (req, res) => {
  console.log('🧪 Test route appelée');
  res.json({
    success: true,
    message: 'Test route fonctionnelle',
    timestamp: new Date().toISOString(),
    headers: req.headers
  });
});

// Route publique - Récupérer toutes les images par catégorie
router.get('/category/:slug', cacheMiddleware(300), async (req, res) => {
  try {
    const { slug } = req.params;
    
    // Vérifier d'abord si la table categories existe
    const tableExists = await pool.query(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'categories'
    `);

    if (tableExists.rows[0].count === '0') {
      // Si la table n'existe pas, retourner un tableau vide
      return res.json({
        success: true,
        data: []
      });
    }
    
    const result = await pool.query(`
      SELECT 
        i.id,
        i.title,
        i.description,
        i.image_url,
        i.thumbnail_url,
        i.album_name,
        i.event_date,
        i.is_featured,
        i.sort_order,
        c.name as category_name,
        c.slug as category_slug
      FROM images i
      JOIN categories c ON i.category_id = c.id
      WHERE c.slug = $1
      ORDER BY i.sort_order ASC, i.created_at DESC
    `, [slug]);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des images:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// Route publique - Récupérer toutes les catégories
router.get('/categories', cacheMiddleware(600), async (req, res) => {
  try {
    // Vérifier d'abord si la table categories existe
    const tableExists = await pool.query(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'categories'
    `);

    if (tableExists.rows[0].count === '0') {
      // Si la table n'existe pas, retourner un tableau vide
      return res.json({
        success: true,
        data: []
      });
    }

    const result = await pool.query(`
      SELECT 
        c.id,
        c.name,
        c.slug,
        c.description,
        COUNT(i.id) as image_count
      FROM categories c
      LEFT JOIN images i ON i.category_id = c.id
      GROUP BY c.id, c.name, c.slug, c.description
      ORDER BY c.name ASC
    `);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// Route publique - Récupérer les images en vedette
router.get('/featured', cacheMiddleware(300), async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        i.id,
        i.title,
        i.description,
        i.image_url,
        i.thumbnail_url,
        i.album_name,
        i.event_date,
        c.name as category_name,
        c.slug as category_slug
      FROM images i
      JOIN categories c ON i.category_id = c.id
      WHERE i.is_featured = true
      ORDER BY i.sort_order ASC, i.created_at DESC
      LIMIT 12
    `);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des images en vedette:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// Route publique - Récupérer les images par nom d'album
router.get('/album/:albumName', cacheMiddleware(300), async (req, res) => {
  try {
    const { albumName } = req.params;
    
    const result = await pool.query(`
      SELECT 
        i.id,
        i.title,
        i.description,
        i.image_url,
        i.thumbnail_url,
        i.album_name,
        i.event_date,
        i.is_featured,
        i.sort_order,
        c.name as category_name,
        c.slug as category_slug
      FROM images i
      JOIN categories c ON i.category_id = c.id
      WHERE i.album_name = $1
      ORDER BY i.sort_order ASC, i.created_at ASC
    `, [albumName]);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des images par album:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// Route publique - Récupérer tous les noms d'albums
router.get('/albums', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        album_name,
        COUNT(*) as image_count,
        MIN(created_at) as created_at
      FROM images 
      WHERE album_name IS NOT NULL AND album_name != ''
      GROUP BY album_name
      ORDER BY created_at DESC
    `);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des albums:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// Route publique - Récupérer les albums par catégorie
router.get('/albums/category/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    const result = await pool.query(`
      SELECT 
        i.album_name,
        COUNT(*) as image_count,
        MIN(i.created_at) as created_at,
        c.name as category_name,
        c.slug as category_slug
      FROM images i
      JOIN categories c ON i.category_id = c.id
      WHERE c.slug = $1 AND i.album_name IS NOT NULL AND i.album_name != ''
      GROUP BY i.album_name
      ORDER BY created_at DESC
    `, [slug]);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des albums par catégorie:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// Routes protégées (administration)

// Upload d'une seule image
router.post('/', authenticateToken, uploadSingle, handleUploadError, async (req, res) => {
  try {
    const { title, description, category_id, album_name, event_date, is_featured = 0, sort_order = 0 } = req.body;
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Aucune image fournie'
      });
    }

    if (!category_id) {
      return res.status(400).json({
        success: false,
        message: 'La catégorie est requise'
      });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    let thumbnailUrl = null;

    // Créer une miniature si c'est une image
    if (req.file.mimetype.startsWith('image/')) {
      try {
        const thumbnailFilename = await createThumbnail(req.file.path);
        thumbnailUrl = `/uploads/thumbnails/${thumbnailFilename}`;
      } catch (error) {
        console.warn('Impossible de créer la miniature:', error);
      }
    }

    const result = await pool.query(`
      INSERT INTO images (title, description, image_url, thumbnail_url, category_id, album_name, event_date, is_featured, sort_order)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id
    `, [title, description, imageUrl, thumbnailUrl, category_id, album_name, event_date, is_featured, sort_order]);

    res.status(201).json({
      success: true,
      message: 'Image uploadée avec succès',
      imageId: result.rows[0].id,
      imageUrl,
      thumbnailUrl
    });
  } catch (error) {
    console.error('Erreur lors de l\'upload:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// Route de test pour diagnostiquer le problème bulk upload
router.post('/bulk-test', async (req, res) => {
  try {
    console.log('🔍 Test de diagnostic pour bulk upload...');
    console.log('📋 Headers:', req.headers);
    console.log('📦 Body:', req.body);
    console.log('📄 Content-Type:', req.headers['content-type']);
    console.log('📊 Content-Length:', req.headers['content-length']);
    
    // Vérifier si c'est du JSON ou du multipart
    const contentType = req.headers['content-type'] || '';
    const isJson = contentType.includes('application/json');
    const isMultipart = contentType.includes('multipart/form-data');
    
    console.log('🔍 Analyse du Content-Type:');
    console.log('  - JSON:', isJson);
    console.log('  - Multipart:', isMultipart);
    
    // Vérifier la connexion à la base de données
    const dbTest = await pool.query('SELECT NOW()');
    console.log('✅ Connexion DB OK:', dbTest.rows[0]);
    
    res.json({
      success: true,
      message: 'Test de diagnostic réussi',
      database: {
        connected: true,
        timestamp: dbTest.rows[0].now
      },
      request: {
        headers: req.headers,
        body: req.body,
        method: req.method,
        url: req.url,
        contentType: {
          raw: contentType,
          isJson: isJson,
          isMultipart: isMultipart
        }
      },
      recommendations: {
        forFileUpload: 'Utilisez multipart/form-data avec le champ "images"',
        forJsonData: 'Utilisez application/json pour les données JSON uniquement',
        forMixedData: 'Séparez les fichiers (multipart) des données JSON'
      }
    });
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du test',
      error: error.message
    });
  }
});

// Route de test avec authentification
router.post('/bulk-auth-test', authenticateToken, async (req, res) => {
  try {
    console.log('🔍 Test d\'authentification pour bulk upload...');
    console.log('👤 Utilisateur:', req.user);
    
    res.json({
      success: true,
      message: 'Authentification réussie',
      user: req.user
    });
  } catch (error) {
    console.error('❌ Erreur lors du test d\'authentification:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du test',
      error: error.message
    });
  }
});

// Route de test pour vérifier le parsing JSON
router.post('/bulk-json-test', async (req, res) => {
  try {
    console.log('🔍 Test de parsing JSON...');
    console.log('📋 Content-Type:', req.headers['content-type']);
    console.log('📦 Body reçu:', req.body);
    console.log('📊 Type du body:', typeof req.body);
    
    // Tester si on peut accéder aux propriétés
    const testData = {
      category_id: req.body.category_id,
      album_name: req.body.album_name,
      title: req.body.title,
      description: req.body.description
    };
    
    res.json({
      success: true,
      message: 'Test de parsing JSON réussi',
      receivedData: testData,
      bodyType: typeof req.body,
      bodyKeys: req.body ? Object.keys(req.body) : 'null/undefined'
    });
  } catch (error) {
    console.error('❌ Erreur lors du test JSON:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du test JSON',
      error: error.message
    });
  }
});

// Upload multiple d'images
router.post('/bulk', authenticateToken, uploadMultiple, handleUploadError, async (req, res) => {
  try {
    console.log('🔍 Début de l\'upload bulk...');
    console.log('📋 Files:', req.files ? req.files.length : 'undefined');
    console.log('📦 Body:', req.body);
    
    // S'assurer que req.body existe
    const body = req.body || {};
    const { category_id, album_name, title, description, event_date, is_featured = 0 } = body;
    
    if (!req.files || req.files.length === 0) {
      console.log('❌ Aucune image fournie');
      return res.status(400).json({
        success: false,
        message: 'Aucune image fournie'
      });
    }

    if (!category_id) {
      console.log('❌ Catégorie manquante');
      return res.status(400).json({
        success: false,
        message: 'La catégorie est requise'
      });
    }

    console.log('✅ Validation OK, début du traitement...');
    const uploadedImages = [];

    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      console.log(`📁 Traitement du fichier ${i + 1}/${req.files.length}:`, file.originalname);
      
      const imageUrl = `/uploads/${file.filename}`;
      let thumbnailUrl = null;

      // Créer une miniature si c'est une image
      if (file.mimetype.startsWith('image/')) {
        try {
          const thumbnailFilename = await createThumbnail(file.path);
          thumbnailUrl = `/uploads/thumbnails/${thumbnailFilename}`;
          console.log('✅ Miniature créée:', thumbnailFilename);
        } catch (error) {
          console.warn('⚠️ Impossible de créer la miniature:', error);
        }
      }

      // Utiliser le titre saisi par l'utilisateur, sinon utiliser le nom du fichier
      const imageTitle = title || file.originalname;
      const imageDescription = description || '';
      
      // Gérer les dates vides ou nulles
      const eventDate = event_date && event_date.trim() !== '' ? event_date : null;

      console.log('💾 Insertion en base de données...');
      const result = await pool.query(`
        INSERT INTO images (title, description, image_url, thumbnail_url, category_id, album_name, event_date, is_featured, sort_order)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id
      `, [imageTitle, imageDescription, imageUrl, thumbnailUrl, category_id, album_name, eventDate, is_featured, i]);

      uploadedImages.push({
        id: result.rows[0].id,
        title: imageTitle,
        imageUrl,
        thumbnailUrl
      });
      console.log('✅ Image insérée avec ID:', result.rows[0].id);
    }

    console.log('🎉 Upload terminé avec succès');
    res.status(201).json({
      success: true,
      message: `${uploadedImages.length} image(s) uploadée(s) avec succès`,
      images: uploadedImages
    });
  } catch (error) {
    console.error('❌ Erreur lors de l\'upload multiple:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
});

// Récupérer toutes les images (admin)
router.get('/admin', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        i.id,
        i.title,
        i.description,
        i.image_url,
        i.thumbnail_url,
        i.album_name,
        i.event_date,
        i.is_featured,
        i.sort_order,
        i.created_at,
        COALESCE(c.name, 'Non catégorisée') as category_name,
        COALESCE(c.slug, 'uncategorized') as category_slug
      FROM images i
      LEFT JOIN categories c ON i.category_id = c.id
      ORDER BY i.created_at DESC
    `);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des images:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// Modifier une image
router.put('/:id', authenticateToken, uploadSingle, handleUploadError, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category_id, album_name, event_date, is_featured, sort_order } = req.body;

    // Récupérer l'image actuelle
    const currentImageResult = await pool.query('SELECT image_url, thumbnail_url FROM images WHERE id = $1', [id]);
    
    if (currentImageResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Image non trouvée'
      });
    }

    const currentImage = currentImageResult.rows[0];
    let imageUrl = currentImage.image_url;
    let thumbnailUrl = currentImage.thumbnail_url;

    // Si une nouvelle image est fournie
    if (req.file) {
      // Supprimer les anciens fichiers
      if (currentImage.image_url) {
        try {
          await deleteFile(path.join(__dirname, '..', currentImage.image_url));
        } catch (error) {
          console.warn('Impossible de supprimer l\'ancien fichier image:', error);
        }
      }

      if (currentImage.thumbnail_url) {
        try {
          await deleteFile(path.join(__dirname, '..', currentImage.thumbnail_url));
        } catch (error) {
          console.warn('Impossible de supprimer l\'ancien fichier thumbnail:', error);
        }
      }

      // Créer les nouveaux fichiers
      imageUrl = `/uploads/${req.file.filename}`;
      
      if (req.file.mimetype.startsWith('image/')) {
        try {
          const thumbnailFilename = await createThumbnail(req.file.path);
          thumbnailUrl = `/uploads/thumbnails/${thumbnailFilename}`;
        } catch (error) {
          console.warn('Impossible de créer la miniature:', error);
        }
      }
    }

    const result = await pool.query(`
      UPDATE images 
      SET title = $1, description = $2, category_id = $3, album_name = $4, event_date = $5, is_featured = $6, sort_order = $7, image_url = $8, thumbnail_url = $9
      WHERE id = $10
    `, [title, description, category_id, album_name, event_date, is_featured, sort_order, imageUrl, thumbnailUrl, id]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Image non trouvée'
      });
    }

    res.json({
      success: true,
      message: 'Image modifiée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la modification:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// Supprimer une image
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Récupérer les informations de l'image avant suppression
    const imageResult = await pool.query('SELECT image_url, thumbnail_url FROM images WHERE id = $1', [id]);
    
    if (imageResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Image non trouvée'
      });
    }

    const image = imageResult.rows[0];

    // Supprimer l'image de la base de données
    const result = await pool.query('DELETE FROM images WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Image non trouvée'
      });
    }

    // Supprimer les fichiers physiques
    if (image.image_url) {
      try {
        await deleteFile(path.join(__dirname, '..', image.image_url));
      } catch (error) {
        console.warn('Impossible de supprimer le fichier image:', error);
      }
    }

    if (image.thumbnail_url) {
      try {
        await deleteFile(path.join(__dirname, '..', image.thumbnail_url));
      } catch (error) {
        console.warn('Impossible de supprimer le fichier thumbnail:', error);
      }
    }

    res.json({
      success: true,
      message: 'Image supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

module.exports = router; 