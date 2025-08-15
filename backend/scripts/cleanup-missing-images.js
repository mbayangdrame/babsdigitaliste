const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function cleanupMissingImages() {
  let pool;
  
  try {
    console.log('🧹 Nettoyage des images manquantes...');
    
    // Configuration de la connexion
    const dbConfig = {
      connectionString: process.env.DATABASE_URL || `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME}`,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    };

    pool = new Pool(dbConfig);
    console.log('✅ Connexion établie');

    // Récupérer toutes les images
    const result = await pool.query('SELECT id, title, image_url, thumbnail_url FROM images');
    console.log(`📸 ${result.rows.length} images trouvées dans la base de données`);

    let missingImages = [];
    let validImages = [];

    for (const image of result.rows) {
      let isMissing = false;
      
      // Vérifier l'image principale
      if (image.image_url) {
        const imagePath = path.join(__dirname, '..', image.image_url);
        if (!fs.existsSync(imagePath)) {
          isMissing = true;
        }
      }
      
      // Vérifier la thumbnail
      if (image.thumbnail_url) {
        const thumbnailPath = path.join(__dirname, '..', image.thumbnail_url);
        if (!fs.existsSync(thumbnailPath)) {
          isMissing = true;
        }
      }
      
      if (isMissing) {
        missingImages.push(image);
      } else {
        validImages.push(image);
      }
    }

    console.log(`\n📊 Résumé:`);
    console.log(`  - Images valides: ${validImages.length}`);
    console.log(`  - Images manquantes: ${missingImages.length}`);

    if (missingImages.length > 0) {
      console.log(`\n🗑️  Suppression des images manquantes...`);
      
      for (const image of missingImages) {
        console.log(`  - Suppression de l'image ID ${image.id}: ${image.title}`);
        await pool.query('DELETE FROM images WHERE id = $1', [image.id]);
      }
      
      console.log(`\n✅ ${missingImages.length} images supprimées de la base de données`);
      console.log(`\n💡 Prochaines étapes:`);
      console.log(`   1. Re-uploader les images via l'interface d'administration`);
      console.log(`   2. Ou utiliser le script de migration si vous avez les fichiers locaux`);
    } else {
      console.log(`\n✅ Toutes les images existent sur le serveur !`);
    }

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    if (pool) {
      await pool.end();
    }
  }
}

cleanupMissingImages(); 