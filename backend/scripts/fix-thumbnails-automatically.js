const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const { createThumbnail } = require('../middleware/upload');
require('dotenv').config();

async function fixThumbnailsAutomatically() {
  let pool;
  
  try {
    console.log('🔧 Correction automatique des thumbnails...');
    
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

    let fixedThumbnails = 0;
    let errors = 0;

    for (const image of result.rows) {
      console.log(`\n🔍 Traitement de l'image ${image.id}: ${image.title}`);
      
      // Vérifier si l'image principale existe
      if (image.image_url) {
        const imagePath = path.join(__dirname, '..', image.image_url);
        
        if (fs.existsSync(imagePath)) {
          console.log(`  ✅ Image principale existe: ${image.image_url}`);
          
          // Vérifier si le thumbnail existe
          let thumbnailExists = false;
          if (image.thumbnail_url) {
            const thumbnailPath = path.join(__dirname, '..', image.thumbnail_url);
            thumbnailExists = fs.existsSync(thumbnailPath);
          }
          
          // Si le thumbnail n'existe pas, le créer
          if (!thumbnailExists) {
            try {
              console.log(`  🔄 Création du thumbnail pour l'image ID: ${image.id}`);
              const thumbnailFilename = await createThumbnail(imagePath);
              const thumbnailUrl = `/uploads/thumbnails/${thumbnailFilename}`;
              
              // Mettre à jour la base de données
              await pool.query(
                'UPDATE images SET thumbnail_url = $1 WHERE id = $2',
                [thumbnailUrl, image.id]
              );
              
              console.log(`  ✅ Thumbnail créé: ${thumbnailFilename}`);
              fixedThumbnails++;
            } catch (error) {
              console.error(`  ❌ Erreur lors de la création du thumbnail pour l'image ID ${image.id}:`, error);
              errors++;
            }
          } else {
            console.log(`  ✅ Thumbnail existe déjà pour l'image ID: ${image.id}`);
          }
        } else {
          console.log(`  ❌ Image principale manquante: ${image.image_url}`);
          errors++;
        }
      } else {
        console.log(`  ⚠️ Pas d'URL d'image pour l'image ID: ${image.id}`);
      }
    }
    
    console.log('\n📋 Résumé de la correction:');
    console.log(`  - Thumbnails corrigés: ${fixedThumbnails}`);
    console.log(`  - Erreurs: ${errors}`);
    console.log(`  - Total d'images: ${result.rows.length}`);
    
    if (fixedThumbnails > 0) {
      console.log('✅ Correction terminée avec succès !');
    } else {
      console.log('✅ Tous les thumbnails sont corrects.');
    }
    
    return { success: true, fixedThumbnails, errors, total: result.rows.length };
    
  } catch (error) {
    console.error('❌ Erreur lors de la correction:', error);
    return { success: false, error: error.message };
  } finally {
    if (pool) {
      await pool.end();
    }
  }
}

// Exporter la fonction pour utilisation dans d'autres modules
module.exports = { fixThumbnailsAutomatically };

// Exécuter le script si appelé directement
if (require.main === module) {
  fixThumbnailsAutomatically();
} 