const { Pool } = require('pg');
require('dotenv').config();

console.log('📋 Liste des tables de la base de données...\n');

// Configuration de connexion à la base de données
const dbConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
    sslmode: 'require'
  }
};

async function listTables() {
  const pool = new Pool(dbConfig);
  
  try {
    console.log('🔌 Connexion à la base de données...');
    const client = await pool.connect();
    console.log('✅ Connexion réussie');
    
    // Lister toutes les tables
    console.log('\n📋 Tables disponibles:');
    const tablesResult = await client.query(`
      SELECT 
        table_name,
        table_type,
        (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
      FROM information_schema.tables t
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    if (tablesResult.rows.length > 0) {
      console.log(`✅ ${tablesResult.rows.length} table(s) trouvée(s):\n`);
      
      for (const table of tablesResult.rows) {
        console.log(`📊 Table: ${table.table_name}`);
        console.log(`   Type: ${table.table_type}`);
        console.log(`   Colonnes: ${table.column_count}`);
        
        // Afficher les colonnes de chaque table
        const columnsResult = await client.query(`
          SELECT 
            column_name,
            data_type,
            is_nullable,
            column_default
          FROM information_schema.columns 
          WHERE table_name = $1 
          ORDER BY ordinal_position
        `, [table.table_name]);
        
        console.log('   Colonnes:');
        columnsResult.rows.forEach(col => {
          const nullable = col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
          const defaultVal = col.column_default ? ` DEFAULT ${col.column_default}` : '';
          console.log(`     - ${col.column_name}: ${col.data_type} ${nullable}${defaultVal}`);
        });
        
        // Afficher le nombre de lignes
        try {
          const countResult = await client.query(`SELECT COUNT(*) as count FROM "${table.table_name}"`);
          console.log(`   Lignes: ${countResult.rows[0].count}`);
        } catch (error) {
          console.log(`   Lignes: Erreur lors du comptage`);
        }
        
        console.log('');
      }
    } else {
      console.log('❌ Aucune table trouvée');
    }
    
    // Afficher les données de la table admins
    console.log('\n👥 Données de la table admins:');
    const adminsResult = await client.query('SELECT * FROM admins ORDER BY id');
    
    if (adminsResult.rows.length > 0) {
      adminsResult.rows.forEach(admin => {
        console.log(`   ID: ${admin.id}`);
        console.log(`   Username: ${admin.username}`);
        console.log(`   Email: ${admin.email}`);
        console.log(`   Active: ${admin.is_active}`);
        console.log(`   Last Login: ${admin.last_login || 'Jamais'}`);
        console.log(`   Created: ${admin.created_at}`);
        console.log('');
      });
    } else {
      console.log('   Aucun admin trouvé');
    }
    
    // Afficher les données de la table users
    console.log('\n👤 Données de la table users:');
    const usersResult = await client.query('SELECT * FROM users ORDER BY id');
    
    if (usersResult.rows.length > 0) {
      usersResult.rows.forEach(user => {
        console.log(`   ID: ${user.id}`);
        console.log(`   Username: ${user.username}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Created: ${user.created_at}`);
        console.log('');
      });
    } else {
      console.log('   Aucun utilisateur trouvé');
    }
    
    client.release();
    await pool.end();
    
    console.log('🎉 Liste terminée !');
    
  } catch (error) {
    console.error('\n❌ Erreur lors de la liste des tables:', error.message);
    console.error('🔍 Code d\'erreur:', error.code);
    
    if (pool) {
      await pool.end();
    }
  }
}

// Exécuter le script
listTables(); 