@echo off
echo 🚀 Preparation du deploiement EnglishMaster sur Heroku

REM Verifier si Git est initialise
if not exist ".git" (
    echo 📁 Initialisation de Git...
    git init
    git branch -M master
)

REM Verifier le Heroku CLI
heroku --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Heroku CLI non trouve. Installez-le depuis https://devcenter.heroku.com/articles/heroku-cli
    pause
    exit /b 1
)

echo ✅ Heroku CLI detecte

REM Verifier la connexion Heroku
heroku auth:whoami >nul 2>&1
if errorlevel 1 (
    echo ❌ Non connecte a Heroku. Executez 'heroku login' d'abord
    pause
    exit /b 1
)

echo ✅ Connecte a Heroku

REM Tester la build
echo 🏗️ Test de la build locale...
call npm run build
if errorlevel 1 (
    echo ❌ Erreur lors de la build
    pause
    exit /b 1
)

echo ✅ Build reussie

REM Creer l'application Heroku
echo 📱 Creation de l'application Heroku...
heroku create englishmaster-learning --region eu 2>nul || echo Application existe deja

REM Configurer les variables d'environnement
echo ⚙️ Configuration des variables d'environnement...
heroku config:set NODE_ENV=production --app englishmaster-learning

REM Ajouter le remote Git
for /f %%i in ('git remote') do if "%%i"=="heroku" goto :remote_exists
heroku git:remote -a englishmaster-learning
:remote_exists

REM Deployer
echo 🚀 Deploiement en cours...
git add .
git commit -m "Deploy EnglishMaster to Heroku" 2>nul || echo Rien a commiter
git push heroku master

echo ✅ Deploiement termine !
echo 🌐 Application disponible sur : https://englishmaster-learning.herokuapp.com

REM Ouvrir l'application
heroku open --app englishmaster-learning

pause
