# Babs Digitaliste - Portfolio Photographique

Ce projet est un portfolio photographique avec un système d'administration pour gérer les images via une base de données MySQL.

## 🚀 Fonctionnalités

### Frontend (React + TypeScript)
- Portfolio photographique responsive
- Galerie d'images par catégories
- Animations avec Framer Motion
- Interface d'administration sécurisée
- Upload multiple d'images
- Gestion des images (ajout, suppression, modification)

### Backend (Node.js + Express)
- API REST sécurisée
- Authentification JWT
- Upload et gestion d'images
- Base de données MySQL
- Rate limiting et sécurité

## 📋 Prérequis

- Node.js (version 16 ou supérieure)
- MySQL (version 5.7 ou supérieure)
- npm ou yarn

## 🛠️ Installation

### 1. Cloner le projet
```bash
git clone <votre-repo>
cd babsdigitaliste
```

### 2. Configuration de la base de données

#### A. Créer la base de données MySQL
Connectez-vous à votre serveur MySQL (lwspanel) et exécutez le script SQL :

```sql
-- Créer la base de données
CREATE DATABASE IF NOT EXISTS babsdigitaliste_db;
USE babsdigitaliste_db;

-- Exécuter le contenu du fichier backend/database/schema.sql
```

#### B. Configurer les variables d'environnement
Créez un fichier `.env` dans le dossier `backend/` :

```env
# Configuration de la base de données MySQL
DB_HOST=votre_host_mysql
DB_USER=votre_username_mysql
DB_PASSWORD=votre_password_mysql
DB_NAME=babsdigitaliste_db
DB_PORT=3306

# Configuration du serveur
PORT=5000
NODE_ENV=production

# JWT Secret pour l'authentification
JWT_SECRET=votre_secret_jwt_tres_securise

# Configuration CORS
CORS_ORIGIN=https://votre-domaine.com

# Configuration du stockage des images
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760
```

### 3. Installation des dépendances

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
# Retourner à la racine du projet
cd ..
npm install
```

## 🚀 Démarrage

### 1. Démarrer le backend
```bash
cd backend
npm start
```

Le serveur backend sera accessible sur `http://localhost:5000`

### 2. Démarrer le frontend
```bash
# Dans un nouveau terminal
npm run dev
```

Le frontend sera accessible sur `http://localhost:3000`

## 🔐 Accès à l'administration

### Identifiants par défaut
- **URL d'administration** : `http://localhost:3000/admin`
- **Nom d'utilisateur** : `admin`
- **Mot de passe** : `admin123`

⚠️ **Important** : Changez ces identifiants par défaut en production !

## 📁 Structure du projet

```
babsdigitaliste/
├── backend/                 # API Backend
│   ├── config/             # Configuration base de données
│   ├── database/           # Schéma SQL
│   ├── middleware/         # Middlewares (auth, upload)
│   ├── routes/             # Routes API
│   ├── uploads/            # Images uploadées
│   ├── package.json
│   └── server.js
├── src/                    # Frontend React
│   ├── components/         # Composants React
│   ├── pages/             # Pages de l'application
│   ├── services/          # Services API
│   └── ...
├── public/                # Fichiers statiques
└── package.json
```

## 🔧 Configuration pour lwspanel

### 1. Configuration de la base de données
Dans votre panneau lwspanel :
1. Créez une base de données MySQL
2. Notez les informations de connexion
3. Mettez à jour le fichier `.env` avec ces informations

### 2. Configuration du serveur
Assurez-vous que votre hébergeur supporte :
- Node.js
- MySQL
- Upload de fichiers
- HTTPS (recommandé)

### 3. Variables d'environnement en production
```env
DB_HOST=votre_host_lwspanel
DB_USER=votre_user_lwspanel
DB_PASSWORD=votre_password_lwspanel
DB_NAME=votre_db_name
DB_PORT=3306
PORT=5000
NODE_ENV=production
JWT_SECRET=votre_secret_tres_securise
CORS_ORIGIN=https://votre-domaine.com
```

## 📸 Utilisation

### 1. Ajouter des images
1. Connectez-vous à l'interface d'administration
2. Sélectionnez une catégorie
3. Choisissez les images à uploader
4. Cliquez sur "Upload Images"

### 2. Gérer les images
- **Voir toutes les images** : Tableau dans l'admin
- **Supprimer une image** : Bouton "Supprimer" dans le tableau
- **Modifier les détails** : (Fonctionnalité à implémenter)

### 3. Catégories disponibles
- Nature
- Shooting
- Mariage
- Événement
- Politique
- Cultures
- Vidéos

## 🔒 Sécurité

- Authentification JWT
- Rate limiting
- Validation des fichiers uploadés
- Protection CORS
- Helmet.js pour la sécurité HTTP

## 🐛 Dépannage

### Problèmes courants

#### 1. Erreur de connexion à la base de données
- Vérifiez les informations de connexion dans `.env`
- Assurez-vous que MySQL est démarré
- Vérifiez les permissions utilisateur

#### 2. Erreur CORS
- Vérifiez la variable `CORS_ORIGIN` dans `.env`
- Assurez-vous que l'URL du frontend correspond

#### 3. Erreur d'upload
- Vérifiez les permissions du dossier `uploads/`
- Vérifiez la taille maximale des fichiers

#### 4. Images non affichées
- Vérifiez que le serveur backend sert les fichiers statiques
- Vérifiez les chemins d'accès aux images

## 📝 API Endpoints

### Public
- `GET /api/images/categories` - Liste des catégories
- `GET /api/images/category/:slug` - Images par catégorie
- `GET /api/images/featured` - Images en vedette

### Administration (protégé)
- `POST /api/auth/login` - Connexion admin
- `GET /api/images/admin/all` - Toutes les images
- `POST /api/images/bulk` - Upload multiple
- `DELETE /api/images/:id` - Supprimer une image
- `PUT /api/images/:id` - Modifier une image

## 🤝 Contribution

1. Fork le projet
2. Créez une branche pour votre fonctionnalité
3. Committez vos changements
4. Poussez vers la branche
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT.

## 📞 Support

Pour toute question ou problème :
- Créez une issue sur GitHub
- Contactez l'équipe de développement

---

**Babs Digitaliste** - Portfolio Photographique Professionnel 