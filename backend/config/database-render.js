const { Pool } = require('pg');
require('dotenv').config();

// Ce fichier est conservé pour compatibilité, mais redirige vers Supabase si disponible
const connectionString = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;
const isSupabase = connectionString && /\.supabase\.co(?::\d+)?\/?/.test(connectionString);

const pool = new Pool({
  connectionString,
  ssl: isSupabase ? { rejectUnauthorized: false } : (process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false),
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test de connexion
pool.query('SELECT NOW()')
  .then(result => {
    console.log('✅ Connexion PostgreSQL réussie (via', isSupabase ? 'Supabase' : 'URL', ')');
    console.log('Heure du serveur:', result.rows[0].now);
  })
  .catch(err => {
    console.error('❌ Erreur de connexion PostgreSQL:', err.message);
  });

module.exports = pool;