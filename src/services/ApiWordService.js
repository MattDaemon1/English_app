// Service pour communiquer avec l'API backend
class ApiWordService {
    constructor() {
        this.baseUrl = 'http://localhost:3001/api';
    }

    // === MÉTHODES POUR LES MOTS ===

    async getAllWords(difficulty = 'all') {
        try {
            const params = new URLSearchParams();
            if (difficulty && difficulty !== 'all') {
                params.append('difficulty', difficulty);
            }
            
            const response = await fetch(`${this.baseUrl}/words?${params}`);
            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.error);
            }
            
            return result.data.map(word => this.formatWord(word));
        } catch (error) {
            console.error('Erreur lors de la récupération des mots:', error);
            return [];
        }
    }

    async getWordById(id) {
        try {
            const response = await fetch(`${this.baseUrl}/words/${id}`);
            const result = await response.json();
            
            if (!result.success) {
                return null;
            }
            
            return this.formatWord(result.data);
        } catch (error) {
            console.error('Erreur lors de la récupération du mot:', error);
            return null;
        }
    }

    async searchWords(query, difficulty = 'all') {
        try {
            const params = new URLSearchParams();
            params.append('search', query);
            if (difficulty && difficulty !== 'all') {
                params.append('difficulty', difficulty);
            }
            
            const response = await fetch(`${this.baseUrl}/words?${params}`);
            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.error);
            }
            
            return result.data.map(word => this.formatWord(word));
        } catch (error) {
            console.error('Erreur lors de la recherche:', error);
            return [];
        }
    }

    async getTotalWordsCount(difficulty = 'all') {
        try {
            const params = new URLSearchParams();
            if (difficulty && difficulty !== 'all') {
                params.append('difficulty', difficulty);
            }
            
            const response = await fetch(`${this.baseUrl}/words/count?${params}`);
            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.error);
            }
            
            return result.data.count;
        } catch (error) {
            console.error('Erreur lors du comptage des mots:', error);
            return 0;
        }
    }

    // === MÉTHODES POUR LE QUIZ ===

    async generateQuiz(difficulty = 'all', count = 10) {
        try {
            const response = await fetch(`${this.baseUrl}/quiz/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ difficulty, count })
            });
            
            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.error);
            }
            
            return result.data;
        } catch (error) {
            console.error('Erreur lors de la génération du quiz:', error);
            return null;
        }
    }

    // === MÉTHODES POUR LE PROGRÈS ===

    async updateUserProgress(wordId, knowsWord) {
        try {
            const response = await fetch(`${this.baseUrl}/progress`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ wordId, knowsWord })
            });
            
            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.error);
            }
            
            return result.data;
        } catch (error) {
            console.error('Erreur lors de la mise à jour du progrès:', error);
            return null;
        }
    }

    async getUserProgress(wordId = null) {
        try {
            const params = new URLSearchParams();
            if (wordId) {
                params.append('wordId', wordId);
            }
            
            const response = await fetch(`${this.baseUrl}/progress?${params}`);
            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.error);
            }
            
            return result.data;
        } catch (error) {
            console.error('Erreur lors de la récupération du progrès:', error);
            return wordId ? null : [];
        }
    }

    // === MÉTHODES POUR LES SESSIONS DE QUIZ ===

    async saveQuizSession(score, totalQuestions, difficulty, durationSeconds = null) {
        try {
            const response = await fetch(`${this.baseUrl}/quiz/session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ score, totalQuestions, difficulty, durationSeconds })
            });
            
            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.error);
            }
            
            return result.data;
        } catch (error) {
            console.error('Erreur lors de l\'enregistrement de la session:', error);
            return null;
        }
    }

    async saveQuizAnswer(sessionId, wordId, isCorrect, timeTakenSeconds = null) {
        try {
            const response = await fetch(`${this.baseUrl}/quiz/answer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sessionId, wordId, isCorrect, timeTakenSeconds })
            });
            
            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.error);
            }
            
            return result.data;
        } catch (error) {
            console.error('Erreur lors de l\'enregistrement de la réponse:', error);
            return null;
        }
    }

    // === MÉTHODES POUR LES STATISTIQUES ===

    async getStats() {
        try {
            const response = await fetch(`${this.baseUrl}/stats`);
            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.error);
            }
            
            return result.data;
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

    async getCategories() {
        try {
            const response = await fetch(`${this.baseUrl}/categories`);
            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.error);
            }
            
            return result.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des catégories:', error);
            return [];
        }
    }

    // === UTILITAIRES ===

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
}

// Instance singleton
let serviceInstance = null;

export function getApiService() {
    if (!serviceInstance) {
        serviceInstance = new ApiWordService();
    }
    return serviceInstance;
}

export default ApiWordService;
