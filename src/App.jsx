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
    const [mode, setMode] = useState('flashcard') // 'flashcard' ou 'quiz'

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
    } = useWords(selectedDifficulty, mode)

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
        setMode('quiz')
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
        setMode('flashcard')
        exitQuiz()
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
        <div className={`min-h-screen ${theme.background}`}>
            <div className="container mx-auto p-4 max-w-4xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className={`text-4xl font-bold ${theme.text} mb-2`}>
                        EnglishMaster
                    </h1>
                    <p className={theme.textSecondary}>
                        {isQuizMode ? 'Quiz interactif - 10 questions' : 'Apprenez l\'anglais avec des flashcards interactives'}
                    </p>
                    <Badge variant="outline" className={`mt-2 ${theme.badgeOutline}`}>
                        {isQuizMode ? `Question ${currentQuizIndex + 1}/10` : `v2.0 - ${totalWords} mots disponibles`}
                    </Badge>
                </div>

                {/* Sélecteur de thème */}
                <div className="text-center mb-6">
                    <div className="mb-4">
                        <label className={`block text-sm font-medium ${theme.textSecondary} mb-2`}>
                            Choisissez votre thème :
                        </label>
                        <div className="flex flex-wrap justify-center gap-2">
                            {Object.entries(themes).map(([key, themeOption]) => (
                                <button
                                    key={key}
                                    onClick={() => setSelectedTheme(key)}
                                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${selectedTheme === key
                                        ? getThemeClasses(theme, 'button-primary-solid')
                                        : getThemeClasses(theme, 'button-secondary')
                                        }`}
                                >
                                    {themeOption.name}
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
                                setMode('flashcard')
                                exitQuiz()
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
                            <div className={`text-center text-sm ${theme.textSecondary} italic`}>
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
                                            buttonClass += `${theme.secondary} ${theme.card} ${theme.textSecondary}`
                                        }
                                    } else {
                                        buttonClass += `${theme.background} ${theme.card} ${theme.text} ${theme.secondary.replace('bg-', 'hover:bg-')}`
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
