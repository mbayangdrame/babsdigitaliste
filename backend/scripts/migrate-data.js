const pool = require('../config/database');

async function migrateData() {
  try {
    console.log('🔄 Migration des données existantes...');
    
    // 1. Mettre à jour les images existantes
    console.log('📸 Migration des images...');
    
    // Récupérer toutes les images
    const images = await pool.query('SELECT * FROM images');
    console.log(`📊 ${images.rows.length} images trouvées`);
    
    for (const image of images.rows) {
      console.log(`🔄 Migration de l'image ${image.id}...`);
      
      // Mettre à jour les colonnes manquantes
      const updates = [];
      const values = [];
      let paramIndex = 1;
      
      // Mettre à jour title si vide
      if (!image.title || image.title === 'Image sans titre') {
        updates.push(`title = $${paramIndex++}`);
        values.push(image.original_name || `Image ${image.id}`);
      }
      
      // Mettre à jour image_url si vide
      if (!image.image_url) {
        updates.push(`image_url = $${paramIndex++}`);
        values.push(`/uploads/${image.filename}`);
      }
      
      // Mettre à jour thumbnail_url si vide
      if (!image.thumbnail_url) {
        updates.push(`thumbnail_url = $${paramIndex++}`);
        values.push(`/uploads/thumbnails/${image.filename}`);
      }
      
      // Mettre à jour category_id si vide
      if (!image.category_id && image.category) {
        // Chercher la catégorie par nom
        const categoryResult = await pool.query(
          'SELECT id FROM categories WHERE name ILIKE $1 OR slug ILIKE $1',
          [image.category]
        );
        
        if (categoryResult.rows.length > 0) {
          updates.push(`category_id = $${paramIndex++}`);
          values.push(categoryResult.rows[0].id);
        }
      }
      
      // Mettre à jour album_name si vide
      if (!image.album_name) {
        updates.push(`album_name = $${paramIndex++}`);
        values.push('Sans album');
      }
      
      // Mettre à jour is_featured si null
      if (image.is_featured === null) {
        updates.push(`is_featured = $${paramIndex++}`);
        values.push(false);
      }
      
      // Mettre à jour sort_order si null
      if (image.sort_order === null) {
        updates.push(`sort_order = $${paramIndex++}`);
        values.push(0);
      }
      
      // Exécuter la mise à jour si nécessaire
      if (updates.length > 0) {
        values.push(image.id);
        const updateQuery = `
          UPDATE images 
          SET ${updates.join(', ')}
          WHERE id = $${paramIndex}
        `;
        
        await pool.query(updateQuery, values);
        console.log(`✅ Image ${image.id} mise à jour`);
      } else {
        console.log(`✅ Image ${image.id} déjà à jour`);
      }
    }
    
    // 2. Vérifier les catégories
    console.log('📋 Vérification des catégories...');
    const categories = await pool.query('SELECT * FROM categories');
    console.log(`📊 ${categories.rows.length} catégories trouvées`);
    
    if (categories.rows.length === 0) {
      console.log('🔧 Ajout des catégories par défaut...');
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
      console.log('✅ Catégories par défaut ajoutées');
    }
    
    // 3. Statistiques finales
    console.log('📊 Statistiques finales...');
    const finalImages = await pool.query('SELECT COUNT(*) as count FROM images');
    const finalCategories = await pool.query('SELECT COUNT(*) as count FROM categories');
    
    console.log(`📸 Images: ${finalImages.rows[0].count}`);
    console.log(`📋 Catégories: ${finalCategories.rows[0].count}`);
    
    console.log('🎉 Migration terminée avec succès !');
    
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
  } finally {
    await pool.end();
  }
}

migrateData(); 