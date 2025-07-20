import React, { useState } from 'react';

/**
 * 🎨 Démonstration de la Nouvelle Charte Graphique EnglishMaster
 * Fond crème #FAF8F6 avec système de couleurs harmonieux
 */
const CharteEnglishMasterDemo = () => {
    const [score, setScore] = useState(7);
    const [selectedAnswer, setSelectedAnswer] = useState(null);

    // Fonction pour déterminer la classe de score
    const getScoreClass = (scoreValue) => {
        if (scoreValue >= 7) return 'score-excellent';
        if (scoreValue >= 4) return 'score-moyen';
        return 'score-faible';
    };

    // Données de démonstration
    const questionDemo = {
        word: "Beautiful",
        pronunciation: "/ˈbjuːtɪfʊl/",
        choices: ["Laid", "Beau", "Grand", "Petit"],
        correctAnswer: 1
    };

    return (
        <div style={{ backgroundColor: '#FAF8F6', minHeight: '100vh', padding: '24px' }}>

            {/* En-tête avec nouvelle typographie */}
            <header className="text-center mb-12">
                <h1 className="title-main text-4xl mb-4" style={{ color: '#1E293B' }}>
                    🎓 EnglishMaster
                </h1>
                <h2 className="subtitle text-xl mb-6" style={{ color: '#334155' }}>
                    Nouvelle Charte Graphique - Fond Crème
                </h2>
                <p className="text-secondary" style={{ color: '#64748B' }}>
                    Système de couleurs optimisé pour l'apprentissage
                </p>
            </header>

            <div className="max-w-6xl mx-auto">

                {/* Grille de composants */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">

                    {/* Carte Palette de Couleurs */}
                    <div className="card-englishmaster">
                        <h3 className="question-text mb-4" style={{ color: '#1E293B' }}>
                            🎨 Palette de Couleurs
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: '#FAF8F6' }}></div>
                                <span style={{ color: '#334155' }}>Fond crème #FAF8F6</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: '#1E293B' }}></div>
                                <span style={{ color: '#334155' }}>Texte principal #1E293B</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: '#2563EB' }}></div>
                                <span style={{ color: '#334155' }}>Bleu principal #2563EB</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: '#E2E8F0' }}></div>
                                <span style={{ color: '#334155' }}>Gris secondaire #E2E8F0</span>
                            </div>
                        </div>
                    </div>

                    {/* Carte Boutons */}
                    <div className="card-englishmaster">
                        <h3 className="question-text mb-4" style={{ color: '#1E293B' }}>
                            🔘 Boutons
                        </h3>
                        <div className="space-y-3">
                            <button
                                className="btn-englishmaster btn-primary w-full"
                                style={{
                                    backgroundColor: '#2563EB',
                                    color: 'white',
                                    borderRadius: '10px',
                                    padding: '10px 16px',
                                    fontWeight: '600',
                                    fontSize: '16px',
                                    boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = '#1E40AF';
                                    e.target.style.transform = 'translateY(-1px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = '#2563EB';
                                    e.target.style.transform = 'translateY(0)';
                                }}
                            >
                                Bouton Principal
                            </button>

                            <button
                                className="btn-englishmaster btn-secondary w-full"
                                style={{
                                    backgroundColor: '#E2E8F0',
                                    color: '#1E293B',
                                    borderRadius: '10px',
                                    padding: '10px 16px',
                                    fontWeight: '600',
                                    fontSize: '16px',
                                    boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = '#CBD5E1';
                                    e.target.style.transform = 'translateY(-1px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = '#E2E8F0';
                                    e.target.style.transform = 'translateY(0)';
                                }}
                            >
                                Bouton Secondaire
                            </button>
                        </div>
                    </div>

                    {/* Carte Indicateurs de Score */}
                    <div className="card-englishmaster">
                        <h3 className="question-text mb-4" style={{ color: '#1E293B' }}>
                            📊 Indicateurs de Score
                        </h3>
                        <div className="space-y-3">
                            <div className="score-faible text-center">
                                0-3/10 - À améliorer
                            </div>
                            <div className="score-moyen text-center">
                                4-6/10 - Bien
                            </div>
                            <div className="score-excellent text-center">
                                7-10/10 - Excellent
                            </div>
                        </div>

                        {/* Contrôle interactif */}
                        <div className="mt-4">
                            <label style={{ color: '#334155', fontSize: '14px' }}>
                                Test Score: {score}/10
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="10"
                                value={score}
                                onChange={(e) => setScore(parseInt(e.target.value))}
                                className="w-full mt-2"
                            />
                            <div className={`mt-2 text-center ${getScoreClass(score)}`}>
                                Score actuel: {score}/10
                            </div>
                        </div>
                    </div>

                </div>

                {/* Quiz Démonstration */}
                <div className="mb-8">
                    <div className="card-englishmaster max-w-2xl mx-auto">
                        <h3 className="question-text mb-6 text-center" style={{ color: '#1E293B' }}>
                            ❓ Exemple de Quiz
                        </h3>

                        <div className="text-center mb-6">
                            <div className="text-3xl font-bold mb-2" style={{ color: '#1E293B' }}>
                                {questionDemo.word}
                            </div>
                            <div className="text-lg mb-4" style={{ color: '#64748B' }}>
                                {questionDemo.pronunciation}
                            </div>
                            <p className="question-text" style={{ color: '#334155' }}>
                                Que signifie ce mot en français ?
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {questionDemo.choices.map((choice, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedAnswer(index)}
                                    className="p-4 rounded-lg border text-left transition-all duration-200"
                                    style={{
                                        backgroundColor: selectedAnswer === index
                                            ? (index === questionDemo.correctAnswer ? '#10B981' : '#EF4444')
                                            : '#E2E8F0',
                                        color: selectedAnswer === index ? 'white' : '#1E293B',
                                        borderColor: selectedAnswer === index ? 'transparent' : '#CBD5E1',
                                        fontWeight: '500',
                                        cursor: 'pointer'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (selectedAnswer === null) {
                                            e.target.style.backgroundColor = '#CBD5E1';
                                            e.target.style.transform = 'translateY(-1px)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (selectedAnswer === null) {
                                            e.target.style.backgroundColor = '#E2E8F0';
                                            e.target.style.transform = 'translateY(0)';
                                        }
                                    }}
                                >
                                    <span className="font-semibold mr-2">
                                        {String.fromCharCode(65 + index)}.
                                    </span>
                                    {choice}
                                    {selectedAnswer === index && index === questionDemo.correctAnswer && (
                                        <span className="ml-2">✓</span>
                                    )}
                                    {selectedAnswer === index && index !== questionDemo.correctAnswer && (
                                        <span className="ml-2">✗</span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {selectedAnswer !== null && (
                            <div className="mt-6 text-center">
                                <div className={selectedAnswer === questionDemo.correctAnswer ? 'score-excellent' : 'score-faible'}>
                                    {selectedAnswer === questionDemo.correctAnswer
                                        ? '🎉 Bonne réponse !'
                                        : '😊 Essayez encore !'}
                                </div>
                                <button
                                    onClick={() => setSelectedAnswer(null)}
                                    className="mt-3 btn-englishmaster btn-secondary"
                                    style={{
                                        backgroundColor: '#E2E8F0',
                                        color: '#1E293B',
                                        borderRadius: '10px',
                                        padding: '8px 16px',
                                        fontSize: '14px',
                                        border: 'none',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Réinitialiser
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Avantages de la nouvelle charte */}
                <div className="card-englishmaster">
                    <h3 className="question-text mb-6 text-center" style={{ color: '#1E293B' }}>
                        ✨ Avantages de la Nouvelle Charte
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="text-center p-4">
                            <div className="text-3xl mb-2">👁️</div>
                            <div className="font-semibold mb-1" style={{ color: '#1E293B' }}>
                                Lisibilité
                            </div>
                            <div className="text-sm" style={{ color: '#64748B' }}>
                                Fond crème doux pour les yeux
                            </div>
                        </div>

                        <div className="text-center p-4">
                            <div className="text-3xl mb-2">🎯</div>
                            <div className="font-semibold mb-1" style={{ color: '#1E293B' }}>
                                Contraste
                            </div>
                            <div className="text-sm" style={{ color: '#64748B' }}>
                                Texte ardoise très lisible
                            </div>
                        </div>

                        <div className="text-center p-4">
                            <div className="text-3xl mb-2">🌊</div>
                            <div className="font-semibold mb-1" style={{ color: '#1E293B' }}>
                                Animations
                            </div>
                            <div className="text-sm" style={{ color: '#64748B' }}>
                                Transitions douces 0.2s
                            </div>
                        </div>

                        <div className="text-center p-4">
                            <div className="text-3xl mb-2">📱</div>
                            <div className="font-semibold mb-1" style={{ color: '#1E293B' }}>
                                Responsive
                            </div>
                            <div className="text-sm" style={{ color: '#64748B' }}>
                                Adapté à tous écrans
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Footer */}
            <footer className="text-center mt-12">
                <p style={{ color: '#64748B', fontSize: '14px' }}>
                    🎨 Charte Graphique EnglishMaster - Optimisée pour l'apprentissage - 2025
                </p>
            </footer>

        </div>
    );
};

export default CharteEnglishMasterDemo;
