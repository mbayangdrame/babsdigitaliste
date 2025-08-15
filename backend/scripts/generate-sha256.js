const crypto = require('crypto');

function generateSHA256Hash(password) {
  const hash = crypto.createHash('sha256').update(password).digest('hex');
  console.log('🔑 Hash SHA-256 pour "' + password + '" :');
  console.log(hash);
  return hash;
}

// Générer le hash pour admin123
generateSHA256Hash('admin123');

// Générer le hash pour babs
generateSHA256Hash('babs'); 