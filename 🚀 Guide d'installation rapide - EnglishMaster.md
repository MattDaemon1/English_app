# 🚀 Guide d'installation rapide - EnglishMaster

## Installation en 3 étapes

### 1. Prérequis
Assurez-vous d'avoir installé :
- **Node.js** (version 18+) : [Télécharger ici](https://nodejs.org/)
- **npm** (inclus avec Node.js)

### 2. Installation
```bash
# Extraire le projet
tar -xzf english-learning-app.tar.gz
cd english-learning-app

# Installer les dépendances
npm install

# Lancer l'application
npm run dev
```

### 3. Utilisation
- Ouvrez votre navigateur
- Allez sur `http://localhost:5173`
- Commencez à apprendre ! 🎉

## Commandes utiles

```bash
# Développement
npm run dev          # Lance le serveur de développement

# Production
npm run build        # Construit l'application pour la production
npm run preview      # Prévisualise la version de production

# Maintenance
npm install          # Installe/met à jour les dépendances
```

## Résolution de problèmes

**Erreur de port déjà utilisé ?**
```bash
# Arrêtez le processus existant ou changez de port
npm run dev -- --port 3000
```

**Erreurs de dépendances ?**
```bash
# Supprimez node_modules et réinstallez
rm -rf node_modules package-lock.json
npm install
```

**L'application ne se charge pas ?**
- Vérifiez que Node.js est bien installé : `node --version`
- Vérifiez les erreurs dans la console du navigateur (F12)
- Essayez un autre navigateur (Chrome recommandé)

## Support navigateurs

✅ **Recommandés :**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

⚠️ **Fonctionnalités limitées :**
- Internet Explorer (non supporté)
- Navigateurs très anciens

---

**Besoin d'aide ?** Consultez le README_EnglishMaster.md pour plus de détails !

