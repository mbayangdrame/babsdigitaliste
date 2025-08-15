# Configuration pour lwspanel

Ce guide vous aide à déployer l'application Babs Digitaliste sur lwspanel.

## 🔧 Configuration de la base de données MySQL

### 1. Créer la base de données
1. Connectez-vous à votre panneau lwspanel
2. Allez dans la section "Bases de données"
3. Créez une nouvelle base de données MySQL
4. Notez les informations suivantes :
   - Nom de la base de données
   - Nom d'utilisateur
   - Mot de passe
   - Hôte (généralement localhost)

### 2. Initialiser la base de données
```bash
# Dans le dossier backend
npm run init-db
```

## 🌐 Configuration du serveur

### 1. Variables d'environnement
Créez un fichier `.env` dans le dossier `backend/` avec vos informations lwspanel :

```env
# Configuration lwspanel
DB_HOST=localhost
DB_USER=votre_username_lwspanel
DB_PASSWORD=votre_password_lwspanel
DB_NAME=votre_db_name_lwspanel
DB_PORT=3306

# Configuration serveur
PORT=5000
NODE_ENV=production

# JWT Secret (générez un secret sécurisé)
JWT_SECRET=votre_secret_tres_securise_ici

# CORS - Remplacez par votre domaine
CORS_ORIGIN=https://www.babsdigitaliste.com

# Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760
```

### 2. Configuration du domaine
1. Dans lwspanel, configurez votre domaine pour pointer vers le dossier du projet
2. Assurez-vous que Node.js est activé
3. Configurez le point d'entrée sur `backend/server.js`

### 3. Dossiers requis
Assurez-vous que ces dossiers existent et ont les bonnes permissions :
```bash
backend/uploads/
backend/uploads/thumbnails/
```

## 🚀 Déploiement

### 1. Upload des fichiers
1. Uploadez tous les fichiers du projet sur votre serveur lwspanel
2. Assurez-vous que la structure des dossiers est respectée

### 2. Installation des dépendances
```bash
# Dans le dossier backend
npm install --production

# Dans le dossier racine (frontend)
npm install --production
```

### 3. Build du frontend
```bash
npm run build
```

### 4. Démarrer l'application
```bash
# Démarrer le backend
cd backend
npm start

# Le frontend sera servi statiquement
```

## 🔐 Sécurité

### 1. Changer les identifiants par défaut
Après la première connexion, changez les identifiants admin :
- Username : `admin`
- Password : `admin123`

### 2. Configuration HTTPS
Activez HTTPS dans lwspanel pour sécuriser les communications.

### 3. Firewall
Configurez le firewall pour n'autoriser que les ports nécessaires.

## 📁 Structure sur le serveur

```
votre-domaine.com/
├── backend/
│   ├── uploads/
│   ├── node_modules/
│   ├── .env
│   └── server.js
├── dist/           # Build du frontend
├── public/
└── index.html
```

## 🔍 Vérification

### 1. Test de l'API
```bash
curl https://www.babsdigitaliste.com/api/health
```

### 2. Test de la base de données
Accédez à l'administration : `https://www.babsdigitaliste.com/admin`

### 3. Test d'upload
Essayez d'uploader une image via l'interface d'administration.

## 🐛 Dépannage lwspanel

### Problème : Erreur de connexion MySQL
- Vérifiez les informations de connexion dans `.env`
- Assurez-vous que l'utilisateur a les bonnes permissions

### Problème : Images non uploadées
- Vérifiez les permissions du dossier `uploads/`
- Vérifiez l'espace disque disponible

### Problème : CORS
- Vérifiez que `CORS_ORIGIN` correspond à votre domaine
- Assurez-vous que le protocole (http/https) correspond

### Problème : Port non accessible
- Vérifiez que le port 5000 est ouvert
- Configurez un proxy reverse si nécessaire

## 📞 Support lwspanel

Si vous rencontrez des problèmes spécifiques à lwspanel :
1. Consultez la documentation lwspanel
2. Contactez le support lwspanel
3. Vérifiez les logs d'erreur dans lwspanel

## 🔄 Mise à jour

Pour mettre à jour l'application :
1. Sauvegardez vos données
2. Uploadez les nouveaux fichiers
3. Redémarrez l'application
4. Testez les fonctionnalités

---

**Note** : Ce guide est spécifique à lwspanel. Adaptez-le selon votre configuration exacte. 