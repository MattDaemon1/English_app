# 🚀 Guide de Déploiement Heroku - EnglishMaster

## Prérequis

1. **Compte Heroku** : Créez un compte sur [heroku.com](https://heroku.com)
2. **Heroku CLI** : Installez depuis [devcenter.heroku.com](https://devcenter.heroku.com/articles/heroku-cli)
3. **Git** : Assurez-vous que Git est installé et configuré

## Installation Heroku CLI

### Windows
```powershell
# Téléchargez et installez depuis le site officiel
# Ou utilisez Chocolatey :
choco install heroku-cli
```

### macOS
```bash
brew tap heroku/brew && brew install heroku
```

### Linux
```bash
curl https://cli-assets.heroku.com/install.sh | sh
```

## Étapes de Déploiement

### 1. Connexion à Heroku
```bash
heroku login
```

### 2. Déploiement Automatique

#### Sur Windows (PowerShell)
```powershell
.\deploy.ps1
```

#### Sur macOS/Linux (Bash)
```bash
chmod +x deploy.sh
./deploy.sh
```

### 3. Déploiement Manuel

```bash
# Créer l'application Heroku
heroku create votre-nom-app --region eu

# Configurer les variables d'environnement
heroku config:set NODE_ENV=production

# Ajouter le remote Heroku
heroku git:remote -a votre-nom-app

# Déployer
git add .
git commit -m "Deploy to Heroku"
git push heroku master
```

## Structure de l'Application

L'application utilise :
- **Frontend** : React + Vite (build dans `/dist`)
- **Backend** : Node.js + Express (sert l'API et les fichiers statiques)
- **Base de données** : SQLite (incluse dans le déploiement)

## Configuration Heroku

### Fichiers de configuration créés :
- `Procfile` : Définit comment démarrer l'application
- `app.json` : Métadonnées de l'application
- `package.json` : Scripts modifiés pour Heroku

### Variables d'environnement :
- `NODE_ENV=production` : Mode production
- `PORT` : Port fourni automatiquement par Heroku

## Post-Déploiement

### Vérifier le déploiement
```bash
heroku logs --tail
heroku open
```

### Commandes utiles
```bash
# Voir les logs
heroku logs --tail

# Redémarrer l'application
heroku restart

# Voir l'état de l'application
heroku ps

# Ouvrir l'application
heroku open

# Variables d'environnement
heroku config
```

## Mise à jour de l'application

```bash
# Après vos modifications
git add .
git commit -m "Votre message de commit"
git push heroku master
```

## Domaine personnalisé (Optionnel)

```bash
# Ajouter un domaine personnalisé
heroku domains:add votredomaine.com

# Configurer le DNS
# Pointez votre domaine vers l'URL Heroku fournie
```

## Surveillance et Logs

```bash
# Logs en temps réel
heroku logs --tail

# Logs spécifiques
heroku logs --source app
heroku logs --source heroku

# Métriques
heroku ps:scale web=1
```

## Dépannage

### Problèmes courants :
1. **Build failed** : Vérifiez `package.json` et les dépendances
2. **Application crashed** : Consultez `heroku logs`
3. **Base de données** : SQLite est incluse, pas de configuration supplémentaire

### Support :
- Documentation Heroku : [devcenter.heroku.com](https://devcenter.heroku.com)
- Logs d'erreur : `heroku logs --tail`

## Coûts

- **Dyno eco** : Gratuit avec limitations (s'endort après 30min d'inactivité)
- **Dyno basic** : ~7$/mois pour un dyno toujours actif

---

🎯 **Votre application sera accessible à l'URL** : `https://votre-nom-app.herokuapp.com`
