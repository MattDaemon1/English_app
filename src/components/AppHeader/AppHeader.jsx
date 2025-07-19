import { themes } from '../../themes/index.js';

export const AppHeader = ({
    selectedDifficulty,
    selectedTheme,
    isQuizMode,
    theme,
    onDifficultyChange,
    onThemeChange,
    onStartQuiz
}) => {
    return (
        <header className={`${theme.cardBackground} ${theme.border} rounded-lg p-6 mb-8 mx-4`}>
            <div className="grid md:grid-cols-3 gap-6">
                {/* Difficulté */}
                <div>
                    <label htmlFor="difficulty-select" className={`block text-sm font-medium ${theme.textSecondary} mb-2`}>
                        Niveau de difficulté
                    </label>
                    <select
                        id="difficulty-select"
                        value={selectedDifficulty}
                        onChange={(e) => onDifficultyChange(e.target.value)}
                        className={`w-full p-3 rounded-lg border transition-colors ${theme.input} ${theme.border}`}
                    >
                        <option value="all">Tous les niveaux</option>
                        <option value="beginner">Débutant</option>
                        <option value="intermediate">Intermédiaire</option>
                        <option value="advanced">Avancé</option>
                    </select>
                </div>

                {/* Thème */}
                <div>
                    <label htmlFor="theme-select" className={`block text-sm font-medium ${theme.textSecondary} mb-2`}>
                        Thème de couleur
                    </label>
                    <select
                        id="theme-select"
                        value={selectedTheme}
                        onChange={(e) => onThemeChange(e.target.value)}
                        className={`w-full p-3 rounded-lg border transition-colors ${theme.input} ${theme.border}`}
                    >
                        {Object.entries(themes).map(([key, themeData]) => (
                            <option key={key} value={key}>
                                {themeData.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Mode Quiz */}
                <div className="flex items-end">
                    {!isQuizMode && (
                        <button
                            onClick={onStartQuiz}
                            className={`w-full px-6 py-3 rounded-lg font-medium transition-colors ${theme.button} ${theme.buttonHover}`}
                        >
                            🎯 Commencer le Quiz (10 questions)
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};
