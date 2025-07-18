import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
  // Get from local storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
}

export function useProgress() {
  const [progress, setProgress] = useLocalStorage('englishMaster_progress', {
    wordsLearned: [],
    totalScore: 0,
    totalAnswered: 0,
    streakDays: 0,
    lastStudyDate: null,
    achievements: [],
    studyTime: 0
  });

  const updateProgress = (updates) => {
    setProgress(prev => ({
      ...prev,
      ...updates,
      lastStudyDate: new Date().toISOString().split('T')[0]
    }));
  };

  const addWordLearned = (wordId) => {
    setProgress(prev => ({
      ...prev,
      wordsLearned: [...new Set([...prev.wordsLearned, wordId])],
      lastStudyDate: new Date().toISOString().split('T')[0]
    }));
  };

  const incrementScore = () => {
    setProgress(prev => ({
      ...prev,
      totalScore: prev.totalScore + 1,
      totalAnswered: prev.totalAnswered + 1,
      lastStudyDate: new Date().toISOString().split('T')[0]
    }));
  };

  const incrementAnswered = () => {
    setProgress(prev => ({
      ...prev,
      totalAnswered: prev.totalAnswered + 1,
      lastStudyDate: new Date().toISOString().split('T')[0]
    }));
  };

  const resetProgress = () => {
    setProgress({
      wordsLearned: [],
      totalScore: 0,
      totalAnswered: 0,
      streakDays: 0,
      lastStudyDate: null,
      achievements: [],
      studyTime: 0
    });
  };

  return {
    progress,
    updateProgress,
    addWordLearned,
    incrementScore,
    incrementAnswered,
    resetProgress
  };
}

