import React from 'react';

/**
 * Composant d'exemple montrant l'implémentation de la nouvelle charte graphique EnglishMaster
 * 🎨 Utilise la palette de couleurs, typographie et composants UI définis dans la charte
 */
const EnglishMasterDemo = ({ theme }) => {
    return (
        <div className={`min-h-screen p-6 ${theme.background}`}>

            {/* En-tête avec la nouvelle typographie */}
            <header className="text-center mb-8">
                <h1 className={`title-main ${theme.text} mb-4`}>
                    🎓 EnglishMaster
                </h1>
                <h2 className={`subtitle ${theme.textSecondary} mb-6`}>
                    Nouvelle Charte Graphique
                </h2>
            </header>

            {/* Grille de démonstration des composants */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* Carte de palette de couleurs */}
                <div className="card-english-master">
                    <h3 className={`question-text ${theme.text} mb-4`}>🎨 Palette de Couleurs</h3>
                    <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
                            <span className="button-text">Bleu océan #3B82F6</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 bg-emerald-500 rounded-full"></div>
                            <span className="button-text">Vert forêt #10B981</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 bg-orange-500 rounded-full"></div>
                            <span className="button-text">Orange coucher #F97316</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 bg-purple-500 rounded-full"></div>
                            <span className="button-text">Violet mystique #8B5CF6</span>
                        </div>
                    </div>
                </div>

                {/* Carte de boutons */}
                <div className="card-english-master">
                    <h3 className={`question-text ${theme.text} mb-4`}>🔘 Boutons</h3>
                    <div className="space-y-3">
                        <button className="btn-english-master btn-primary w-full">
                            Bouton Principal
                        </button>
                        <button className="btn-english-master btn-success w-full">
                            Validation/Succès
                        </button>
                        <button className="btn-english-master btn-warning w-full">
                            Avertissement
                        </button>
                        <button className="btn-english-master btn-danger w-full">
                            Erreur
                        </button>
                    </div>
                </div>

                {/* Carte de typographie */}
                <div className="card-english-master">
                    <h3 className={`question-text ${theme.text} mb-4`}>🔤 Typographie</h3>
                    <div className="space-y-3">
                        <p className="title-main text-2xl">Titre Principal</p>
                        <p className="subtitle text-lg">Sous-titre</p>
                        <p className="question-text">Texte de question</p>
                        <p className="button-text">Texte de bouton</p>
                        <p className="note-text">Note secondaire</p>
                        <p className="accent-text">Citation accent</p>
                    </div>
                </div>

                {/* Carte des scores */}
                <div className="card-english-master">
                    <h3 className={`question-text ${theme.text} mb-4`}>📊 Indicateurs de Score</h3>
                    <div className="space-y-3">
                        <div className="score-low p-3 rounded-xl font-bold text-center">
                            0-4/10 - À améliorer
                        </div>
                        <div className="score-medium p-3 rounded-xl font-bold text-center">
                            5-7/10 - Bien
                        </div>
                        <div className="score-high p-3 rounded-xl font-bold text-center">
                            8-10/10 - Excellent
                        </div>
                    </div>
                </div>

                {/* Carte Quiz exemple */}
                <div className="card-english-master">
                    <h3 className={`question-text ${theme.text} mb-4`}>❓ Exemple Quiz</h3>
                    <div className="space-y-4">
                        <p className="question-text font-medium">
                            Que signifie "Beautiful" ?
                        </p>
                        <div className="space-y-2">
                            <button className={`${theme.buttonSecondary} w-full p-3 text-left rounded-xl border`}>
                                A. Laid
                            </button>
                            <button className={`${theme.buttonSuccess || theme.button} w-full p-3 text-left rounded-xl`}>
                                B. Beau ✓
                            </button>
                            <button className={`${theme.buttonSecondary} w-full p-3 text-left rounded-xl border`}>
                                C. Grand
                            </button>
                        </div>
                    </div>
                </div>

                {/* Carte des améliorations UI */}
                <div className="card-english-master">
                    <h3 className={`question-text ${theme.text} mb-4`}>✨ Améliorations UI</h3>
                    <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                            <span className="text-2xl">🎯</span>
                            <span className="button-text">Bordures arrondies 12px</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-2xl">🌊</span>
                            <span className="button-text">Ombres douces</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-2xl">🚀</span>
                            <span className="button-text">Animations hover</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-2xl">📱</span>
                            <span className="button-text">Design responsive</span>
                        </div>
                    </div>
                </div>

            </div>

            {/* Footer avec citation accent */}
            <footer className="text-center mt-12">
                <p className="accent-text text-lg">
                    "La beauté réside dans la simplicité et la cohérence"
                </p>
                <p className="note-text mt-2">
                    Charte graphique EnglishMaster - Optimisée pour l'apprentissage
                </p>
            </footer>

        </div>
    );
};

export default EnglishMasterDemo;
