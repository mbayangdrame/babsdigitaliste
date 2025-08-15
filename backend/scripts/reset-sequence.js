const pool = require('../config/database');

async function resetSequence() {
  try {
    console.log('🔄 Réinitialisation de la séquence d\'ID...');
    
    // 1. Vérifier l'ID maximum actuel
    const maxIdResult = await pool.query('SELECT MAX(id) as max_id FROM images');
    const maxId = maxIdResult.rows[0].max_id || 0;
    console.log(`📊 ID maximum actuel: ${maxId}`);
    
    // 2. Réinitialiser la séquence
    await pool.query(`ALTER SEQUENCE images_id_seq RESTART WITH ${maxId + 1}`);
    console.log(`✅ Séquence réinitialisée à ${maxId + 1}`);
    
    // 3. Vérifier la séquence
    const sequenceResult = await pool.query('SELECT last_value FROM images_id_seq');
    console.log(`📊 Valeur actuelle de la séquence: ${sequenceResult.rows[0].last_value}`);
    
    console.log('🎉 Séquence réinitialisée avec succès !');
    
  } catch (error) {
    console.error('❌ Erreur lors de la réinitialisation:', error);
  } finally {
    await pool.end();
  }
}

resetSequence(); 