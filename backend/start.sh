#!/bin/bash

echo "🚀 Démarrage du backend Babs Digitaliste..."

# Aller dans le dossier du backend
cd /home/babsdigitaliste/backend

# Installer les dépendances si nécessaire
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install --production
fi

# Démarrer le serveur avec PM2
echo "🔄 Démarrage avec PM2..."
pm2 start server.js --name "babs-backend" --env production

echo "✅ Backend démarré avec PM2"
echo "📊 Statut: pm2 status"
echo "📋 Logs: pm2 logs babs-backend"
