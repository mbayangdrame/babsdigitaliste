const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 8889,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'babsdigitaliste'
};

async function addDateField() {
  let connection;
  
  try {
    console.log('🔗 Connexion à la base de données...');
    connection = await mysql.createConnection(dbConfig);
    
    console.log('✅ Connexion réussie');
    
    // Vérifier si le champ date existe déjà
    console.log('🔍 Vérification de la structure de la table images...');
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'images'
    `, [dbConfig.database]);
    
    const columnNames = columns.map(col => col.COLUMN_NAME);
    
    if (!columnNames.includes('event_date')) {
      console.log('➕ Ajout du champ event_date à la table images...');
      await connection.execute(`
        ALTER TABLE images 
        ADD COLUMN event_date DATE NULL
      `);
      console.log('✅ Champ event_date ajouté');
    } else {
      console.log('✅ Le champ event_date existe déjà');
    }
    
    // Afficher la structure finale de la table images
    console.log('\n📋 Structure finale de la table images:');
    const [imageColumns] = await connection.execute(`
      DESCRIBE images
    `);
    
    imageColumns.forEach(col => {
      console.log(`  - ${col.Field}: ${col.Type} ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });
    
    console.log('\n✅ Modification terminée avec succès !');
    console.log('📝 La table images a maintenant un champ event_date pour saisir les dates d\'événements');
    
  } catch (error) {
    console.error('❌ Erreur lors de la modification:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Connexion fermée');
    }
  }
}

// Exécuter le script
addDateField(); 