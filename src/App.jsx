import { useState } from 'react'
import { Badge } from './components/ui/badge.jsx'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card.jsx'
import { themes, getThemeClasses } from './themes/index.js'
import { useWords } from './hooks/useWords.js'
import { useQuiz } from './hooks/useQuiz.js'
import { QuizComponent } from './components/Quiz/QuizComponent.jsx'
import { FlashcardComponent } from './components/Flashcard/FlashcardComponent.jsx'
import { AppHeader } from './components/AppHeader/AppHeader.jsx'

function App() {
    // États globaux
    const [selectedDifficulty, setSelectedDifficulty] = useState('all')
    const [selectedTheme, setSelectedTheme] = useState('classic')

    // Hooks personnalisés
    const {
        words,
        currentWord,
        currentWordIndex,
        loading,
        totalWords,
        showAnswer,
        handleNext,
        handlePrevious,
        toggleAnswer,
        handleKnowAnswer
    } = useWords(selectedDifficulty, 'flashcard') // Toujours en mode flashcard pour useWords

    const {
        isQuizMode,
        currentQuizWord,
        currentQuizIndex,
        selectedAnswer,
        score: quizScore,
        quizFinished: quizCompleted,
        startQuiz,
        selectAnswer,
        submitAnswer,
        nextQuestion,
        restartQuiz,
        exitQuiz
    } = useQuiz(selectedDifficulty)

    const theme = themes[selectedTheme] // Thème actuel

    // Gestion du changement de difficulté et mode

    const handleStartQuiz = () => {
        startQuiz()
    }

    const handleDifficultyChange = (difficulty) => {
        setSelectedDifficulty(difficulty)
    }

    const handleQuizAnswer = (answerIndex) => {
        selectAnswer(answerIndex)
        setTimeout(() => {
            submitAnswer()
            setTimeout(() => {
                nextQuestion()
            }, 1500)
        }, 100)
    }

    const handleBackToFlashcards = () => {
        exitQuiz() // Plus besoin de setMode
    }

    if (loading) {
        return (
            <div className={`min-h-screen ${theme.background} flex items-center justify-center`}>
                <div className="text-center">
                    <div className={`text-2xl font-bold ${theme.text} mb-2`}>Chargement...</div>
                    <div className={theme.textSecondary}>
                        {isQuizMode ? 'Préparation du quiz...' : 'Préparation de vos mots'}
                    </div>
                </div>
            </div>
        )
    }

    if (!isQuizMode && !currentWord) {
        return (
            <div className={`min-h-screen ${theme.background} flex items-center justify-center`}>
                <div className="text-center">
                    <div className={`text-2xl font-bold ${theme.text} mb-2`}>Aucun mot trouvé</div>
                    <div className={theme.textSecondary}>Essayez un autre filtre</div>
                </div>
            </div>
        )
    }

    return (
        <div className={`min-h-screen ${theme.background} relative overflow-hidden`}>
            {/* Éléments décoratifs de fond */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
            </div>

            <div className="container mx-auto p-6 max-w-5xl relative z-10">
                {/* Header amélioré */}
                <div className="text-center mb-12 animate-fadeIn">
                    <div className="mb-6">
                        <h1 className={`text-6xl font-black ${theme.text} mb-4 tracking-tight`}>
                            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
                                English
                            </span>
                            <span className={theme.text}>Master</span>
                        </h1>
                        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full mb-4"></div>
                    </div>
                    <p className={`${theme.textSecondary} text-lg font-medium mb-4`}>
                        {isQuizMode ? '🎯 Quiz interactif - Testez vos connaissances' : '📚 Apprenez l\'anglais avec des flashcards interactives'}
                    </p>
                    <Badge variant="outline" className={`${theme.badgeOutline} text-sm font-semibold px-4 py-2 rounded-full shadow-lg`}>
                        {isQuizMode ? `Question ${currentQuizIndex + 1}/10` : `v2.0 - ${totalWords} mots disponibles`}
                    </Badge>
                </div>

                {/* Sélecteur de thème amélioré */}
                <div className="text-center mb-8 animate-slideIn">
                    <div className="mb-6">
                        <h3 className={`text-lg font-semibold ${theme.text} mb-4`}>
                            🎨 Choisissez votre ambiance
                        </h3>
                        <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
                            {Object.entries(themes).map(([key, themeOption]) => (
                                <button
                                    key={key}
                                    onClick={() => setSelectedTheme(key)}
                                    className={`group relative px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${selectedTheme === key
                                        ? getThemeClasses(themeOption, 'button-primary-solid') + ' ring-4 ring-white/30'
                                        : getThemeClasses(themeOption, 'button-secondary') + ' hover:shadow-xl'
                                        }`}
                                >
                                    <span className="relative z-10">{themeOption.name}</span>
                                    {selectedTheme === key && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl opacity-20 animate-pulse"></div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sélecteur de mode et filtres */}
                <div className="text-center mb-6">
                    <div className="flex justify-center gap-2 mb-4">
                        <button
                            onClick={() => {
                                exitQuiz() // Plus besoin de setMode
                            }}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${getThemeClasses(theme, 'button-primary', !isQuizMode)
                                }`}
                        >
                            📚 Flashcards
                        </button>
                        <button
                            onClick={handleStartQuiz}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${getThemeClasses(theme, 'button-primary', isQuizMode)
                                }`}
                        >
                            🎯 Quiz (10 questions)
                        </button>
                    </div>
                </div>                {/* Filtres de difficulté */}
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
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${getThemeClasses(theme, 'button-primary', selectedDifficulty === level.key)
                                    }`}
                            >
                                {level.label}
                            </button>
                        ))}
                    </div>
                )}

                {/* Contenu principal - MODE QUIZ */}
                {isQuizMode && !quizCompleted && currentQuizWord && (
                    <Card className={`mb-6 max-w-lg mx-auto ${theme.card} shadow-sm`}>
                        <CardHeader>
                            <CardTitle className={`text-center text-2xl font-bold ${theme.text} mb-2`}>
                                Quelle est la traduction de :
                            </CardTitle>
                            <div className={`text-center text-3xl font-bold ${theme.text} mb-2`}>
                                {currentQuizWord.word}
                            </div>
                            {currentQuizWord.pronunciation && (
                                <div className={`text-center text-sm ${theme.textSecondary} italic`}>
                                    {currentQuizWord.pronunciation}
                                </div>
                            )}
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {currentQuizWord.choices?.map((choice, index) => {
                                    let buttonClass = "w-full p-4 text-left rounded-lg border transition-colors "

                                    if (selectedAnswer !== null) {
                                        if (index === currentQuizWord.correctAnswer) {
                                            buttonClass += "bg-green-100 border-green-500 text-green-800 ring-2 ring-green-300"
                                        } else if (index === selectedAnswer && index !== currentQuizWord.correctAnswer) {
                                            buttonClass += "bg-red-100 border-red-500 text-red-800 ring-2 ring-red-300"
                                        } else {
                                            buttonClass += `${theme.card} border-gray-200 ${theme.textSecondary} opacity-60`
                                        }
                                    } else {
                                        buttonClass += `${theme.card} hover:${theme.secondary} ${theme.text} border-gray-200 hover:border-gray-300 hover:shadow-lg`
                                    }

                                    return (
                                        <button
                                            key={index}
                                            onClick={() => selectedAnswer === null && handleQuizAnswer(index)}
                                            disabled={selectedAnswer !== null}
                                            className={buttonClass}
                                        >
                                            <div className="text-lg font-medium">
                                                {String.fromCharCode(65 + index)}. {choice}
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>

                            <div className="mt-6 text-center">
                                <div className={`text-sm ${theme.textSecondary}`}>
                                    Score actuel: {quizScore}/{currentQuizIndex + (selectedAnswer ? 1 : 0)}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Résultats du Quiz */}
                {isQuizMode && quizCompleted && (
                    <Card className={`mb-6 max-w-lg mx-auto ${theme.card} shadow-sm`}>
                        <CardHeader>
                            <CardTitle className={`text-center text-3xl font-bold ${theme.text}`}>
                                Quiz Terminé ! 🎉
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center mb-6">
                                <div className={`text-4xl font-bold ${theme.text} mb-2`}>
                                    {quizScore}/10
                                </div>
                                <div className={`text-lg ${theme.textSecondary} mb-4`}>
                                    Score: {Math.round((quizScore / 10) * 100)}%
                                </div>
                                <Badge variant="secondary" className={`text-sm ${theme.badge}`}>
                                    {quizScore >= 8 ? '🏆 Excellent' :
                                        quizScore >= 6 ? '👍 Bien' :
                                            quizScore >= 4 ? '👌 Correct' : '💪 Continuez !'}
                                </Badge>
                            </div>

                            <div className="flex justify-center gap-3 mb-4">
                                <button
                                    onClick={restartQuiz}
                                    className={`px-6 py-2 rounded-lg transition-colors ${getThemeClasses(theme, 'button-primary-solid')}`}
                                >
                                    🔄 Refaire le quiz
                                </button>
                                <button
                                    onClick={handleBackToFlashcards}
                                    className={`px-6 py-2 rounded-lg transition-colors ${getThemeClasses(theme, 'button-secondary')}`}
                                >
                                    📚 Retour aux flashcards
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Contenu principal - MODE FLASHCARD */}
                {!isQuizMode && currentWord && (
                    <Card className={`mb-6 max-w-lg mx-auto ${theme.card} shadow-sm`}>
                        <CardHeader>
                            <CardTitle className={`text-center text-3xl font-bold ${theme.text}`}>
                                {currentWord.word}
                            </CardTitle>
                            <div className={`text-center text-sm ${theme.textSecondary} italic`}>
                                {currentWord.pronunciation}
                            </div>
                        </CardHeader>
                        <CardContent>
                            {showAnswer ? (
                                <>
                                    <div className={`text-center text-xl ${theme.text} font-medium mb-4`}>
                                        {currentWord.translation}
                                    </div>

                                    {currentWord.definition && (
                                        <div className={`text-center text-sm ${theme.textSecondary} mb-3`}>
                                            <strong>Définition:</strong> {currentWord.definition}
                                        </div>
                                    )}

                                    {currentWord.example && (
                                        <div className={`text-center text-sm ${theme.textSecondary} mb-4`}>
                                            <div className="italic">"{currentWord.example}"</div>
                                            <div className={theme.textSecondary}>"{currentWord.exampleTranslation}"</div>
                                        </div>
                                    )}

                                    <div className="flex justify-center mb-4">
                                        <Badge variant="secondary" className={`text-xs ${theme.badge}`}>
                                            {currentWord.difficulty === 'beginner' ? 'Débutant' :
                                                currentWord.difficulty === 'intermediate' ? 'Intermédiaire' :
                                                    currentWord.difficulty === 'advanced' ? 'Avancé' : currentWord.difficulty}
                                        </Badge>
                                    </div>

                                    {/* Boutons de réponse */}
                                    <div className="flex justify-center gap-3">
                                        <button
                                            onClick={() => handleKnowAnswer(false)}
                                            className={`px-4 py-2 rounded-lg transition-colors text-sm ${getThemeClasses(theme, 'button-primary-solid')}`}
                                        >
                                            ❌ Je ne savais pas
                                        </button>
                                        <button
                                            onClick={() => handleKnowAnswer(true)}
                                            className={`px-4 py-2 rounded-lg transition-colors text-sm ${getThemeClasses(theme, 'button-primary-solid')}`}
                                        >
                                            ✅ Je savais !
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center">
                                    <div className={`text-lg ${theme.textSecondary} mb-4`}>
                                        🤔 Connaissez-vous ce mot ?
                                    </div>
                                    <button
                                        onClick={toggleAnswer}
                                        className={`px-6 py-2 rounded-lg transition-colors ${getThemeClasses(theme, 'button-primary-solid')}`}
                                    >
                                        Révéler la réponse
                                    </button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Navigation - seulement en mode flashcard */}
                {!isQuizMode && currentWord && (
                    <>
                        <div className="flex justify-center gap-4 mb-4">
                            <button
                                onClick={handlePrevious}
                                disabled={currentWordIndex === 0}
                                className={`px-6 py-2 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors ${getThemeClasses(theme, 'button-primary-solid')}`}
                            >
                                ← Précédent
                            </button>
                            <button
                                onClick={toggleAnswer}
                                className={`px-6 py-2 rounded-lg transition-colors ${getThemeClasses(theme, 'button-secondary')}`}
                            >
                                {showAnswer ? '🙈 Cacher' : '👁️ Révéler'}
                            </button>
                            <button
                                onClick={handleNext}
                                disabled={currentWordIndex === words.length - 1}
                                className={`px-6 py-2 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors ${getThemeClasses(theme, 'button-primary-solid')}`}
                            >
                                Suivant →
                            </button>
                        </div>

                        {/* Compteur */}
                        <div className={`text-center ${theme.textSecondary}`}>
                            <Badge variant="outline" className={theme.badgeOutline}>
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
