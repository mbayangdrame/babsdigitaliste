const { Pool } = require('pg');
require('dotenv').config();

console.log('🔍 Vérification des utilisateurs admin...\n');

// Configuration de connexion à la base de données
const dbConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
    sslmode: 'require'
  }
};

async function checkAdminUsers() {
  const pool = new Pool(dbConfig);
  
  try {
    console.log('🔌 Connexion à la base de données...');
    const client = await pool.connect();
    console.log('✅ Connexion réussie');
    
    // Vérifier la table users
    console.log('\n📋 Vérification de la table users...');
    const usersResult = await client.query('SELECT * FROM users ORDER BY id');
    
    if (usersResult.rows.length > 0) {
      console.log(`✅ ${usersResult.rows.length} utilisateur(s) trouvé(s) dans la table users:`);
      usersResult.rows.forEach(user => {
        console.log(`   ID: ${user.id}, Username: ${user.username}, Email: ${user.email}, Role: ${user.role}`);
      });
    } else {
      console.log('❌ Aucun utilisateur trouvé dans la table users');
    }
    
    // Vérifier la table admins
    console.log('\n📋 Vérification de la table admins...');
    const adminsResult = await client.query('SELECT * FROM admins ORDER BY id');
    
    if (adminsResult.rows.length > 0) {
      console.log(`✅ ${adminsResult.rows.length} admin(s) trouvé(s) dans la table admins:`);
      adminsResult.rows.forEach(admin => {
        console.log(`   ID: ${admin.id}, Username: ${admin.username}, Email: ${admin.email}, Active: ${admin.is_active}`);
      });
    } else {
      console.log('❌ Aucun admin trouvé dans la table admins');
    }
    
    // Test de connexion avec l'utilisateur 'babs'
    console.log('\n🧪 Test de connexion avec l\'utilisateur "babs"...');
    const testUser = await client.query(
      'SELECT * FROM admins WHERE username = $1',
      ['babs']
    );
    
    if (testUser.rows.length > 0) {
      const user = testUser.rows[0];
      console.log('✅ Utilisateur "babs" trouvé:');
      console.log(`   ID: ${user.id}`);
      console.log(`   Username: ${user.username}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Password Hash: ${user.password_hash}`);
      console.log(`   Active: ${user.is_active}`);
      console.log(`   Last Login: ${user.last_login}`);
      
      // Test de connexion avec le mot de passe 'bas'
      const passwordMatch = (user.password_hash === 'bas');
      console.log(`\n🔐 Test de mot de passe: ${passwordMatch ? '✅ CORRECT' : '❌ INCORRECT'}`);
      
      if (!passwordMatch) {
        console.log('💡 Le mot de passe ne correspond pas. Mise à jour...');
        await client.query(
          'UPDATE admins SET password_hash = $1 WHERE username = $2',
          ['bas', 'babs']
        );
        console.log('✅ Mot de passe mis à jour');
      }
    } else {
      console.log('❌ Utilisateur "babs" non trouvé dans la table admins');
      
      // Créer l'utilisateur dans la table admins
      console.log('💡 Création de l\'utilisateur "babs" dans la table admins...');
      await client.query(
        'INSERT INTO admins (username, email, password_hash, is_active) VALUES ($1, $2, $3, $4)',
        ['babs', 'babs@babsdigitaliste.com', 'bas', true]
      );
      console.log('✅ Utilisateur "babs" créé dans la table admins');
    }
    
    client.release();
    await pool.end();
    
    console.log('\n🎉 Vérification terminée !');
    console.log('\n💡 Identifiants de connexion :');
    console.log('   Username: babs');
    console.log('   Password: bas');
    
  } catch (error) {
    console.error('\n❌ Erreur lors de la vérification:', error.message);
    console.error('🔍 Code d\'erreur:', error.code);
    
    if (pool) {
      await pool.end();
    }
  }
}

// Exécuter le script
checkAdminUsers(); 