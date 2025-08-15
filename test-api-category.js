const fetch = require('node-fetch');

async function testApi() {
    const url = 'https://babsdigitaliste.com/api/images/category/shooting';
    
    try {
        console.log('Test de l\'API:', url);
        
        const response = await fetch(url);
        
        console.log('Status:', response.status);
        console.log('Status Text:', response.statusText);
        console.log('Headers:', Object.fromEntries(response.headers.entries()));
        
        // Lire le contenu brut
        const rawText = await response.text();
        console.log('Contenu brut (premiers 500 caractères):', rawText.substring(0, 500));
        console.log('Longueur du contenu:', rawText.length);
        
        if (rawText.length === 0) {
            console.log('⚠️  La réponse est vide!');
            return;
        }
        
        // Essayer de parser le JSON
        try {
            const jsonData = JSON.parse(rawText);
            console.log('✅ JSON parsé avec succès:', JSON.stringify(jsonData, null, 2));
        } catch (parseError) {
            console.log('❌ Erreur de parsing JSON:', parseError.message);
            console.log('Premiers caractères:', rawText.substring(0, 100));
        }
        
    } catch (error) {
        console.error('❌ Erreur de requête:', error.message);
    }
}

testApi(); 