#!/bin/bash

echo "🔐 Test d'authentification pour Babs Digitaliste..."

# URL de l'API
API_URL="http://localhost:3001"

echo "📡 Test de la route de santé (sans auth)..."
curl -s -X GET "$API_URL/api/health" | jq .

echo ""
echo "🔍 Test de diagnostic bulk (sans auth)..."
curl -s -X POST "$API_URL/api/images/bulk-test" \
  -H "Content-Type: application/json" \
  -d '{"test": "bulk_upload"}' | jq .

echo ""
echo "🚫 Test bulk avec auth manquante (devrait échouer)..."
curl -s -X POST "$API_URL/api/images/bulk" \
  -H "Content-Type: application/json" \
  -d '{"test": "bulk_upload"}' | jq .

echo ""
echo "🔐 Test d'authentification (avec token invalide)..."
curl -s -X POST "$API_URL/api/images/bulk-auth-test" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer invalid_token" \
  -d '{"test": "auth"}' | jq .

echo ""
echo "📋 Instructions pour résoudre le problème :"
echo "1. Vérifiez que votre frontend envoie le token JWT"
echo "2. Le token doit être dans l'en-tête: Authorization: Bearer <token>"
echo "3. Le token doit être valide et non expiré"
echo "4. Testez d'abord la connexion avec /api/auth/login"

echo ""
echo "✅ Tests terminés !" 