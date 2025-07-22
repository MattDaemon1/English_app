/**
 * 📊 Composant Statistics Dashboard - Tableau de bord des statistiques
 */

import React from 'react';
import { Card } from '../ui/card';
import Badge from './Badge';
import LevelDisplay from './LevelDisplay';
import { BADGES } from '../../utils/rewardSystem';

const StatisticsDashboard = ({ stats }) => {
    const userBadges = stats.badges || [];
    const allBadges = Object.values(BADGES);
    const unlockedCount = userBadges.length;
    const totalCount = allBadges.length;

    // Fonction pour vérifier si un badge est débloqué
    const isBadgeUnlocked = (badge) => {
        return userBadges.some(b => b.id === badge.id);
    };

    // Fonction pour obtenir le style d'un badge (grisé si non débloqué)
    const getBadgeStyle = (isUnlocked) => {
        return {
            opacity: isUnlocked ? 1 : 0.3,
            filter: isUnlocked ? 'none' : 'grayscale(100%)',
            transform: isUnlocked ? 'scale(1)' : 'scale(0.9)',
            transition: 'all 0.3s ease'
        };
    };

    return (
        <div className="space-y-6">
            {/* Niveau et XP */}
            <LevelDisplay level={stats.level} stats={stats} />

            {/* Statistiques principales */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4 text-center bg-blue-50 border-blue-200">
                    <div className="text-2xl font-bold text-blue-600">
                        {stats.wordsLearned}
                    </div>
                    <div className="text-sm text-blue-500">
                        Mots appris
                    </div>
                </Card>

                <Card className="p-4 text-center bg-orange-50 border-orange-200">
                    <div className="text-2xl font-bold text-orange-600">
                        {stats.currentStreak}
                    </div>
                    <div className="text-sm text-orange-500">
                        Série actuelle
                    </div>
                </Card>

                <Card className="p-4 text-center bg-purple-50 border-purple-200">
                    <div className="text-2xl font-bold text-purple-600">
                        {stats.perfectQuizzes}
                    </div>
                    <div className="text-sm text-purple-500">
                        Quiz parfaits
                    </div>
                </Card>

                <Card className="p-4 text-center bg-green-50 border-green-200">
                    <div className="text-2xl font-bold text-green-600">
                        {Math.floor(stats.timeSpent / 60) || 0}h {stats.timeSpent % 60 || 0}m
                    </div>
                    <div className="text-sm text-green-500">
                        Temps d'étude
                    </div>
                </Card>
            </div>

            {/* Collection de badges */}
            <Card className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">
                        Collection de Badges
                    </h3>
                    <div className="text-sm text-gray-600">
                        {unlockedCount} / {totalCount} débloqués
                    </div>
                </div>

                <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4 mb-4">
                    {allBadges.map(badge => {
                        const isUnlocked = isBadgeUnlocked(badge);

                        return (
                            <div
                                key={badge.id}
                                className="text-center"
                                style={getBadgeStyle(isUnlocked)}
                            >
                                <div
                                    className={`relative group cursor-help transition-transform duration-300 ${isUnlocked ? 'hover:scale-110' : 'hover:scale-95'
                                        }`}
                                    title={`${badge.name}: ${badge.description}`}
                                >
                                    {isUnlocked ? (
                                        <div className="relative">
                                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-2xl shadow-lg border-2 border-yellow-300">
                                                {badge.icon}
                                            </div>
                                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                                <span className="text-white text-xs">✓</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="relative">
                                            <div className="w-16 h-16 rounded-full bg-gray-200 border-2 border-gray-300 flex items-center justify-center text-2xl">
                                                <span className="text-gray-400">{badge.icon}</span>
                                            </div>
                                            <div className="absolute inset-0 bg-gray-500 bg-opacity-20 rounded-full flex items-center justify-center">
                                                <span className="text-gray-500 text-lg">🔒</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className={`text-xs mt-2 truncate max-w-full font-medium ${isUnlocked ? 'text-gray-800' : 'text-gray-400'
                                    }`}>
                                    {badge.name}
                                </div>
                                {!isUnlocked && (
                                    <div className="text-xs text-gray-400 mt-1">
                                        Non débloqué
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div
                        className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-500"
                        style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
                    />
                </div>
            </Card>

            {/* Statistiques détaillées */}
            <Card className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Statistiques Détaillées
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Meilleure série:</span>
                            <span className="font-bold">{stats.bestStreak}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Prononciations écoutées:</span>
                            <span className="font-bold">{stats.pronunciationsListened}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Mots favoris:</span>
                            <span className="font-bold">{stats.favoritesCount}</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Réponses rapides:</span>
                            <span className="font-bold">{stats.fastAnswers}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Sessions d'étude:</span>
                            <span className="font-bold">{stats.sessionsCount}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">XP Total:</span>
                            <span className="font-bold text-purple-600">{stats.totalXP}</span>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default StatisticsDashboard;
