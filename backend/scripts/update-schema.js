const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'babsdigitaliste_db',
  port: process.env.DB_PORT || 8888
};

async function updateSchema() {
  let connection;
  
  try {
    // Créer une connexion directe
    connection = await mysql.createConnection(dbConfig);

    console.log('Connexion à la base de données établie');

    // Vérifier si la colonne album_name existe
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'images' AND COLUMN_NAME = 'album_name'
    `, [dbConfig.database]);

    if (columns.length === 0) {
      // Ajouter la colonne album_name
      await connection.execute(`
        ALTER TABLE images 
        ADD COLUMN album_name VARCHAR(255) AFTER category_id
      `);
      console.log('✅ Colonne album_name ajoutée avec succès');
    } else {
      console.log('ℹ️ La colonne album_name existe déjà');
    }

    // Vérifier et créer l'index si nécessaire
    const [indexes] = await connection.execute(`
      SELECT INDEX_NAME 
      FROM INFORMATION_SCHEMA.STATISTICS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'images' AND INDEX_NAME = 'idx_images_album'
    `, [dbConfig.database]);

    if (indexes.length === 0) {
      await connection.execute(`
        CREATE INDEX idx_images_album ON images(album_name)
      `);
      console.log('✅ Index sur album_name créé avec succès');
    } else {
      console.log('ℹ️ L\'index sur album_name existe déjà');
    }

    console.log('✅ Mise à jour du schéma terminée avec succès');

  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour du schéma:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Connexion fermée');
    }
  }
}

// Exécuter le script
updateSchema(); 