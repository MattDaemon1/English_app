import { Badge } from '../ui/badge.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card.jsx';

export const QuizComponent = ({
    currentQuizWord,
    currentQuizIndex,
    selectedAnswer,
    quizScore,
    quizCompleted,
    totalQuestions = 10,
    theme,
    onAnswerSelect,
    onRestart,
    onBackToFlashcards
}) => {
    const getScoreMessage = (score) => {
        if (score >= 8) return '🎉 Excellent !';
        if (score >= 6) return '👍 Bien';
        if (score >= 4) return '👌 Correct';
        return '💪 Continuez !';
    };

    if (quizCompleted) {
        return (
            <div className="flex items-center justify-center">
                <Card className={`w-full max-w-2xl mx-4 ${theme.cardBackground} ${theme.border}`}>
                    <CardHeader className="text-center">
                        <CardTitle className={`text-3xl font-bold ${theme.text}`}>Quiz terminé !</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center space-y-6">
                        <div className={`text-6xl font-bold ${theme.accent}`}>
                            {quizScore}/{totalQuestions}
                        </div>
                        <div className={`text-2xl ${theme.text}`}>
                            {getScoreMessage(quizScore)}
                        </div>
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={onRestart}
                                className={`px-6 py-3 rounded-lg font-medium transition-colors ${theme.button} ${theme.buttonHover}`}
                            >
                                Recommencer le quiz
                            </button>
                            <button
                                onClick={onBackToFlashcards}
                                className={`px-6 py-3 rounded-lg font-medium transition-colors ${theme.buttonSecondary} ${theme.buttonSecondaryHover}`}
                            >
                                Retour aux flashcards
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!currentQuizWord) {
        return (
            <div className="flex items-center justify-center">
                <div className={`text-xl ${theme.text}`}>Chargement de la question...</div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center">
            <Card className={`w-full max-w-2xl mx-4 ${theme.cardBackground} ${theme.border}`}>
                <CardHeader>
                    <div className="flex justify-between items-center mb-4">
                        <Badge variant="secondary" className={theme.badge}>
                            Question {currentQuizIndex + 1}/{totalQuestions}
                        </Badge>
                        <Badge variant="secondary" className={theme.badge}>
                            Score: {quizScore}/{totalQuestions}
                        </Badge>
                    </div>
                    <CardTitle className={`text-2xl font-bold text-center ${theme.text}`}>
                        Que signifie ce mot en français ?
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className={`text-4xl font-bold text-center py-8 ${theme.accent}`}>
                        {currentQuizWord.word}
                    </div>

                    <div className="grid gap-3">
                        {currentQuizWord.choices?.map((choice, index) => (
                            <button
                                key={index}
                                onClick={() => onAnswerSelect(index)}
                                disabled={selectedAnswer !== null}
                                className={`p-4 rounded-lg text-left transition-all duration-200 font-medium
                                    ${selectedAnswer === null
                                        ? `${theme.button} ${theme.buttonHover} hover:scale-105`
                                        : selectedAnswer === index
                                            ? index === currentQuizWord.correctAnswer
                                                ? 'bg-green-500 text-white'
                                                : 'bg-red-500 text-white'
                                            : index === currentQuizWord.correctAnswer
                                                ? 'bg-green-500 text-white'
                                                : `${theme.buttonSecondary} opacity-50`
                                    }`}
                            >
                                {choice}
                            </button>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
