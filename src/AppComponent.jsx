import { useState } from 'react'
import Badge from './components/Badge.jsx'
import { themes } from './themes/index.js'
import { AuthProvider, useAuth } from './hooks/useAuth.jsx'
import { useWords } from './hooks/useWords.js'
import { LoginForm } from './components/Auth/LoginForm.jsx'
import './App.css'

function AppContent() {
    const [selectedDifficulty] = useState('beginner')
    const [selectedTheme] = useState('classic')
    const { currentUser, isAuthenticated } = useAuth()

    // Récupération du thème
    const theme = themes[selectedTheme] || themes.classic

    // Debug : vérifier que le thème est bien chargé
    console.log('Theme sélectionné:', selectedTheme, 'Theme object:', theme)

    // Ajout du système de mots
    const {
        currentWord,
        totalWords,
        loading
    } = useWords(selectedDifficulty, 'flashcard')

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
                <p>✅ Base + CSS + Badge + Auth + Words + LoginForm</p>
            </div>

            <div className="content-section">
                {!isAuthenticated && (
                    <div>
                        <p>Connectez-vous pour sauvegarder vos progrès :</p>
                        <LoginForm theme={theme} />
                    </div>
                )}

                {currentWord && (
                    <div className="word-preview">
                        <h3>Mot actuel: {currentWord.word}</h3>
                        <p>Traduction: {currentWord.translation}</p>
                        <p>Difficulté: {selectedDifficulty}</p>
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
