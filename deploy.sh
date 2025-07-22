#!/bin/bash

echo "🚀 Déploiement EnglishMaster sur Heroku"

# Vérifier si Heroku CLI est installé
if ! command -v heroku &> /dev/null; then
    echo "❌ Heroku CLI n'est pas installé. Installez-le depuis https://devcenter.heroku.com/articles/heroku-cli"
    exit 1
fi

# Vérifier si on est connecté à Heroku
if ! heroku auth:whoami &> /dev/null; then
    echo "❌ Non connecté à Heroku. Exécutez 'heroku login' d'abord"
    exit 1
fi

echo "✅ Heroku CLI détecté et connecté"

# Créer l'application Heroku (si elle n'existe pas)
echo "📱 Création de l'application Heroku..."
heroku create englishmaster-app --region eu || echo "Application existe déjà"

# Configurer les variables d'environnement
echo "⚙️ Configuration des variables d'environnement..."
heroku config:set NODE_ENV=production --app englishmaster-app

# Ajouter le remote git si nécessaire
if ! git remote | grep -q heroku; then
    heroku git:remote -a englishmaster-app
fi

# Déployer
echo "🚀 Déploiement en cours..."
git add .
git commit -m "Deploy to Heroku" || echo "Rien à commiter"
git push heroku master

echo "✅ Déploiement terminé !"
echo "🌐 Votre application est disponible sur : https://englishmaster-app.herokuapp.com"

# Ouvrir l'application
heroku open --app englishmaster-app
