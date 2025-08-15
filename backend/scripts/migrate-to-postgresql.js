const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false }
});

async function createTables() {
  try {
    // Table des utilisateurs
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE,
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Table des catégories
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Table des images
    await pool.query(`
      CREATE TABLE IF NOT EXISTS images (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) NOT NULL,
        original_name VARCHAR(255) NOT NULL,
        category VARCHAR(255) NOT NULL,
        event_date DATE,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Insérer les catégories par défaut
    const categories = [
      { name: 'Nature & Paysages', slug: 'nature', description: 'Photos de nature et paysages' },
      { name: 'Shooting Photo', slug: 'shooting', description: 'Portraits et sessions photo' },
      { name: 'Mariages', slug: 'mariage', description: 'Cérémonies de mariage' },
      { name: 'Événements', slug: 'evenement', description: 'Événements et cérémonies' },
      { name: 'Mode & Culture', slug: 'cultures', description: 'Mode et culture traditionnelle' },
      { name: 'Politique', slug: 'politique', description: 'Événements politiques' }
    ];

    for (const category of categories) {
      await pool.query(`
        INSERT INTO categories (name, slug, description) 
        VALUES ($1, $2, $3) 
        ON CONFLICT (slug) DO NOTHING
      `, [category.name, category.slug, category.description]);
    }

    // Créer un utilisateur admin par défaut
    await pool.query(`
      INSERT INTO users (username, password, email, role) 
      VALUES ($1, $2, $3, $4) 
      ON CONFLICT (username) DO NOTHING
    `, ['admin', 'admin123', 'admin@babsdigitaliste.com', 'admin']);

    console.log('✅ Tables créées avec succès');
    console.log('✅ Catégories par défaut insérées');
    console.log('✅ Utilisateur admin créé (username: admin, password: admin123)');

  } catch (error) {
    console.error('❌ Erreur lors de la création des tables:', error);
  } finally {
    await pool.end();
  }
}

createTables(); 