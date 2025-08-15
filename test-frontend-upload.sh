#!/bin/bash

echo "🧪 Test de l'upload frontend après correction"
echo "============================================="

# Configuration
API_URL="http://localhost:3001"

# Test 1: Vérifier que l'API fonctionne
echo "1️⃣ Test de santé de l'API..."
RESPONSE=$(curl -s "$API_URL/api/health")
echo "📊 Résultat:"
echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
echo ""

# Test 2: Test d'authentification
echo "2️⃣ Test d'authentification..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username": "babs", "password": "bas"}')

echo "📊 Résultat de connexion:"
echo "$LOGIN_RESPONSE" | jq '.' 2>/dev/null || echo "$LOGIN_RESPONSE"

# Extraire le token si la connexion réussit
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token' 2>/dev/null)
if [ "$TOKEN" != "null" ] && [ "$TOKEN" != "" ]; then
  echo "✅ Token obtenu avec succès"
  echo ""
  
  # Test 3: Test d'upload avec un fichier de test
  echo "3️⃣ Test d'upload avec fichier..."
  
  # Créer un fichier de test temporaire
  echo "test image data" > test-upload.jpg
  
  UPLOAD_RESPONSE=$(curl -s -X POST "$API_URL/api/images/bulk" \
    -H "Authorization: Bearer $TOKEN" \
    -F "images=@test-upload.jpg" \
    -F "category_id=1" \
    -F "album_name=test-frontend" \
    -F "title=Test Frontend" \
    -F "description=Test après correction")
  
  echo "📊 Résultat d'upload:"
  echo "$UPLOAD_RESPONSE" | jq '.' 2>/dev/null || echo "$UPLOAD_RESPONSE"
  
  # Nettoyer le fichier de test
  rm -f test-upload.jpg
  
else
  echo "❌ Échec de l'authentification"
fi

echo ""
echo "✅ Test terminé"
echo ""
echo "💡 Si l'upload fonctionne maintenant, le problème était bien dans fetchWithCORS"
echo "🔧 La correction empêche maintenant de forcer Content-Type: application/json pour FormData" 