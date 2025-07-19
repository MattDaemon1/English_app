import { useState, useEffect } from 'react'
import { Badge } from './components/ui/badge.jsx'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card.jsx'
import { getWordService } from './services/WordService.js'

function App() {
    // États pour la gestion des mots et de l'application
    const [words, setWords] = useState([])
    const [currentWordIndex, setCurrentWordIndex] = useState(0)
    const [loading, setLoading] = useState(true)
    const [totalWords, setTotalWords] = useState(0)
    const [selectedDifficulty, setSelectedDifficulty] = useState('all')
    const [progressStats, setProgressStats] = useState(null)
    
    const wordService = getWordService()
    const currentWord = words[currentWordIndex]

    // Charger les mots depuis la base de données
    useEffect(() => {
        loadWords()
        loadStats()
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

    const loadStats = async () => {
        try {
            const stats = await wordService.getProgressStats()
            setProgressStats(stats)
        } catch (error) {
            console.error('Erreur lors du chargement des statistiques:', error)
        }
    }

    const handleNext = () => {
        if (currentWordIndex < words.length - 1) {
            setCurrentWordIndex(currentWordIndex + 1)
        }
    }

    const handlePrevious = () => {
        if (currentWordIndex > 0) {
            setCurrentWordIndex(currentWordIndex - 1)
        }
    }

    const handleDifficultyChange = (difficulty) => {
        setSelectedDifficulty(difficulty)
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
                    <div className="text-gray-500">Vérifiez votre base de données</div>
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
                        SQLite - {totalWords} mots
                    </Badge>
                </div>

                {/* Filtres de difficulté */}
                <div className="flex justify-center gap-2 mb-6">
                    {['all', 'beginner', 'intermediate', 'advanced'].map((level) => (
                        <button
                            key={level}
                            onClick={() => handleDifficultyChange(level)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                selectedDifficulty === level
                                    ? 'bg-gray-900 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            {level === 'all' ? 'Tous' : level}
                        </button>
                    ))}
                </div>

                {/* Statistiques de progression */}
                {progressStats && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 max-w-2xl mx-auto">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-2xl font-bold text-gray-900">{progressStats.total_words_studied || 0}</div>
                            <div className="text-xs text-gray-500">Mots étudiés</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-2xl font-bold text-gray-900">{progressStats.words_learned || 0}</div>
                            <div className="text-xs text-gray-500">Mots appris</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-2xl font-bold text-gray-900">
                                {Math.round((progressStats.success_rate || 0) * 100)}%
                            </div>
                            <div className="text-xs text-gray-500">Taux de réussite</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-2xl font-bold text-gray-900">{progressStats.mastered_words || 0}</div>
                            <div className="text-xs text-gray-500">Mots maîtrisés</div>
                        </div>
                    </div>
                )}

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
                                <div className="text-gray-500">"{currentWord.example_translation}"</div>
                            </div>
                        )}
                        
                        <div className="flex justify-center gap-2">
                            <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700 border-gray-200">
                                {currentWord.difficulty}
                            </Badge>
                            <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700 border-gray-200">
                                {currentWord.category}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                {/* Navigation */}
                <div className="flex justify-center gap-4 mb-4">
                    <button
                        onClick={handlePrevious}
                        disabled={currentWordIndex === 0}
                        className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        ← Précédent
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={currentWordIndex === words.length - 1}
                        className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        Suivant →
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center text-xl text-gray-700 font-medium">
                            {currentWord.translation}
                        </div>
                        <div className="mt-4 flex justify-center">
                            <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700 border-gray-200">
                                Niveau {currentWord.difficulty || 'beginner'}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                {/* Navigation */}
                <div className="flex justify-center gap-4 mb-4">
                    <button
                        onClick={() => setCurrentWordIndex(Math.max(0, currentWordIndex - 1))}
                        disabled={currentWordIndex === 0}
                        className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        ← Précédent
                    </button>
                    <button
                        onClick={() => setCurrentWordIndex(Math.min(wordsData.length - 1, currentWordIndex + 1))}
                        disabled={currentWordIndex === wordsData.length - 1}
                        className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        Suivant →
                    </button>
                </div>

                {/* Compteur */}
                <div className="text-center text-gray-600">
                    <Badge variant="outline" className="border-gray-300 text-gray-700">
                        {currentWordIndex + 1} / {wordsData.length}
                    </Badge>
                </div>
            </div>
        </div>
    )
}

export default App
