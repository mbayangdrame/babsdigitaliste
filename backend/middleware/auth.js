const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const pool = require('../config/database');

// Middleware pour vérifier le token JWT
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Token d\'accès requis' 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ 
      success: false, 
      message: 'Token invalide' 
    });
  }
};

// Fonction de connexion admin
const loginAdmin = async (username, password) => {
  try {
    console.log('🔍 Tentative de connexion pour:', username);
    
    const result = await pool.query(
      'SELECT * FROM admins WHERE username = $1 AND is_active = true',
      [username]
    );
    
    console.log('📋 Résultat de la requête:', result.rows.length, 'ligne(s) trouvée(s)');
    
    if (result.rows.length === 0) {
      console.log('❌ Aucun utilisateur trouvé avec ce nom d\'utilisateur');
      return { success: false, message: 'Identifiants invalides' };
    }

    const admin = result.rows[0];
    console.log('✅ Utilisateur trouvé:', admin.username);
    
    // Comparaison directe des mots de passe
    const isValidPassword = (password === admin.password_hash);
    console.log('🔐 Vérification du mot de passe:', isValidPassword ? 'CORRECT' : 'INCORRECT');

    if (!isValidPassword) {
      console.log('❌ Mot de passe incorrect');
      return { success: false, message: 'Identifiants invalides' };
    }

    // Mettre à jour la dernière connexion
    await pool.query(
      'UPDATE admins SET last_login = NOW() WHERE id = $1',
      [admin.id]
    );
    console.log('✅ Dernière connexion mise à jour');

    // Générer le token JWT
    const token = jwt.sign(
      { 
        id: admin.id, 
        username: admin.username, 
        email: admin.email 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    console.log('✅ Token JWT généré');

    return {
      success: true,
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email
      }
    };
  } catch (error) {
    console.error('❌ Erreur lors de la connexion:', error);
    return { success: false, message: 'Erreur serveur' };
  }
};

// Fonction pour créer un nouvel admin
const createAdmin = async (username, email, password) => {
  try {
    const result = await pool.query(
      'INSERT INTO admins (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id',
      [username, email, password]
    );

    return {
      success: true,
      adminId: result.rows[0].id,
      message: 'Administrateur créé avec succès'
    };
  } catch (error) {
    console.error('Erreur lors de la création de l\'admin:', error);
    return { success: false, message: 'Erreur lors de la création' };
  }
};

module.exports = {
  authenticateToken,
  loginAdmin,
  createAdmin
}; 