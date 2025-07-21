import { useState, useEffect } from 'react'
import Badge from './components/Badge.jsx'
import { themes } from './themes/index.js'
import { AuthProvider, useAuth } from './hooks/useAuth.jsx'
import { useWords } from './hooks/useWords.js'
import { useQuiz } from './hooks/useQuiz.js'
import { LoginForm } from './components/Auth/LoginForm.jsx'
import './App.css'

function AppContent() {
    const [selectedDifficulty, setSelectedDifficulty] = useState('beginner')
    const [selectedTheme] = useState('classic')
    const [currentMode, setCurrentMode] = useState('flashcards') // nouveau: mode quiz ou flashcards
    const [showTranslation, setShowTranslation] = useState(false)
    const [wordIndex, setWordIndex] = useState(0)
    const [knownWords, setKnownWords] = useState(new Set())
    const [studySession, setStudySession] = useState({ studied: 0, correct: 0 })
    const { currentUser, isAuthenticated } = useAuth()

    // Récupération du thème
    const theme = themes[selectedTheme] || themes.classic

    // Ajout du système de mots (flashcards)
    const {
        currentWord,
        totalWords,
        loading,
        allWords
    } = useWords(selectedDifficulty, 'flashcard')

    // Fonctions pour les flashcards améliorées
    const nextWord = () => {
        if (allWords && allWords.length > 0) {
            setWordIndex((prev) => (prev + 1) % allWords.length)
            setShowTranslation(false)
        }
    }

    const previousWord = () => {
        if (allWords && allWords.length > 0) {
            setWordIndex((prev) => (prev - 1 + allWords.length) % allWords.length)
            setShowTranslation(false)
        }
    }

    const toggleTranslation = () => {
        setShowTranslation(!showTranslation)
    }

    const markAsKnown = () => {
        if (currentWord) {
            setKnownWords(prev => new Set([...prev, currentWord.word]))
            setStudySession(prev => ({ ...prev, studied: prev.studied + 1, correct: prev.correct + 1 }))
            setTimeout(nextWord, 500)
        }
    }

    const markAsStudying = () => {
        setStudySession(prev => ({ ...prev, studied: prev.studied + 1 }))
        setTimeout(nextWord, 500)
    }

    const resetSession = () => {
        setStudySession({ studied: 0, correct: 0 })
        setKnownWords(new Set())
        setWordIndex(0)
        setShowTranslation(false)
    }

    // Mot actuel basé sur l'index
    const displayWord = allWords && allWords.length > 0 ? allWords[wordIndex] : currentWord

    // Raccourcis clavier pour les flashcards
    useEffect(() => {
        const handleKeyPress = (event) => {
            if (currentMode !== 'flashcards') return

            switch (event.key) {
                case 'ArrowLeft':
                case 'h':
                    event.preventDefault()
                    previousWord()
                    break
                case 'ArrowRight':
                case 'l':
                    event.preventDefault()
                    nextWord()
                    break
                case ' ':
                case 'Enter':
                    event.preventDefault()
                    toggleTranslation()
                    break
                case 'k':
                    if (showTranslation) {
                        event.preventDefault()
                        markAsKnown()
                    }
                    break
                case 'r':
                    if (showTranslation) {
                        event.preventDefault()
                        markAsStudying()
                    }
                    break
            }
        }

        window.addEventListener('keydown', handleKeyPress)
        return () => window.removeEventListener('keydown', handleKeyPress)
    }, [currentMode, showTranslation, displayWord])

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
                {currentMode === 'flashcards' && studySession.studied > 0 && (
                    <Badge variant="success">Session: {studySession.correct}/{studySession.studied}</Badge>
                )}
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

            {/* Contrôles pour Flashcards */}
            {currentMode === 'flashcards' && (
                <div className="flashcard-controls" style={{ textAlign: 'center', margin: '20px 0' }}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ marginRight: '10px', color: '#374151' }}>Difficulté:</label>
                        <select
                            value={selectedDifficulty}
                            onChange={(e) => {
                                setSelectedDifficulty(e.target.value)
                                setWordIndex(0)
                                setShowTranslation(false)
                            }}
                            style={{
                                padding: '8px 12px',
                                borderRadius: '6px',
                                border: '1px solid #D1D5DB',
                                backgroundColor: 'white'
                            }}
                        >
                            <option value="beginner">🟢 Débutant</option>
                            <option value="intermediate">🟡 Intermédiaire</option>
                            <option value="advanced">🔴 Avancé</option>
                        </select>
                        <button
                            onClick={resetSession}
                            style={{
                                marginLeft: '10px',
                                padding: '8px 15px',
                                backgroundColor: '#6B7280',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer'
                            }}
                        >
                            🔄 Reset Session
                        </button>
                    </div>

                    {allWords && allWords.length > 0 && (
                        <div style={{ color: '#6B7280', fontSize: '14px' }}>
                            Mot {wordIndex + 1} sur {allWords.length}
                            {knownWords.size > 0 && ` • ${knownWords.size} mots maîtrisés`}
                        </div>
                    )}
                </div>
            )}

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
                {currentMode === 'flashcards' && displayWord && (
                    <div className="flashcard-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {/* Carte principale */}
                        <div
                            className="flashcard"
                            onClick={toggleTranslation}
                            style={{
                                border: knownWords.has(displayWord.word) ? '3px solid #10B981' : '2px solid #2563EB',
                                borderRadius: '16px',
                                padding: '40px',
                                margin: '20px 0',
                                backgroundColor: knownWords.has(displayWord.word) ? '#ECFDF5' : '#EFF6FF',
                                cursor: 'pointer',
                                minWidth: '400px',
                                minHeight: '200px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                                position: 'relative'
                            }}
                        >
                            {knownWords.has(displayWord.word) && (
                                <div style={{
                                    position: 'absolute',
                                    top: '10px',
                                    right: '15px',
                                    color: '#10B981',
                                    fontSize: '20px'
                                }}>
                                    ✅
                                </div>
                            )}

                            <div style={{ textAlign: 'center' }}>
                                <h2 style={{
                                    fontSize: '36px',
                                    color: knownWords.has(displayWord.word) ? '#10B981' : '#2563EB',
                                    marginBottom: '20px',
                                    fontWeight: '600'
                                }}>
                                    {displayWord.word}
                                </h2>

                                {showTranslation ? (
                                    <div style={{
                                        fontSize: '24px',
                                        color: '#374151',
                                        fontStyle: 'italic',
                                        opacity: 0.9
                                    }}>
                                        {displayWord.translation}
                                    </div>
                                ) : (
                                    <div style={{
                                        color: '#6B7280',
                                        fontSize: '16px',
                                        fontStyle: 'italic'
                                    }}>
                                        Cliquez pour voir la traduction
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Contrôles de navigation */}
                        <div className="flashcard-navigation" style={{
                            display: 'flex',
                            gap: '15px',
                            marginBottom: '20px',
                            flexWrap: 'wrap',
                            justifyContent: 'center'
                        }}>
                            <button
                                onClick={previousWord}
                                style={{
                                    padding: '12px 20px',
                                    backgroundColor: '#6B7280',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '16px'
                                }}
                            >
                                ⬅️ Précédent
                            </button>

                            <button
                                onClick={toggleTranslation}
                                style={{
                                    padding: '12px 20px',
                                    backgroundColor: '#2563EB',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '16px'
                                }}
                            >
                                {showTranslation ? '🙈 Cacher' : '👁️ Révéler'}
                            </button>

                            <button
                                onClick={nextWord}
                                style={{
                                    padding: '12px 20px',
                                    backgroundColor: '#6B7280',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '16px'
                                }}
                            >
                                Suivant ➡️
                            </button>
                        </div>

                        {/* Actions d'apprentissage */}
                        {showTranslation && (
                            <div className="learning-actions" style={{
                                display: 'flex',
                                gap: '15px',
                                marginTop: '10px'
                            }}>
                                <button
                                    onClick={markAsStudying}
                                    style={{
                                        padding: '10px 20px',
                                        backgroundColor: '#F59E0B',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    📖 À revoir
                                </button>

                                <button
                                    onClick={markAsKnown}
                                    disabled={knownWords.has(displayWord.word)}
                                    style={{
                                        padding: '10px 20px',
                                        backgroundColor: knownWords.has(displayWord.word) ? '#9CA3AF' : '#10B981',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: knownWords.has(displayWord.word) ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    {knownWords.has(displayWord.word) ? '✅ Maîtrisé' : '🎯 Je connais'}
                                </button>
                            </div>
                        )}

                        {/* Informations supplémentaires */}
                        <div style={{
                            marginTop: '20px',
                            padding: '15px',
                            backgroundColor: '#F8FAFC',
                            borderRadius: '8px',
                            textAlign: 'center',
                            fontSize: '14px',
                            color: '#64748B'
                        }}>
                            <p>Difficulté: <strong>{selectedDifficulty}</strong></p>
                            {studySession.studied > 0 && (
                                <p>Progress: {studySession.correct}/{studySession.studied} mots maîtrisés ({Math.round((studySession.correct / studySession.studied) * 100)}%)</p>
                            )}
                        </div>

                        {/* Aide raccourcis clavier */}
                        <div style={{
                            marginTop: '15px',
                            padding: '12px',
                            backgroundColor: '#FEF3C7',
                            borderRadius: '8px',
                            fontSize: '12px',
                            color: '#92400E',
                            textAlign: 'center'
                        }}>
                            <strong>⌨️ Raccourcis:</strong> ←/→ Navigation • Espace/Enter Révéler • K Je connais • R À revoir
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
