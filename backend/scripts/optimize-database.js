const pool = require('../config/database');

async function optimizeDatabase() {
  console.log('🔧 === OPTIMISATION DE LA BASE DE DONNÉES ===');
  console.log('');

  try {
    // 1. Créer des index pour accélérer les requêtes
    console.log('📊 Création des index pour optimiser les performances...');
    
    // Index pour les catégories (slug)
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_categories_slug 
      ON categories(slug)
    `);
    console.log('  ✅ Index créé: categories.slug');
    
    // Index pour les images par catégorie
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_images_category_id 
      ON images(category_id)
    `);
    console.log('  ✅ Index créé: images.category_id');
    
    // Index pour les images par album
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_images_album_name 
      ON images(album_name)
    `);
    console.log('  ✅ Index créé: images.album_name');
    
    // Index pour les images en vedette
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_images_featured 
      ON images(is_featured) 
      WHERE is_featured = true
    `);
    console.log('  ✅ Index créé: images.is_featured');
    
    // Index composé pour le tri
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_images_sort_created 
      ON images(sort_order, created_at)
    `);
    console.log('  ✅ Index créé: images.sort_order + created_at');
    
    console.log('');

    // 2. Mettre à jour les statistiques de la base de données
    console.log('📈 Mise à jour des statistiques...');
    await pool.query('ANALYZE');
    console.log('  ✅ Statistiques mises à jour');
    
    console.log('');

    // 3. Vérifier les performances des requêtes principales
    console.log('⚡ Test des performances des requêtes...');
    
    // Test: récupération des catégories
    const startCategories = Date.now();
    const categoriesResult = await pool.query(`
      SELECT c.id, c.name, c.slug, c.description, COUNT(i.id) as image_count
      FROM categories c
      LEFT JOIN images i ON i.category_id = c.id
      GROUP BY c.id, c.name, c.slug, c.description
      ORDER BY c.name ASC
    `);
    const categoriesTime = Date.now() - startCategories;
    console.log(`  ✅ Requête catégories: ${categoriesTime}ms (${categoriesResult.rows.length} résultats)`);
    
    // Test: récupération des images par catégorie
    if (categoriesResult.rows.length > 0) {
      const testSlug = categoriesResult.rows[0].slug;
      const startImages = Date.now();
      const imagesResult = await pool.query(`
        SELECT i.id, i.title, i.description, i.image_url, i.thumbnail_url, 
               i.album_name, i.event_date, i.is_featured, i.sort_order,
               c.name as category_name, c.slug as category_slug
        FROM images i
        JOIN categories c ON i.category_id = c.id
        WHERE c.slug = $1
        ORDER BY i.sort_order ASC, i.created_at DESC
      `, [testSlug]);
      const imagesTime = Date.now() - startImages;
      console.log(`  ✅ Requête images (${testSlug}): ${imagesTime}ms (${imagesResult.rows.length} résultats)`);
    }
    
    // Test: récupération des images en vedette
    const startFeatured = Date.now();
    const featuredResult = await pool.query(`
      SELECT i.id, i.title, i.description, i.image_url, i.thumbnail_url,
             i.album_name, i.event_date, c.name as category_name, c.slug as category_slug
      FROM images i
      JOIN categories c ON i.category_id = c.id
      WHERE i.is_featured = true
      ORDER BY i.sort_order ASC, i.created_at DESC
      LIMIT 12
    `);
    const featuredTime = Date.now() - startFeatured;
    console.log(`  ✅ Requête images vedettes: ${featuredTime}ms (${featuredResult.rows.length} résultats)`);
    
    console.log('');

    // 4. Statistiques finales
    console.log('📊 Statistiques finales:');
    const statsResult = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM categories) as categories_count,
        (SELECT COUNT(*) FROM images) as images_count,
        (SELECT COUNT(*) FROM images WHERE is_featured = true) as featured_count
    `);
    const stats = statsResult.rows[0];
    console.log(`  📁 Catégories: ${stats.categories_count}`);
    console.log(`  🖼️ Images: ${stats.images_count}`);
    console.log(`  ⭐ Images en vedette: ${stats.featured_count}`);
    
    console.log('');
    console.log('✅ Optimisation terminée avec succès !');
    console.log('💡 Les requêtes API devraient maintenant être plus rapides.');
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'optimisation:', error);
    throw error;
  }
}

// Exporter la fonction pour l'utilisation dans d'autres scripts
module.exports = { optimizeDatabase };

// Exécuter l'optimisation si ce script est appelé directement
if (require.main === module) {
  optimizeDatabase()
    .then(() => {
      console.log('🎉 Optimisation terminée.');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Erreur:', error);
      process.exit(1);
    });
}