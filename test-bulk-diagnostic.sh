#!/bin/bash

echo "🔍 Diagnostic du problème d'upload bulk"
echo "========================================"

# Configuration
API_URL="http://localhost:3001"
TOKEN=""

# Fonction pour afficher les résultats
show_result() {
    echo "📊 Résultat:"
    echo "$1" | jq '.' 2>/dev/null || echo "$1"
    echo ""
}

# Test 1: Vérifier la santé de l'API
echo "1️⃣ Test de santé de l'API..."
RESPONSE=$(curl -s "$API_URL/api/health")
show_result "$RESPONSE"

# Test 2: Test de diagnostic général
echo "2️⃣ Test de diagnostic général..."
RESPONSE=$(curl -s -X POST "$API_URL/api/images/bulk-test" \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}')
show_result "$RESPONSE"

# Test 3: Test de parsing JSON
echo "3️⃣ Test de parsing JSON..."
RESPONSE=$(curl -s -X POST "$API_URL/api/images/bulk-json-test" \
  -H "Content-Type: application/json" \
  -d '{"category_id": "1", "album_name": "test", "title": "test"}')
show_result "$RESPONSE"

# Test 4: Test avec données JSON malformées
echo "4️⃣ Test avec JSON malformé..."
RESPONSE=$(curl -s -X POST "$API_URL/api/images/bulk-json-test" \
  -H "Content-Type: application/json" \
  -d '{"category_id": "1", "album_name": "test", "title": "test",}')
show_result "$RESPONSE"

# Test 5: Test avec Content-Type incorrect
echo "5️⃣ Test avec Content-Type incorrect..."
RESPONSE=$(curl -s -X POST "$API_URL/api/images/bulk-json-test" \
  -H "Content-Type: text/plain" \
  -d '{"category_id": "1"}')
show_result "$RESPONSE"

echo "✅ Diagnostic terminé"
echo ""
echo "💡 Recommandations:"
echo "   - Pour l'upload de fichiers: utilisez multipart/form-data"
echo "   - Pour les données JSON: utilisez application/json"
echo "   - Ne mélangez pas les deux dans la même requête" 