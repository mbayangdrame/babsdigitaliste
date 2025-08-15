const fs = require('fs');
const path = require('path');
require('dotenv').config();

function checkPersistentStorage() {
  console.log('🔍 Vérification de la configuration du stockage persistant...');

  // Vérifier les variables d'environnement
  console.log('\n📋 Variables d\'environnement:');
  console.log(`  - UPLOAD_PATH: ${process.env.UPLOAD_PATH || 'Non défini (utilise le chemin par défaut)'}`);
  console.log(`  - NODE_ENV: ${process.env.NODE_ENV || 'Non défini'}`);

  // Chemin par défaut
  const defaultUploadPath = path.join(__dirname, 'uploads');
  const uploadPath = process.env.UPLOAD_PATH || defaultUploadPath;
  
  console.log(`\n📂 Chemin de stockage: ${uploadPath}`);
  
  // Vérifier si le dossier existe
  if (fs.existsSync(uploadPath)) {
    console.log('✅ Dossier uploads existe');
    
    // Lister le contenu
    try {
      const files = fs.readdirSync(uploadPath);
      console.log(`📁 Contenu du dossier: ${files.length} éléments`);
      
      if (files.length > 0) {
        console.log('  - Fichiers/dossiers trouvés:');
        files.forEach(file => {
          const filePath = path.join(uploadPath, file);
          const stats = fs.statSync(filePath);
          if (stats.isDirectory()) {
            const subFiles = fs.readdirSync(filePath);
            console.log(`    📁 ${file}/ (${subFiles.length} fichiers)`);
          } else {
            console.log(`    📄 ${file}`);
          }
        });
      } else {
        console.log('  - Dossier vide');
      }
    } catch (error) {
      console.error('❌ Erreur lors de la lecture du dossier:', error.message);
    }
  } else {
    console.log('❌ Dossier uploads n\'existe pas');
    console.log('💡 Création du dossier...');
    
    try {
      fs.mkdirSync(uploadPath, { recursive: true });
      console.log('✅ Dossier uploads créé');
      
      // Créer le dossier thumbnails
      const thumbnailsPath = path.join(uploadPath, 'thumbnails');
      fs.mkdirSync(thumbnailsPath, { recursive: true });
      console.log('✅ Dossier thumbnails créé');
    } catch (error) {
      console.error('❌ Erreur lors de la création du dossier:', error.message);
    }
}

// Vérifier les permissions
  try {
    const testFile = path.join(uploadPath, 'test-write.txt');
    fs.writeFileSync(testFile, 'test');
    fs.unlinkSync(testFile);
    console.log('✅ Permissions d\'écriture OK');
  } catch (error) {
    console.error('❌ Problème de permissions d\'écriture:', error.message);
  }
  
  console.log('\n💡 Recommandations:');
  if (process.env.NODE_ENV === 'production') {
    console.log('  - En production, utilisez un stockage persistant (AWS S3, Google Cloud Storage, etc.)');
    console.log('  - Ou configurez un volume persistant sur votre plateforme de déploiement');
  } else {
    console.log('  - En développement, le stockage local est suffisant');
  }
}

checkPersistentStorage(); 