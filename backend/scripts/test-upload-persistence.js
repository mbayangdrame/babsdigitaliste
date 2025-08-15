const fs = require('fs');
const path = require('path');
const pool = require('../config/database');

async function testUploadPersistence() {
  console.log('🔍 === TEST DE PERSISTANCE DES UPLOADS ===');
  console.log('');

  // 1. Configuration
  const uploadDir = process.env.UPLOAD_PATH || path.join(__dirname, '..', 'uploads');
  const thumbnailDir = path.join(uploadDir, 'thumbnails');
  
  console.log('📂 Configuration:');
  console.log('  Upload directory:', uploadDir);
  console.log('  Thumbnail directory:', thumbnailDir);
  console.log('');

  // 2. Créer les dossiers s'ils n'existent pas
  console.log('📁 Création des dossiers:');
  try {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log('  ✅ Dossier uploads créé');
    } else {
      console.log('  ✅ Dossier uploads existe déjà');
    }
    
    if (!fs.existsSync(thumbnailDir)) {
      fs.mkdirSync(thumbnailDir, { recursive: true });
      console.log('  ✅ Dossier thumbnails créé');
    } else {
      console.log('  ✅ Dossier thumbnails existe déjà');
    }
  } catch (error) {
    console.log('  ❌ Erreur lors de la création des dossiers:', error.message);
    return;
  }
  console.log('');

  // 3. Test d'écriture de fichier
  console.log('✍️ Test d\'écriture de fichier:');
  const testFileName = `test-${Date.now()}.txt`;
  const testFilePath = path.join(uploadDir, testFileName);
  const testContent = `Test de persistance - ${new Date().toISOString()}`;
  
  try {
    fs.writeFileSync(testFilePath, testContent);
    console.log('  ✅ Fichier test créé:', testFileName);
    
    // Vérifier que le fichier existe
    if (fs.existsSync(testFilePath)) {
      const content = fs.readFileSync(testFilePath, 'utf8');
      console.log('  ✅ Fichier test lu:', content.substring(0, 50) + '...');
      
      // Nettoyer
      fs.unlinkSync(testFilePath);
      console.log('  ✅ Fichier test supprimé');
    } else {
      console.log('  ❌ Fichier test non trouvé après création');
    }
  } catch (error) {
    console.log('  ❌ Erreur lors du test d\'écriture:', error.message);
  }
  console.log('');

  // 4. Vérifier les images existantes dans la base de données
  console.log('🗄️ Vérification des images en base de données:');
  try {
    const result = await pool.query(`
      SELECT id, title, image_url, thumbnail_url, created_at 
      FROM images 
      ORDER BY created_at DESC 
      LIMIT 10
    `);
    
    console.log(`  📊 Nombre d'images en DB: ${result.rows.length}`);
    
    if (result.rows.length > 0) {
      console.log('  📋 Dernières images:');
      for (const image of result.rows) {
        const imageExists = fs.existsSync(path.join(__dirname, '..', image.image_url));
        const thumbnailExists = image.thumbnail_url ? 
          fs.existsSync(path.join(__dirname, '..', image.thumbnail_url)) : false;
        
        console.log(`    - ID ${image.id}: ${image.title}`);
        console.log(`      Image: ${image.image_url} ${imageExists ? '✅' : '❌'}`);
        if (image.thumbnail_url) {
          console.log(`      Thumb: ${image.thumbnail_url} ${thumbnailExists ? '✅' : '❌'}`);
        }
        console.log(`      Date: ${image.created_at}`);
        console.log('');
      }
    }
  } catch (error) {
    console.log('  ❌ Erreur lors de la vérification DB:', error.message);
  }

  // 5. Statistiques des fichiers
  console.log('📊 Statistiques des fichiers:');
  try {
    const uploadFiles = fs.readdirSync(uploadDir).filter(f => !f.startsWith('.'));
    const thumbnailFiles = fs.existsSync(thumbnailDir) ? 
      fs.readdirSync(thumbnailDir).filter(f => !f.startsWith('.')) : [];
    
    console.log(`  📁 Fichiers uploads: ${uploadFiles.length}`);
    console.log(`  🖼️ Fichiers thumbnails: ${thumbnailFiles.length}`);
    
    // Taille totale
    let totalSize = 0;
    uploadFiles.forEach(file => {
      const filePath = path.join(uploadDir, file);
      try {
        const stats = fs.statSync(filePath);
        totalSize += stats.size;
      } catch (e) {
        // Ignorer les erreurs de fichiers individuels
      }
    });
    
    console.log(`  💾 Taille totale: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
  } catch (error) {
    console.log('  ❌ Erreur lors du calcul des statistiques:', error.message);
  }
  
  console.log('');
  console.log('=== FIN DU TEST ===');
}

// Exporter la fonction pour l'utilisation dans d'autres scripts
module.exports = { testUploadPersistence };

// Exécuter le test si ce script est appelé directement
if (require.main === module) {
  testUploadPersistence()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('❌ Erreur:', error);
      process.exit(1);
    });
}