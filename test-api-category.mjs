import fetch from 'node-fetch';

// URL de base de l'API
const API_BASE_URL = process.env.API_BASE || 'http://localhost:3000/api';

async function testCategoryAPI() {
  console.log('🔍 Test de l\'API de catégories...\n');

  try {
    // Test 1: Récupérer toutes les catégories
    console.log('📋 Test 1: Récupération des catégories...');
    const categoriesResponse = await fetch(`${API_BASE_URL}/images/categories`);
    const categoriesData = await categoriesResponse.json();
    
    console.log('Status:', categoriesResponse.status);
    console.log('Catégories trouvées:', categoriesData.data?.length || 0);
    
    if (categoriesData.data && categoriesData.data.length > 0) {
      console.log('Catégories disponibles:');
      categoriesData.data.forEach(cat => {
        console.log(`  - ${cat.name} (${cat.slug}) - ${cat.image_count} images`);
      });
    } else {
      console.log('❌ Aucune catégorie trouvée');
    }
    console.log('');

    // Test 2: Tester chaque catégorie
    if (categoriesData.data && categoriesData.data.length > 0) {
      for (const category of categoriesData.data) {
        console.log(`📸 Test 2: Images pour la catégorie "${category.name}" (${category.slug})...`);
        
        const imagesResponse = await fetch(`${API_BASE_URL}/images/category/${category.slug}`);
        const imagesData = await imagesResponse.json();
        
        console.log('Status:', imagesResponse.status);
        console.log('Images trouvées:', imagesData.data?.length || 0);
        
        if (imagesData.data && imagesData.data.length > 0) {
          console.log('Première image:', {
            id: imagesData.data[0].id,
            title: imagesData.data[0].title,
            image_url: imagesData.data[0].image_url,
            thumbnail_url: imagesData.data[0].thumbnail_url
          });
        } else {
          console.log('❌ Aucune image trouvée pour cette catégorie');
        }
        console.log('');
      }
    }

    // Test 3: Tester une catégorie spécifique (nature)
    console.log('🌿 Test 3: Test spécifique de la catégorie "nature"...');
    const natureResponse = await fetch(`${API_BASE_URL}/images/category/nature`);
    const natureData = await natureResponse.json();
    
    console.log('Status:', natureResponse.status);
    console.log('Images trouvées:', natureData.data?.length || 0);
    
    if (natureData.data && natureData.data.length > 0) {
      console.log('Exemple d\'image:');
      console.log(JSON.stringify(natureData.data[0], null, 2));
    }
    console.log('');

    // Test 4: Vérifier la santé de l'API
    console.log('🏥 Test 4: Vérification de la santé de l\'API...');
    try {
      const healthResponse = await fetch(`${API_BASE_URL}/health`);
      const healthData = await healthResponse.json();
      console.log('Status:', healthResponse.status);
      console.log('Santé API:', healthData);
    } catch (error) {
      console.log('❌ Endpoint /health non disponible');
    }

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
  }
}

// Exécuter le test
testCategoryAPI(); 