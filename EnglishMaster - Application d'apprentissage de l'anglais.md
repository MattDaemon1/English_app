# EnglishMaster - Application d'apprentissage de l'anglais

## 📱 Description

EnglishMaster est une application web interactive conçue pour apprendre l'anglais facilement avec les mots les plus courants. L'application propose plusieurs types d'exercices pour un apprentissage rapide et efficace.

## ✨ Fonctionnalités

### 🎯 Types d'exercices
- **Flashcards** : Mémorisez les mots avec des cartes interactives
- **Quiz interactif** : Questions à choix multiples avec feedback immédiat
- **Conversation** : Pratiquez des dialogues du quotidien
- **Exercices d'écoute** : Améliorez votre compréhension orale

### 📊 Suivi de progression
- Système de points et achievements
- Statistiques de performance détaillées
- Sauvegarde automatique des progrès
- Analyse de la précision, vitesse, rétention et régularité

### 🎨 Interface utilisateur
- Design moderne et responsive (mobile-friendly)
- Interface simple et intuitive
- Animations fluides et feedback visuel
- Support de la synthèse vocale

### 📚 Base de données
- Plus de 40 mots anglais courants avec traductions
- Mots classés par difficulté (débutant, intermédiaire, avancé)
- Exemples d'usage et définitions
- Prononciation phonétique

## 🚀 Installation et utilisation

### Prérequis
- Node.js (version 18 ou supérieure)
- npm ou pnpm

### Installation locale

1. **Extraire le projet**
   ```bash
   tar -xzf english-learning-app.tar.gz
   cd english-learning-app
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   # ou
   pnpm install
   ```

3. **Lancer l'application en mode développement**
   ```bash
   npm run dev
   # ou
   pnpm run dev
   ```

4. **Ouvrir dans le navigateur**
   - Accédez à `http://localhost:5173`
   - L'application se recharge automatiquement lors des modifications

### Construction pour la production

```bash
npm run build
# ou
pnpm run build
```

Les fichiers de production seront générés dans le dossier `dist/`.

## 📁 Structure du projet

```
english-learning-app/
├── public/                 # Fichiers statiques
├── src/
│   ├── components/         # Composants UI (shadcn/ui)
│   ├── data/              # Données des mots et exercices
│   │   ├── words.js       # Base de mots principale
│   │   └── extendedWords.js # Mots supplémentaires
│   ├── hooks/             # Hooks React personnalisés
│   │   └── useLocalStorage.js # Gestion de la persistance
│   ├── utils/             # Utilitaires et logique métier
│   │   └── gameLogic.js   # Algorithmes d'apprentissage
│   ├── App.jsx            # Composant principal
│   ├── App.css            # Styles globaux
│   └── main.jsx           # Point d'entrée
├── package.json           # Dépendances et scripts
└── README.md             # Documentation
```

## 🎮 Guide d'utilisation

### 1. Flashcards
- Cliquez sur la carte pour révéler la traduction
- Utilisez le bouton "Écouter" pour entendre la prononciation
- Marquez les mots comme "Appris" une fois maîtrisés

### 2. Quiz
- Cliquez sur "Commencer le Quiz" pour générer des questions
- Choisissez la bonne traduction parmi les options
- Recevez un feedback immédiat avec explications

### 3. Conversation
- Suivez les dialogues étape par étape
- Écoutez la prononciation des phrases
- Pratiquez des scénarios réels (restaurant, hôtel, etc.)

### 4. Exercices d'écoute
- Cliquez sur "Écouter le mot"
- Tapez ce que vous entendez
- Utilisez les indices si nécessaire

### 5. Filtres et niveaux
- Sélectionnez votre niveau (débutant, intermédiaire, avancé)
- Filtrez par "Tous les niveaux" pour un mélange

## 🔧 Technologies utilisées

- **React 18** - Framework frontend
- **Vite** - Outil de build rapide
- **Tailwind CSS** - Framework CSS utilitaire
- **shadcn/ui** - Composants UI modernes
- **Lucide React** - Icônes
- **Web Speech API** - Synthèse vocale

## 📈 Fonctionnalités avancées

### Système de points
- Flashcards : +10 points
- Quiz : +15 points
- Conversation : +20 points
- Écoute : +25 points

### Achievements
- Premier mot appris
- 10 mots maîtrisés
- Score parfait
- Régularité d'étude

### Algorithmes d'apprentissage
- **Répétition espacée** : Les mots difficiles reviennent plus souvent
- **Génération adaptative** : Exercices personnalisés selon les performances
- **Analyse de performance** : Suivi détaillé des progrès

## 🎯 Améliorations possibles

### Fonctionnalités futures
1. **Base de données étendue** : Intégrer les 3000 mots complets
2. **Modes hors ligne** : Fonctionnement sans connexion internet
3. **Synchronisation cloud** : Sauvegarde des progrès en ligne
4. **Reconnaissance vocale** : Exercices de prononciation
5. **Gamification** : Défis quotidiens, classements
6. **Personnalisation** : Thèmes, vitesse d'apprentissage
7. **Statistiques avancées** : Graphiques de progression
8. **Mode sombre** : Interface adaptée à la luminosité

### Extensions techniques
1. **Application mobile native** : React Native ou Flutter
2. **Backend API** : Gestion des utilisateurs et synchronisation
3. **Intelligence artificielle** : Recommandations personnalisées
4. **Intégrations** : Dictionnaires, traducteurs externes

## 🐛 Dépannage

### Problèmes courants

**L'audio ne fonctionne pas**
- Vérifiez que votre navigateur supporte la Web Speech API
- Autorisez l'accès audio si demandé
- Testez avec un autre navigateur (Chrome recommandé)

**L'application ne se charge pas**
- Vérifiez que Node.js est installé
- Supprimez `node_modules` et réinstallez : `rm -rf node_modules && npm install`
- Vérifiez les erreurs dans la console du navigateur

**Les progrès ne se sauvegardent pas**
- Vérifiez que le localStorage est activé dans votre navigateur
- Évitez le mode navigation privée
- Videz le cache si nécessaire

## 📞 Support

Pour toute question ou suggestion d'amélioration :
- Consultez la documentation dans le code
- Vérifiez les commentaires dans les fichiers source
- Testez les différentes fonctionnalités étape par étape

## 📄 Licence

Ce projet est fourni à des fins éducatives et de démonstration.

---

**Bon apprentissage avec EnglishMaster ! 🚀📚**

