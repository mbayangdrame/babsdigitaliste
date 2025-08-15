const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Utiliser le chemin persistant configuré ou le chemin par défaut
const uploadDir = process.env.UPLOAD_PATH || path.join(__dirname, '..', 'uploads');
const thumbnailDir = path.join(uploadDir, 'thumbnails');

// Créer le dossier uploads s'il n'existe pas
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log(`📁 Dossier uploads créé: ${uploadDir}`);
}

if (!fs.existsSync(thumbnailDir)) {
  fs.mkdirSync(thumbnailDir, { recursive: true });
  console.log(`📁 Dossier thumbnails créé: ${thumbnailDir}`);
}

console.log(`📂 Chemin d'upload configuré: ${uploadDir}`);
console.log(`📂 Chemin des thumbnails: ${thumbnailDir}`);

// Configuration du stockage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Générer un nom unique pour le fichier
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Filtre pour les types de fichiers autorisés
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Seuls les fichiers image (jpeg, jpg, png, gif, webp) sont autorisés'));
  }
};

// Configuration de multer optimisée pour les uploads
const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 25 * 1024 * 1024, // Réduit à 25MB par défaut
    files: 10, // Réduit à 10 images maximum
    fieldSize: 1024 * 1024, // 1MB pour les champs texte
    fieldNameSize: 100, // Taille du nom de champ
    headerPairs: 2000 // Nombre de paires header
  },
  fileFilter: fileFilter,
  preservePath: false
});

// Middleware pour uploader une seule image
const uploadSingle = upload.single('image');

// Middleware pour uploader plusieurs images
const uploadMultiple = (req, res, next) => {
  console.log('🔍 Début du middleware uploadMultiple');
  console.log('📋 Headers:', req.headers);
  console.log('📦 Content-Type:', req.headers['content-type']);
  console.log('📊 Content-Length:', req.headers['content-length']);
  
  upload.array('images', 10)(req, res, (err) => {
    if (err) {
      console.error('❌ Erreur multer:', err);
      return next(err);
    }
    
    console.log('✅ Multer terminé');
    console.log('📁 Files reçus:', req.files ? req.files.length : 'undefined');
    if (req.files) {
      req.files.forEach((file, index) => {
        console.log(`📄 Fichier ${index + 1}:`, file.originalname, file.size, 'bytes');
      });
    }
    console.log('📦 Body après multer:', req.body);
    
    next();
  });
};

// Middleware pour gérer les erreurs d'upload
const handleUploadError = (error, req, res, next) => {
  console.error('Erreur upload:', error);
  
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'Le fichier est trop volumineux. Taille maximale: 25MB'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Trop de fichiers. Maximum: 10 fichiers'
      });
    }
    if (error.code === 'LIMIT_FIELD_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'Champ trop volumineux. Taille maximale: 1MB'
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Fichier inattendu dans la requête'
      });
    }
  }
  
  if (error.message.includes('Seuls les fichiers image')) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  // Erreur générique
  return res.status(500).json({
    success: false,
    message: 'Erreur lors de l\'upload du fichier'
  });
};

// Fonction pour supprimer un fichier
const deleteFile = async (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Erreur lors de la suppression du fichier:', error);
    return false;
  }
};

// Fonction pour créer un thumbnail (simplifiée)
const createThumbnail = async (originalPath) => {
  try {
    const filename = path.basename(originalPath);
    const thumbnailPath = path.join(thumbnailDir, filename);
    
    // Pour l'instant, on copie simplement le fichier original
    // En production, vous devriez utiliser sharp ou jimp pour créer de vrais thumbnails
    fs.copyFileSync(originalPath, thumbnailPath);
    return filename;
  } catch (error) {
    console.error('Erreur lors de la création du thumbnail:', error);
    throw error;
  }
};

module.exports = {
  uploadSingle,
  uploadMultiple,
  handleUploadError,
  deleteFile,
  createThumbnail,
  uploadDir,
  thumbnailDir
}; 