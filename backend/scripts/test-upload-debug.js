const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const axios = require('axios');

async function testUploadDebug() {
  try {
    console.log('🧪 Test de diagnostic upload...');
    
    // 1. Authentification
    console.log('🔐 Authentification...');
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
      username: 'babs',
      password: 'bas'
    });
    
    if (!loginResponse.data.success) {
      console.error('❌ Échec de l\'authentification:', loginResponse.data.message);
      return;
    }
    
    console.log('✅ Authentification réussie');
    const token = loginResponse.data.token;
    
    // 2. Créer un fichier de test unique
    const timestamp = Date.now();
    const testImagePath = path.join(__dirname, '..', 'uploads', `test-debug-${timestamp}.jpg`);
    console.log('📝 Création d\'un fichier de test unique...');
    const testBuffer = Buffer.from(`fake image data for debug ${timestamp}`);
    fs.writeFileSync(testImagePath, testBuffer);
    
    // 3. Préparer FormData exactement comme le frontend
    console.log('📦 Préparation FormData...');
    const form = new FormData();
    
    // Ajouter les fichiers comme le frontend
    form.append('images', fs.createReadStream(testImagePath));
    
    // Ajouter les champs comme le frontend
    form.append('category_id', '1');
    form.append('album_name', 'test-debug');
    form.append('title', 'Test Debug');
    form.append('description', 'Test de diagnostic');
    // Ne pas envoyer event_date si vide
    
    console.log('📋 FormData préparé avec:');
    console.log('  - 1 fichier image');
    console.log('  - category_id: 1');
    console.log('  - album_name: test-debug');
    console.log('  - title: Test Debug');
    console.log('  - description: Test de diagnostic');
    
    // 4. Envoyer la requête
    console.log('📤 Envoi de la requête...');
    
    const uploadResponse = await axios.post('http://localhost:3001/api/images/bulk', form, {
      headers: {
        'Authorization': `Bearer ${token}`,
        ...form.getHeaders()
      },
      timeout: 300000 // 5 minutes
    });
    
    console.log('📊 Réponse reçue:');
    console.log('  - Status:', uploadResponse.status);
    console.log('  - Data:', uploadResponse.data);
    
    if (uploadResponse.data.success) {
      console.log('✅ Upload réussi !');
    } else {
      console.log('❌ Upload échoué:', uploadResponse.data.message);
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
    
    if (error.response) {
      console.error('📊 Statut de réponse:', error.response.status);
      console.error('📋 Headers de réponse:', error.response.headers);
      console.error('📦 Corps de réponse:', error.response.data);
    }
    
    if (error.request) {
      console.error('📡 Erreur de requête:', error.request);
    }
  }
}

testUploadDebug(); 