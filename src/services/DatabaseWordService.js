import { getDatabase } from '../database/database.js';

class DatabaseWordService {
    constructor() {
        this.db = getDatabase();
    }

    // Récupérer tous les mots avec filtres
    async getAllWords(difficulty = 'all') {
        try {
            const filters = {};
            if (difficulty && difficulty !== 'all') {
                filters.difficulty = difficulty;
            }

            const words = this.db.getWords(filters);
            return words.map(word => this.formatWord(word));
        } catch (error) {
            console.error('Erreur lors de la récupération des mots:', error);
            return [];
        }
    }

    // Récupérer un mot par ID
    async getWordById(id) {
        try {
            const word = this.db.getWordById(id);
            return word ? this.formatWord(word) : null;
        } catch (error) {
            console.error('Erreur lors de la récupération du mot:', error);
            return null;
        }
    }

    // Rechercher des mots
    async searchWords(query, difficulty = 'all') {
        try {
            const filters = {
                search: query
            };
            if (difficulty && difficulty !== 'all') {
                filters.difficulty = difficulty;
            }

            const words = this.db.getWords(filters);
            return words.map(word => this.formatWord(word));
        } catch (error) {
            console.error('Erreur lors de la recherche:', error);
            return [];
        }
    }

    // Générer un quiz
    async generateQuiz(difficulty = 'all', count = 10) {
        try {
            const words = this.db.getRandomWords(count, difficulty);
            if (words.length === 0) {
                return null;
            }

            const quizWord = words[0];
            const otherWords = this.db.getRandomWords(3, difficulty);

            // Créer les choix de réponse
            const choices = [
                quizWord.translation,
                ...otherWords
                    .filter(w => w.id !== quizWord.id)
                    .slice(0, 3)
                    .map(w => w.translation)
            ];

            // Mélanger les choix
            const shuffledChoices = this.shuffleArray([...choices]);
            const correctAnswer = shuffledChoices.indexOf(quizWord.translation);

            return {
                word: quizWord.word,
                pronunciation: quizWord.pronunciation,
                choices: shuffledChoices,
                correctAnswer: correctAnswer,
                wordId: quizWord.id
            };
        } catch (error) {
            console.error('Erreur lors de la génération du quiz:', error);
            return null;
        }
    }

    // Enregistrer le progrès d'un utilisateur
    async updateUserProgress(wordId, knowsWord) {
        try {
            return this.db.updateProgress(wordId, knowsWord);
        } catch (error) {
            console.error('Erreur lors de la mise à jour du progrès:', error);
            return null;
        }
    }

    // Récupérer le progrès d'un utilisateur
    async getUserProgress(wordId = null) {
        try {
            return this.db.getUserProgress(wordId);
        } catch (error) {
            console.error('Erreur lors de la récupération du progrès:', error);
            return wordId ? null : [];
        }
    }

    // Enregistrer une session de quiz
    async saveQuizSession(score, totalQuestions, difficulty, durationSeconds = null) {
        try {
            return this.db.saveQuizSession(score, totalQuestions, difficulty, durationSeconds);
        } catch (error) {
            console.error('Erreur lors de l\'enregistrement de la session:', error);
            return null;
        }
    }

    // Enregistrer une réponse de quiz
    async saveQuizAnswer(sessionId, wordId, isCorrect, timeTakenSeconds = null) {
        try {
            return this.db.saveQuizAnswer(sessionId, wordId, isCorrect, timeTakenSeconds);
        } catch (error) {
            console.error('Erreur lors de l\'enregistrement de la réponse:', error);
            return null;
        }
    }

    // Récupérer les statistiques
    async getStats() {
        try {
            const quizStats = this.db.getQuizStats();
            const totalWords = this.db.getTotalWordsCount();
            const categories = this.db.getCategories();

            return {
                totalWords,
                categories: categories.length,
                quizStats
            };
        } catch (error) {
            console.error('Erreur lors de la récupération des statistiques:', error);
            return {
                totalWords: 0,
                categories: 0,
                quizStats: {
                    total_sessions: 0,
                    average_score: 0,
                    best_score: 0,
                    average_duration: 0
                }
            };
        }
    }

    // Récupérer le nombre total de mots
    async getTotalWordsCount(difficulty = 'all') {
        try {
            return this.db.getTotalWordsCount(difficulty === 'all' ? null : difficulty);
        } catch (error) {
            console.error('Erreur lors du comptage des mots:', error);
            return 0;
        }
    }

    // Récupérer les catégories disponibles
    async getCategories() {
        try {
            return this.db.getCategories();
        } catch (error) {
            console.error('Erreur lors de la récupération des catégories:', error);
            return [];
        }
    }

    // Utilitaires privées

    // Formater un mot pour l'interface
    formatWord(dbWord) {
        return {
            id: dbWord.id,
            word: dbWord.word,
            translation: dbWord.translation,
            pronunciation: dbWord.pronunciation,
            partOfSpeech: dbWord.part_of_speech,
            definition: dbWord.definition,
            example: dbWord.example,
            exampleTranslation: dbWord.example_translation,
            difficulty: dbWord.difficulty,
            category: dbWord.category
        };
    }

    // Mélanger un tableau
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
}

// Instance singleton
let serviceInstance = null;

export function getDatabaseService() {
    if (!serviceInstance) {
        serviceInstance = new DatabaseWordService();
    }
    return serviceInstance;
}

export default DatabaseWordService;
