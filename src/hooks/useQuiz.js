import { useState } from 'react';
import { getApiService } from '../services/ApiWordService.js';

export const useQuiz = (selectedDifficulty) => {
    const [isQuizMode, setIsQuizMode] = useState(false);
    const [quizWords, setQuizWords] = useState([]);
    const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [score, setScore] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [quizFinished, setQuizFinished] = useState(false);

    const wordService = getApiService();
    const currentQuizWord = quizWords[currentQuizIndex];

    const startQuiz = async () => {
        try {
            // Générer 10 mots pour le quiz
            const quiz = [];
            for (let i = 0; i < 10; i++) {
                const quizWord = await wordService.generateQuiz(selectedDifficulty, 10);
                if (quizWord) {
                    quiz.push(quizWord);
                }
            }

            setQuizWords(quiz);
            setCurrentQuizIndex(0);
            setScore(0);
            setAnswers([]);
            setIsQuizMode(true);
            setShowResult(false);
            setQuizFinished(false);
            setSelectedAnswer(null);
        } catch (error) {
            console.error('Erreur lors de la génération du quiz:', error);
        }
    };

    const selectAnswer = (answerIndex) => {
        setSelectedAnswer(answerIndex);
    };

    const submitAnswer = () => {
        const isCorrect = selectedAnswer === currentQuizWord.correctAnswer;
        const newAnswer = {
            questionIndex: currentQuizIndex,
            selectedAnswer: selectedAnswer,
            isCorrect: isCorrect,
            word: currentQuizWord.word,
            correctTranslation: currentQuizWord.choices[currentQuizWord.correctAnswer]
        };

        setAnswers([...answers, newAnswer]);

        if (isCorrect) {
            setScore(score + 1);
        }

        setShowResult(true);
    };

    const nextQuestion = () => {
        if (currentQuizIndex < quizWords.length - 1) {
            setCurrentQuizIndex(currentQuizIndex + 1);
            setSelectedAnswer(null);
            setShowResult(false);
        } else {
            setQuizFinished(true);
        }
    };

    const restartQuiz = () => {
        setIsQuizMode(false);
        setQuizWords([]);
        setCurrentQuizIndex(0);
        setSelectedAnswer(null);
        setScore(0);
        setAnswers([]);
        setShowResult(false);
        setQuizFinished(false);
    };

    const exitQuiz = () => {
        restartQuiz();
    };

    return {
        isQuizMode,
        quizWords,
        currentQuizWord,
        currentQuizIndex,
        selectedAnswer,
        score,
        answers,
        showResult,
        quizFinished,
        startQuiz,
        selectAnswer,
        submitAnswer,
        nextQuestion,
        restartQuiz,
        exitQuiz
    };
};
