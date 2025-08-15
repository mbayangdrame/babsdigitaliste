const { Pool } = require('pg');
require('dotenv').config();

console.log('🔍 Test de connexion à la base PostgreSQL/Supabase...');
const connectionString = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;
console.log('URL:', connectionString ? 'définie' : 'non définie');

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 10000,
  query_timeout: 10000
});

pool.query('SELECT NOW() as now')
  .then(result => {
    console.log('✅ Connexion réussie !');
    console.log('Heure du serveur:', result.rows[0].now);
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Erreur de connexion:', err.message);
    console.error('Code d\'erreur:', err.code || 'N/A');
    process.exit(1);
  });