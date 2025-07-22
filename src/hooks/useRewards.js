/**
 * 🎯 Hook useRewards - Gestion du système de récompenses
 */

import { useState, useEffect, useCallback } from 'react';
import { RewardSystem } from '../utils/rewardSystem';

let rewardSystemInstance = null;

export const useRewards = () => {
    const [stats, setStats] = useState(null);
    const [notifications, setNotifications] = useState([]);

    // Initialiser le système de récompenses
    useEffect(() => {
        if (!rewardSystemInstance) {
            rewardSystemInstance = new RewardSystem();
        }

        setStats(rewardSystemInstance.getStats());
    }, []);

    // Fonction pour ajouter une notification
    const addNotification = useCallback((reward) => {
        const id = Date.now();
        const notification = { id, ...reward };

        setNotifications(prev => [...prev, notification]);

        // Auto-suppression après 4 secondes
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 4000);
    }, []);

    // Fonctions d'action avec récompenses
    const actions = {
        // Nouveau mot appris
        wordLearned: useCallback(() => {
            if (!rewardSystemInstance) return;

            const reward = rewardSystemInstance.wordLearned();
            setStats(rewardSystemInstance.getStats());

            if (reward.newBadges?.length > 0) {
                addNotification(reward);
            }

            return reward;
        }, [addNotification]),

        // Bonne réponse
        correctAnswer: useCallback((responseTime = null) => {
            if (!rewardSystemInstance) return;

            const reward = rewardSystemInstance.correctAnswer(responseTime);
            setStats(rewardSystemInstance.getStats());

            if (reward.newBadges?.length > 0) {
                addNotification(reward);
            }

            return reward;
        }, [addNotification]),

        // Mauvaise réponse
        incorrectAnswer: useCallback(() => {
            if (!rewardSystemInstance) return;

            rewardSystemInstance.incorrectAnswer();
            setStats(rewardSystemInstance.getStats());
        }, []),

        // Quiz parfait
        perfectQuiz: useCallback(() => {
            if (!rewardSystemInstance) return;

            const reward = rewardSystemInstance.perfectQuiz();
            setStats(rewardSystemInstance.getStats());

            if (reward.newBadges?.length > 0) {
                addNotification(reward);
            }

            return reward;
        }, [addNotification]),

        // Prononciation écoutée
        pronunciationListened: useCallback(() => {
            if (!rewardSystemInstance) return;

            const reward = rewardSystemInstance.pronunciationListened();
            setStats(rewardSystemInstance.getStats());

            if (reward.newBadges?.length > 0) {
                addNotification(reward);
            }

            return reward;
        }, [addNotification]),

        // Favori ajouté
        favoriteAdded: useCallback(() => {
            if (!rewardSystemInstance) return;

            const reward = rewardSystemInstance.favoriteAdded();
            setStats(rewardSystemInstance.getStats());

            if (reward.newBadges?.length > 0) {
                addNotification(reward);
            }

            return reward;
        }, [addNotification]),

        // XP custom
        addXP: useCallback((amount, reason) => {
            if (!rewardSystemInstance) return;

            const reward = rewardSystemInstance.addXP(amount, reason);
            setStats(rewardSystemInstance.getStats());

            if (reward.newBadges?.length > 0) {
                addNotification(reward);
            }

            return reward;
        }, [addNotification]),

        // Reset (pour debug)
        reset: useCallback(() => {
            if (!rewardSystemInstance) return;

            rewardSystemInstance.reset();
            setStats(rewardSystemInstance.getStats());
            setNotifications([]);
        }, [])
    };

    // Fonction pour supprimer une notification
    const removeNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    return {
        stats,
        notifications,
        actions,
        removeNotification
    };
};
