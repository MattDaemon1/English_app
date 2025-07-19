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

function App() {
    // États pour la gestion des mots et de l'application
    const [words, setWords] = useState([])
    const [currentWordIndex, setCurrentWordIndex] = useState(0)
    const [loading, setLoading] = useState(true)
    const [totalWords, setTotalWords] = useState(0)
    const [selectedDifficulty, setSelectedDifficulty] = useState('all')
    const [showAnswer, setShowAnswer] = useState(true) // Mode flashcard
    
    // États pour le mode quiz
    const [mode, setMode] = useState('flashcard') // 'flashcard' ou 'quiz'
    const [quizWords, setQuizWords] = useState([])
    const [currentQuizIndex, setCurrentQuizIndex] = useState(0)
    const [quizOptions, setQuizOptions] = useState([])
    const [selectedAnswer, setSelectedAnswer] = useState(null)
    const [quizScore, setQuizScore] = useState(0)
    const [quizCompleted, setQuizCompleted] = useState(false)
    const [userAnswers, setUserAnswers] = useState([])

    const wordService = new MockWordService()
    const currentWord = words[currentWordIndex]
    const currentQuizWord = quizWords[currentQuizIndex]

    // Charger les mots depuis le service
    useEffect(() => {
        if (mode === 'flashcard') {
            loadWords()
        }
    }, [selectedDifficulty, mode])

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

    const startQuiz = async () => {
        setLoading(true)
        setMode('quiz')
        setQuizCompleted(false)
        setQuizScore(0)
        setCurrentQuizIndex(0)
        setUserAnswers([])
        
        try {
            const quizWordsData = await wordService.getQuizWords(selectedDifficulty, 10)
            setQuizWords(quizWordsData)
            
            if (quizWordsData.length > 0) {
                generateQuizQuestion(quizWordsData, 0)
            }
        } catch (error) {
            console.error('Erreur lors du démarrage du quiz:', error)
        } finally {
            setLoading(false)
        }
    }

    const generateQuizQuestion = async (allQuizWords, questionIndex) => {
        const currentWord = allQuizWords[questionIndex]
        const allWords = await wordService.getWords({ limit: 100 })
        const options = wordService.generateQuizOptions(currentWord, allWords, 4)
        setQuizOptions(options)
        setSelectedAnswer(null)
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

    const handleQuizAnswer = (selectedOption) => {
        setSelectedAnswer(selectedOption)
        
        const isCorrect = selectedOption.id === currentQuizWord.id
        const newAnswer = {
            question: currentQuizWord,
            selectedAnswer: selectedOption,
            correctAnswer: currentQuizWord,
            isCorrect
        }
        
        setUserAnswers([...userAnswers, newAnswer])
        
        if (isCorrect) {
            setQuizScore(quizScore + 1)
        }

        // Attendre 1.5 secondes puis passer à la question suivante
        setTimeout(() => {
            if (currentQuizIndex < quizWords.length - 1) {
                const nextIndex = currentQuizIndex + 1
                setCurrentQuizIndex(nextIndex)
                generateQuizQuestion(quizWords, nextIndex)
            } else {
                setQuizCompleted(true)
            }
        }, 1500)
    }

    const restartQuiz = () => {
        startQuiz()
    }

    const backToFlashcards = () => {
        setMode('flashcard')
        loadWords()
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="text-2xl font-bold text-gray-700 mb-2">Chargement...</div>
                    <div className="text-gray-500">
                        {mode === 'quiz' ? 'Préparation du quiz...' : 'Préparation de vos mots'}
                    </div>
                </div>
            </div>
        )
    }

    if (mode === 'flashcard' && !currentWord) {
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
                    <p className="text-gray-600">
                        {mode === 'quiz' ? 'Quiz interactif - 10 questions' : 'Apprenez l\'anglais avec des flashcards interactives'}
                    </p>
                    <Badge variant="outline" className="mt-2 border-gray-600 text-gray-800">
                        {mode === 'quiz' ? `Question ${currentQuizIndex + 1}/10` : `v2.0 - ${totalWords} mots disponibles`}
                    </Badge>
                </div>

                {/* Sélecteur de mode et filtres */}
                <div className="text-center mb-6">
                    <div className="flex justify-center gap-2 mb-4">
                        <button
                            onClick={() => setMode('flashcard')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === 'flashcard'
                                    ? 'bg-gray-800 text-white'
                                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                }`}
                        >
                            📚 Flashcards
                        </button>
                        <button
                            onClick={startQuiz}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === 'quiz'
                                    ? 'bg-gray-800 text-white'
                                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                }`}
                        >
                            🎯 Quiz (10 questions)
                        </button>
                    </div>
                </div>

                {/* Filtres de difficulté */}
                {!quizCompleted && (
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
                )}

                {/* Contenu principal - MODE QUIZ */}
                {mode === 'quiz' && !quizCompleted && currentQuizWord && (
                    <Card className="mb-6 max-w-lg mx-auto border-gray-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-center text-2xl font-bold text-gray-900 mb-2">
                                Quelle est la traduction de :
                            </CardTitle>
                            <div className="text-center text-3xl font-bold text-gray-800 mb-2">
                                {currentQuizWord.word}
                            </div>
                            <div className="text-center text-sm text-gray-500 italic">
                                {currentQuizWord.pronunciation}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {quizOptions.map((option, index) => {
                                    let buttonClass = "w-full p-4 text-left rounded-lg border transition-colors "
                                    
                                    if (selectedAnswer) {
                                        if (option.id === currentQuizWord.id) {
                                            buttonClass += "bg-green-100 border-green-500 text-green-800"
                                        } else if (option.id === selectedAnswer.id && option.id !== currentQuizWord.id) {
                                            buttonClass += "bg-red-100 border-red-500 text-red-800"
                                        } else {
                                            buttonClass += "bg-gray-50 border-gray-200 text-gray-600"
                                        }
                                    } else {
                                        buttonClass += "bg-white border-gray-200 text-gray-800 hover:bg-gray-50 hover:border-gray-300"
                                    }

                                    return (
                                        <button
                                            key={option.id}
                                            onClick={() => !selectedAnswer && handleQuizAnswer(option)}
                                            disabled={!!selectedAnswer}
                                            className={buttonClass}
                                        >
                                            <div className="text-lg font-medium">
                                                {String.fromCharCode(65 + index)}. {option.translation}
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>
                            
                            <div className="mt-6 text-center">
                                <div className="text-sm text-gray-500">
                                    Score actuel: {quizScore}/{currentQuizIndex + (selectedAnswer ? 1 : 0)}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Résultats du Quiz */}
                {mode === 'quiz' && quizCompleted && (
                    <Card className="mb-6 max-w-lg mx-auto border-gray-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-center text-3xl font-bold text-gray-900">
                                Quiz Terminé ! 🎉
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center mb-6">
                                <div className="text-4xl font-bold text-gray-800 mb-2">
                                    {quizScore}/10
                                </div>
                                <div className="text-lg text-gray-600 mb-4">
                                    Score: {Math.round((quizScore / 10) * 100)}%
                                </div>
                                <Badge variant="secondary" className="text-sm bg-gray-800 text-white">
                                    {quizScore >= 8 ? '🏆 Excellent' : 
                                     quizScore >= 6 ? '👍 Bien' : 
                                     quizScore >= 4 ? '👌 Correct' : '💪 Continuez !'}
                                </Badge>
                            </div>

                            <div className="flex justify-center gap-3 mb-4">
                                <button
                                    onClick={restartQuiz}
                                    className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    🔄 Refaire le quiz
                                </button>
                                <button
                                    onClick={backToFlashcards}
                                    className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    📚 Retour aux flashcards
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Contenu principal - MODE FLASHCARD */}
                {mode === 'flashcard' && currentWord && (
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
                )}

                {/* Navigation - seulement en mode flashcard */}
                {mode === 'flashcard' && currentWord && (
                    <>
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
                    </>
                )}
            </div>
        </div>
    )
}

export default App
