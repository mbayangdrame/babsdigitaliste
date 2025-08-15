# Guide de Dépannage - Babs Digitaliste

## Erreur `ERR_CONNECTION_REFUSED`

### Symptômes
- Le site se charge mais les données ne s'affichent pas
- Erreur dans la console du navigateur : `Failed to load resource: net::ERR_CONNECTION_REFUSED`
- L'API backend n'est pas accessible

### Causes possibles

1. **URL de l'API incorrecte**
   - Le frontend essaie de se connecter à `localhost:3001` en production
   - Solution : L'URL s'adapte maintenant automatiquement

2. **Backend non démarré**
   - Le processus Node.js n'est pas en cours d'exécution
   - Solution : Redémarrer le backend

3. **Problème de configuration CORS**
   - Le serveur refuse les requêtes depuis le frontend
   - Solution : Vérifier la configuration CORS

4. **Problème de base de données**
   - La base de données n'est pas accessible
   - Solution : Vérifier la connexion MySQL

### Solutions

#### 1. Vérifier le statut du déploiement
```bash
./scripts/check-deployment.sh
```

#### 2. Redémarrer le backend
```bash
ssh babsd2524861@babsdigitaliste.com 'pm2 restart babsdigitaliste-backend'
```

#### 3. Vérifier les logs du backend
```bash
ssh babsd2524861@babsdigitaliste.com 'pm2 logs babsdigitaliste-backend'
```

#### 4. Vérifier la base de données
```bash
ssh babsd2524861@babsdigitaliste.com 'mysql -u babsd2524861 -p babsd2524861 -e "SHOW TABLES;"'
```

#### 5. Tester l'API manuellement
```bash
curl https://babsdigitaliste.com/api/health
```

### Configuration mise à jour

#### Frontend (src/services/api.ts)
- L'URL de l'API s'adapte automatiquement à l'environnement
- En local : `http://localhost:3001/api`
- En production : `https://babsdigitaliste.com/api`

#### Backend (server.js)
- Configuration CORS améliorée avec logs de débogage
- Routes de test ajoutées (`/api/health`, `/api/test`)
- Gestion des erreurs améliorée

#### Variables d'environnement
- `CORS_ORIGINS` : Origines autorisées pour CORS
- `NODE_ENV` : Environnement (production/development)
- `DB_*` : Configuration de la base de données

### Commandes utiles

#### Redéployer complètement
```bash
./deploy-production.sh
```

#### Vérifier le statut des services
```bash
ssh babsd2524861@babsdigitaliste.com 'pm2 status'
```

#### Voir les logs en temps réel
```bash
ssh babsd2524861@babsdigitaliste.com 'pm2 logs babsdigitaliste-backend --lines 50'
```

#### Redémarrer tous les services
```bash
ssh babsd2524861@babsdigitaliste.com 'pm2 restart all'
```

### Diagnostic étape par étape

1. **Vérifier l'accessibilité du site**
   ```bash
   curl -I https://babsdigitaliste.com
   ```

2. **Tester l'API backend**
   ```bash
   curl https://babsdigitaliste.com/api/health
   ```

3. **Vérifier les processus**
   ```bash
   ssh babsd2524861@babsdigitaliste.com 'ps aux | grep node'
   ```

4. **Vérifier les ports**
   ```bash
   ssh babsd2524861@babsdigitaliste.com 'netstat -tlnp | grep :3001'
   ```

5. **Vérifier les logs d'erreur**
   ```bash
   ssh babsd2524861@babsdigitaliste.com 'tail -f /var/log/nginx/error.log'
   ```

### Problèmes courants

#### Le backend ne démarre pas
- Vérifier les dépendances : `npm install --production`
- Vérifier les variables d'environnement
- Vérifier les permissions des fichiers

#### Erreurs de base de données
- Vérifier les identifiants de connexion
- Vérifier que MySQL est démarré
- Vérifier les permissions de l'utilisateur

#### Problèmes CORS
- Vérifier la configuration `CORS_ORIGINS`
- Vérifier que l'origine du frontend est incluse
- Vérifier les logs du backend pour les erreurs CORS

### Contact et support

En cas de problème persistant :
1. Exécuter le script de vérification
2. Collecter les logs d'erreur
3. Vérifier la configuration du serveur
4. Contacter l'administrateur système 