import EnglishDB from '../database/EnglishDB.js';

class WordService {
    constructor() {
        this.db = new EnglishDB();
        this.currentSessionId = null;
    }

    // === SERVICES DE MOTS ===

    /**
     * Obtenir des mots avec options de filtrage
     * @param {Object} options - Options de filtrage
     * @returns {Promise<Array>} Liste de mots
     */
    async getWords(options = {}) {
        try {
            return this.db.getWords(options);
        } catch (error) {
            console.error('Erreur lors de la récupération des mots:', error);
            return [];
        }
    }

    /**
     * Obtenir un mot aléatoire
     * @param {string} difficulty - Niveau de difficulté (optionnel)
     * @returns {Promise<Object>} Mot aléatoire
     */
    async getRandomWord(difficulty = null) {
        try {
            return this.db.getRandomWord(difficulty);
        } catch (error) {
            console.error('Erreur lors de la récupération du mot aléatoire:', error);
            return null;
        }
    }

    /**
     * Obtenir un mot par ID
     * @param {number} id - ID du mot
     * @returns {Promise<Object>} Mot
     */
    async getWordById(id) {
        try {
            return this.db.getWordById(id);
        } catch (error) {
            console.error('Erreur lors de la récupération du mot:', error);
            return null;
        }
    }

    /**
     * Rechercher des mots
     * @param {string} query - Terme de recherche
     * @param {Object} options - Options supplémentaires
     * @returns {Promise<Array>} Résultats de recherche
     */
    async searchWords(query, options = {}) {
        try {
            return this.db.getWords({
                ...options,
                search: query
            });
        } catch (error) {
            console.error('Erreur lors de la recherche:', error);
            return [];
        }
    }

    // === SERVICES DE PROGRESSION ===

    /**
     * Enregistrer une réponse
     * @param {number} wordId - ID du mot
     * @param {boolean} isCorrect - Réponse correcte ou non
     */
    async recordAnswer(wordId, isCorrect) {
        try {
            this.db.recordAnswer(wordId, isCorrect);
            return true;
        } catch (error) {
            console.error('Erreur lors de l\'enregistrement de la réponse:', error);
            return false;
        }
    }

    /**
     * Obtenir les statistiques de progression
     * @returns {Promise<Object>} Statistiques
     */
    async getProgressStats() {
        try {
            return this.db.getProgressStats();
        } catch (error) {
            console.error('Erreur lors de la récupération des statistiques:', error);
            return {
                total_words_studied: 0,
                words_learned: 0,
                success_rate: 0,
                mastered_words: 0
            };
        }
    }

    // === SERVICES DE SESSION ===

    /**
     * Démarrer une nouvelle session d'apprentissage
     * @param {string} sessionType - Type de session
     * @returns {Promise<number>} ID de la session
     */
    async startLearningSession(sessionType = 'flashcard') {
        try {
            this.currentSessionId = this.db.startSession(sessionType);
            return this.currentSessionId;
        } catch (error) {
            console.error('Erreur lors du démarrage de la session:', error);
            return null;
        }
    }

    /**
     * Terminer la session courante
     * @param {number} wordsStudied - Nombre de mots étudiés
     * @param {number} correctAnswers - Nombre de bonnes réponses
     * @param {number} totalQuestions - Nombre total de questions
     */
    async endLearningSession(wordsStudied, correctAnswers, totalQuestions) {
        try {
            if (this.currentSessionId) {
                this.db.endSession(this.currentSessionId, wordsStudied, correctAnswers, totalQuestions);
                this.currentSessionId = null;
            }
            return true;
        } catch (error) {
            console.error('Erreur lors de la fin de session:', error);
            return false;
        }
    }

    // === SERVICES UTILITAIRES ===

    /**
     * Obtenir le nombre total de mots
     * @param {Object} filters - Filtres optionnels
     * @returns {Promise<number>} Nombre de mots
     */
    async getWordsCount(filters = {}) {
        try {
            return this.db.getWordsCount(filters.difficulty, filters.category);
        } catch (error) {
            console.error('Erreur lors du comptage des mots:', error);
            return 0;
        }
    }

    /**
     * Obtenir les catégories disponibles
     * @returns {Promise<Array>} Liste des catégories
     */
    async getCategories() {
        // Pour l'instant, retourner les catégories statiques
        // Plus tard, on pourra les récupérer dynamiquement de la DB
        return [
            'daily-life',
            'food',
            'travel',
            'work',
            'emotions',
            'nature',
            'technology',
            'education',
            'greetings',
            'family',
            'transport',
            'house',
            'clothes',
            'weather',
            'colors',
            'body',
            'time'
        ];
    }

    /**
     * Obtenir les niveaux de difficulté
     * @returns {Promise<Array>} Liste des difficultés
     */
    async getDifficulties() {
        return ['beginner', 'intermediate', 'advanced'];
    }

    /**
     * Fermer la connexion à la base de données
     */
    close() {
        if (this.db) {
            this.db.close();
        }
    }
}

// Instance singleton pour l'application
let wordServiceInstance = null;

export const getWordService = () => {
    if (!wordServiceInstance) {
        wordServiceInstance = new WordService();
    }
    return wordServiceInstance;
};

export default WordService;
