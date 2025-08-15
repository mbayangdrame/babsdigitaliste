const { Pool } = require('pg');
require('dotenv').config({ path: '../config/production.env' });

async function initPostgres() {
  let pool;
  
  try {
    console.log('🚀 Initialisation de la base de données PostgreSQL...');
    
    // Configuration de la connexion
    const dbConfig = {
      connectionString: process.env.DATABASE_URL || `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME}`,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    };

    pool = new Pool(dbConfig);
    console.log('✅ Connexion établie');

    // 1. Créer la table categories
    console.log('📝 Création de la table categories...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        slug VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table categories créée/vérifiée');

    // 2. Vérifier et créer la table images avec les bonnes colonnes
    console.log('🔍 Vérification de la table images...');
    const { rows: columns } = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'images'
    `);
    
    const columnNames = columns.map(col => col.column_name);
    console.log('Colonnes existantes:', columnNames);

    // 3. Ajouter les colonnes manquantes si nécessaire
    const requiredColumns = ['category_id', 'title', 'image_url', 'thumbnail_url', 'album_name', 'is_featured', 'sort_order'];
    const missingColumns = requiredColumns.filter(col => !columnNames.includes(col));

    if (missingColumns.length > 0) {
      console.log('➕ Ajout des colonnes manquantes:', missingColumns);
      
      for (const column of missingColumns) {
        try {
          let alterQuery = '';
          switch (column) {
            case 'category_id':
              alterQuery = 'ADD COLUMN category_id INTEGER REFERENCES categories(id)';
              break;
            case 'title':
              alterQuery = 'ADD COLUMN title VARCHAR(255) NOT NULL DEFAULT \'\'';
              break;
            case 'image_url':
              alterQuery = 'ADD COLUMN image_url VARCHAR(500) NOT NULL DEFAULT \'\'';
              break;
            case 'thumbnail_url':
              alterQuery = 'ADD COLUMN thumbnail_url VARCHAR(500)';
              break;
            case 'album_name':
              alterQuery = 'ADD COLUMN album_name VARCHAR(255)';
              break;
            case 'is_featured':
              alterQuery = 'ADD COLUMN is_featured BOOLEAN DEFAULT FALSE';
              break;
            case 'sort_order':
              alterQuery = 'ADD COLUMN sort_order INTEGER DEFAULT 0';
              break;
          }
          
          if (alterQuery) {
            await pool.query(`ALTER TABLE images ${alterQuery}`);
            console.log(`✅ Colonne ${column} ajoutée`);
          }
        } catch (error) {
          console.log(`ℹ️ Colonne ${column} existe déjà ou erreur:`, error.message);
        }
      }
    }

    // 4. Insérer les catégories par défaut
    console.log('📋 Insertion des catégories par défaut...');
    const defaultCategories = [
      ['Nature', 'nature', 'Photographies de paysages naturels'],
      ['Shooting', 'shooting', 'Sessions photo professionnelles'],
      ['Mariage', 'mariage', 'Cérémonies et événements de mariage'],
      ['Événement', 'evenement', 'Événements et cérémonies'],
      ['Politique', 'politique', 'Événements politiques'],
      ['Cultures', 'cultures', 'Événements culturels'],
      ['Vidéos', 'videos', 'Contenus vidéo']
    ];

    for (const [name, slug, description] of defaultCategories) {
      try {
        await pool.query(
          'INSERT INTO categories (name, slug, description) VALUES ($1, $2, $3) ON CONFLICT (slug) DO NOTHING',
          [name, slug, description]
        );
        console.log(`✅ Catégorie "${name}" insérée ou existante`);
      } catch (error) {
        console.error(`❌ Erreur pour "${name}":`, error.message);
      }
    }

    // 5. Vérification finale
    console.log('\n📊 Vérification finale...');
    const { rows: categories } = await pool.query('SELECT COUNT(*) as count FROM categories');
    const { rows: images } = await pool.query('SELECT COUNT(*) as count FROM images');
    
    console.log(`✅ ${categories[0].count} catégories dans la base`);
    console.log(`✅ ${images[0].count} images dans la base`);

    console.log('\n🎉 Initialisation PostgreSQL terminée!');
    console.log('🔗 Les API devraient maintenant fonctionner correctement');

  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
  } finally {
    if (pool) {
      await pool.end();
      console.log('🔌 Connexion fermée');
    }
  }
}

initPostgres(); 