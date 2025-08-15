const { Pool } = require('pg');
require('dotenv').config();

console.log('🔧 Création d\'un utilisateur admin...\n');

// Configuration de connexion à la base de données
const dbConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
    sslmode: 'require'
  }
};

// Informations de l'utilisateur à créer
const userInfo = {
  username: 'babs',
  password: 'bas',
  email: 'babs@babsdigitaliste.com',
  role: 'admin'
};

async function createAdminUser() {
  const pool = new Pool(dbConfig);
  
  try {
    console.log('🔌 Connexion à la base de données...');
    const client = await pool.connect();
    console.log('✅ Connexion réussie');
    
    // Créer la table users si elle n'existe pas
    console.log('\n📋 Création/vérification de la table users...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE,
        role VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Table users créée/vérifiée');
    
    // Créer la table admins si elle n'existe pas (pour compatibilité)
    console.log('\n📋 Création/vérification de la table admins...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        last_login TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Table admins créée/vérifiée');
    
    // Vérifier si l'utilisateur existe déjà
    console.log('\n🔍 Vérification de l\'existence de l\'utilisateur...');
    const existingUser = await client.query(
      'SELECT * FROM users WHERE username = $1 OR email = $2',
      [userInfo.username, userInfo.email]
    );
    
    if (existingUser.rows.length > 0) {
      console.log('⚠️  Un utilisateur avec ce nom d\'utilisateur ou cet email existe déjà');
      console.log('💡 Suppression de l\'ancien utilisateur...');
      await client.query('DELETE FROM users WHERE username = $1', [userInfo.username]);
      await client.query('DELETE FROM admins WHERE username = $1', [userInfo.username]);
    }
    
    // Créer le nouvel utilisateur
    console.log(`\n👤 Création de l'utilisateur ${userInfo.username}...`);
    const userResult = await client.query(
      'INSERT INTO users (username, password, email, role) VALUES ($1, $2, $3, $4) RETURNING id',
      [userInfo.username, userInfo.password, userInfo.email, userInfo.role]
    );
    console.log('✅ Utilisateur créé dans la table users');
    
    // Créer l'utilisateur dans la table admins aussi (pour compatibilité)
    await client.query(
      'INSERT INTO admins (username, email, password_hash) VALUES ($1, $2, $3)',
      [userInfo.username, userInfo.email, userInfo.password]
    );
    console.log('✅ Utilisateur créé dans la table admins');
    
    // Vérifier que l'utilisateur a été créé
    const verifyUser = await client.query(
      'SELECT * FROM users WHERE username = $1',
      [userInfo.username]
    );
    
    if (verifyUser.rows.length > 0) {
      const user = verifyUser.rows[0];
      console.log('\n🎉 Utilisateur créé avec succès !');
      console.log('\n📋 Informations de connexion :');
      console.log(`   Username: ${user.username}`);
      console.log(`   Password: ${userInfo.password}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Créé le: ${user.created_at}`);
      
      console.log('\n🔗 Vous pouvez maintenant vous connecter à :');
      console.log('   https://babsdigitaliste.com/admin');
      console.log('   ou');
      console.log('   http://localhost:3000/admin');
      
      console.log('\n💡 Identifiants de connexion :');
      console.log(`   Nom d'utilisateur: ${userInfo.username}`);
      console.log(`   Mot de passe: ${userInfo.password}`);
    }
    
    client.release();
    await pool.end();
    
  } catch (error) {
    console.error('\n❌ Erreur lors de la création de l\'utilisateur:', error.message);
    console.error('🔍 Code d\'erreur:', error.code);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Vérifiez que la base de données est accessible');
    } else if (error.code === '28P01') {
      console.error('\n💡 Erreur d\'authentification à la base de données');
    } else if (error.code === '23505') {
      console.error('\n💡 L\'utilisateur existe déjà (contrainte unique)');
    }
    
    if (pool) {
      await pool.end();
    }
  }
}

// Exécuter le script
createAdminUser(); 