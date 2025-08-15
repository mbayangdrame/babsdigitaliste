const pool = require('../config/database');

async function fixDatabaseStructure() {
  try {
    console.log('🔧 Correction complète de la structure de la base de données...');
    
    // 1. Vérifier la structure actuelle
    console.log('📋 Vérification de la structure actuelle...');
    const columns = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'images' 
      AND table_schema = 'public'
      ORDER BY ordinal_position;
    `);
    
    console.log('📊 Colonnes actuelles:');
    columns.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    });
    
    // 2. Supprimer l'ancienne table si elle existe avec l'ancienne structure
    const hasOldColumns = columns.rows.some(col => 
      ['filename', 'original_name', 'category'].includes(col.column_name)
    );
    
    if (hasOldColumns) {
      console.log('🔄 Détection d\'ancienne structure, migration nécessaire...');
      
      // Sauvegarder les données existantes
      const existingData = await pool.query('SELECT * FROM images');
      console.log(`📸 ${existingData.rows.length} images à migrer`);
      
      // Supprimer l'ancienne table
      await pool.query('DROP TABLE IF EXISTS images CASCADE');
      console.log('🗑️ Ancienne table supprimée');
      
      // Recréer la table avec la nouvelle structure
      await pool.query(`
        CREATE TABLE images (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          image_url VARCHAR(500) NOT NULL,
          thumbnail_url VARCHAR(500),
          category_id INTEGER,
          album_name VARCHAR(255),
          event_date DATE,
          is_featured BOOLEAN DEFAULT FALSE,
          sort_order INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
        );
      `);
      console.log('✅ Nouvelle table créée');
      
      // Recréer les index
      await pool.query('CREATE INDEX IF NOT EXISTS idx_images_category ON images(category_id);');
      await pool.query('CREATE INDEX IF NOT EXISTS idx_images_featured ON images(is_featured);');
      await pool.query('CREATE INDEX IF NOT EXISTS idx_images_sort ON images(sort_order);');
      await pool.query('CREATE INDEX IF NOT EXISTS idx_images_album ON images(album_name);');
      console.log('✅ Index recréés');
      
      // Migrer les données existantes
      for (const oldImage of existingData.rows) {
        console.log(`🔄 Migration de l'image ${oldImage.id}...`);
        
        // Déterminer la catégorie
        let categoryId = null;
        if (oldImage.category) {
          const categoryResult = await pool.query(
            'SELECT id FROM categories WHERE name ILIKE $1 OR slug ILIKE $1',
            [oldImage.category]
          );
          if (categoryResult.rows.length > 0) {
            categoryId = categoryResult.rows[0].id;
          }
        }
        
        // Insérer avec la nouvelle structure
        await pool.query(`
          INSERT INTO images (
            id, title, description, image_url, thumbnail_url, 
            category_id, album_name, event_date, is_featured, sort_order,
            created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        `, [
          oldImage.id,
          oldImage.original_name || `Image ${oldImage.id}`,
          oldImage.description || '',
          `/uploads/${oldImage.filename}`,
          `/uploads/thumbnails/${oldImage.filename}`,
          categoryId,
          'Sans album',
          oldImage.event_date,
          oldImage.is_featured || false,
          oldImage.sort_order || 0,
          oldImage.created_at,
          oldImage.updated_at
        ]);
        
        console.log(`✅ Image ${oldImage.id} migrée`);
      }
      
      console.log('🎉 Migration des données terminée !');
    } else {
      console.log('✅ Structure déjà à jour');
    }
    
    // 3. Vérification finale
    console.log('📊 Vérification finale...');
    const finalColumns = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'images' 
      AND table_schema = 'public'
      ORDER BY ordinal_position;
    `);
    
    console.log('📋 Structure finale:');
    finalColumns.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    });
    
    const imageCount = await pool.query('SELECT COUNT(*) as count FROM images');
    console.log(`📸 Nombre d'images: ${imageCount.rows[0].count}`);
    
    console.log('🎉 Structure de la base de données corrigée avec succès !');
    
  } catch (error) {
    console.error('❌ Erreur lors de la correction:', error);
  } finally {
    await pool.end();
  }
}

fixDatabaseStructure(); 