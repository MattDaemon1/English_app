# EnglishMaster - Application d'apprentissage de l'anglais

## 📖 Description

EnglishMaster est une application web interactive conçue pour aider les francophones à apprendre l'anglais de manière ludique et efficace. L'application propose plusieurs modes d'exercices, un système de progression et des fonctionnalités avancées d'apprentissage.

## ✨ Fonctionnalités

### 🎯 Modes d'apprentissage
- **Flashcards** : Mémorisez les mots avec des cartes interactives
- **Quiz interactif** : Testez vos connaissances avec des questions à choix multiples
- **Conversations** : Pratiquez avec des dialogues du quotidien
- **Exercices d'écoute** : Améliorez votre compréhension orale

### 📊 Système de progression
- Suivi des mots appris
- Statistiques de performance détaillées
- Système de points et niveaux
- Achievements et récompenses
- Répétition espacée pour optimiser la mémorisation

### 🔧 Fonctionnalités avancées
- Synthèse vocale pour la prononciation
- Filtrage par niveau de difficulté
- Sauvegarde automatique des progrès
- Interface responsive et moderne
- Algorithmes d'apprentissage adaptatifs

## 🚀 Installation et lancement

### Prérequis
- Node.js (version 14 ou supérieure)
- npm ou yarn

### Installation

# Cloner le projet (si nécessaire)
cd english-learning-app

# Installer les dépendances
npm install

# Lancer l'application en mode développement
npm run dev


L'application sera accessible à l'adresse : `http://localhost:5173`

### Scripts disponibles
- `npm run dev` : Lance le serveur de développement
- `npm run build` : Compile l'application pour la production
- `npm run preview` : Prévisualise la version de production

## 📱 Utilisation

### 1. Démarrage
- Ouvrez l'application dans votre navigateur
- Choisissez votre niveau de difficulté (Débutant, Intermédiaire, Avancé)
- Sélectionnez un mode d'exercice

### 2. Flashcards
- Cliquez sur une carte pour révéler la traduction
- Utilisez les boutons pour écouter la prononciation
- Marquez les mots comme appris quand vous les maîtrisez

### 3. Quiz
- Cliquez sur "Commencer le Quiz" pour générer une question
- Sélectionnez la bonne traduction parmi les choix proposés
- Recevez un feedback immédiat avec explications

### 4. Conversations
- Suivez les dialogues étape par étape
- Écoutez la prononciation des phrases
- Pratiquez des situations du quotidien

### 5. Exercices d'écoute
- Cliquez pour écouter un mot
- Tapez ce que vous entendez
- Utilisez les indices si nécessaire

## 🏆 Système de progression

### Niveaux
- **Niveau 1 - Débutant** : 0-99 points
- **Niveau 2 - Apprenti** : 100-299 points
- **Niveau 3 - Intermédiaire** : 300-599 points
- **Niveau 4 - Avancé** : 600-999 points
- **Niveau 5 - Expert** : 1000+ points

### Achievements
- 🌟 **Premier mot** : Apprenez votre premier mot
- 📚 **Vocabulaire en croissance** : Apprenez 10 mots
- 🎯 **Perfection** : 100% de bonnes réponses sur 10 questions
- 🔥 **Régularité** : Étudiez 7 jours consécutifs
- 🗣️ **Maître de conversation** : Complétez 5 exercices de conversation

## 🛠️ Structure technique

### Technologies utilisées
- **React 18** : Framework JavaScript
- **Vite** : Outil de build moderne
- **Lucide React** : Icônes
- **LocalStorage** : Sauvegarde des progrès

### Architecture
```
src/
├── components/ui/     # Composants d'interface réutilisables
├── data/             # Données (mots, catégories)
├── hooks/            # Hooks React personnalisés
├── utils/            # Logique métier et algorithmes
├── App.jsx           # Composant principal
├── App.css           # Styles globaux
└── main.jsx          # Point d'entrée
```

### Algorithmes d'apprentissage
- **Répétition espacée** : Optimise les intervalles de révision
- **Analyse de performance** : Évalue précision, vitesse, rétention
- **Génération adaptative** : Ajuste la difficulté selon les progrès

## 📚 Base de données des mots

L'application contient actuellement 20 mots soigneusement sélectionnés avec :
- Traduction française
- Prononciation phonétique
- Définition
- Exemple d'usage
- Traduction de l'exemple
- Catégorie grammaticale
- Niveau de difficulté

### Catégories disponibles
- Salutations (greetings)
- Adjectifs (adjectives)
- Verbes (verbs)
- Relations (relationships)
- Concepts abstraits (abstract)
- Activités (activities)
- Émotions (emotions)
- Éducation (education)
- Personnalité (personality)
- Communication (communication)
- Nature (nature)
- Science (science)
- Temps (time)

## 🔄 Sauvegarde des progrès

Les données suivantes sont automatiquement sauvegardées :
- Mots appris
- Score total
- Nombre de réponses
- Série de jours consécutifs
- Achievements débloqués
- Temps d'étude

## 🎨 Personnalisation

Pour ajouter de nouveaux mots, modifiez le fichier `src/data/words.js` :

```javascript
{
  id: 21,
  word: "nouveau_mot",
  translation: "traduction",
  pronunciation: "/prononciation/",
  partOfSpeech: "noun|verb|adjective|...",
  definition: "Définition du mot",
  example: "Exemple en anglais",
  exampleTranslation: "Traduction de l'exemple",
  difficulty: "beginner|intermediate|advanced",
  category: "catégorie"
}
```

## 🐛 Dépannage

### L'application ne se lance pas
- Vérifiez que Node.js est installé : `node --version`
- Réinstallez les dépendances : `rm -rf node_modules package-lock.json && npm install`

### Problèmes de synthèse vocale
- Vérifiez que votre navigateur supporte l'API Speech Synthesis
- Testez avec un navigateur différent (Chrome recommandé)

### Perte des progrès
- Les données sont stockées dans le localStorage du navigateur
- Évitez de vider le cache ou utilisez le mode navigation privée

## 🤝 Contribution

Pour contribuer au projet :
1. Forkez le repository
2. Créez une branche pour votre fonctionnalité
3. Committez vos changements
4. Poussez vers la branche
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.

## 🙏 Remerciements

- Icônes fournies par [Lucide](https://lucide.dev/)
- Interface inspirée des meilleures pratiques UX/UI
- Algorithmes d'apprentissage basés sur la recherche en sciences cognitives

---

**Bon apprentissage ! 🚀📚**
