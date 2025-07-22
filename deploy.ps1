# Script de déploiement Heroku pour Windows
Write-Host "🚀 Déploiement EnglishMaster sur Heroku" -ForegroundColor Green

# Vérifier si Heroku CLI est installé
try {
    heroku --version | Out-Null
    Write-Host "✅ Heroku CLI détecté" -ForegroundColor Green
}
catch {
    Write-Host "❌ Heroku CLI n'est pas installé. Installez-le depuis https://devcenter.heroku.com/articles/heroku-cli" -ForegroundColor Red
    exit 1
}

# Vérifier si on est connecté à Heroku
try {
    heroku auth:whoami | Out-Null
    Write-Host "✅ Connecté à Heroku" -ForegroundColor Green
}
catch {
    Write-Host "❌ Non connecté à Heroku. Exécutez 'heroku login' d'abord" -ForegroundColor Red
    exit 1
}

# Créer l'application Heroku (si elle n'existe pas)
Write-Host "📱 Création de l'application Heroku..." -ForegroundColor Yellow
try {
    heroku create englishmaster-app --region eu
}
catch {
    Write-Host "Application existe déjà" -ForegroundColor Yellow
}

# Configurer les variables d'environnement
Write-Host "⚙️ Configuration des variables d'environnement..." -ForegroundColor Yellow
heroku config:set NODE_ENV=production --app englishmaster-app

# Ajouter le remote git si nécessaire
$remotes = git remote
if ($remotes -notcontains "heroku") {
    heroku git:remote -a englishmaster-app
}

# Déployer
Write-Host "🚀 Déploiement en cours..." -ForegroundColor Yellow
git add .
try {
    git commit -m "Deploy to Heroku"
}
catch {
    Write-Host "Rien à commiter" -ForegroundColor Yellow
}
git push heroku master

Write-Host "✅ Déploiement terminé !" -ForegroundColor Green
Write-Host "🌐 Votre application est disponible sur : https://englishmaster-app.herokuapp.com" -ForegroundColor Cyan

# Ouvrir l'application
heroku open --app englishmaster-app
