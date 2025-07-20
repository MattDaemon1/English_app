import Database from 'better-sqlite3';
import path from 'path';

class EnglishDatabase {
    constructor() {
        // Créer la base de données dans le dossier du projet
        const dbPath = path.join(process.cwd(), 'english-app.db');
        this.db = new Database(dbPath);

        // Activer les clés étrangères
        this.db.pragma('foreign_keys = ON');

        this.initializeTables();
    }

    initializeTables() {
        // Table des mots
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS words (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                word TEXT NOT NULL UNIQUE,
                translation TEXT NOT NULL,
                pronunciation TEXT,
                part_of_speech TEXT,
                definition TEXT,
                example TEXT,
                example_translation TEXT,
                difficulty TEXT DEFAULT 'beginner',
                category TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Table du progrès utilisateur
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS user_progress (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                word_id INTEGER NOT NULL,
                knows_word BOOLEAN DEFAULT 0,
                times_seen INTEGER DEFAULT 0,
                times_correct INTEGER DEFAULT 0,
                times_incorrect INTEGER DEFAULT 0,
                last_seen DATETIME DEFAULT CURRENT_TIMESTAMP,
                first_seen DATETIME DEFAULT CURRENT_TIMESTAMP,
                mastery_level INTEGER DEFAULT 0,
                FOREIGN KEY (word_id) REFERENCES words(id) ON DELETE CASCADE,
                UNIQUE(word_id)
            )
        `);

        // Table des sessions de quiz
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS quiz_sessions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                score INTEGER NOT NULL,
                total_questions INTEGER NOT NULL,
                difficulty TEXT,
                duration_seconds INTEGER,
                completed_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Table des détails de réponses de quiz
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS quiz_answers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id INTEGER NOT NULL,
                word_id INTEGER NOT NULL,
                is_correct BOOLEAN NOT NULL,
                time_taken_seconds INTEGER,
                answered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (session_id) REFERENCES quiz_sessions(id) ON DELETE CASCADE,
                FOREIGN KEY (word_id) REFERENCES words(id) ON DELETE CASCADE
            )
        `);

        // Index pour améliorer les performances
        this.db.exec(`
            CREATE INDEX IF NOT EXISTS idx_words_difficulty ON words(difficulty);
            CREATE INDEX IF NOT EXISTS idx_words_category ON words(category);
            CREATE INDEX IF NOT EXISTS idx_user_progress_word_id ON user_progress(word_id);
            CREATE INDEX IF NOT EXISTS idx_quiz_sessions_completed_at ON quiz_sessions(completed_at);
        `);
    }

    // === MÉTHODES POUR LES MOTS ===

    // Insérer un mot
    insertWord(wordData) {
        const stmt = this.db.prepare(`
            INSERT INTO words (word, translation, pronunciation, part_of_speech, definition, example, example_translation, difficulty, category)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        return stmt.run(
            wordData.word,
            wordData.translation,
            wordData.pronunciation,
            wordData.partOfSpeech,
            wordData.definition,
            wordData.example,
            wordData.exampleTranslation,
            wordData.difficulty,
            wordData.category
        );
    }

    // Récupérer tous les mots avec filtres
    getWords(filters = {}) {
        let query = 'SELECT * FROM words';
        const conditions = [];
        const params = [];

        if (filters.difficulty && filters.difficulty !== 'all') {
            conditions.push('difficulty = ?');
            params.push(filters.difficulty);
        }

        if (filters.category) {
            conditions.push('category = ?');
            params.push(filters.category);
        }

        if (filters.search) {
            conditions.push('(word LIKE ? OR translation LIKE ?)');
            params.push(`%${filters.search}%`, `%${filters.search}%`);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ' ORDER BY word ASC';

        if (filters.limit) {
            query += ' LIMIT ?';
            params.push(filters.limit);
        }

        const stmt = this.db.prepare(query);
        return stmt.all(...params);
    }

    // Récupérer un mot par ID
    getWordById(id) {
        const stmt = this.db.prepare('SELECT * FROM words WHERE id = ?');
        return stmt.get(id);
    }

    // Récupérer des mots aléatoires pour le quiz
    getRandomWords(count = 10, difficulty = null) {
        let query = 'SELECT * FROM words';
        const params = [];

        if (difficulty && difficulty !== 'all') {
            query += ' WHERE difficulty = ?';
            params.push(difficulty);
        }

        query += ' ORDER BY RANDOM() LIMIT ?';
        params.push(count);

        const stmt = this.db.prepare(query);
        return stmt.all(...params);
    }

    // === MÉTHODES POUR LE PROGRÈS ===

    // Enregistrer le progrès d'un mot
    updateProgress(wordId, knowsWord) {
        const stmt = this.db.prepare(`
            INSERT INTO user_progress (word_id, knows_word, times_seen, times_correct, times_incorrect, last_seen)
            VALUES (?, ?, 1, ?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(word_id) DO UPDATE SET
                knows_word = ?,
                times_seen = times_seen + 1,
                times_correct = times_correct + ?,
                times_incorrect = times_incorrect + ?,
                last_seen = CURRENT_TIMESTAMP,
                mastery_level = CASE 
                    WHEN times_correct >= 5 THEN 3
                    WHEN times_correct >= 3 THEN 2
                    WHEN times_correct >= 1 THEN 1
                    ELSE 0
                END
        `);

        const timesCorrect = knowsWord ? 1 : 0;
        const timesIncorrect = knowsWord ? 0 : 1;

        return stmt.run(wordId, knowsWord, timesCorrect, timesIncorrect, knowsWord, timesCorrect, timesIncorrect);
    }

    // Récupérer le progrès d'un utilisateur
    getUserProgress(wordId = null) {
        if (wordId) {
            const stmt = this.db.prepare(`
                SELECT up.*, w.word, w.translation 
                FROM user_progress up 
                JOIN words w ON up.word_id = w.id 
                WHERE up.word_id = ?
            `);
            return stmt.get(wordId);
        } else {
            const stmt = this.db.prepare(`
                SELECT up.*, w.word, w.translation 
                FROM user_progress up 
                JOIN words w ON up.word_id = w.id 
                ORDER BY up.last_seen DESC
            `);
            return stmt.all();
        }
    }

    // === MÉTHODES POUR LES QUIZ ===

    // Enregistrer une session de quiz
    saveQuizSession(score, totalQuestions, difficulty, durationSeconds = null) {
        const stmt = this.db.prepare(`
            INSERT INTO quiz_sessions (score, total_questions, difficulty, duration_seconds)
            VALUES (?, ?, ?, ?)
        `);

        return stmt.run(score, totalQuestions, difficulty, durationSeconds);
    }

    // Enregistrer une réponse de quiz
    saveQuizAnswer(sessionId, wordId, isCorrect, timeTakenSeconds = null) {
        const stmt = this.db.prepare(`
            INSERT INTO quiz_answers (session_id, word_id, is_correct, time_taken_seconds)
            VALUES (?, ?, ?, ?)
        `);

        return stmt.run(sessionId, wordId, isCorrect, timeTakenSeconds);
    }

    // Récupérer les statistiques de quiz
    getQuizStats() {
        const stmt = this.db.prepare(`
            SELECT 
                COUNT(*) as total_sessions,
                AVG(score) as average_score,
                MAX(score) as best_score,
                AVG(duration_seconds) as average_duration
            FROM quiz_sessions
        `);

        return stmt.get();
    }

    // === MÉTHODES UTILITAIRES ===

    // Compter le nombre total de mots
    getTotalWordsCount(difficulty = null) {
        let query = 'SELECT COUNT(*) as count FROM words';
        const params = [];

        if (difficulty && difficulty !== 'all') {
            query += ' WHERE difficulty = ?';
            params.push(difficulty);
        }

        const stmt = this.db.prepare(query);
        return stmt.get(...params).count;
    }

    // Récupérer les catégories disponibles
    getCategories() {
        const stmt = this.db.prepare('SELECT DISTINCT category FROM words WHERE category IS NOT NULL ORDER BY category');
        return stmt.all().map(row => row.category);
    }

    // Fermer la base de données
    close() {
        this.db.close();
    }

    // Méthode pour vider et réinitialiser la base
    reset() {
        this.db.exec('DELETE FROM quiz_answers');
        this.db.exec('DELETE FROM quiz_sessions');
        this.db.exec('DELETE FROM user_progress');
        this.db.exec('DELETE FROM words');
        console.log('🗑️ Base de données réinitialisée');
    }
}

// Instance singleton
let dbInstance = null;

export function getDatabase() {
    if (!dbInstance) {
        dbInstance = new EnglishDatabase();
    }
    return dbInstance;
}

export default EnglishDatabase;
