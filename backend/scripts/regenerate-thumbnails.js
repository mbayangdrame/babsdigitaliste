const pool = require('../config/database');
const fs = require('fs');
const path = require('path');
const { createThumbnail } = require('../middleware/upload');

async function regenerateThumbnails() {
  try {
    console.log('🔄 Régénération des thumbnails manquants...');
    
    // Récupérer toutes les images de la base de données
    const imagesResult = await pool.query('SELECT id, image_url, thumbnail_url FROM images');
    console.log(`📊 ${imagesResult.rows.length} images trouvées en base de données`);
    
    let regeneratedThumbnails = 0;
    let errors = 0;
    
    for (const image of imagesResult.rows) {
      // Vérifier si l'image principale existe
      if (image.image_url) {
        const imagePath = path.join(__dirname, '..', image.image_url);
        
        if (fs.existsSync(imagePath)) {
          // Vérifier si le thumbnail existe
          let thumbnailExists = false;
          if (image.thumbnail_url) {
            const thumbnailPath = path.join(__dirname, '..', image.thumbnail_url);
            thumbnailExists = fs.existsSync(thumbnailPath);
          }
          
          // Si le thumbnail n'existe pas, le recréer
          if (!thumbnailExists) {
            try {
              console.log(`🔄 Régénération du thumbnail pour l'image ID: ${image.id}`);
              const thumbnailFilename = await createThumbnail(imagePath);
              const thumbnailUrl = `/uploads/thumbnails/${thumbnailFilename}`;
              
              // Mettre à jour la base de données
              await pool.query(
                'UPDATE images SET thumbnail_url = $1 WHERE id = $2',
                [thumbnailUrl, image.id]
              );
              
              console.log(`✅ Thumbnail régénéré: ${thumbnailFilename}`);
              regeneratedThumbnails++;
            } catch (error) {
              console.error(`❌ Erreur lors de la régénération du thumbnail pour l'image ID ${image.id}:`, error);
              errors++;
            }
          } else {
            console.log(`✅ Thumbnail existe déjà pour l'image ID: ${image.id}`);
          }
        } else {
          console.log(`⚠️ Image principale manquante pour l'image ID: ${image.id}`);
        }
      }
    }
    
    console.log('\n📋 Résumé de la régénération:');
    console.log(`- Thumbnails régénérés: ${regeneratedThumbnails}`);
    console.log(`- Erreurs: ${errors}`);
    
    if (regeneratedThumbnails > 0) {
      console.log('✅ Régénération terminée avec succès !');
    } else {
      console.log('✅ Tous les thumbnails existent déjà.');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la régénération:', error);
  } finally {
    await pool.end();
  }
}

// Exécuter le script
regenerateThumbnails(); 