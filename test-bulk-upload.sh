#!/bin/bash

echo "🧪 Test de l'upload bulk pour Babs Digitaliste..."

# URL de l'API
API_URL="http://localhost:3001"

echo "📡 Test de la route bulk avec OPTIONS..."
curl -s -X OPTIONS "$API_URL/api/images/bulk" \
  -H "Origin: https://babsdigitaliste.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type,Authorization" \
  -v

echo ""
echo "🔍 Test de diagnostic bulk..."
curl -s -X POST "$API_URL/api/images/bulk-test" \
  -H "Origin: https://babsdigitaliste.com" \
  -H "Content-Type: application/json" \
  -d '{"test": "bulk_upload"}' | jq .

echo ""
echo "📊 Informations sur les limites..."
echo "   Taille max fichier: 25MB"
echo "   Nombre max fichiers: 10"
echo "   Timeout: 5 minutes"
echo "   Limite de taux: Désactivée pour les uploads"

echo ""
echo "✅ Tests terminés !"
echo "💡 Si les tests passent, essayez un upload avec des fichiers plus petits (max 5MB chacun)" 