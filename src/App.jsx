import { useState, useEffect } from 'react'
import { Badge } from './components/ui/badge.jsx'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card.jsx'
import { wordsData } from './data/words.js'

// Service simulé pour la transition vers SQLite
class MockWordService {
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

function App() {
    // États pour la gestion des mots et de l'application
    const [words, setWords] = useState([])
    const [currentWordIndex, setCurrentWordIndex] = useState(0)
    const [loading, setLoading] = useState(true)
    const [totalWords, setTotalWords] = useState(0)
    const [selectedDifficulty, setSelectedDifficulty] = useState('all')
    const [showAnswer, setShowAnswer] = useState(true) // Mode flashcard

    const wordService = new MockWordService()
    const currentWord = words[currentWordIndex]

    // Charger les mots depuis le service
    useEffect(() => {
        loadWords()
    }, [selectedDifficulty])

    const loadWords = async () => {
        setLoading(true)
        try {
            const options = {
                limit: 50,
                offset: 0,
                difficulty: selectedDifficulty === 'all' ? null : selectedDifficulty
            }

            const wordsData = await wordService.getWords(options)
            const count = await wordService.getWordsCount({
                difficulty: selectedDifficulty === 'all' ? null : selectedDifficulty
            })

            setWords(wordsData)
            setTotalWords(count)
            setCurrentWordIndex(0)
        } catch (error) {
            console.error('Erreur lors du chargement des mots:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleNext = () => {
        if (currentWordIndex < words.length - 1) {
            setCurrentWordIndex(currentWordIndex + 1)
            setShowAnswer(true)
        }
    }

    const handlePrevious = () => {
        if (currentWordIndex > 0) {
            setCurrentWordIndex(currentWordIndex - 1)
            setShowAnswer(true)
        }
    }

    const handleDifficultyChange = (difficulty) => {
        setSelectedDifficulty(difficulty)
    }

    const toggleAnswer = () => {
        setShowAnswer(!showAnswer)
    }

    const handleKnowAnswer = async (knows) => {
        handleNext()
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="text-2xl font-bold text-gray-700 mb-2">Chargement...</div>
                    <div className="text-gray-500">Préparation de vos mots</div>
                </div>
            </div>
        )
    }

    if (!currentWord) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="text-2xl font-bold text-gray-700 mb-2">Aucun mot trouvé</div>
                    <div className="text-gray-500">Essayez un autre filtre</div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto p-4 max-w-4xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        EnglishMaster
                    </h1>
                    <p className="text-gray-600">Apprenez l'anglais avec des flashcards interactives</p>
                    <Badge variant="outline" className="mt-2 border-gray-300 text-gray-700">
                        v2.0 - {totalWords} mots disponibles
                    </Badge>
                </div>

                {/* Filtres de difficulté */}
                <div className="flex justify-center gap-2 mb-6">
                    {[
                        { key: 'all', label: 'Tous' },
                        { key: 'beginner', label: 'Débutant' },
                        { key: 'intermediate', label: 'Intermédiaire' },
                        { key: 'advanced', label: 'Avancé' }
                    ].map((level) => (
                        <button
                            key={level.key}
                            onClick={() => handleDifficultyChange(level.key)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedDifficulty === level.key
                                ? 'bg-gray-800 text-white'
                                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                }`}
                        >
                            {level.label}
                        </button>
                    ))}
                </div>

                {/* Flashcard */}
                <Card className="mb-6 max-w-lg mx-auto border-gray-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-center text-3xl font-bold text-gray-900">
                            {currentWord.word}
                        </CardTitle>
                        <div className="text-center text-sm text-gray-500 italic">
                            {currentWord.pronunciation}
                        </div>
                    </CardHeader>
                    <CardContent>
                        {showAnswer ? (
                            <>
                                <div className="text-center text-xl text-gray-700 font-medium mb-4">
                                    {currentWord.translation}
                                </div>

                                {currentWord.definition && (
                                    <div className="text-center text-sm text-gray-600 mb-3">
                                        <strong>Définition:</strong> {currentWord.definition}
                                    </div>
                                )}

                                {currentWord.example && (
                                    <div className="text-center text-sm text-gray-600 mb-4">
                                        <div className="italic">"{currentWord.example}"</div>
                                        <div className="text-gray-500">"{currentWord.exampleTranslation}"</div>
                                    </div>
                                )}

                                <div className="flex justify-center mb-4">
                                    <Badge variant="secondary" className="text-xs bg-gray-800 text-white">
                                        {currentWord.difficulty === 'beginner' ? 'Débutant' :
                                            currentWord.difficulty === 'intermediate' ? 'Intermédiaire' :
                                                currentWord.difficulty === 'advanced' ? 'Avancé' : currentWord.difficulty}
                                    </Badge>
                                </div>

                                {/* Boutons de réponse */}
                                <div className="flex justify-center gap-3">
                                    <button
                                        onClick={() => handleKnowAnswer(false)}
                                        className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                                    >
                                        ❌ Je ne savais pas
                                    </button>
                                    <button
                                        onClick={() => handleKnowAnswer(true)}
                                        className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                                    >
                                        ✅ Je savais !
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="text-center">
                                <div className="text-lg text-gray-500 mb-4">
                                    🤔 Connaissez-vous ce mot ?
                                </div>
                                <button
                                    onClick={toggleAnswer}
                                    className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    Révéler la réponse
                                </button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Navigation */}
                <div className="flex justify-center gap-4 mb-4">
                    <button
                        onClick={handlePrevious}
                        disabled={currentWordIndex === 0}
                        className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        ← Précédent
                    </button>
                    <button
                        onClick={toggleAnswer}
                        className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        {showAnswer ? '🙈 Cacher' : '👁️ Révéler'}
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={currentWordIndex === words.length - 1}
                        className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        Suivant →
                    </button>
                </div>

                {/* Compteur */}
                <div className="text-center text-gray-600">
                    <Badge variant="outline" className="border-gray-600 text-gray-800">
                        {currentWordIndex + 1} / {words.length}
                    </Badge>
                </div>
            </div>
        </div>
    )
}

export default App
