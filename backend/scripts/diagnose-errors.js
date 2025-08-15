const pool = require('../config/database');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../config/production.env' });

async function diagnoseErrors() {
  console.log('🔍 DIAGNOSTIC DES ERREURS 500');
  console.log('================================\n');

  try {
    // 1. Test de connexion à la base de données
    console.log('1. Test de connexion à la base de données...');
    const connectionTest = await pool.query('SELECT NOW() as current_time, version() as pg_version');
    console.log('✅ Connexion réussie');
    console.log('   Heure serveur:', connectionTest.rows[0].current_time);
    console.log('   Version PostgreSQL:', connectionTest.rows[0].pg_version.split(' ')[0]);
    console.log('');

    // 2. Vérifier l'existence des tables
    console.log('2. Vérification des tables...');
    const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('images', 'categories', 'admins')
      ORDER BY table_name
    `;
    const tables = await pool.query(tablesQuery);
    console.log('   Tables trouvées:', tables.rows.map(row => row.table_name).join(', '));
    console.log('');

    // 3. Vérifier la structure de la table images
    if (tables.rows.some(row => row.table_name === 'images')) {
      console.log('3. Structure de la table images...');
      const imageColumns = await pool.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns 
        WHERE table_name = 'images' 
        ORDER BY ordinal_position
      `);
      console.log('   Colonnes:');
      imageColumns.rows.forEach(col => {
        console.log(`     - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
      });
      console.log('');
    }

    // 4. Vérifier la structure de la table categories
    if (tables.rows.some(row => row.table_name === 'categories')) {
      console.log('4. Structure de la table categories...');
      const categoryColumns = await pool.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns 
        WHERE table_name = 'categories' 
        ORDER BY ordinal_position
      `);
      console.log('   Colonnes:');
      categoryColumns.rows.forEach(col => {
        console.log(`     - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
      });
      console.log('');
    }

    // 5. Compter les enregistrements
    console.log('5. Nombre d\'enregistrements...');
    if (tables.rows.some(row => row.table_name === 'images')) {
      const imageCount = await pool.query('SELECT COUNT(*) as count FROM images');
      console.log(`   Images: ${imageCount.rows[0].count}`);
    }
    if (tables.rows.some(row => row.table_name === 'categories')) {
      const categoryCount = await pool.query('SELECT COUNT(*) as count FROM categories');
      console.log(`   Catégories: ${categoryCount.rows[0].count}`);
    }
    if (tables.rows.some(row => row.table_name === 'admins')) {
      const adminCount = await pool.query('SELECT COUNT(*) as count FROM admins');
      console.log(`   Admins: ${adminCount.rows[0].count}`);
    }
    console.log('');

    // 6. Test de la requête /api/images/categories
    console.log('6. Test de la requête /api/images/categories...');
    try {
      const categoriesQuery = `
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
      `;
      const categoriesResult = await pool.query(categoriesQuery);
      console.log(`   ✅ Requête réussie: ${categoriesResult.rows.length} catégories trouvées`);
    } catch (error) {
      console.log(`   ❌ Erreur: ${error.message}`);
      console.log(`   Code: ${error.code}`);
    }
    console.log('');

    // 7. Test de la requête /api/images/admin
    console.log('7. Test de la requête /api/images/admin...');
    try {
      const adminQuery = `
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
      `;
      const adminResult = await pool.query(adminQuery);
      console.log(`   ✅ Requête réussie: ${adminResult.rows.length} images trouvées`);
    } catch (error) {
      console.log(`   ❌ Erreur: ${error.message}`);
      console.log(`   Code: ${error.code}`);
    }
    console.log('');

    // 8. Vérifier les variables d'environnement
    console.log('8. Variables d\'environnement...');
    console.log('   NODE_ENV:', process.env.NODE_ENV);
    console.log('   DATABASE_URL:', process.env.DATABASE_URL ? 'Définie' : 'Non définie');
    console.log('   JWT_SECRET:', process.env.JWT_SECRET ? 'Définie' : 'Non définie');
    console.log('');

    // 9. Test de génération de token JWT
    console.log('9. Test de génération JWT...');
    try {
      const testToken = jwt.sign({ test: 'data' }, process.env.JWT_SECRET || 'test_secret');
      console.log('   ✅ Token JWT généré avec succès');
    } catch (error) {
      console.log(`   ❌ Erreur JWT: ${error.message}`);
    }

  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await pool.end();
    console.log('🔚 Connexion fermée');
  }
}

// Exécuter le diagnostic
diagnoseErrors().catch(console.error); 