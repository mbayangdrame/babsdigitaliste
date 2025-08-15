const express = require('express');
const cors = require('cors');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const app = express();

// Configuration CORS de test
app.use(cors({
  origin: ['https://babsdigitaliste.com', 'https://www.babsdigitaliste.com'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Route de test pour la route bulk
app.post('/api/images/bulk-test', async (req, res) => {
  try {
    console.log('🔍 Test de la route bulk upload...');
    console.log('📋 Headers:', req.headers);
    console.log('📦 Body:', req.body);
    
    // Vérifier la connexion à la base de données
    const dbTest = await pool.query('SELECT NOW()');
    console.log('✅ Connexion DB OK:', dbTest.rows[0]);
    
    // Vérifier si la table images existe
    const tableTest = await pool.query(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'images'
    `);
    console.log('📊 Table images existe:', tableTest.rows[0].count > 0);
    
    // Vérifier si la table categories existe
    const categoriesTest = await pool.query(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'categories'
    `);
    console.log('📊 Table categories existe:', categoriesTest.rows[0].count > 0);
    
    res.json({
      success: true,
      message: 'Test de diagnostic réussi',
      database: {
        connected: true,
        images_table_exists: tableTest.rows[0].count > 0,
        categories_table_exists: categoriesTest.rows[0].count > 0
      },
      request: {
        headers: req.headers,
        body: req.body,
        method: req.method,
        url: req.url
      }
    });
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du test',
      error: error.message,
      stack: error.stack
    });
  }
});

// Route de test pour l'authentification
app.post('/api/auth-test', authenticateToken, async (req, res) => {
  res.json({
    success: true,
    message: 'Authentification réussie',
    user: req.user
  });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`🔧 Serveur de diagnostic en écoute sur le port ${PORT}`);
}); 