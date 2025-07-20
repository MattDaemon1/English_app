import { Badge } from '../ui/badge.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card.jsx';

export const FlashcardComponent = ({
    currentWord,
    currentWordIndex,
    totalWords,
    showAnswer,
    theme,
    onNext,
    onPrevious,
    onToggleAnswer,
    onKnowAnswer
}) => {
    const getDifficultyLabel = (difficulty) => {
        switch (difficulty) {
            case 'beginner': return 'Débutant';
            case 'intermediate': return 'Intermédiaire';
            case 'advanced': return 'Avancé';
            default: return difficulty;
        }
    };

    if (!currentWord) {
        return (
            <div className="flex items-center justify-center">
                <div className={`text-xl ${theme.text}`}>Aucun mot trouvé</div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center">
            <Card className={`w-full max-w-2xl mx-4 ${theme.cardBackground} ${theme.border}`}>
                <CardHeader>
                    <div className="flex justify-between items-center mb-4">
                        <Badge variant="secondary" className={theme.badge}>
                            {currentWordIndex + 1} / {totalWords}
                        </Badge>
                        <Badge
                            variant={currentWord.difficulty === 'advanced' ? 'destructive' : 'secondary'}
                            className={theme.badge}
                        >
                            {getDifficultyLabel(currentWord.difficulty)}
                        </Badge>
                    </div>
                    <CardTitle className={`text-center ${theme.text}`}>
                        Flashcard - Apprentissage
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div
                        className={`text-center cursor-pointer p-8 rounded-lg transition-all duration-300 ${theme.cardSecondary}`}
                        onClick={onToggleAnswer}
                    >
                        <div className={`text-4xl font-bold mb-4 ${theme.accent}`}>
                            {currentWord.word}
                        </div>
                        <div className={`text-2xl ${theme.text} transition-opacity duration-300 ${showAnswer ? 'opacity-100' : 'opacity-0'}`}>
                            {showAnswer ? (
                                currentWord.translation && currentWord.translation !== '[ ]' && currentWord.translation.trim() !== ''
                                    ? currentWord.translation
                                    : '⚠️ Traduction non disponible'
                            ) : 'Cliquez pour voir la traduction'}
                        </div>
                    </div>

                    <div className="flex justify-between items-center">
                        <button
                            onClick={onPrevious}
                            disabled={currentWordIndex === 0}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${theme.button} ${theme.buttonHover}`}
                        >
                            ← Précédent
                        </button>

                        <div className="flex gap-2">
                            <button
                                onClick={() => onKnowAnswer(false)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${theme.buttonSecondary} ${theme.buttonSecondaryHover}`}
                            >
                                ❌ Je ne sais pas
                            </button>
                            <button
                                onClick={() => onKnowAnswer(true)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${theme.button} ${theme.buttonHover}`}
                            >
                                ✅ Je sais
                            </button>
                        </div>

                        <button
                            onClick={onNext}
                            disabled={currentWordIndex >= totalWords - 1}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${theme.button} ${theme.buttonHover}`}
                        >
                            Suivant →
                        </button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
