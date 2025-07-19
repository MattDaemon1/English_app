import { wordsData } from '../data/words.js';

// Service simulé pour la transition vers SQLite
export class MockWordService {
    constructor() {
        this.words = wordsData;
        this.progress = new Map(); // Simuler la progression en mémoire
    }

    async getWords(options = {}) {
        let filteredWords = [...this.words]; // Copie pour éviter de modifier l'original

        if (options.difficulty) {
            filteredWords = filteredWords.filter(word => word.difficulty === options.difficulty);
        }

        if (options.category) {
            filteredWords = filteredWords.filter(word => word.category === options.category);
        }

        if (options.search) {
            filteredWords = filteredWords.filter(word =>
                word.word.toLowerCase().includes(options.search.toLowerCase()) ||
                word.translation.toLowerCase().includes(options.search.toLowerCase())
            );
        }

        // Mélanger les mots dans le désordre
        for (let i = filteredWords.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [filteredWords[i], filteredWords[j]] = [filteredWords[j], filteredWords[i]];
        }

        const start = options.offset || 0;
        const end = start + (options.limit || 50);

        return filteredWords.slice(start, end);
    }

    async getQuizWords(difficulty, count = 10) {
        let filteredWords = [...this.words];

        if (difficulty && difficulty !== 'all') {
            filteredWords = filteredWords.filter(word => word.difficulty === difficulty);
        }

        // Mélanger les mots
        for (let i = filteredWords.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [filteredWords[i], filteredWords[j]] = [filteredWords[j], filteredWords[i]];
        }

        return filteredWords.slice(0, Math.min(count, filteredWords.length));
    }

    generateQuizOptions(correctWord, allWords, count = 4) {
        // Prendre des mots aléatoires différents du mot correct
        const otherWords = allWords.filter(w => w.id !== correctWord.id);
        const shuffledOthers = [...otherWords];

        for (let i = shuffledOthers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledOthers[i], shuffledOthers[j]] = [shuffledOthers[j], shuffledOthers[i]];
        }

        const options = [correctWord, ...shuffledOthers.slice(0, count - 1)];

        // Mélanger les options
        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
        }

        return options;
    }

    async getWordsCount(filters = {}) {
        let filteredWords = this.words;

        if (filters.difficulty) {
            filteredWords = filteredWords.filter(word => word.difficulty === filters.difficulty);
        }

        return filteredWords.length;
    }

    async getProgressStats() {
        const totalStudied = this.progress.size;
        const learned = Array.from(this.progress.values()).filter(p => p.learned).length;
        const totalAttempts = Array.from(this.progress.values()).reduce((sum, p) => sum + p.attempts, 0);
        const correctAnswers = Array.from(this.progress.values()).reduce((sum, p) => sum + p.correct, 0);

        return {
            total_words_studied: totalStudied,
            words_learned: learned,
            success_rate: totalAttempts > 0 ? correctAnswers / totalAttempts : 0,
            mastered_words: Array.from(this.progress.values()).filter(p => p.mastery >= 4).length
        };
    }

    async recordAnswer(wordId, isCorrect) {
        const current = this.progress.get(wordId) || { attempts: 0, correct: 0, learned: false, mastery: 0 };
        current.attempts++;
        if (isCorrect) current.correct++;
        current.mastery = Math.min(5, current.mastery + (isCorrect ? 1 : -1));
        current.learned = current.mastery >= 3;
        this.progress.set(wordId, current);
    }
}
