import { useState } from 'react'
import Badge from './components/Badge.jsx'
import { themes } from './themes/index.js'
import { AuthProvider, useAuth } from './hooks/useAuth.jsx'
import { useWords } from './hooks/useWords.js'
import { useQuiz } from './hooks/useQuiz.js'
import { LoginForm } from './components/Auth/LoginForm.jsx'
import './App.css'

function AppContent() {
    const [selectedDifficulty] = useState('beginner')
    const [selectedTheme] = useState('classic')
    const [currentMode, setCurrentMode] = useState('flashcards') // nouveau: mode quiz ou flashcards
    const { currentUser, isAuthenticated } = useAuth()

    // Récupération du thème
    const theme = themes[selectedTheme] || themes.classic

    // Ajout du système de mots (flashcards)
    const {
        currentWord,
        totalWords,
        loading
    } = useWords(selectedDifficulty, 'flashcard')

    // Ajout du système de quiz
    const {
        isQuizMode,
        currentQuizWord,
        currentQuizIndex,
        selectedAnswer,
        score: quizScore,
        quizFinished,
        startQuiz,
        selectAnswer,
        submitAnswer,
        nextQuestion,
        restartQuiz,
        exitQuiz
    } = useQuiz(selectedDifficulty)

    return (
        <div className="app-container">
            <div className="header-section">
                <h1 className="app-title">🎓 EnglishMaster</h1>
                <p className="app-subtitle">Application d'apprentissage de l'anglais</p>
                <Badge variant="premium" size="lg">Version 2.1.0</Badge>
                <br /><br />
                {isAuthenticated && <Badge variant="success">Connecté: {currentUser?.username}</Badge>}
                {!isAuthenticated && <Badge variant="info">Mode Invité</Badge>}
                <Badge variant="info">Mots: {totalWords}</Badge>
                {loading && <Badge variant="warning">Chargement...</Badge>}
                {isQuizMode && <Badge variant="warning">Quiz: {quizScore}/10</Badge>}
                <p>✅ Base + CSS + Badge + Auth + Words + LoginForm + Quiz 🎯</p>
            </div>

            {/* Sélecteur de mode */}
            <div className="mode-selector" style={{ textAlign: 'center', margin: '20px 0' }}>
                <button
                    onClick={() => setCurrentMode('flashcards')}
                    style={{
                        padding: '10px 20px',
                        margin: '0 10px',
                        backgroundColor: currentMode === 'flashcards' ? '#2563EB' : '#E5E7EB',
                        color: currentMode === 'flashcards' ? 'white' : '#374151',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer'
                    }}
                >
                    📚 Flashcards
                </button>
                <button
                    onClick={() => {
                        setCurrentMode('quiz')
                        if (!isQuizMode) startQuiz()
                    }}
                    style={{
                        padding: '10px 20px',
                        margin: '0 10px',
                        backgroundColor: currentMode === 'quiz' ? '#2563EB' : '#E5E7EB',
                        color: currentMode === 'quiz' ? 'white' : '#374151',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer'
                    }}
                >
                    🎯 Quiz
                </button>
            </div>

            <div className="content-section">
                {!isAuthenticated && (
                    <div>
                        <p>Connectez-vous pour sauvegarder vos progrès :</p>
                        <LoginForm theme={theme} />
                    </div>
                )}

                {/* Mode Quiz */}
                {currentMode === 'quiz' && isQuizMode && !quizFinished && currentQuizWord && (
                    <div className="quiz-section" style={{
                        border: '2px solid #2563EB',
                        borderRadius: '12px',
                        padding: '20px',
                        margin: '20px 0',
                        backgroundColor: '#F8FAFC'
                    }}>
                        <h2 style={{ color: '#2563EB', textAlign: 'center' }}>
                            🎯 Question {currentQuizIndex + 1}/10
                        </h2>
                        <div style={{ textAlign: 'center', margin: '20px 0' }}>
                            <h3 style={{ fontSize: '24px', color: '#1E293B' }}>
                                {currentQuizWord.word}
                            </h3>
                            <p style={{ color: '#64748B', fontStyle: 'italic' }}>
                                Quelle est la traduction ?
                            </p>
                        </div>

                        <div className="quiz-choices" style={{ display: 'grid', gap: '10px', maxWidth: '500px', margin: '0 auto' }}>
                            {currentQuizWord.choices?.map((choice, index) => (
                                <button
                                    key={index}
                                    onClick={() => selectAnswer(index)}
                                    disabled={selectedAnswer !== null}
                                    style={{
                                        padding: '15px',
                                        border: selectedAnswer === index ? '2px solid #2563EB' : '1px solid #D1D5DB',
                                        borderRadius: '8px',
                                        backgroundColor: selectedAnswer === index ? '#EBF4FF' : 'white',
                                        cursor: selectedAnswer !== null ? 'not-allowed' : 'pointer',
                                        textAlign: 'left',
                                        fontSize: '16px'
                                    }}
                                >
                                    {String.fromCharCode(65 + index)}. {choice}
                                </button>
                            ))}
                        </div>

                        <div style={{ textAlign: 'center', marginTop: '20px' }}>
                            {selectedAnswer !== null ? (
                                <button
                                    onClick={() => {
                                        submitAnswer()
                                        setTimeout(nextQuestion, 1000)
                                    }}
                                    style={{
                                        padding: '10px 20px',
                                        backgroundColor: '#10B981',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    ✅ Valider
                                </button>
                            ) : (
                                <p style={{ color: '#64748B' }}>Sélectionnez une réponse</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Résultats du Quiz */}
                {currentMode === 'quiz' && quizFinished && (
                    <div className="quiz-results" style={{
                        border: '2px solid #10B981',
                        borderRadius: '12px',
                        padding: '20px',
                        margin: '20px 0',
                        backgroundColor: '#F0FDF4',
                        textAlign: 'center'
                    }}>
                        <h2 style={{ color: '#10B981' }}>🎉 Quiz Terminé !</h2>
                        <div style={{ fontSize: '24px', margin: '20px 0' }}>
                            Score: {quizScore}/10 ({Math.round((quizScore / 10) * 100)}%)
                        </div>
                        <div style={{ margin: '20px 0' }}>
                            {quizScore >= 8 ? '🏆 Excellent !' :
                                quizScore >= 6 ? '👍 Bien joué !' :
                                    quizScore >= 4 ? '👌 Pas mal !' : '💪 Continue !'}
                        </div>
                        <div>
                            <button
                                onClick={restartQuiz}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#2563EB',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    margin: '0 10px'
                                }}
                            >
                                🔄 Refaire
                            </button>
                            <button
                                onClick={() => {
                                    exitQuiz()
                                    setCurrentMode('flashcards')
                                }}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#64748B',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    margin: '0 10px'
                                }}
                            >
                                📚 Retour aux flashcards
                            </button>
                        </div>
                    </div>
                )}

                {/* Mode Flashcards */}
                {currentMode === 'flashcards' && currentWord && (
                    <div className="word-preview" style={{
                        border: '2px solid #10B981',
                        borderRadius: '12px',
                        padding: '20px',
                        margin: '20px 0',
                        backgroundColor: '#F0FDF4'
                    }}>
                        <h3 style={{ color: '#10B981', textAlign: 'center' }}>📚 Flashcard</h3>
                        <div style={{ textAlign: 'center' }}>
                            <h3 style={{ fontSize: '28px', color: '#1E293B' }}>
                                {currentWord.word}
                            </h3>
                            <p style={{ fontSize: '18px', color: '#374151' }}>
                                {currentWord.translation}
                            </p>
                            <p style={{ color: '#64748B' }}>
                                Difficulté: {selectedDifficulty}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

function AppComponent() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    )
}

export default AppComponent
