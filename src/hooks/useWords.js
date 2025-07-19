import { useState, useEffect } from 'react';
import { MockWordService } from '../services/MockWordService.js';

export const useWords = (selectedDifficulty, mode) => {
    const [words, setWords] = useState([]);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [totalWords, setTotalWords] = useState(0);
    const [showAnswer, setShowAnswer] = useState(true);

    const wordService = new MockWordService();
    const currentWord = words[currentWordIndex];

    useEffect(() => {
        if (mode === 'flashcard') {
            loadWords();
        }
    }, [selectedDifficulty, mode]);

    const loadWords = async () => {
        setLoading(true);
        try {
            const options = {
                limit: 50,
                offset: 0,
                difficulty: selectedDifficulty === 'all' ? null : selectedDifficulty
            };

            const wordsData = await wordService.getWords(options);
            const count = await wordService.getWordsCount({
                difficulty: selectedDifficulty === 'all' ? null : selectedDifficulty
            });

            setWords(wordsData);
            setTotalWords(count);
            setCurrentWordIndex(0);
        } catch (error) {
            console.error('Erreur lors du chargement des mots:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        if (currentWordIndex < words.length - 1) {
            setCurrentWordIndex(currentWordIndex + 1);
            setShowAnswer(true);
        }
    };

    const handlePrevious = () => {
        if (currentWordIndex > 0) {
            setCurrentWordIndex(currentWordIndex - 1);
            setShowAnswer(true);
        }
    };

    const toggleAnswer = () => {
        setShowAnswer(!showAnswer);
    };

    const handleKnowAnswer = async (knows) => {
        handleNext();
    };

    return {
        words,
        currentWord,
        currentWordIndex,
        loading,
        totalWords,
        showAnswer,
        handleNext,
        handlePrevious,
        toggleAnswer,
        handleKnowAnswer,
        loadWords
    };
};
