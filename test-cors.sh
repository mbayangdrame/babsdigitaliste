#!/bin/bash

echo "🧪 Test de la configuration CORS pour Babs Digitaliste..."

# URL de l'API
API_URL="http://localhost:3001"

echo "📡 Test de la route de santé..."
curl -s -X GET "$API_URL/api/health" \
  -H "Origin: https://babsdigitaliste.com" \
  -H "Content-Type: application/json" | jq .

echo ""
echo "🌐 Test CORS spécifique..."
curl -s -X GET "$API_URL/api/cors-test" \
  -H "Origin: https://babsdigitaliste.com" \
  -H "Content-Type: application/json" | jq .

echo ""
echo "🔍 Test OPTIONS (preflight)..."
curl -s -X OPTIONS "$API_URL/api/images/bulk" \
  -H "Origin: https://babsdigitaliste.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type,Authorization" \
  -v

echo ""
echo "✅ Tests terminés !" 