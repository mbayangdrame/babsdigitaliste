const { Pool } = require('pg');
require('dotenv').config();

let dbConfig;

// Priorités de connexion: SUPABASE_DB_URL > DATABASE_URL > variables individuelles
if (process.env.SUPABASE_DB_URL) {
  console.log('🔗 Utilisation de SUPABASE_DB_URL pour la connexion...');
  dbConfig = {
    connectionString: process.env.SUPABASE_DB_URL,
    // Supabase requiert SSL; on l'active systématiquement
    ssl: { rejectUnauthorized: false },
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  };
} else if (process.env.DATABASE_URL) {
  console.log('🔗 Utilisation de DATABASE_URL pour la connexion...');
  const isSupabase = /\.supabase\.co(?::\d+)?\/?/.test(process.env.DATABASE_URL);
  dbConfig = {
    connectionString: process.env.DATABASE_URL,
    // Forcer SSL si l'URL pointe vers Supabase, sinon respecter NODE_ENV
    ssl: isSupabase ? { rejectUnauthorized: false } : (process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false),
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  };
} else {
  console.log('🔧 Utilisation des variables individuelles pour la connexion...');
  dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'babsdigitaliste_db',
    port: process.env.DB_PORT || 5432,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  };
}

// Afficher la configuration (sans les mots de passe)
console.log('📊 Configuration de la base de données:');
console.log('   Mode:', process.env.NODE_ENV || 'development');
console.log('   Host:', dbConfig.host || 'via URL');
console.log('   Database:', dbConfig.database || 'via URL');
console.log('   Port:', dbConfig.port || 'via URL');
console.log('   SSL:', dbConfig.ssl ? 'Activé' : 'Désactivé');

const pool = new Pool(dbConfig);

// Test de connexion avec gestion d'erreur améliorée
pool.query('SELECT NOW()')
  .then(result => {
    console.log('✅ Connexion à la base de données PostgreSQL réussie');
    console.log('⏰ Heure du serveur:', result.rows[0].now);
  })
  .catch(err => {
    console.error('❌ Erreur de connexion à la base de données:', err.message);
    console.error('🔍 Code d\'erreur:', err.code);
    
    // Suggestions selon le type d'erreur
    if (err.code === 'ECONNREFUSED') {
      console.error('💡 Vérifiez que la base de données est active et accessible');
    } else if (err.code === 'ENOTFOUND') {
      console.error('💡 Vérifiez l\'URL/host de la base de données');
    } else if (err.code === '28P01') {
      console.error('💡 Vérifiez les identifiants de connexion');
    } else if (err.code === '3D000') {
      console.error('💡 Vérifiez le nom de la base de données');
    }
  });

module.exports = pool; 