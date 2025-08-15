const bcrypt = require('bcryptjs');

async function generatePasswordHash() {
  const password = 'babs';
  const saltRounds = 10;
  
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    console.log('🔑 Hash généré pour le mot de passe "babs" :');
    console.log(hash);
    
    // Test de vérification
    const isValid = await bcrypt.compare(password, hash);
    console.log('✅ Vérification du hash :', isValid);
    
    return hash;
  } catch (error) {
    console.error('❌ Erreur lors de la génération du hash:', error);
  }
}

generatePasswordHash(); 