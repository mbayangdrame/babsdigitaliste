#!/bin/bash

# Script de vérification du déploiement
# Ce script vérifie que tous les services fonctionnent correctement

set -e

echo "🔍 Vérification du déploiement de babsdigitaliste.com..."

# Configuration
REMOTE_HOST="babsdigitaliste.com"
REMOTE_USER="babsd2524861"

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 1. Vérifier l'accessibilité du site principal
print_status "Vérification de l'accessibilité du site principal..."
if curl -s -o /dev/null -w "%{http_code}" https://babsdigitaliste.com | grep -q "200"; then
    print_success "✅ Site principal accessible"
else
    print_error "❌ Site principal non accessible"
fi

# 2. Vérifier l'API backend
print_status "Vérification de l'API backend..."
API_RESPONSE=$(curl -s https://babsdigitaliste.com/api/health 2>/dev/null || echo "ERROR")
if echo "$API_RESPONSE" | grep -q "success"; then
    print_success "✅ API backend opérationnelle"
    echo "   Réponse: $(echo "$API_RESPONSE" | jq -r '.message' 2>/dev/null || echo "Données reçues")"
else
    print_error "❌ API backend non accessible"
    echo "   Réponse: $API_RESPONSE"
fi

# 3. Vérifier le statut du processus backend sur le serveur
print_status "Vérification du processus backend sur le serveur..."
BACKEND_STATUS=$(ssh $REMOTE_USER@$REMOTE_HOST 'pm2 status babsdigitaliste-backend --no-daemon 2>/dev/null || echo "NOT_FOUND"')
if echo "$BACKEND_STATUS" | grep -q "online"; then
    print_success "✅ Processus backend en cours d'exécution"
else
    print_error "❌ Processus backend non trouvé ou arrêté"
    echo "   Status: $BACKEND_STATUS"
fi

# 4. Vérifier la base de données (via script Node)
print_status "Vérification de la connexion à la base de données (Node)..."
DB_CHECK=$(ssh $REMOTE_USER@$REMOTE_HOST 'cd /backend && node -e "const db = require(\"./config/database\"); db.query(\"SELECT NOW()\").then(() => console.log(\"DB_OK\")).catch(e => console.log(\"DB_ERROR:\", e.message))" 2>/dev/null || echo "DB_CHECK_FAILED"')
if echo "$DB_CHECK" | grep -q "DB_OK"; then
    print_success "✅ Connexion à la base de données OK"
else
    print_error "❌ Problème de connexion à la base de données"
    echo "   Erreur: $DB_CHECK"
fi

# 5. Vérifier les logs récents
print_status "Vérification des logs récents du backend..."
RECENT_LOGS=$(ssh $REMOTE_USER@$REMOTE_HOST 'pm2 logs babsdigitaliste-backend --lines 10 --nostream 2>/dev/null || echo "NO_LOGS"')
if echo "$RECENT_LOGS" | grep -q "ERROR\|error"; then
    print_warning "⚠️  Erreurs détectées dans les logs récents"
    echo "   Derniers logs:"
    echo "$RECENT_LOGS" | tail -5
else
    print_success "✅ Aucune erreur récente dans les logs"
fi

# 6. Test de connexion CORS
print_status "Test de connexion CORS..."
CORS_TEST=$(curl -s -H "Origin: https://babsdigitaliste.com" -H "Access-Control-Request-Method: GET" -H "Access-Control-Request-Headers: Content-Type" -X OPTIONS https://babsdigitaliste.com/api/health 2>/dev/null || echo "CORS_ERROR")
if echo "$CORS_TEST" | grep -q "200\|204"; then
    print_success "✅ Configuration CORS correcte"
else
    print_error "❌ Problème de configuration CORS"
    echo "   Réponse: $CORS_TEST"
fi

echo ""
print_status "📋 Résumé de la vérification :"
echo "   • Site principal : https://babsdigitaliste.com"
echo "   • API backend : https://babsdigitaliste.com/api"
echo "   • Admin : https://babsdigitaliste.com/admin"
echo ""
echo "🔧 Commandes utiles en cas de problème :"
echo "   • Redémarrer le backend : ssh $REMOTE_USER@$REMOTE_HOST 'pm2 restart babsdigitaliste-backend'"
echo "   • Voir les logs : ssh $REMOTE_USER@$REMOTE_HOST 'pm2 logs babsdigitaliste-backend'"
echo "   • Status du serveur : ssh $REMOTE_USER@$REMOTE_HOST 'pm2 status'"
echo "   • Vérifier la base de données : ssh $REMOTE_USER@$REMOTE_HOST 'echo \"SELECT NOW();\" | psql "$SUPABASE_DB_URL"'"