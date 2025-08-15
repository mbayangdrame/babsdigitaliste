const fs = require('fs');
const path = require('path');

console.log('🔄 Début de la migration des uploads vers le stockage persistant...');

// Chemins source et destination
const sourceDir = path.join(__dirname, '..', 'uploads');
const persistentDir = process.env.UPLOAD_PATH || path.join(__dirname, '..', 'uploads');

console.log(`📂 Source: ${sourceDir}`);
console.log(`📂 Destination: ${persistentDir}`);

// Fonction pour copier récursivement un dossier
function copyDirectory(source, destination) {
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
    console.log(`📁 Dossier créé: ${destination}`);
  }

  const files = fs.readdirSync(source);
  
  for (const file of files) {
    const sourcePath = path.join(source, file);
    const destPath = path.join(destination, file);
    
    const stat = fs.statSync(sourcePath);
    
    if (stat.isDirectory()) {
      copyDirectory(sourcePath, destPath);
    } else {
      // Vérifier si le fichier existe déjà dans la destination
      if (!fs.existsSync(destPath)) {
        fs.copyFileSync(sourcePath, destPath);
        console.log(`📄 Fichier copié: ${file}`);
      } else {
        console.log(`⚠️  Fichier déjà existant, ignoré: ${file}`);
      }
    }
  }
}

// Fonction pour vérifier les fichiers existants
function checkExistingFiles() {
  console.log('\n📊 Statistiques des fichiers:');
  
  if (fs.existsSync(sourceDir)) {
    const sourceFiles = countFiles(sourceDir);
    console.log(`📂 Fichiers dans le dossier source: ${sourceFiles}`);
  } else {
    console.log('❌ Dossier source inexistant');
  }
  
  if (fs.existsSync(persistentDir)) {
    const persistentFiles = countFiles(persistentDir);
    console.log(`📂 Fichiers dans le dossier persistant: ${persistentFiles}`);
  } else {
    console.log('❌ Dossier persistant inexistant');
  }
}

function countFiles(dir) {
  let count = 0;
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      count += countFiles(filePath);
    } else {
      count++;
    }
  }
  
  return count;
}

// Exécution de la migration
try {
  checkExistingFiles();
  
  if (fs.existsSync(sourceDir) && sourceDir !== persistentDir) {
    console.log('\n🔄 Début de la copie...');
    copyDirectory(sourceDir, persistentDir);
    console.log('✅ Migration terminée avec succès!');
  } else {
    console.log('ℹ️  Aucune migration nécessaire (chemins identiques ou dossier source inexistant)');
  }
  
  checkExistingFiles();
  
} catch (error) {
  console.error('❌ Erreur lors de la migration:', error);
  process.exit(1);
} 