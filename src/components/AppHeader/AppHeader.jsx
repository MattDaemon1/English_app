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
        <header className={`${theme.cardBackground} ${theme.border} rounded-lg p-4 sm:p-6 mb-6 sm:mb-8 mx-2 sm:mx-4`}>
            <div className="flex flex-wrap items-end justify-center gap-4 sm:gap-6">
                {/* Difficulté */}
                <div className="min-w-[200px]">
                    <label htmlFor="difficulty-select" className={`block text-xs sm:text-sm font-medium ${theme.textSecondary} mb-2`}>
                        Niveau de difficulté
                    </label>
                    <select
                        id="difficulty-select"
                        value={selectedDifficulty}
                        onChange={(e) => onDifficultyChange(e.target.value)}
                        className={`w-full p-2 sm:p-3 rounded-lg border transition-colors text-sm ${theme.input} ${theme.border}`}
                    >
                        <option value="all">Tous les niveaux</option>
                        <option value="beginner">Débutant</option>
                        <option value="intermediate">Intermédiaire</option>
                        <option value="advanced">Avancé</option>
                    </select>
                </div>

                {/* Thème */}
                <div className="min-w-[200px]">
                    <label htmlFor="theme-select" className={`block text-xs sm:text-sm font-medium ${theme.textSecondary} mb-2`}>
                        Thème de couleur
                    </label>
                    <select
                        id="theme-select"
                        value={selectedTheme}
                        onChange={(e) => onThemeChange(e.target.value)}
                        className={`w-full p-2 sm:p-3 rounded-lg border transition-colors text-sm ${theme.input} ${theme.border}`}
                    >
                        {Object.entries(themes).map(([key, themeData]) => (
                            <option key={key} value={key}>
                                {themeData.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Mode Quiz */}
                <div className="min-w-[250px]">
                    {!isQuizMode && (
                        <button
                            onClick={onStartQuiz}
                            className={`w-full px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${theme.button} ${theme.buttonHover}`}
                        >
                            🎯 Commencer le Quiz (10 questions)
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};
