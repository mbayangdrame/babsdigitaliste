const pool = require('../config/database');
const fs = require('fs');
const path = require('path');

async function cleanAllImages() {
  try {
    console.log('🧹 Nettoyage complet de toutes les images...');
    
    // 1. Supprimer toutes les images de la base de données
    console.log('🗑️ Suppression des enregistrements en base de données...');
    const deleteResult = await pool.query('DELETE FROM images');
    console.log(`✅ ${deleteResult.rowCount} enregistrements supprimés de la base de données`);
    
    // 2. Supprimer tous les fichiers images
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    const thumbnailsDir = path.join(__dirname, '..', 'uploads', 'thumbnails');
    
    let deletedImages = 0;
    let deletedThumbnails = 0;
    
    // Supprimer les images originales
    if (fs.existsSync(uploadsDir)) {
      const imageFiles = fs.readdirSync(uploadsDir)
        .filter(file => file.match(/\.(jpg|jpeg|png|gif|webp)$/i))
        .filter(file => !file.startsWith('.')); // Exclure les fichiers cachés
      
      for (const file of imageFiles) {
        try {
          fs.unlinkSync(path.join(uploadsDir, file));
          deletedImages++;
        } catch (error) {
          console.error(`❌ Erreur lors de la suppression de ${file}:`, error.message);
        }
      }
      console.log(`✅ ${deletedImages} images originales supprimées`);
    }
    
    // Supprimer les thumbnails
    if (fs.existsSync(thumbnailsDir)) {
      const thumbnailFiles = fs.readdirSync(thumbnailsDir)
        .filter(file => file.match(/\.(jpg|jpeg|png|gif|webp)$/i))
        .filter(file => !file.startsWith('.')); // Exclure les fichiers cachés
      
      for (const file of thumbnailFiles) {
        try {
          fs.unlinkSync(path.join(thumbnailsDir, file));
          deletedThumbnails++;
        } catch (error) {
          console.error(`❌ Erreur lors de la suppression du thumbnail ${file}:`, error.message);
        }
      }
      console.log(`✅ ${deletedThumbnails} thumbnails supprimés`);
    }
    
    // 3. Vérifier que les dossiers sont vides
    const remainingImages = fs.existsSync(uploadsDir) ? 
      fs.readdirSync(uploadsDir).filter(file => file.match(/\.(jpg|jpeg|png|gif|webp)$/i)).length : 0;
    
    const remainingThumbnails = fs.existsSync(thumbnailsDir) ? 
      fs.readdirSync(thumbnailsDir).filter(file => file.match(/\.(jpg|jpeg|png|gif|webp)$/i)).length : 0;
    
    console.log('\n📋 Résumé du nettoyage:');
    console.log(`- Enregistrements supprimés: ${deleteResult.rowCount}`);
    console.log(`- Images originales supprimées: ${deletedImages}`);
    console.log(`- Thumbnails supprimés: ${deletedThumbnails}`);
    console.log(`- Images restantes: ${remainingImages}`);
    console.log(`- Thumbnails restants: ${remainingThumbnails}`);
    
    if (remainingImages === 0 && remainingThumbnails === 0) {
      console.log('✅ Nettoyage complet réussi ! Vous pouvez maintenant faire un upload propre.');
    } else {
      console.log('⚠️ Certains fichiers n\'ont pas pu être supprimés.');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
  } finally {
    await pool.end();
  }
}

// Exécuter le script
cleanAllImages(); 