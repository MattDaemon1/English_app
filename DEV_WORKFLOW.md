# 🔄 Workflow de Développement Continu - EnglishMaster

Ce guide décrit comment utiliser le système de déploiement continu mis en place pour l'application EnglishMaster.

## 🚀 Commandes de Déploiement Rapide

### NPM Scripts

```bash
# Déploiement simple
npm run deploy

# Déploiement avec surveillance des logs
npm run deploy:watch

# Déploiement rapide avec message prédéfini
npm run quick-deploy

# Surveillance des logs Heroku
npm run logs

# Informations de l'application
npm run app:info

# Surveillance continue des fichiers pour auto-déploiement
npm run watch:deploy

# Développement complet avec surveillance
npm run dev:watch
```

### Scripts Directs

```bash
# Script Node.js (multiplateforme)
node dev-deploy.js deploy "Mon message de commit"
node dev-deploy.js deploy --monitor
node dev-deploy.js logs
node dev-deploy.js info

# Script PowerShell (Windows)
.\quick-deploy.ps1
.\quick-deploy.ps1 -Message "Nouvelle fonctionnalité"
.\quick-deploy.ps1 -Monitor
.\quick-deploy.ps1 -Force -Monitor
```

## 🔧 Modes de Développement

### 1. Développement Standard
```bash
# Terminal 1: API + Client
npm run dev:full

# Terminal 2: Déploiement manuel quand prêt
npm run deploy
```

### 2. Développement avec Surveillance
```bash
# Un seul terminal avec surveillance auto
npm run dev:watch
```
Cette commande lance :
- 🔵 **API** : Serveur Express sur port 3001
- 🟢 **CLIENT** : Vite dev server sur port 5173  
- 🟣 **WATCHER** : Surveillance des fichiers pour auto-déploiement

### 3. Déploiement Rapide
```bash
# Pour les petites corrections
npm run quick-deploy
```

## 📊 Surveillance et Monitoring

### Logs en Temps Réel
```bash
npm run logs
# ou
heroku logs --tail --app englishmaster-learning
```

### Status de l'Application
```bash
npm run app:info
# ou
heroku ps --app englishmaster-learning
```

### Redémarrage d'Urgence
```bash
heroku restart --app englishmaster-learning
```

## 🎯 Workflow Recommandé

### Pour le Développement de Fonctionnalités

1. **Démarrer l'environnement de développement**
   ```bash
   npm run dev:watch
   ```

2. **Développer votre fonctionnalité**
   - Modifiez vos fichiers
   - Testez localement sur http://localhost:5173
   - Le watcher détectera automatiquement les changements

3. **Déployer quand prêt**
   - Le watcher vous proposera de déployer
   - Tapez "d" + Entrée pour déployer
   - Ou ignorez et continuez le développement

### Pour les Corrections Rapides

1. **Correction directe**
   ```bash
   # Éditer le fichier nécessaire
   npm run quick-deploy
   ```

2. **Vérification**
   ```bash
   npm run logs
   ```

### Pour les Mises à Jour Importantes

1. **Tests locaux complets**
   ```bash
   npm run dev:full
   # Tester toutes les fonctionnalités
   ```

2. **Déploiement avec surveillance**
   ```bash
   npm run deploy:watch
   ```

3. **Monitoring post-déploiement**
   - Les logs s'affichent automatiquement
   - Vérifiez que l'application démarre correctement
   - Testez les fonctionnalités critiques

## 🛠️ Configuration Avancée

### Variables d'Environnement Heroku
```bash
# Lister les variables
heroku config --app englishmaster-learning

# Ajouter une variable
heroku config:set MA_VARIABLE=valeur --app englishmaster-learning
```

### Gestion des Branches
```bash
# Déployer depuis une autre branche
git push heroku ma-branche:master
```

### Rollback d'Urgence
```bash
# Revenir à la version précédente
heroku rollback --app englishmaster-learning
```

## 📝 Bonnes Pratiques

### Messages de Commit
- ✅ `"Ajout système de favoris"`
- ✅ `"Fix: correction bug audio"`
- ✅ `"UI: amélioration interface quiz"`
- ❌ `"update"` ou `"fix"`

### Fréquence de Déploiement
- **Corrections critiques** : Immédiatement
- **Nouvelles fonctionnalités** : Après tests locaux
- **Améliorations UI** : Grouper plusieurs changements

### Surveillance
- Surveillez toujours les logs après un déploiement important
- Vérifiez les métriques de performance
- Testez les fonctionnalités critiques

## 🚨 Dépannage

### Déploiement Échoué
```bash
# Voir les logs de build
heroku logs --source app --app englishmaster-learning

# Relancer le build
git commit --allow-empty -m "Trigger rebuild"
git push heroku master
```

### Application Crashée
```bash
# Voir les erreurs
heroku logs --tail --app englishmaster-learning

# Redémarrer
heroku restart --app englishmaster-learning
```

### Build Lent
```bash
# Nettoyer le cache Heroku
heroku repo:purge_cache --app englishmaster-learning
```

---

## 🌐 Liens Utiles

- **Application** : https://englishmaster-learning-34511c3cdb5b.herokuapp.com
- **Dashboard Heroku** : https://dashboard.heroku.com/apps/englishmaster-learning
- **Logs** : `npm run logs`
- **Status** : `npm run app:info`

---

**💡 Tip** : Gardez ce workflow ouvert dans un onglet pour référence rapide !
