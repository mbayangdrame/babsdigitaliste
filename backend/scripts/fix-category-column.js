const pool = require('../config/database');
require('dotenv').config();

async function fixCategoryColumn() {
  console.log('🔧 CORRECTION DE LA COLONNE CATEGORY');
  console.log('====================================\n');

  try {
    // 1. Vérifier la structure actuelle
    console.log('1. Structure actuelle de la table images:');
    const imageColumns = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'images' 
      ORDER BY ordinal_position
    `);
    imageColumns.rows.forEach(col => {
      console.log(`   - ${col.column_name}: ${col.data_type}`);
    });
    console.log('');

    // 2. Ajouter la colonne category_id
    console.log('2. Ajout de la colonne category_id...');
    await pool.query('ALTER TABLE images ADD COLUMN IF NOT EXISTS category_id INTEGER');
    console.log('   ✅ Colonne category_id ajoutée');

    // 3. Migrer les données de category vers category_id
    console.log('3. Migration des données...');
    const images = await pool.query('SELECT id, category FROM images WHERE category IS NOT NULL');
    console.log(`   ${images.rows.length} images à migrer`);

    for (const image of images.rows) {
      // Trouver la catégorie correspondante
      const categoryResult = await pool.query(
        'SELECT id FROM categories WHERE name ILIKE $1 OR slug ILIKE $1',
        [image.category]
      );
      
      if (categoryResult.rows.length > 0) {
        await pool.query(
          'UPDATE images SET category_id = $1 WHERE id = $2',
          [categoryResult.rows[0].id, image.id]
        );
        console.log(`   ✅ Image ${image.id}: ${image.category} -> category_id ${categoryResult.rows[0].id}`);
      } else {
        console.log(`   ⚠️  Image ${image.id}: catégorie "${image.category}" non trouvée`);
      }
    }

    // 4. Ajouter la contrainte de clé étrangère (sans IF NOT EXISTS)
    console.log('4. Ajout de la contrainte de clé étrangère...');
    try {
      await pool.query(`
        ALTER TABLE images 
        ADD CONSTRAINT fk_images_category 
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
      `);
      console.log('   ✅ Contrainte de clé étrangère ajoutée');
    } catch (error) {
      if (error.code === '42710') {
        console.log('   ⚠️  Contrainte déjà existante');
      } else {
        throw error;
      }
    }

    // 5. Ajouter les index
    console.log('5. Ajout des index...');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_images_category ON images(category_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_images_featured ON images(is_featured)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_images_sort ON images(sort_order)');
    console.log('   ✅ Index ajoutés');

    // 6. Test des requêtes
    console.log('6. Test des requêtes...');
    try {
      const categoriesTest = await pool.query(`
        SELECT 
          c.id,
          c.name,
          c.slug,
          c.description,
          COUNT(i.id) as image_count
        FROM categories c
        LEFT JOIN images i ON i.category_id = c.id
        GROUP BY c.id, c.name, c.slug, c.description
        ORDER BY c.name ASC
      `);
      console.log(`   ✅ Requête categories: ${categoriesTest.rows.length} catégories trouvées`);
      
      const adminTest = await pool.query(`
        SELECT 
          i.id,
          i.title,
          i.description,
          i.image_url,
          i.thumbnail_url,
          i.album_name,
          i.event_date,
          i.is_featured,
          i.sort_order,
          i.created_at,
          COALESCE(c.name, 'Non catégorisée') as category_name,
          COALESCE(c.slug, 'uncategorized') as category_slug
        FROM images i
        LEFT JOIN categories c ON i.category_id = c.id
        ORDER BY i.created_at DESC
      `);
      console.log(`   ✅ Requête admin: ${adminTest.rows.length} images trouvées`);
    } catch (error) {
      console.log(`   ❌ Erreur lors du test: ${error.message}`);
    }

    console.log('\n🎉 CORRECTION TERMINÉE AVEC SUCCÈS!');
    console.log('Les endpoints /api/images/admin et /api/images/categories devraient maintenant fonctionner.');

  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
  } finally {
    await pool.end();
  }
}

fixCategoryColumn().catch(console.error); 