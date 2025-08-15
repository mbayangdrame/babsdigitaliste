// Script obsolète (MySQL) — désactivé depuis la migration vers PostgreSQL/Supabase
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function initializeDatabase() {
  console.log('🚀 Initialisation de la base de données...');

  console.log('⛔ Ce script était prévu pour MySQL. Utilisez init-postgres.js à la place.');
  return;

  let connection;

  try {
    // Intentionnellement vide

    // Intentionnellement vide

  } catch (error) {
    // Intentionnellement vide
  } finally {
    // Intentionnellement vide
  }
}

// Exécuter le script si appelé directement
if (require.main === module) {
  initializeDatabase();
}

module.exports = initializeDatabase; 