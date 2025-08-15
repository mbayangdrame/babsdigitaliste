const pool = require('../config/database');
const fs = require('fs');
const path = require('path');

async function checkImagesStatus() {
  try {
    console.log('🔍 Vérification de l\'état des images...');
    
    // Compter les fichiers dans les dossiers
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    const thumbnailsDir = path.join(__dirname, '..', 'uploads', 'thumbnails');
    
    let uploadsCount = 0;
    let thumbnailsCount = 0;
    
    if (fs.existsSync(uploadsDir)) {
      uploadsCount = fs.readdirSync(uploadsDir).filter(file => 
        file.match(/\.(jpg|jpeg|png|gif|webp)$/i)
      ).length;
    }
    
    if (fs.existsSync(thumbnailsDir)) {
      thumbnailsCount = fs.readdirSync(thumbnailsDir).filter(file => 
        file.match(/\.(jpg|jpeg|png|gif|webp)$/i)
      ).length;
    }
    
    console.log(`📁 Fichiers physiques:`);
    console.log(`   - Images originales: ${uploadsCount}`);
    console.log(`   - Thumbnails: ${thumbnailsCount}`);
    
    // Vérifier la base de données
    const imagesResult = await pool.query('SELECT COUNT(*) as count FROM images');
    const dbCount = parseInt(imagesResult.rows[0].count);
    
    console.log(`📊 Base de données:`);
    console.log(`   - Images enregistrées: ${dbCount}`);
    
    if (dbCount > 0) {
      // Afficher quelques exemples d'images
      const sampleImages = await pool.query(`
        SELECT id, title, image_url, thumbnail_url, category_id 
        FROM images 
        ORDER BY created_at DESC 
        LIMIT 5
      `);
      
      console.log(`\n📋 Exemples d'images en base:`);
      sampleImages.rows.forEach(image => {
        const imageExists = fs.existsSync(path.join(__dirname, '..', image.image_url));
        const thumbnailExists = image.thumbnail_url ? 
          fs.existsSync(path.join(__dirname, '..', image.thumbnail_url)) : false;
        
        console.log(`   ID ${image.id}: "${image.title}"`);
        console.log(`     - Image: ${image.image_url} ${imageExists ? '✅' : '❌'}`);
        console.log(`     - Thumbnail: ${image.thumbnail_url || 'Aucun'} ${thumbnailExists ? '✅' : '❌'}`);
      });
    }
    
    // Vérifier les catégories
    const categoriesResult = await pool.query('SELECT name, slug FROM categories ORDER BY name');
    console.log(`\n📂 Catégories disponibles:`);
    categoriesResult.rows.forEach(cat => {
      console.log(`   - ${cat.name} (${cat.slug})`);
    });
    
    console.log('\n✅ Vérification terminée !');
    
  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error);
  } finally {
    await pool.end();
  }
}

// Exécuter le script
checkImagesStatus(); 