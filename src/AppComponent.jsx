import { useState, useEffect } from 'react'
import Badge from './components/Badge.jsx'
import { themes } from './themes/index.js'
import { AuthProvider, useAuth } from './hooks/useAuth.jsx'
import { useWords } from './hooks/useWords.js'
import { useQuiz } from './hooks/useQuiz.js'
import { useRewards } from './hooks/useRewards.js'
import { useResponsive } from './hooks/useResponsive.js'
import useNotifications from './hooks/useNotifications.js'
import useAdmin from './hooks/useAdmin.js'
import RewardNotification from './components/Rewards/RewardNotification.jsx'
import LevelDisplay from './components/Rewards/LevelDisplay.jsx'
import StatisticsDashboard from './components/Rewards/StatisticsDashboard.jsx'
import AuthButton from './components/Auth/AuthButton.jsx'
import NotificationSystem from './components/Notifications/NotificationSystem.jsx'
import AdminDashboard from './components/Admin/AdminDashboard.jsx'
import AdminCredentials from './components/Admin/AdminCredentials.jsx'
import './App.css'

function AppContent() {
    const [selectedDifficulty, setSelectedDifficulty] = useState('beginner')
    const [selectedTheme] = useState('classic')
    const [currentMode, setCurrentMode] = useState('flashcards')
    const [showTranslation, setShowTranslation] = useState(false)
    const [wordIndex, setWordIndex] = useState(0)
    const [knownWords, setKnownWords] = useState(new Set())
    const [studySession, setStudySession] = useState({ studied: 0, correct: 0 })
    const [shuffledWords, setShuffledWords] = useState([])
    const [isAutoPlay, setIsAutoPlay] = useState(false)
    const [autoPlaySpeed, setAutoPlaySpeed] = useState(3000)
    const [favorites, setFavorites] = useState(new Set())
    const [answerStartTime, setAnswerStartTime] = useState(null)
    const [showAdminDashboard, setShowAdminDashboard] = useState(false)
    const { isAuthenticated, user } = useAuth()
    const { isMobile, isTablet } = useResponsive()
    const { isAdmin } = useAdmin()

    // Système de récompenses
    const { stats, notifications, actions, removeNotification } = useRewards()

    // Système de notifications modernes
    const notificationSystem = useNotifications()

    // Récupération du thème
    const theme = themes[selectedTheme] || themes.classic

    // Ajout du système de mots (flashcards)
    const {
        currentWord,
        totalWords,
        loading,
        allWords
    } = useWords(selectedDifficulty, 'flashcard')

    // Fonction pour mélanger un tableau
    const shuffleArray = (array) => {
        const shuffled = [...array]
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
        }
        return shuffled
    }

    // Effet pour mélanger les mots quand ils changent
    useEffect(() => {
        console.log('Words loaded:', allWords?.length, 'words') // Debug
        if (allWords && allWords.length > 0) {
            const shuffled = shuffleArray(allWords)
            setShuffledWords(shuffled)
            setWordIndex(0)
            setShowTranslation(false)
            console.log('Shuffled words set:', shuffled.length) // Debug
        }
    }, [allWords, selectedDifficulty])

    // Auto-play functionality
    useEffect(() => {
        let interval
        if (isAutoPlay && shuffledWords.length > 0) {
            interval = setInterval(() => {
                setShowTranslation(prev => {
                    if (prev) {
                        // Utiliser la forme callback pour éviter les closures stales
                        setWordIndex(prevIndex => (prevIndex + 1) % shuffledWords.length)
                        return false
                    } else {
                        return true
                    }
                })
            }, autoPlaySpeed)
        }
        return () => clearInterval(interval)
    }, [isAutoPlay, autoPlaySpeed, shuffledWords.length]) // Utiliser .length pour éviter la re-création constante

    // Fonctions pour les flashcards améliorées
    const nextWord = () => {
        console.log('NextWord called, current index:', wordIndex, 'total words:', shuffledWords?.length) // Debug
        if (shuffledWords && shuffledWords.length > 0) {
            const newIndex = (wordIndex + 1) % shuffledWords.length
            console.log('Moving to index:', newIndex) // Debug
            setWordIndex(newIndex)
            setShowTranslation(false)
            setAnswerStartTime(null) // Reset timer
        }
    }

    const previousWord = () => {
        console.log('PreviousWord called, current index:', wordIndex) // Debug
        if (shuffledWords && shuffledWords.length > 0) {
            const newIndex = (wordIndex - 1 + shuffledWords.length) % shuffledWords.length
            console.log('Moving to index:', newIndex) // Debug
            setWordIndex(newIndex)
            setShowTranslation(false)
            setAnswerStartTime(null) // Reset timer
        }
    }

    const toggleFavorite = () => {
        const currentDisplayWord = shuffledWords && shuffledWords.length > 0 ? shuffledWords[wordIndex] : null
        if (currentDisplayWord) {
            const newFavorites = new Set(favorites)
            if (favorites.has(currentDisplayWord.word)) {
                newFavorites.delete(currentDisplayWord.word)
                notificationSystem.info(
                    'Favori retiré',
                    `"${currentDisplayWord.word}" retiré des favoris`
                )
            } else {
                newFavorites.add(currentDisplayWord.word)
                notificationSystem.success(
                    'Favori ajouté !',
                    `"${currentDisplayWord.word}" ajouté aux favoris ❤️`
                )
                // Récompense pour ajout aux favoris
                if (actions) {
                    actions.favoriteAdded()
                }
            }
            setFavorites(newFavorites)
        }
    }

    const speakWord = () => {
        const currentDisplayWord = shuffledWords && shuffledWords.length > 0 ? shuffledWords[wordIndex] : null
        if (currentDisplayWord && 'speechSynthesis' in window) {
            console.log('Speaking word:', currentDisplayWord.word) // Debug

            const utterance = new SpeechSynthesisUtterance(currentDisplayWord.word)
            utterance.lang = 'fr'
            utterance.rate = 0.8

            utterance.onstart = () => console.log('Speech started') // Debug
            utterance.onerror = (event) => console.error('Speech error:', event.error) // Debug

            speechSynthesis.speak(utterance)

            // Récompense pour écoute de prononciation
            if (actions) {
                actions.pronunciationListened()
            }
        } else {
            console.error('Speech synthesis not available or no word to speak') // Debug
        }
    }

    const toggleTranslation = () => {
        if (!showTranslation) {
            // Démarrer le chrono quand on révèle la traduction
            setAnswerStartTime(Date.now())
        }
        setShowTranslation(!showTranslation)
    }

    const markAsKnown = () => {
        const currentDisplayWord = shuffledWords && shuffledWords.length > 0 ? shuffledWords[wordIndex] : null
        if (currentDisplayWord) {
            const responseTime = answerStartTime ? Date.now() - answerStartTime : null

            setKnownWords(prev => new Set([...prev, currentDisplayWord.word]))
            setStudySession(prev => ({ ...prev, studied: prev.studied + 1, correct: prev.correct + 1 }))

            // Notification de succès
            notificationSystem.success(
                'Mot maîtrisé ! 🎉',
                `Excellent ! "${currentDisplayWord.word}" ajouté aux mots connus`
            )

            // Récompenses pour mot maîtrisé
            if (actions) {
                actions.wordLearned()
                actions.correctAnswer(responseTime)
            }

            setTimeout(nextWord, 500)
        }
    }

    const markAsStudying = () => {
        const responseTime = answerStartTime ? Date.now() - answerStartTime : null

        setStudySession(prev => ({ ...prev, studied: prev.studied + 1 }))

        // Récompenses pour tentative (même si pas maîtrisé)
        if (actions) {
            actions.addXP(1, 'Mot étudié')
        }

        setTimeout(nextWord, 500)
    }

    const resetSession = () => {
        setStudySession({ studied: 0, correct: 0 })
        setKnownWords(new Set())
        setWordIndex(0)
        setShowTranslation(false)

        // Notification de reset
        notificationSystem.info(
            'Session réinitialisée',
            'Nouvelle session d\'apprentissage commencée ! 🚀'
        )

        // Remélanger les mots
        if (allWords && allWords.length > 0) {
            const shuffled = shuffleArray(allWords)
            setShuffledWords(shuffled)
        }
    }

    // Mot actuel basé sur l'index des mots mélangés
    const displayWord = shuffledWords && shuffledWords.length > 0 ? shuffledWords[wordIndex] : null

    // Raccourcis clavier pour les flashcards
    useEffect(() => {
        const handleKeyPress = (event) => {
            if (currentMode !== 'flashcards') return

            // Vérifier si l'utilisateur est en train de taper dans un champ de saisie
            const activeElement = document.activeElement
            const isInputFocused = activeElement && (
                activeElement.tagName === 'INPUT' ||
                activeElement.tagName === 'TEXTAREA' ||
                activeElement.tagName === 'SELECT' ||
                activeElement.isContentEditable
            )

            // Ne pas activer les raccourcis si un champ de saisie est en focus
            if (isInputFocused) return

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
                case 'f':
                    event.preventDefault()
                    toggleFavorite()
                    break
                case 'p':
                    event.preventDefault()
                    speakWord()
                    break
                case 'a':
                    event.preventDefault()
                    setIsAutoPlay(!isAutoPlay)
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
    } = useQuiz(selectedDifficulty, actions)

    return (
        <div className="app-container" style={{ position: 'relative' }}>
            {/* Système de notifications moderne */}
            <NotificationSystem
                notifications={notificationSystem.notifications}
                onRemove={notificationSystem.removeNotification}
            />

            {/* Dashboard Admin */}
            {showAdminDashboard && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }} onClick={() => setShowAdminDashboard(false)}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                        maxWidth: '90%',
                        maxHeight: '90%',
                        overflow: 'auto'
                    }} onClick={(e) => e.stopPropagation()}>
                        <AdminDashboard onClose={() => setShowAdminDashboard(false)} />
                    </div>
                </div>
            )}

            {/* Anciennes notifications de récompenses (gardées pour compatibilité) */}
            {notifications.map(notification => (
                <RewardNotification
                    key={notification.id}
                    reward={notification}
                    onClose={() => removeNotification(notification.id)}
                />
            ))}

            <div className="header-section" style={{ textAlign: 'center', marginBottom: '30px', position: 'relative' }}>
                {/* Bouton de connexion/déconnexion responsive */}
                <div style={{
                    position: isMobile ? 'static' : 'absolute',
                    top: isMobile ? 'auto' : '10px',
                    right: isMobile ? 'auto' : '10px',
                    zIndex: 100,
                    marginBottom: isMobile ? '20px' : '0',
                    display: 'flex',
                    justifyContent: isMobile ? 'center' : 'flex-end',
                    gap: '10px'
                }}>
                    <AuthButton
                        variant="default"
                        size={isMobile ? "sm" : isTablet ? "md" : "md"}
                        showUserInfo={!isMobile}
                    />
                    {/* DEBUG Admin Status */}
                    <div style={{ fontSize: '10px', color: '#666', margin: '5px 0' }}>
                        DEBUG: isAuth: {isAuthenticated ? '✓' : '✗'} | isAdmin: {isAdmin ? '✓' : '✗'}
                        {user && ` | User: ${user.username || user.email}`}
                    </div>

                    {/* Bouton Dashboard Admin */}
                    {isAdmin && (
                        <button
                            onClick={() => setShowAdminDashboard(true)}
                            style={{
                                padding: isMobile ? '8px 12px' : '10px 16px',
                                backgroundColor: '#7C3AED',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: isMobile ? '12px' : '14px',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 2px 4px rgba(124, 58, 237, 0.2)'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#6D28D9'
                                e.target.style.transform = 'translateY(-1px)'
                                e.target.style.boxShadow = '0 4px 8px rgba(124, 58, 237, 0.3)'
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = '#7C3AED'
                                e.target.style.transform = 'translateY(0)'
                                e.target.style.boxShadow = '0 2px 4px rgba(124, 58, 237, 0.2)'
                            }}
                        >
                            🛡️ {!isMobile && 'Dashboard'}
                        </button>
                    )}
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <h1 className="app-title" style={{
                        fontSize: '2.5rem',
                        margin: '0 0 10px 0',
                        color: '#1F2937',
                        fontWeight: 'bold'
                    }}>
                        🎓 EnglishMaster Pro
                    </h1>
                    <p className="app-subtitle" style={{
                        fontSize: '1.1rem',
                        color: '#6B7280',
                        margin: '0 0 15px 0'
                    }}>
                        Application d'apprentissage de l'anglais avec IA
                    </p>
                    <Badge variant="premium" size="lg">Version 2.3.0 🏆 Admin</Badge>
                </div>

                {/* Affichage du niveau utilisateur */}
                {stats && (
                    <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
                        <LevelDisplay level={stats.level} stats={stats} compact={true} />
                    </div>
                )}

                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: '8px',
                    marginBottom: '15px'
                }}>
                    <Badge variant="info">Mots: {totalWords}</Badge>
                    {loading && <Badge variant="warning">Chargement...</Badge>}
                    {isQuizMode && <Badge variant="warning">Quiz: {quizScore}/10</Badge>}
                    {currentMode === 'flashcards' && studySession.studied > 0 && (
                        <Badge variant="success">Session: {studySession.correct}/{studySession.studied}</Badge>
                    )}
                    {favorites.size > 0 && (
                        <Badge variant="info">❤️ Favoris: {favorites.size}</Badge>
                    )}
                </div>
            </div>

            {/* Sélecteur de mode */}
            <div className="mode-selector" style={{ textAlign: 'center', margin: '20px 0' }}>
                <button
                    onClick={() => setCurrentMode('flashcards')}
                    style={{
                        padding: '10px 20px',
                        margin: '0 5px',
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
                        margin: '0 5px',
                        backgroundColor: currentMode === 'quiz' ? '#2563EB' : '#E5E7EB',
                        color: currentMode === 'quiz' ? 'white' : '#374151',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer'
                    }}
                >
                    🎯 Quiz
                </button>
                <button
                    onClick={() => setCurrentMode('stats')}
                    style={{
                        padding: '10px 20px',
                        margin: '0 5px',
                        backgroundColor: currentMode === 'stats' ? '#2563EB' : '#E5E7EB',
                        color: currentMode === 'stats' ? 'white' : '#374151',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer'
                    }}
                >
                    📊 Statistiques
                </button>
                {/* Indicateur admin pour les utilisateurs connectés */}
                {isAdmin && (
                    <span style={{
                        marginLeft: '15px',
                        padding: '5px 10px',
                        backgroundColor: '#7C3AED',
                        color: 'white',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600'
                    }}>
                        👑 ADMIN
                    </span>
                )}
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
                            onClick={() => {
                                const newAutoPlay = !isAutoPlay
                                console.log('Auto-play toggled:', newAutoPlay) // Debug
                                setIsAutoPlay(newAutoPlay)

                                // Notification pour auto-play
                                if (newAutoPlay) {
                                    notificationSystem.info(
                                        'Auto-play activé ▶️',
                                        'Les flashcards défilent automatiquement'
                                    )
                                } else {
                                    notificationSystem.info(
                                        'Auto-play désactivé ⏸️',
                                        'Contrôle manuel restauré'
                                    )
                                }
                            }}
                            style={{
                                marginLeft: '10px',
                                padding: '8px 15px',
                                backgroundColor: isAutoPlay ? '#EF4444' : '#10B981',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer'
                            }}
                        >
                            {isAutoPlay ? '⏸️ Pause' : '▶️ Auto'}
                        </button>

                        {isAutoPlay && (
                            <select
                                value={autoPlaySpeed}
                                onChange={(e) => setAutoPlaySpeed(parseInt(e.target.value))}
                                style={{
                                    marginLeft: '10px',
                                    padding: '8px 12px',
                                    borderRadius: '6px',
                                    border: '1px solid #D1D5DB',
                                    backgroundColor: 'white'
                                }}
                            >
                                <option value={1500}>⚡ Rapide (1.5s)</option>
                                <option value={3000}>🐾 Normal (3s)</option>
                                <option value={5000}>🐌 Lent (5s)</option>
                            </select>
                        )}

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
                {currentMode === 'flashcards' && (
                    <>
                        {loading && (
                            <div style={{ textAlign: 'center', padding: '40px' }}>
                                <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
                                <h3>Chargement des mots...</h3>
                            </div>
                        )}

                        {!loading && (!shuffledWords || shuffledWords.length === 0) && (
                            <div style={{ textAlign: 'center', padding: '40px' }}>
                                <div style={{ fontSize: '48px', marginBottom: '20px' }}>❌</div>
                                <h3>Aucun mot disponible</h3>
                                <p>Vérifiez votre connexion ou essayez une autre difficulté.</p>
                                <button
                                    onClick={() => window.location.reload()}
                                    style={{
                                        padding: '10px 20px',
                                        backgroundColor: '#2563EB',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    🔄 Recharger
                                </button>
                            </div>
                        )}

                        {!loading && displayWord && (
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

                                    {/* Bouton Favori */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            toggleFavorite()
                                        }}
                                        style={{
                                            position: 'absolute',
                                            top: '10px',
                                            left: '15px',
                                            background: 'none',
                                            border: 'none',
                                            fontSize: '20px',
                                            cursor: 'pointer',
                                            color: favorites.has(displayWord.word) ? '#EF4444' : '#D1D5DB'
                                        }}
                                    >
                                        ❤️
                                    </button>

                                    {/* Bouton Son */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            speakWord()
                                        }}
                                        style={{
                                            position: 'absolute',
                                            top: '50px',
                                            left: '15px',
                                            background: 'none',
                                            border: 'none',
                                            fontSize: '20px',
                                            cursor: 'pointer',
                                            color: '#6B7280'
                                        }}
                                    >
                                        🔊
                                    </button>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            toggleFavorite()
                                        }}
                                        style={{
                                            position: 'absolute',
                                            top: '10px',
                                            left: '15px',
                                            background: 'none',
                                            border: 'none',
                                            fontSize: '20px',
                                            cursor: 'pointer',
                                            color: favorites.has(displayWord.word) ? '#EF4444' : '#D1D5DB'
                                        }}
                                    >
                                        ❤️
                                    </button>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            speakWord()
                                        }}
                                        style={{
                                            position: 'absolute',
                                            top: '50px',
                                            left: '15px',
                                            background: 'none',
                                            border: 'none',
                                            fontSize: '20px',
                                            cursor: 'pointer',
                                            color: '#6B7280'
                                        }}
                                    >
                                        🔊
                                    </button>

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
                                    <strong>⌨️ Raccourcis:</strong> ←/→ Navigation • Espace Révéler • K Je connais • R À revoir • F Favori • P Prononcer • A Auto-play
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Mode Statistiques */}
                {currentMode === 'stats' && stats && (
                    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>
                        <StatisticsDashboard stats={stats} />
                    </div>
                )}
            </div>

            {/* Affichage des identifiants admin en développement */}
            {(process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost' || !isAuthenticated) && (
                <AdminCredentials />
            )}
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
