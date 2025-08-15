const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const axios = require('axios');

async function testBulkUpload() {
  try {
    console.log('🧪 Test de l\'upload bulk...');
    
    // 1. D'abord, obtenir un token d'authentification
    console.log('🔐 Authentification...');
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
      username: 'babs',
      password: 'bas'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const loginData = loginResponse.data;
    
    if (!loginData.success) {
      console.error('❌ Échec de l\'authentification:', loginData.message);
      console.error('📋 Réponse complète:', loginData);
      return;
    }
    
    console.log('✅ Authentification réussie');
    const token = loginData.token;
    
    // 2. Créer un fichier de test
    const testImagePath = path.join(__dirname, '..', 'uploads', 'test-image.jpg');
    if (!fs.existsSync(testImagePath)) {
      console.log('📝 Création d\'un fichier de test...');
      // Créer un fichier de test simple
      const testBuffer = Buffer.from('fake image data');
      fs.writeFileSync(testImagePath, testBuffer);
    }
    
    // 3. Préparer la requête multipart
    const form = new FormData();
    form.append('images', fs.createReadStream(testImagePath));
    form.append('category_id', '1');
    form.append('album_name', 'test-album');
    form.append('title', 'Test Image');
    form.append('description', 'Image de test pour diagnostic');
    
    console.log('📤 Envoi de la requête bulk upload...');
    
    try {
      const uploadResponse = await axios.post('http://localhost:3001/api/images/bulk', form, {
        headers: {
          'Authorization': `Bearer ${token}`,
          ...form.getHeaders()
        }
      });
      
      console.log('📊 Statut de la réponse:', uploadResponse.status);
      console.log('📋 Headers de réponse:', uploadResponse.headers);
      
      const uploadData = uploadResponse.data;
      console.log('📦 Corps de la réponse:', uploadData);
      
      if (uploadResponse.status === 200 || uploadResponse.status === 201) {
        console.log('✅ Upload réussi !');
      } else {
        console.log('❌ Upload échoué');
      }
    } catch (error) {
      console.log('❌ Erreur de requête:', error.response?.status);
      console.log('📋 Headers d\'erreur:', error.response?.headers);
      console.log('📦 Corps d\'erreur:', error.response?.data);
      throw error;
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
    if (error.response) {
      console.error('📊 Statut:', error.response.status);
      console.error('📋 Headers:', error.response.headers);
      console.error('📦 Corps:', error.response.data);
    }
  }
}

// Exécuter le test
testBulkUpload(); 