const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const app = express();
app.set('trust proxy', 1);

const PORT = process.env.PORT || 3001;

console.log('🚀 Serveur LWS Panel - Configuration CORS ultra permissive');

// Middleware CORS manuel ultra permissif pour LWS Panel
app.use((req, res, next) => {
  // Autoriser TOUTES les origines
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, Access-Control-Request-Method, Access-Control-Request-Headers');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Max-Age', '86400');
  
  // Gérer les requêtes OPTIONS immédiatement
  if (req.method === 'OPTIONS') {
    console.log('🔄 OPTIONS request handled');
    return res.status(200).end();
  }
  
  console.log(`📨 ${req.method} ${req.path} - Origin: ${req.headers.origin || 'none'}`);
  next();
});

// Sécurité simplifiée
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// Limite de requêtes
app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
}));

// JSON
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Fichiers statiques
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/images', require('./routes/images'));

// Route de test
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API LWS Panel opérationnelle', 
    date: new Date(),
    cors: 'enabled',
    origin: req.headers.origin
  });
});

// Test CORS
app.get('/api/cors-test', (req, res) => {
  res.json({
    success: true,
    message: 'CORS test réussi',
    headers: req.headers,
    method: req.method,
    url: req.url
  });
});

// Test OPTIONS
app.options('/api/test-options', (req, res) => {
  res.status(200).json({ message: 'OPTIONS test réussi' });
});

app.post('/api/test-options', (req, res) => {
  res.json({ message: 'POST test réussi', body: req.body });
});

// 404
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Route non trouvée' });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error('Erreur:', err);
  res.status(500).json({ success: false, message: 'Erreur serveur' });
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur LWS Panel en écoute sur le port ${PORT}`);
  console.log(`🌐 CORS: TOUTES les origines autorisées`);
  console.log(`🔧 Mode: ${process.env.NODE_ENV || 'production'}`);
}); 