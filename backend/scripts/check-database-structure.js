const pool = require('../config/database');
require('dotenv').config();

async function checkDatabaseStructure() {
  try {
    console.log('🔍 Vérification de la structure de la base de données...');
    
    // 1. Vérifier si la table images existe
    console.log('📋 Vérification de la table images...');
    const tableExists = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'images'
      );
    `);
    
    if (!tableExists.rows[0].exists) {
      console.log('❌ La table images n\'existe pas');
      return;
    }
    
    console.log('✅ La table images existe');
    
    // 2. Vérifier les colonnes de la table images
    console.log('📊 Vérification des colonnes...');
    const columns = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'images' 
      AND table_schema = 'public'
      ORDER BY ordinal_position;
    `);
    
    console.log('📋 Colonnes actuelles:');
    columns.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    });
    
    // 3. Vérifier si la colonne title existe
    const titleColumn = columns.rows.find(col => col.column_name === 'title');
    
    if (!titleColumn) {
      console.log('❌ La colonne title n\'existe pas !');
      console.log('🔧 Ajout de la colonne title...');
      
      await pool.query(`
        ALTER TABLE images 
        ADD COLUMN title VARCHAR(255) NOT NULL DEFAULT 'Image sans titre';
      `);
      
      console.log('✅ Colonne title ajoutée');
    } else {
      console.log('✅ La colonne title existe');
    }
    
    // 4. Vérifier les autres colonnes importantes
    const requiredColumns = [
      'description', 'image_url', 'thumbnail_url', 'category_id', 
      'album_name', 'event_date', 'is_featured', 'sort_order'
    ];
    
    for (const colName of requiredColumns) {
      const column = columns.rows.find(col => col.column_name === colName);
      if (!column) {
        console.log(`❌ La colonne ${colName} n'existe pas`);
        
        // Ajouter les colonnes manquantes selon leur type
        switch (colName) {
          case 'description':
            await pool.query('ALTER TABLE images ADD COLUMN description TEXT;');
            break;
          case 'image_url':
            await pool.query('ALTER TABLE images ADD COLUMN image_url VARCHAR(500) NOT NULL DEFAULT \'\';');
            break;
          case 'thumbnail_url':
            await pool.query('ALTER TABLE images ADD COLUMN thumbnail_url VARCHAR(500);');
            break;
          case 'category_id':
            await pool.query('ALTER TABLE images ADD COLUMN category_id INTEGER;');
            break;
          case 'album_name':
            await pool.query('ALTER TABLE images ADD COLUMN album_name VARCHAR(255);');
            break;
          case 'event_date':
            await pool.query('ALTER TABLE images ADD COLUMN event_date DATE;');
            break;
          case 'is_featured':
            await pool.query('ALTER TABLE images ADD COLUMN is_featured BOOLEAN DEFAULT FALSE;');
            break;
          case 'sort_order':
            await pool.query('ALTER TABLE images ADD COLUMN sort_order INTEGER DEFAULT 0;');
            break;
        }
        
        console.log(`✅ Colonne ${colName} ajoutée`);
      } else {
        console.log(`✅ La colonne ${colName} existe`);
      }
    }
    
    // 5. Vérifier la table categories
    console.log('📋 Vérification de la table categories...');
    const categoriesExists = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'categories'
      );
    `);
    
    if (!categoriesExists.rows[0].exists) {
      console.log('❌ La table categories n\'existe pas');
      console.log('🔧 Création de la table categories...');
      
      await pool.query(`
        CREATE TABLE categories (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL UNIQUE,
          slug VARCHAR(100) NOT NULL UNIQUE,
          description TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      
      // Insérer les catégories par défaut
      await pool.query(`
        INSERT INTO categories (name, slug, description) VALUES
        ('Nature', 'nature', 'Photographies de paysages naturels'),
        ('Shooting', 'shooting', 'Sessions photo professionnelles'),
        ('Mariage', 'mariage', 'Cérémonies et événements de mariage'),
        ('Événement', 'evenement', 'Événements et cérémonies'),
        ('Politique', 'politique', 'Événements politiques'),
        ('Cultures', 'cultures', 'Événements culturels'),
        ('Vidéos', 'videos', 'Contenus vidéo')
        ON CONFLICT (slug) DO NOTHING;
      `);
      
      console.log('✅ Table categories créée avec les données par défaut');
    } else {
      console.log('✅ La table categories existe');
    }
    
    console.log('🎉 Structure de la base de données vérifiée et corrigée !');
    
  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error);
  } finally {
    await pool.end();
  }
}

checkDatabaseStructure(); 