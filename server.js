import express from 'express';
import cors from 'cors';
import { getDatabase } from './src/database/database.js';

const app = express();
const port = 3001;
const db = getDatabase();

// Middleware
app.use(cors());
app.use(express.json());

// Routes API

// === ROUTES POUR LES MOTS ===

// GET /api/words - Récupérer tous les mots avec filtres
app.get('/api/words', async (req, res) => {
    try {
        const { difficulty, category, search, limit } = req.query;
        
        const filters = {};
        if (difficulty && difficulty !== 'all') filters.difficulty = difficulty;
        if (category) filters.category = category;
        if (search) filters.search = search;
        if (limit) filters.limit = parseInt(limit);

        const words = db.getWords(filters);
        res.json({ success: true, data: words });
    } catch (error) {
        console.error('Erreur API /words:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/words/count - Compter les mots
app.get('/api/words/count', async (req, res) => {
    try {
        const { difficulty } = req.query;
        const count = db.getTotalWordsCount(difficulty === 'all' ? null : difficulty);
        res.json({ success: true, data: { count } });
    } catch (error) {
        console.error('Erreur API /words/count:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/words/:id - Récupérer un mot par ID
app.get('/api/words/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const word = db.getWordById(parseInt(id));
        
        if (!word) {
            return res.status(404).json({ success: false, error: 'Mot non trouvé' });
        }
        
        res.json({ success: true, data: word });
    } catch (error) {
        console.error('Erreur API /words/:id:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST /api/quiz/generate - Générer un quiz
app.post('/api/quiz/generate', async (req, res) => {
    try {
        const { difficulty = 'all', count = 10 } = req.body;
        
        const words = db.getRandomWords(count, difficulty === 'all' ? null : difficulty);
        if (words.length === 0) {
            return res.status(404).json({ success: false, error: 'Aucun mot trouvé' });
        }

        const quizWord = words[0];
        const otherWords = db.getRandomWords(3, difficulty === 'all' ? null : difficulty);
        
        // Créer les choix de réponse
        const choices = [
            quizWord.translation,
            ...otherWords
                .filter(w => w.id !== quizWord.id)
                .slice(0, 3)
                .map(w => w.translation)
        ];

        // Mélanger les choix
        const shuffledChoices = shuffleArray([...choices]);
        const correctAnswer = shuffledChoices.indexOf(quizWord.translation);

        const quiz = {
            word: quizWord.word,
            pronunciation: quizWord.pronunciation,
            choices: shuffledChoices,
            correctAnswer: correctAnswer,
            wordId: quizWord.id
        };

        res.json({ success: true, data: quiz });
    } catch (error) {
        console.error('Erreur API /quiz/generate:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// === ROUTES POUR LE PROGRÈS ===

// POST /api/progress - Mettre à jour le progrès
app.post('/api/progress', async (req, res) => {
    try {
        const { wordId, knowsWord } = req.body;
        
        if (!wordId || typeof knowsWord !== 'boolean') {
            return res.status(400).json({ 
                success: false, 
                error: 'wordId et knowsWord sont requis' 
            });
        }

        const result = db.updateProgress(wordId, knowsWord);
        res.json({ success: true, data: result });
    } catch (error) {
        console.error('Erreur API /progress:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/progress - Récupérer le progrès
app.get('/api/progress', async (req, res) => {
    try {
        const { wordId } = req.query;
        
        const progress = wordId 
            ? db.getUserProgress(parseInt(wordId))
            : db.getUserProgress();
            
        res.json({ success: true, data: progress });
    } catch (error) {
        console.error('Erreur API /progress:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// === ROUTES POUR LES QUIZ ===

// POST /api/quiz/session - Enregistrer une session de quiz
app.post('/api/quiz/session', async (req, res) => {
    try {
        const { score, totalQuestions, difficulty, durationSeconds } = req.body;
        
        const result = db.saveQuizSession(score, totalQuestions, difficulty, durationSeconds);
        res.json({ success: true, data: { sessionId: result.lastInsertRowid } });
    } catch (error) {
        console.error('Erreur API /quiz/session:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST /api/quiz/answer - Enregistrer une réponse de quiz
app.post('/api/quiz/answer', async (req, res) => {
    try {
        const { sessionId, wordId, isCorrect, timeTakenSeconds } = req.body;
        
        const result = db.saveQuizAnswer(sessionId, wordId, isCorrect, timeTakenSeconds);
        res.json({ success: true, data: result });
    } catch (error) {
        console.error('Erreur API /quiz/answer:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// === ROUTES POUR LES STATISTIQUES ===

// GET /api/stats - Récupérer les statistiques
app.get('/api/stats', async (req, res) => {
    try {
        const quizStats = db.getQuizStats();
        const totalWords = db.getTotalWordsCount();
        const categories = db.getCategories();
        
        const stats = {
            totalWords,
            categories: categories.length,
            quizStats
        };
        
        res.json({ success: true, data: stats });
    } catch (error) {
        console.error('Erreur API /stats:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/categories - Récupérer les catégories
app.get('/api/categories', async (req, res) => {
    try {
        const categories = db.getCategories();
        res.json({ success: true, data: categories });
    } catch (error) {
        console.error('Erreur API /categories:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// === UTILITAIRES ===

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// === GESTION DES ERREURS ===

app.use((err, req, res, next) => {
    console.error('Erreur serveur:', err);
    res.status(500).json({ 
        success: false, 
        error: 'Erreur interne du serveur' 
    });
});

// === DÉMARRAGE DU SERVEUR ===

app.listen(port, () => {
    console.log(`🚀 Serveur API English App démarré sur http://localhost:${port}`);
    console.log(`📊 Base de données: ${db.getTotalWordsCount()} mots disponibles`);
});

export default app;
