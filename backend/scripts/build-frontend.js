const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Début de la construction du frontend...');

try {
  // Aller au répertoire parent (racine du projet)
  const parentDir = path.join(__dirname, '../..');
  process.chdir(parentDir);
  
  console.log('📦 Installation des dépendances du frontend...');
  execSync('npm install', { stdio: 'inherit' });
  
  console.log('🔨 Construction du frontend...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Vérifier si le dossier dist existe
  const distPath = path.join(parentDir, 'dist');
  if (!fs.existsSync(distPath)) {
    throw new Error('Le dossier dist n\'existe pas après la construction');
  }
  
  // Copier le dossier dist vers backend
  const backendDistPath = path.join(__dirname, '../dist');
  
  // Supprimer l'ancien dossier dist s'il existe
  if (fs.existsSync(backendDistPath)) {
    console.log('🗑️ Suppression de l\'ancien dossier dist...');
    fs.rmSync(backendDistPath, { recursive: true, force: true });
  }
  
  console.log('📋 Copie des fichiers du frontend...');
  
  // Fonction récursive pour copier les dossiers
  function copyDir(src, dest) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      
      if (entry.isDirectory()) {
        copyDir(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
  
  copyDir(distPath, backendDistPath);
  
  console.log('✅ Frontend construit et copié avec succès !');
  console.log(`📁 Dossier de destination: ${backendDistPath}`);
  
} catch (error) {
  console.error('❌ Erreur lors de la construction du frontend:', error.message);
  process.exit(1);
} 