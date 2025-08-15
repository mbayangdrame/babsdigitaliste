const axios = require('axios');

const API_BASE = process.env.API_BASE || (process.env.VITE_API_URL || 'http://localhost:3000/api');

async function testEndpoint(endpoint, method = 'GET') {
  try {
    console.log(`🔍 Test: ${method} ${endpoint}`);
    
    const response = await axios({
      method,
      url: `${API_BASE}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'API-Test-Script'
      }
    });
    
    console.log(`  Status: ${response.status} ${response.statusText}`);
    
    if (response.status >= 200 && response.status < 300) {
      const data = response.data;
      console.log(`  ✅ Succès: ${data.success ? 'Oui' : 'Non'}`);
      if (data.data) {
        console.log(`  📊 Données: ${Array.isArray(data.data) ? data.data.length + ' éléments' : 'Objet'}`);
      }
    } else {
      console.log(`  ❌ Erreur: ${response.status} ${response.statusText}`);
      console.log(`  📋 Détails: ${JSON.stringify(response.data).substring(0, 200)}...`);
    }
    
    console.log('');
    return response.status;
  } catch (error) {
    if (error.response) {
      console.log(`  ❌ Erreur: ${error.response.status} ${error.response.statusText}`);
      console.log(`  📋 Détails: ${JSON.stringify(error.response.data).substring(0, 200)}...`);
      console.log('');
      return error.response.status;
    } else {
      console.log(`  💥 Exception: ${error.message}`);
      console.log('');
      return 0;
    }
  }
}

async function testAllEndpoints() {
  console.log('🧪 === TEST DES ENDPOINTS API ===');
  console.log(`🌐 Base URL: ${API_BASE}`);
  console.log('');
  
  const endpoints = [
    '/images/test',
    '/images/categories',
    '/images/featured',
    '/images/albums',
    '/images/category/mariage',
    '/images/category/nature',
    '/health',
    '/test'
  ];
  
  const results = {};
  
  for (const endpoint of endpoints) {
    const status = await testEndpoint(endpoint);
    results[endpoint] = status;
    
    // Pause entre les requêtes pour éviter la surcharge
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('📊 === RÉSUMÉ DES TESTS ===');
  const errors = Object.entries(results).filter(([_, status]) => status >= 400);
  
  if (errors.length === 0) {
    console.log('✅ Tous les endpoints fonctionnent correctement');
  } else {
    console.log('❌ Endpoints avec erreurs:');
    errors.forEach(([endpoint, status]) => {
      console.log(`  - ${endpoint}: ${status}`);
    });
  }
  
  return results;
}

// Exporter la fonction pour l'utilisation dans d'autres scripts
module.exports = { testAllEndpoints, testEndpoint };

// Exécuter les tests si ce script est appelé directement
if (require.main === module) {
  testAllEndpoints()
    .then(() => {
      console.log('🎉 Tests terminés.');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Erreur lors des tests:', error);
      process.exit(1);
    });
} 