const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

// Vérification des modules PostgreSQL au démarrage
console.log('🔍 Vérification des modules PostgreSQL...');
try {
  require('pg');
  console.log('✅ Module pg chargé avec succès');
} catch (error) {
  console.error('❌ Erreur lors du chargement du module pg:', error.message);
  process.exit(1);
}

try {
  require('pg-protocol');
  console.log('✅ Module pg-protocol chargé avec succès');
} catch (error) {
  console.error('❌ Erreur lors du chargement du module pg-protocol:', error.message);
  console.error('💡 Essayez de relancer: npm run fix-deps');
  process.exit(1);
}

const app = express();
app.set('trust proxy', 1); // Nécessaire derrière un proxy (NGINX)

// Configuration des timeouts pour les uploads
app.use((req, res, next) => {
  // Augmenter les timeouts pour les uploads
  if (req.path.includes('/api/images/bulk') || req.path.includes('/api/images')) {
    req.setTimeout(300000); // 5 minutes
    res.setTimeout(300000); // 5 minutes
  }
  next();
});

const PORT = process.env.PORT || 3001; // Port par défaut pour le développement

// ----- CORS -----
const allowedOrigins = [
  'https://babsdigitaliste.com',
  'https://www.babsdigitaliste.com',
  // Déployer derrière votre propre domaine/API gateway
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:4173'
];

console.log('🌐 Origines CORS autorisées:', allowedOrigins);

app.use(cors({
  origin: (origin, callback) => {
    // autoriser les requêtes server-to-server sans origin
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    console.log('🚫 Origin bloquée par CORS:', origin);
    return callback(new Error('Origin not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200
}));

app.options('*', cors()); // important pour le preflight

// ----- Sécurité -----
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
    },
  },
}));

// ----- Limite de requêtes -----
app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.RATE_LIMIT_MAX ? Number(process.env.RATE_LIMIT_MAX) : 100,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Ne pas appliquer la limite de taux aux uploads
    return req.path.includes('/api/images/bulk') || req.path.includes('/api/images');
  }
}));

// ----- Fichiers statiques -----
const uploadPath = process.env.UPLOAD_PATH || path.join(__dirname, 'uploads');

// Créer les dossiers s'ils n'existent pas
const fs = require('fs');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
  console.log(`📁 Dossier uploads créé: ${uploadPath}`);
}

const thumbnailsPath = path.join(uploadPath, 'thumbnails');
if (!fs.existsSync(thumbnailsPath)) {
  fs.mkdirSync(thumbnailsPath, { recursive: true });
  console.log(`📁 Dossier thumbnails créé: ${thumbnailsPath}`);
}

// Servir les fichiers statiques
app.use('/uploads', express.static(uploadPath, {
  onDotfiles: 'ignore', // Ne pas servir les fichiers cachés (par ex. .gitkeep)
  etag: true, // Utiliser les ETags pour la mise en cache
  lastModified: true, // Utiliser la date de dernière modification
  maxAge: '1d', // Mettre en cache pour 1 jour
  fallthrough: true, // Passer à la route suivante si le fichier n'est pas trouvé
}));

console.log(`📂 Dossier statique configuré: ${uploadPath}`);

// ----- JSON et URL-encoded pour toutes les routes -----
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// ----- Routes API (upload en premier) -----
app.use('/api/images', require('./routes/images'));
app.use('/api/auth', require('./routes/auth'));

app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API Babs Digitaliste opérationnelle', 
    date: new Date(),
    environment: process.env.NODE_ENV,
    allowed_origins: allowedOrigins,
    request_origin: req.headers.origin
  });
});

// Route de test pour vérifier la connexion
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Test de connexion réussi',
    timestamp: new Date().toISOString()
  });
});

// Route de test CORS spécifique
app.get('/api/cors-test', (req, res) => {
  res.json({
    success: true,
    message: 'Test CORS réussi',
    cors_configured: true,
    allowed_origins: allowedOrigins,
    current_origin: req.headers.origin,
    headers: req.headers
  });
});

// ----- Route racine -----
app.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Bienvenue sur l\'API Babs Digitaliste',
    endpoints: {
      health: '/api/health',
      test: '/api/test',
      cors_test: '/api/cors-test',
      auth: '/api/auth',
      images: '/api/images'
    },
    documentation: 'Cette API sert de backend pour le site Babs Digitaliste'
  });
});

// ----- 404 -----
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Route non trouvée' });
});

// ----- Gestion des erreurs -----
app.use((err, req, res, next) => {
  console.error('Erreur serveur:', err);
  
  // Gestion spécifique des erreurs CORS
  if (err.message === 'Origin not allowed by CORS') {
    return res.status(403).json({ 
      success: false, 
      message: 'Origin not allowed by CORS',
      error: err.message,
      allowedOrigins: allowedOrigins,
      requestOrigin: req.headers.origin
    });
  }
  
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ success: false, message: 'Données JSON invalides' });
  }
  
  res.status(500).json({ success: false, message: 'Erreur serveur interne' });
});

app.listen(PORT, async () => {
  console.log(`🚀 Serveur en écoute sur le port ${PORT}`);
  console.log(`🌐 CORS configuré pour les origines: ${allowedOrigins.join(', ')}`);
  console.log(`🔧 Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log(`⏱️  Timeouts configurés pour les uploads: 5 minutes`);
  
  // Correction automatique des thumbnails au démarrage
  if (process.env.NODE_ENV === 'production') {
    console.log('🔧 Démarrage de la correction automatique des thumbnails...');
    try {
      const { fixThumbnailsAutomatically } = require('./scripts/fix-thumbnails-automatically');
      // Exécuter en arrière-plan pour ne pas bloquer le démarrage
      setTimeout(() => {
        fixThumbnailsAutomatically().catch(error => {
          console.error('❌ Erreur lors de la correction automatique des thumbnails:', error);
        });
      }, 5000); // Attendre 5 secondes après le démarrage
    } catch (error) {
      console.error('❌ Impossible de charger le script de correction des thumbnails:', error);
    }
  }
});
