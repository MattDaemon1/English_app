// Algorithmes d'apprentissage et logique de jeu

export const difficultyLevels = {
  beginner: { name: 'Débutant', color: 'green', multiplier: 1 },
  intermediate: { name: 'Intermédiaire', color: 'yellow', multiplier: 1.5 },
  advanced: { name: 'Avancé', color: 'red', multiplier: 2 }
};

export const exerciseTypes = {
  flashcards: {
    name: 'Flashcards',
    description: 'Mémorisez les mots avec des cartes interactives',
    icon: '🃏',
    points: 10
  },
  quiz: {
    name: 'Quiz',
    description: 'Testez vos connaissances avec des questions',
    icon: '❓',
    points: 15
  },
  conversation: {
    name: 'Conversation',
    description: 'Pratiquez avec des dialogues réels',
    icon: '💬',
    points: 20
  },
  listening: {
    name: 'Écoute',
    description: 'Améliorez votre compréhension orale',
    icon: '👂',
    points: 25
  }
};

// Algorithme de répétition espacée (Spaced Repetition)
export class SpacedRepetition {
  constructor() {
    this.intervals = [1, 3, 7, 14, 30, 90]; // jours
  }

  // Calcule le prochain intervalle de révision
  getNextInterval(currentInterval, success) {
    const currentIndex = this.intervals.indexOf(currentInterval) || 0;

    if (success) {
      // Si réussi, passer au prochain intervalle
      return this.intervals[Math.min(currentIndex + 1, this.intervals.length - 1)];
    } else {
      // Si échoué, revenir au début ou réduire l'intervalle
      return this.intervals[Math.max(0, currentIndex - 1)];
    }
  }

  // Détermine si un mot doit être révisé
  shouldReview(lastReviewDate, interval) {
    if (!lastReviewDate) return true;

    const daysSinceReview = Math.floor(
      (new Date() - new Date(lastReviewDate)) / (1000 * 60 * 60 * 24)
    );

    return daysSinceReview >= interval;
  }
}

// Générateur d'exercices adaptatifs
export class ExerciseGenerator {
  constructor(words, userProgress) {
    this.words = words;
    this.userProgress = userProgress;
    this.spacedRepetition = new SpacedRepetition();
  }

  // Sélectionne les mots à réviser en priorité
  getWordsForReview() {
    return this.words.filter(word => {
      const wordProgress = this.userProgress.wordsLearned.find(w => w.id === word.id);
      if (!wordProgress) return true; // Nouveau mot

      return this.spacedRepetition.shouldReview(
        wordProgress.lastReview,
        wordProgress.interval || 1
      );
    });
  }

  // Génère un quiz à choix multiples
  generateMultipleChoice(word, options = 4) {
    const correctAnswer = word.translation;
    const wrongAnswers = this.words
      .filter(w => w.id !== word.id && w.translation !== correctAnswer)
      .map(w => w.translation)
      .sort(() => Math.random() - 0.5)
      .slice(0, options - 1);

    const allAnswers = [correctAnswer, ...wrongAnswers]
      .sort(() => Math.random() - 0.5);

    return {
      question: word.word,
      answers: allAnswers,
      correctAnswer: correctAnswer,
      explanation: word.definition,
      example: word.example
    };
  }

  // Génère un exercice de complétion
  generateFillInTheBlank(word) {
    const sentence = word.example;
    const wordToHide = word.word;
    const hiddenSentence = sentence.replace(
      new RegExp(wordToHide, 'gi'),
      '______'
    );

    return {
      sentence: hiddenSentence,
      correctAnswer: wordToHide,
      hint: word.translation,
      fullSentence: sentence
    };
  }

  // Génère un exercice d'association
  generateMatching(words, pairs = 5) {
    const selectedWords = words.slice(0, pairs);
    const englishWords = selectedWords.map(w => ({ id: w.id, text: w.word, type: 'english' }));
    const frenchWords = selectedWords.map(w => ({ id: w.id, text: w.translation, type: 'french' }));

    return {
      englishWords: englishWords.sort(() => Math.random() - 0.5),
      frenchWords: frenchWords.sort(() => Math.random() - 0.5),
      correctPairs: selectedWords.map(w => ({ english: w.word, french: w.translation }))
    };
  }

  // Génère un quiz complet avec plusieurs questions
  generateQuiz(words, numberOfQuestions = 10) {
    const selectedWords = words
      .sort(() => Math.random() - 0.5)
      .slice(0, numberOfQuestions);

    return selectedWords.map(word => {
      const wrongAnswers = words
        .filter(w => w.id !== word.id && w.translation !== word.translation)
        .map(w => w.translation)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      const allAnswers = [word.translation, ...wrongAnswers]
        .sort(() => Math.random() - 0.5);

      return {
        question: word.word,
        answers: allAnswers,
        correct: word.translation,
        explanation: word.definition,
        example: word.example
      };
    });
  }
}

// Système de points et achievements
export class AchievementSystem {
  constructor() {
    this.achievements = [
      {
        id: 'first_word',
        name: 'Premier mot',
        description: 'Apprenez votre premier mot',
        icon: '🌟',
        condition: (progress) => progress.wordsLearned.length >= 1,
        points: 50
      },
      {
        id: 'ten_words',
        name: 'Vocabulaire en croissance',
        description: 'Apprenez 10 mots',
        icon: '📚',
        condition: (progress) => progress.wordsLearned.length >= 10,
        points: 100
      },
      {
        id: 'perfect_score',
        name: 'Perfection',
        description: 'Obtenez 100% de bonnes réponses sur 10 questions',
        icon: '🎯',
        condition: (progress) => progress.totalAnswered >= 10 && (progress.totalScore / progress.totalAnswered) === 1,
        points: 200
      },
      {
        id: 'streak_week',
        name: 'Régularité',
        description: 'Étudiez 7 jours consécutifs',
        icon: '🔥',
        condition: (progress) => progress.streakDays >= 7,
        points: 150
      },
      {
        id: 'conversation_master',
        name: 'Maître de conversation',
        description: 'Complétez 5 exercices de conversation',
        icon: '🗣️',
        condition: (progress) => progress.conversationCompleted >= 5,
        points: 300
      }
    ];
  }

  checkAchievements(progress) {
    return this.achievements.filter(achievement =>
      !progress.achievements.includes(achievement.id) &&
      achievement.condition(progress)
    );
  }

  calculateLevel(totalPoints) {
    if (totalPoints < 100) return { level: 1, name: 'Débutant', nextLevel: 100 };
    if (totalPoints < 300) return { level: 2, name: 'Apprenti', nextLevel: 300 };
    if (totalPoints < 600) return { level: 3, name: 'Intermédiaire', nextLevel: 600 };
    if (totalPoints < 1000) return { level: 4, name: 'Avancé', nextLevel: 1000 };
    return { level: 5, name: 'Expert', nextLevel: null };
  }
}

// Générateur de conversations contextuelles
export class ConversationGenerator {
  constructor() {
    this.scenarios = [
      {
        id: 'restaurant',
        name: 'Au restaurant',
        context: 'Vous êtes dans un restaurant et voulez commander',
        difficulty: 'beginner',
        steps: [
          {
            speaker: 'waiter',
            english: 'Hello, welcome to our restaurant!',
            french: 'Bonjour, bienvenue dans notre restaurant !',
            audio: true
          },
          {
            speaker: 'customer',
            english: 'Thank you. Can I see the menu, please?',
            french: 'Merci. Puis-je voir le menu, s\'il vous plaît ?',
            userInput: true
          },
          {
            speaker: 'waiter',
            english: 'Of course! Here it is. What would you like to drink?',
            french: 'Bien sûr ! Le voici. Que souhaitez-vous boire ?',
            audio: true
          },
          {
            speaker: 'customer',
            english: 'I\'ll have a glass of water, please.',
            french: 'Je prendrai un verre d\'eau, s\'il vous plaît.',
            userInput: true
          }
        ]
      },
      {
        id: 'shopping',
        name: 'Faire du shopping',
        context: 'Vous cherchez des vêtements dans un magasin',
        difficulty: 'intermediate',
        steps: [
          {
            speaker: 'salesperson',
            english: 'Good afternoon! Can I help you find something?',
            french: 'Bon après-midi ! Puis-je vous aider à trouver quelque chose ?',
            audio: true
          },
          {
            speaker: 'customer',
            english: 'Yes, I\'m looking for a blue shirt.',
            french: 'Oui, je cherche une chemise bleue.',
            userInput: true
          },
          {
            speaker: 'salesperson',
            english: 'What size do you need?',
            french: 'Quelle taille vous faut-il ?',
            audio: true
          },
          {
            speaker: 'customer',
            english: 'Medium, please.',
            french: 'Taille moyenne, s\'il vous plaît.',
            userInput: true
          }
        ]
      }
    ];
  }

  getScenarioByDifficulty(difficulty) {
    return this.scenarios.filter(scenario => scenario.difficulty === difficulty);
  }

  getRandomScenario() {
    return this.scenarios[Math.floor(Math.random() * this.scenarios.length)];
  }
}

// Analyseur de performance
export class PerformanceAnalyzer {
  constructor() {
    this.metrics = {
      accuracy: 'Précision',
      speed: 'Vitesse',
      retention: 'Rétention',
      consistency: 'Régularité'
    };
  }

  analyzePerformance(progress, timeSpent) {
    const accuracy = progress.totalAnswered > 0 ?
      (progress.totalScore / progress.totalAnswered) * 100 : 0;

    const averageTimePerQuestion = timeSpent / Math.max(progress.totalAnswered, 1);
    const speed = this.calculateSpeedScore(averageTimePerQuestion);

    const retention = this.calculateRetentionScore(progress.wordsLearned);
    const consistency = this.calculateConsistencyScore(progress.streakDays);

    return {
      accuracy: Math.round(accuracy),
      speed: Math.round(speed),
      retention: Math.round(retention),
      consistency: Math.round(consistency),
      overall: Math.round((accuracy + speed + retention + consistency) / 4)
    };
  }

  calculateSpeedScore(averageTime) {
    // Score basé sur le temps moyen par question (en secondes)
    if (averageTime <= 5) return 100;
    if (averageTime <= 10) return 80;
    if (averageTime <= 15) return 60;
    if (averageTime <= 20) return 40;
    return 20;
  }

  calculateRetentionScore(wordsLearned) {
    // Score basé sur le nombre de mots appris et leur rétention
    const totalWords = wordsLearned.length;
    if (totalWords >= 50) return 100;
    if (totalWords >= 30) return 80;
    if (totalWords >= 15) return 60;
    if (totalWords >= 5) return 40;
    return totalWords * 8; // 8 points par mot pour les premiers mots
  }

  calculateConsistencyScore(streakDays) {
    // Score basé sur la régularité d'étude
    if (streakDays >= 30) return 100;
    if (streakDays >= 14) return 80;
    if (streakDays >= 7) return 60;
    if (streakDays >= 3) return 40;
    return streakDays * 10;
  }

  getRecommendations(performance) {
    const recommendations = [];

    if (performance.accuracy < 70) {
      recommendations.push({
        type: 'accuracy',
        message: 'Concentrez-vous sur la compréhension plutôt que la vitesse',
        action: 'Utilisez plus les flashcards pour mémoriser'
      });
    }

    if (performance.speed < 60) {
      recommendations.push({
        type: 'speed',
        message: 'Pratiquez plus régulièrement pour améliorer votre vitesse',
        action: 'Faites des exercices courts mais fréquents'
      });
    }

    if (performance.retention < 50) {
      recommendations.push({
        type: 'retention',
        message: 'Révisez les mots appris plus souvent',
        action: 'Utilisez la répétition espacée'
      });
    }

    if (performance.consistency < 40) {
      recommendations.push({
        type: 'consistency',
        message: 'Établissez une routine d\'étude quotidienne',
        action: 'Étudiez 10 minutes par jour minimum'
      });
    }

    return recommendations;
  }
}

