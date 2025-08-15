const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:3001/api';

async function testAPI() {
  console.log('🧪 Test des API...\n');

  try {
    // Test 1: Récupérer les catégories
    console.log('1️⃣ Test de récupération des catégories...');
    const categoriesResponse = await fetch(`${API_BASE_URL}/images/categories`);
    const categoriesData = await categoriesResponse.json();
    
    if (categoriesData.success) {
      console.log('✅ Catégories récupérées avec succès');
      console.log(`📊 Nombre de catégories: ${categoriesData.data.length}`);
      categoriesData.data.forEach(cat => {
        console.log(`   - ${cat.name} (${cat.slug}): ${cat.image_count} images`);
      });
    } else {
      console.log('❌ Erreur lors de la récupération des catégories:', categoriesData.message);
    }

    console.log('\n2️⃣ Test de récupération des images par catégorie...');
    const categoryResponse = await fetch(`${API_BASE_URL}/images/category/nature`);
    const categoryData = await categoryResponse.json();
    
    if (categoryData.success) {
      console.log('✅ Images de la catégorie "nature" récupérées avec succès');
      console.log(`📊 Nombre d'images: ${categoryData.data.length}`);
      if (categoryData.data.length > 0) {
        console.log('   Exemple d\'image:');
        const sampleImage = categoryData.data[0];
        console.log(`   - ID: ${sampleImage.id}`);
        console.log(`   - Titre: ${sampleImage.title}`);
        console.log(`   - Catégorie: ${sampleImage.category_name}`);
        console.log(`   - Album: ${sampleImage.album_name || 'Aucun'}`);
      }
    } else {
      console.log('❌ Erreur lors de la récupération des images:', categoryData.message);
    }

    console.log('\n3️⃣ Test de récupération des albums...');
    const albumsResponse = await fetch(`${API_BASE_URL}/images/albums`);
    const albumsData = await albumsResponse.json();
    
    if (albumsData.success) {
      console.log('✅ Albums récupérés avec succès');
      console.log(`📊 Nombre d'albums: ${albumsData.data.length}`);
      albumsData.data.forEach(album => {
        console.log(`   - ${album.album_name}: ${album.image_count} images`);
      });
    } else {
      console.log('❌ Erreur lors de la récupération des albums:', albumsData.message);
    }

    console.log('\n🎉 Tests terminés avec succès!');

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error);
  }
}

testAPI(); 