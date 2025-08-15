const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function checkImagesExist() {
  let pool;
  
  try {
    console.log('🔍 Vérification de l\'existence des images...');
    
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

    let missingImages = 0;
    let missingThumbnails = 0;

    for (const image of result.rows) {
      console.log(`\n🔍 Vérification de l'image ${image.id}: ${image.title}`);
      
      // Vérifier l'image principale
      if (image.image_url) {
        const imagePath = path.join(__dirname, '..', image.image_url);
        if (fs.existsSync(imagePath)) {
          console.log(`  ✅ Image principale existe: ${image.image_url}`);
        } else {
          console.log(`  ❌ Image principale manquante: ${image.image_url}`);
          missingImages++;
        }
      }
      
      // Vérifier la thumbnail
      if (image.thumbnail_url) {
        const thumbnailPath = path.join(__dirname, '..', image.thumbnail_url);
        if (fs.existsSync(thumbnailPath)) {
          console.log(`  ✅ Thumbnail existe: ${image.thumbnail_url}`);
        } else {
          console.log(`  ❌ Thumbnail manquante: ${image.thumbnail_url}`);
          missingThumbnails++;
        }
      }
    }

    console.log(`\n📊 Résumé:`);
    console.log(`  - Images manquantes: ${missingImages}`);
    console.log(`  - Thumbnails manquantes: ${missingThumbnails}`);
    console.log(`  - Total d'images: ${result.rows.length}`);

    if (missingImages > 0 || missingThumbnails > 0) {
      console.log(`\n⚠️  ATTENTION: Certaines images sont manquantes sur le serveur !`);
      console.log(`   Cela peut expliquer pourquoi les images ne s'affichent pas dans le frontend.`);
      console.log(`   Solutions possibles:`);
      console.log(`   1. Re-uploader les images manquantes`);
      console.log(`   2. Supprimer les entrées de la base de données pour les images manquantes`);
      console.log(`   3. Vérifier que les fichiers sont bien synchronisés avec le serveur de production`);
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

checkImagesExist(); 