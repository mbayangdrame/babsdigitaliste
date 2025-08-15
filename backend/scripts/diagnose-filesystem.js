const fs = require('fs');
const path = require('path');

async function diagnoseFilesystem() {
  console.log('🔍 === DIAGNOSTIC DU SYSTÈME DE FICHIERS ===');
  console.log('');

  // 1. Variables d'environnement
  console.log('📋 Variables d\'environnement:');
  console.log('  UPLOAD_PATH:', process.env.UPLOAD_PATH || 'Non défini');
  console.log('  NODE_ENV:', process.env.NODE_ENV || 'Non défini');
  console.log('  PWD:', process.cwd());
  console.log('');

  // 2. Chemins calculés
  const uploadDir = process.env.UPLOAD_PATH || path.join(__dirname, '..', 'uploads');
  const thumbnailDir = path.join(uploadDir, 'thumbnails');
  
  console.log('📂 Chemins calculés:');
  console.log('  Upload directory:', uploadDir);
  console.log('  Thumbnail directory:', thumbnailDir);
  console.log('');

  // 3. Vérification des dossiers
  console.log('📁 Vérification des dossiers:');
  
  try {
    const uploadExists = fs.existsSync(uploadDir);
    console.log(`  ${uploadDir}: ${uploadExists ? '✅ Existe' : '❌ N\'existe pas'}`);
    
    if (uploadExists) {
      const uploadStats = fs.statSync(uploadDir);
      console.log(`    - Permissions: ${uploadStats.mode.toString(8)}`);
      console.log(`    - Propriétaire: UID ${uploadStats.uid}, GID ${uploadStats.gid}`);
      console.log(`    - Modifié: ${uploadStats.mtime}`);
      
      // Tester l'écriture
      try {
        const testFile = path.join(uploadDir, 'test-write.txt');
        fs.writeFileSync(testFile, 'Test d\'écriture');
        fs.unlinkSync(testFile);
        console.log('    - ✅ Écriture: OK');
      } catch (writeError) {
        console.log('    - ❌ Écriture: ÉCHEC', writeError.message);
      }
    }
    
    const thumbnailExists = fs.existsSync(thumbnailDir);
    console.log(`  ${thumbnailDir}: ${thumbnailExists ? '✅ Existe' : '❌ N\'existe pas'}`);
    
    if (thumbnailExists) {
      const thumbnailStats = fs.statSync(thumbnailDir);
      console.log(`    - Permissions: ${thumbnailStats.mode.toString(8)}`);
      console.log(`    - Propriétaire: UID ${thumbnailStats.uid}, GID ${thumbnailStats.gid}`);
    }
  } catch (error) {
    console.log('❌ Erreur lors de la vérification des dossiers:', error.message);
  }
  
  console.log('');

  // 4. Contenu des dossiers
  console.log('📋 Contenu des dossiers:');
  
  try {
    if (fs.existsSync(uploadDir)) {
      const files = fs.readdirSync(uploadDir);
      console.log(`  Upload (${files.length} fichiers):`);
      files.slice(0, 10).forEach(file => {
        const filePath = path.join(uploadDir, file);
        const stats = fs.statSync(filePath);
        console.log(`    - ${file} (${stats.size} bytes, ${stats.mtime})`);
      });
      if (files.length > 10) {
        console.log(`    ... et ${files.length - 10} autres fichiers`);
      }
    }
    
    if (fs.existsSync(thumbnailDir)) {
      const thumbnails = fs.readdirSync(thumbnailDir);
      console.log(`  Thumbnails (${thumbnails.length} fichiers):`);
      thumbnails.slice(0, 10).forEach(file => {
        const filePath = path.join(thumbnailDir, file);
        const stats = fs.statSync(filePath);
        console.log(`    - ${file} (${stats.size} bytes, ${stats.mtime})`);
      });
      if (thumbnails.length > 10) {
        console.log(`    ... et ${thumbnails.length - 10} autres fichiers`);
      }
    }
  } catch (error) {
    console.log('❌ Erreur lors de la lecture du contenu:', error.message);
  }
  
  console.log('');

  // 5. Informations système
  console.log('💻 Informations système:');
  console.log('  Process UID:', process.getuid ? process.getuid() : 'Non disponible');
  console.log('  Process GID:', process.getgid ? process.getgid() : 'Non disponible');
  console.log('  Plateforme:', process.platform);
  console.log('  Architecture:', process.arch);
  console.log('  Version Node:', process.version);
  console.log('');

  // 6. Test de montage de disque (pour déploiement)
  console.log('💾 Test de montage de disque:');
  
  const mountPath = '/opt/project/src/backend/uploads';
  if (fs.existsSync(mountPath)) {
    console.log('  ✅ Disque monté à:', mountPath);
    try {
      const stats = fs.statSync(mountPath);
      console.log('    - Permissions:', stats.mode.toString(8));
      console.log('    - Type:', stats.isDirectory() ? 'Dossier' : 'Fichier');
      
      // Test d'écriture sur le disque
      try {
        const testFile = path.join(mountPath, 'test.txt');
        fs.writeFileSync(testFile, 'Test du disque');
        fs.unlinkSync(testFile);
        console.log('    - ✅ Écriture sur disque: OK');
      } catch (writeError) {
        console.log('    - ❌ Écriture sur disque: ÉCHEC', writeError.message);
      }
    } catch (error) {
      console.log('    - ❌ Erreur stats:', error.message);
    }
  } else {
    console.log('  ❌ Disque non monté à:', mountPath);
  }
  
  console.log('');
  console.log('=== FIN DU DIAGNOSTIC ===');
}

// Exporter la fonction pour l'utilisation dans d'autres scripts
module.exports = { diagnoseFilesystem };

// Exécuter le diagnostic si ce script est appelé directement
if (require.main === module) {
  diagnoseFilesystem().catch(console.error);
}