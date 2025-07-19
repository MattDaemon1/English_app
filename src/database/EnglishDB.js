import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuration du chemin de la base de données
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '../../englishmaster.db');

class EnglishDB {
    constructor() {
        this.db = new Database(dbPath);
        this.initDatabase();
    }

    initDatabase() {
        // Créer la table des mots
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS words (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                word TEXT UNIQUE NOT NULL,
                translation TEXT NOT NULL,
                pronunciation TEXT,
                part_of_speech TEXT,
                definition TEXT,
                example TEXT,
                example_translation TEXT,
                difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
                category TEXT,
                frequency_rank INTEGER DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Créer la table de progression utilisateur
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS user_progress (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                word_id INTEGER NOT NULL,
                learned BOOLEAN DEFAULT 0,
                attempts INTEGER DEFAULT 0,
                correct_answers INTEGER DEFAULT 0,
                last_seen DATETIME DEFAULT CURRENT_TIMESTAMP,
                mastery_level INTEGER DEFAULT 0, -- 0-5 niveau de maîtrise
                FOREIGN KEY (word_id) REFERENCES words(id) ON DELETE CASCADE
            );
        `);

        // Créer la table des sessions d'apprentissage
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS learning_sessions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                start_time DATETIME DEFAULT CURRENT_TIMESTAMP,
                end_time DATETIME,
                words_studied INTEGER DEFAULT 0,
                correct_answers INTEGER DEFAULT 0,
                total_questions INTEGER DEFAULT 0,
                session_type TEXT DEFAULT 'flashcard' -- flashcard, quiz, review
            );
        `);

        // Créer la table des catégories personnalisées
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS custom_categories (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT UNIQUE NOT NULL,
                description TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Index pour optimiser les requêtes
        this.db.exec(`
            CREATE INDEX IF NOT EXISTS idx_words_difficulty ON words(difficulty);
            CREATE INDEX IF NOT EXISTS idx_words_category ON words(category);
            CREATE INDEX IF NOT EXISTS idx_words_frequency ON words(frequency_rank);
            CREATE INDEX IF NOT EXISTS idx_progress_word ON user_progress(word_id);
            CREATE INDEX IF NOT EXISTS idx_progress_learned ON user_progress(learned);
        `);

        console.log('✅ Base de données initialisée avec succès');
    }

    // === OPÉRATIONS SUR LES MOTS ===

    // Ajouter un mot
    addWord(wordData) {
        const stmt = this.db.prepare(`
            INSERT INTO words (word, translation, pronunciation, part_of_speech, definition, example, example_translation, difficulty, category, frequency_rank)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        try {
            const result = stmt.run(
                wordData.word,
                wordData.translation,
                wordData.pronunciation || '',
                wordData.partOfSpeech || 'noun',
                wordData.definition || '',
                wordData.example || '',
                wordData.exampleTranslation || '',
                wordData.difficulty || 'beginner',
                wordData.category || 'daily-life',
                wordData.frequencyRank || 0
            );
            return result.lastInsertRowid;
        } catch (error) {
            console.error('Erreur lors de l\'ajout du mot:', error);
            return null;
        }
    }

    // Obtenir tous les mots avec pagination
    getWords(options = {}) {
        const {
            limit = 50,
            offset = 0,
            difficulty = null,
            category = null,
            search = null
        } = options;

        let query = 'SELECT * FROM words WHERE 1=1';
        const params = [];

        if (difficulty) {
            query += ' AND difficulty = ?';
            params.push(difficulty);
        }

        if (category) {
            query += ' AND category = ?';
            params.push(category);
        }

        if (search) {
            query += ' AND (word LIKE ? OR translation LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        query += ' ORDER BY frequency_rank ASC, word ASC LIMIT ? OFFSET ?';
        params.push(limit, offset);

        const stmt = this.db.prepare(query);
        return stmt.all(...params);
    }

    // Obtenir un mot par ID
    getWordById(id) {
        const stmt = this.db.prepare('SELECT * FROM words WHERE id = ?');
        return stmt.get(id);
    }

    // Obtenir un mot aléatoire
    getRandomWord(difficulty = null) {
        let query = 'SELECT * FROM words';
        const params = [];

        if (difficulty) {
            query += ' WHERE difficulty = ?';
            params.push(difficulty);
        }

        query += ' ORDER BY RANDOM() LIMIT 1';

        const stmt = this.db.prepare(query);
        return stmt.get(...params);
    }

    // === OPÉRATIONS SUR LA PROGRESSION ===

    // Enregistrer une réponse
    recordAnswer(wordId, isCorrect) {
        // Vérifier si le mot existe dans la progression
        let progressStmt = this.db.prepare('SELECT * FROM user_progress WHERE word_id = ?');
        let progress = progressStmt.get(wordId);

        if (!progress) {
            // Créer une nouvelle entrée de progression
            const insertStmt = this.db.prepare(`
                INSERT INTO user_progress (word_id, attempts, correct_answers, mastery_level)
                VALUES (?, 1, ?, 0)
            `);
            insertStmt.run(wordId, isCorrect ? 1 : 0);
        } else {
            // Mettre à jour la progression existante
            const newCorrectAnswers = progress.correct_answers + (isCorrect ? 1 : 0);
            const newAttempts = progress.attempts + 1;
            const successRate = newCorrectAnswers / newAttempts;

            // Calculer le niveau de maîtrise (0-5)
            let masteryLevel = 0;
            if (successRate >= 0.9 && newAttempts >= 5) masteryLevel = 5;
            else if (successRate >= 0.8 && newAttempts >= 3) masteryLevel = 4;
            else if (successRate >= 0.7 && newAttempts >= 3) masteryLevel = 3;
            else if (successRate >= 0.6 && newAttempts >= 2) masteryLevel = 2;
            else if (successRate >= 0.5 && newAttempts >= 2) masteryLevel = 1;

            const updateStmt = this.db.prepare(`
                UPDATE user_progress 
                SET attempts = ?, correct_answers = ?, mastery_level = ?, last_seen = CURRENT_TIMESTAMP
                WHERE word_id = ?
            `);
            updateStmt.run(newAttempts, newCorrectAnswers, masteryLevel, wordId);
        }
    }

    // Obtenir les statistiques de progression
    getProgressStats() {
        const stats = this.db.prepare(`
            SELECT 
                COUNT(*) as total_words_studied,
                SUM(CASE WHEN learned = 1 THEN 1 ELSE 0 END) as words_learned,
                AVG(CASE WHEN attempts > 0 THEN (correct_answers * 1.0 / attempts) ELSE 0 END) as success_rate,
                COUNT(CASE WHEN mastery_level >= 4 THEN 1 END) as mastered_words
            FROM user_progress
        `).get();

        return stats;
    }

    // === OPÉRATIONS SUR LES SESSIONS ===

    // Démarrer une session
    startSession(sessionType = 'flashcard') {
        const stmt = this.db.prepare(`
            INSERT INTO learning_sessions (session_type) VALUES (?)
        `);
        const result = stmt.run(sessionType);
        return result.lastInsertRowid;
    }

    // Terminer une session
    endSession(sessionId, wordsStudied, correctAnswers, totalQuestions) {
        const stmt = this.db.prepare(`
            UPDATE learning_sessions 
            SET end_time = CURRENT_TIMESTAMP, words_studied = ?, correct_answers = ?, total_questions = ?
            WHERE id = ?
        `);
        stmt.run(wordsStudied, correctAnswers, totalQuestions, sessionId);
    }

    // === UTILITAIRES ===

    // Obtenir le nombre total de mots
    getWordsCount(difficulty = null, category = null) {
        let query = 'SELECT COUNT(*) as count FROM words WHERE 1=1';
        const params = [];

        if (difficulty) {
            query += ' AND difficulty = ?';
            params.push(difficulty);
        }

        if (category) {
            query += ' AND category = ?';
            params.push(category);
        }

        const stmt = this.db.prepare(query);
        return stmt.get(...params).count;
    }

    // Fermer la connexion
    close() {
        this.db.close();
    }
}

export default EnglishDB;
