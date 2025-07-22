/**
 * 🏆 Système de Badges et Récompenses - EnglishMaster
 * 
 * Gère les badges, récompenses et système de points XP
 */

// Configuration des badges disponibles
export const BADGES = {
    FIRST_WORD: {
        id: 'first_word',
        name: 'Premier Mot',
        description: 'Apprendre votre premier mot !',
        icon: '🎯',
        condition: (stats) => stats.wordsLearned >= 1,
        xp: 10
    },
    STREAK_5: {
        id: 'streak_5',
        name: 'Série de 5',
        description: '5 bonnes réponses consécutives',
        icon: '🔥',
        condition: (stats) => stats.currentStreak >= 5,
        xp: 25
    },
    STREAK_10: {
        id: 'streak_10',
        name: 'Série de 10',
        description: '10 bonnes réponses consécutives',
        icon: '⚡',
        condition: (stats) => stats.currentStreak >= 10,
        xp: 50
    },
    QUIZ_MASTER: {
        id: 'quiz_master',
        name: 'Quiz Master',
        description: 'Réussir 5 quiz parfaits',
        icon: '🧠',
        condition: (stats) => stats.perfectQuizzes >= 5,
        xp: 75
    },
    PRONUNCIATION_EXPERT: {
        id: 'pronunciation_expert',
        name: 'Expert Prononciation',
        description: 'Écouter 50 prononciations',
        icon: '🎵',
        condition: (stats) => stats.pronunciationsListened >= 50,
        xp: 40
    },
    WORD_COLLECTOR_25: {
        id: 'word_collector_25',
        name: 'Collectionneur de Mots',
        description: 'Apprendre 25 mots',
        icon: '📚',
        condition: (stats) => stats.wordsLearned >= 25,
        xp: 60
    },
    WORD_COLLECTOR_50: {
        id: 'word_collector_50',
        name: 'Bibliothèque Vivante',
        description: 'Apprendre 50 mots',
        icon: '📖',
        condition: (stats) => stats.wordsLearned >= 50,
        xp: 100
    },
    WORD_COLLECTOR_100: {
        id: 'word_collector_100',
        name: 'Maître des Mots',
        description: 'Apprendre 100 mots',
        icon: '🎓',
        condition: (stats) => stats.wordsLearned >= 100,
        xp: 200
    },
    FAVORITE_LOVER: {
        id: 'favorite_lover',
        name: 'Favori Amateur',
        description: 'Ajouter 10 mots aux favoris',
        icon: '⭐',
        condition: (stats) => stats.favoritesCount >= 10,
        xp: 30
    },
    SPEED_LEARNER: {
        id: 'speed_learner',
        name: 'Apprenant Rapide',
        description: 'Répondre en moins de 3 secondes 20 fois',
        icon: '⚡',
        condition: (stats) => stats.fastAnswers >= 20,
        xp: 45
    }
};

// Niveaux XP
export const XP_LEVELS = [
    { level: 1, xpRequired: 0, title: 'Débutant', icon: '🌱' },
    { level: 2, xpRequired: 100, title: 'Apprenti', icon: '🌿' },
    { level: 3, xpRequired: 250, title: 'Étudiant', icon: '📝' },
    { level: 4, xpRequired: 500, title: 'Connaisseur', icon: '🎯' },
    { level: 5, xpRequired: 800, title: 'Expert', icon: '⭐' },
    { level: 6, xpRequired: 1200, title: 'Maître', icon: '🏆' },
    { level: 7, xpRequired: 1700, title: 'Champion', icon: '👑' },
    { level: 8, xpRequired: 2500, title: 'Légende', icon: '💎' }
];

/**
 * Calcule le niveau actuel basé sur l'XP
 */
export function calculateLevel(totalXP) {
    let currentLevel = XP_LEVELS[0];

    for (let i = XP_LEVELS.length - 1; i >= 0; i--) {
        if (totalXP >= XP_LEVELS[i].xpRequired) {
            currentLevel = XP_LEVELS[i];
            break;
        }
    }

    return {
        ...currentLevel,
        progress: getProgressToNextLevel(totalXP, currentLevel.level)
    };
}

/**
 * Calcule le progrès vers le niveau suivant
 */
export function getProgressToNextLevel(totalXP, currentLevel) {
    const current = XP_LEVELS.find(l => l.level === currentLevel);
    const next = XP_LEVELS.find(l => l.level === currentLevel + 1);

    if (!next) {
        return { percentage: 100, current: totalXP, required: current.xpRequired };
    }

    const progressXP = totalXP - current.xpRequired;
    const requiredXP = next.xpRequired - current.xpRequired;
    const percentage = Math.round((progressXP / requiredXP) * 100);

    return {
        percentage: Math.min(percentage, 100),
        current: progressXP,
        required: requiredXP,
        nextLevel: next
    };
}

/**
 * Vérifie quels nouveaux badges ont été débloqués
 */
export function checkNewBadges(stats, currentBadges = []) {
    const newBadges = [];

    Object.values(BADGES).forEach(badge => {
        const alreadyHas = currentBadges.includes(badge.id);
        const meetsCondition = badge.condition(stats);

        if (!alreadyHas && meetsCondition) {
            newBadges.push(badge);
        }
    });

    return newBadges;
}

/**
 * Calcule l'XP total des badges obtenus
 */
export function calculateBadgeXP(badgeIds) {
    return badgeIds.reduce((total, badgeId) => {
        const badge = Object.values(BADGES).find(b => b.id === badgeId);
        return total + (badge ? badge.xp : 0);
    }, 0);
}

/**
 * Classe pour gérer le système de récompenses
 */
export class RewardSystem {
    constructor() {
        this.stats = this.loadStats();
        this.badges = this.loadBadges();
    }

    // Charger les statistiques depuis localStorage
    loadStats() {
        const defaultStats = {
            wordsLearned: 0,
            currentStreak: 0,
            bestStreak: 0,
            perfectQuizzes: 0,
            pronunciationsListened: 0,
            favoritesCount: 0,
            fastAnswers: 0,
            totalXP: 0,
            sessionsCount: 0,
            timeSpent: 0 // en minutes
        };

        const stored = localStorage.getItem('englishmaster_stats');
        return stored ? { ...defaultStats, ...JSON.parse(stored) } : defaultStats;
    }

    // Charger les badges depuis localStorage
    loadBadges() {
        const stored = localStorage.getItem('englishmaster_badges');
        return stored ? JSON.parse(stored) : [];
    }

    // Sauvegarder les statistiques
    saveStats() {
        localStorage.setItem('englishmaster_stats', JSON.stringify(this.stats));
    }

    // Sauvegarder les badges
    saveBadges() {
        localStorage.setItem('englishmaster_badges', JSON.stringify(this.badges));
    }

    // Ajouter de l'XP et vérifier les nouveaux badges
    addXP(amount, reason = 'Action') {
        this.stats.totalXP += amount;
        this.saveStats();

        console.log(`🎉 +${amount} XP pour ${reason}!`);
        return this.checkAndAwardBadges();
    }

    // Enregistrer qu'un mot a été appris
    wordLearned() {
        this.stats.wordsLearned++;
        const rewards = this.addXP(5, 'Nouveau mot appris');
        return rewards;
    }

    // Enregistrer une bonne réponse (gestion de la série)
    correctAnswer(responseTime = null) {
        this.stats.currentStreak++;
        this.stats.bestStreak = Math.max(this.stats.bestStreak, this.stats.currentStreak);

        // Bonus pour réponse rapide (moins de 3 secondes)
        if (responseTime && responseTime < 3000) {
            this.stats.fastAnswers++;
        }

        const baseXP = 2;
        const streakBonus = Math.floor(this.stats.currentStreak / 5) * 2; // Bonus tous les 5
        const speedBonus = (responseTime && responseTime < 3000) ? 1 : 0;

        return this.addXP(baseXP + streakBonus + speedBonus, 'Bonne réponse');
    }

    // Enregistrer une mauvaise réponse (reset de la série)
    incorrectAnswer() {
        this.stats.currentStreak = 0;
        this.saveStats();
    }

    // Enregistrer un quiz parfait
    perfectQuiz() {
        this.stats.perfectQuizzes++;
        return this.addXP(15, 'Quiz parfait');
    }

    // Enregistrer l'écoute d'une prononciation
    pronunciationListened() {
        this.stats.pronunciationsListened++;
        return this.addXP(1, 'Prononciation écoutée');
    }

    // Enregistrer l'ajout d'un favori
    favoriteAdded() {
        this.stats.favoritesCount++;
        return this.addXP(3, 'Favori ajouté');
    }

    // Vérifier et attribuer de nouveaux badges
    checkAndAwardBadges() {
        const newBadges = checkNewBadges(this.stats, this.badges);

        if (newBadges.length > 0) {
            newBadges.forEach(badge => {
                this.badges.push(badge.id);
                this.stats.totalXP += badge.xp;
                console.log(`🏆 Nouveau badge débloqué: ${badge.name} (+${badge.xp} XP)`);
            });

            this.saveBadges();
            this.saveStats();
        }

        return {
            newBadges,
            level: calculateLevel(this.stats.totalXP),
            stats: this.stats
        };
    }

    // Obtenir les statistiques actuelles
    getStats() {
        return {
            ...this.stats,
            level: calculateLevel(this.stats.totalXP),
            badges: this.badges.map(id => Object.values(BADGES).find(b => b.id === id)).filter(Boolean)
        };
    }

    // Reset des statistiques (pour debug/test)
    reset() {
        localStorage.removeItem('englishmaster_stats');
        localStorage.removeItem('englishmaster_badges');
        this.stats = this.loadStats();
        this.badges = this.loadBadges();
    }
}
