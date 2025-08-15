const { exec } = require('child_process');
const path = require('path');

async function runScript(scriptName, description) {
  return new Promise((resolve, reject) => {
    console.log(`\n🔄 ${description}...`);
    console.log(`📁 Exécution de: ${scriptName}`);
    
    const scriptPath = path.join(__dirname, scriptName);
    const child = exec(`node "${scriptPath}"`, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Erreur lors de l'exécution de ${scriptName}:`, error);
        reject(error);
        return;
      }
      
      if (stderr) {
        console.warn(`⚠️ Avertissements dans ${scriptName}:`, stderr);
      }
      
      console.log(`✅ ${description} terminé`);
      console.log(stdout);
      resolve();
    });
    
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
  });
}

async function setupComplete() {
  console.log('🚀 Démarrage de la configuration complète du système...\n');
  
  try {
    // 1. Mettre à jour la structure de la base de données
    await runScript('update-database-structure.js', 'Mise à jour de la structure de la base de données');
    
    // 2. Migrer les données existantes
    await runScript('migrate-data.js', 'Migration des données existantes');
    
    // 3. Tester les API
    await runScript('test-api.js', 'Test des API');
    
    console.log('\n🎉 Configuration complète terminée avec succès!');
    console.log('\n📋 Résumé des actions effectuées:');
    console.log('✅ Structure de la base de données mise à jour');
    console.log('✅ Catégories créées et configurées');
    console.log('✅ Données existantes migrées');
    console.log('✅ API testées et fonctionnelles');
    
    console.log('\n🔗 Votre système est maintenant prêt à être utilisé!');
    console.log('📱 Les catégories devraient maintenant apparaître dans le dashboard admin');
    console.log('🖼️ Les images peuvent maintenant être organisées par catégorie et album');
    
  } catch (error) {
    console.error('\n❌ Erreur lors de la configuration:', error);
    console.log('\n💡 Suggestions de dépannage:');
    console.log('1. Vérifiez que la base de données est accessible');
    console.log('2. Vérifiez les variables d\'environnement dans config/production.env');
    console.log('3. Assurez-vous que le serveur backend est démarré');
  }
}

setupComplete(); 