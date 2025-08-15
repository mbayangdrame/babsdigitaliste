const pool = require('../config/database');
const fs = require('fs');
const path = require('path');

async function recoverImages() {
  try {
    console.log('🔄 Récupération des images existantes...');
    
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    const thumbnailsDir = path.join(__dirname, '..', 'uploads', 'thumbnails');
    
    if (!fs.existsSync(uploadsDir)) {
      console.log('❌ Dossier uploads/ introuvable');
      return;
    }
    
    // Récupérer tous les fichiers images
    const imageFiles = fs.readdirSync(uploadsDir)
      .filter(file => file.match(/\.(jpg|jpeg|png|gif|webp)$/i))
      .filter(file => !file.startsWith('.')); // Exclure les fichiers cachés
    
    console.log(`📁 ${imageFiles.length} images trouvées dans uploads/`);
    
    // Récupérer tous les fichiers thumbnails
    const thumbnailFiles = fs.existsSync(thumbnailsDir) ? 
      fs.readdirSync(thumbnailsDir)
        .filter(file => file.match(/\.(jpg|jpeg|png|gif|webp)$/i))
        .filter(file => !file.startsWith('.')) : [];
    
    console.log(`📁 ${thumbnailFiles.length} thumbnails trouvés dans uploads/thumbnails/`);
    
    // Récupérer les catégories disponibles
    const categoriesResult = await pool.query('SELECT id, name, slug FROM categories ORDER BY name');
    const categories = categoriesResult.rows;
    
    console.log(`📂 ${categories.length} catégories disponibles:`);
    categories.forEach(cat => {
      console.log(`   - ${cat.name} (ID: ${cat.id}, slug: ${cat.slug})`);
    });
    
    let recoveredCount = 0;
    let errors = 0;
    
    for (const imageFile of imageFiles) {
      try {
        // Déterminer la catégorie basée sur le nom du fichier ou utiliser une catégorie par défaut
        let categoryId = categories[0]?.id; // Utiliser la première catégorie par défaut
        
        // Essayer de déterminer la catégorie basée sur le nom du fichier
        const filename = imageFile.toLowerCase();
        if (filename.includes('nature') || filename.includes('paysage')) {
          categoryId = categories.find(c => c.slug === 'nature')?.id || categoryId;
        } else if (filename.includes('shooting') || filename.includes('photo')) {
          categoryId = categories.find(c => c.slug === 'shooting')?.id || categoryId;
        } else if (filename.includes('mariage') || filename.includes('wedding')) {
          categoryId = categories.find(c => c.slug === 'mariage')?.id || categoryId;
        } else if (filename.includes('evenement') || filename.includes('event')) {
          categoryId = categories.find(c => c.slug === 'evenement')?.id || categoryId;
        } else if (filename.includes('politique') || filename.includes('political')) {
          categoryId = categories.find(c => c.slug === 'politique')?.id || categoryId;
        } else if (filename.includes('culture') || filename.includes('mode')) {
          categoryId = categories.find(c => c.slug === 'cultures')?.id || categoryId;
        }
        
        // Vérifier si un thumbnail existe
        const thumbnailUrl = thumbnailFiles.includes(imageFile) ? 
          `/uploads/thumbnails/${imageFile}` : null;
        
        // Créer un titre basé sur le nom du fichier
        const title = imageFile
          .replace(/\.(jpg|jpeg|png|gif|webp)$/i, '')
          .replace(/images-\d+-\d+/, '')
          .replace(/[-_]/g, ' ')
          .replace(/\b\w/g, l => l.toUpperCase())
          .trim() || `Image ${recoveredCount + 1}`;
        
        // Insérer l'image en base de données
        const result = await pool.query(`
          INSERT INTO images (title, description, image_url, thumbnail_url, category_id, album_name, is_featured, sort_order)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          RETURNING id
        `, [
          title,
          `Image récupérée automatiquement - ${title}`,
          `/uploads/${imageFile}`,
          thumbnailUrl,
          categoryId,
          'Images récupérées',
          false,
          recoveredCount + 1
        ]);
        
        console.log(`✅ Image récupérée: ${title} (ID: ${result.rows[0].id})`);
        recoveredCount++;
        
      } catch (error) {
        console.error(`❌ Erreur lors de la récupération de ${imageFile}:`, error.message);
        errors++;
      }
    }
    
    console.log('\n📋 Résumé de la récupération:');
    console.log(`- Images récupérées: ${recoveredCount}`);
    console.log(`- Erreurs: ${errors}`);
    
    if (recoveredCount > 0) {
      console.log('✅ Récupération terminée avec succès !');
    } else {
      console.log('⚠️ Aucune image récupérée.');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la récupération:', error);
  } finally {
    await pool.end();
  }
}

// Exécuter le script
recoverImages(); 