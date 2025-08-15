#!/bin/bash

echo "⏳ Attente du déploiement..."
echo "🔄 Vérification de la disponibilité de l'API..."

# Attendre que l'API soit disponible
for i in {1..30}; do
    echo "🔍 Tentative $i/30..."
    
    # Test de la route de santé
    response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/health)
    
    if [ "$response" = "200" ]; then
        echo "✅ API disponible !"
        break
    else
        echo "⏳ API pas encore prête (HTTP $response), attente..."
        sleep 10
    fi
done

echo "🧪 Test de l'upload après déploiement..."
cd backend && node scripts/test-upload-debug.js 