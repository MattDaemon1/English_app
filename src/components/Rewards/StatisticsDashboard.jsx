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
                        const isUnlocked = userBadges.some(b => b.id === badge.id);

                        return (
                            <div key={badge.id} className="text-center">
                                {isUnlocked ? (
                                    <Badge badge={badge} size="small" />
                                ) : (
                                    <div
                                        className="w-12 h-12 rounded-full border-2 border-gray-300 bg-gray-100 flex items-center justify-center opacity-50"
                                        title={`${badge.name}: ${badge.description}`}
                                    >
                                        <span className="text-lg grayscale">
                                            {badge.icon}
                                        </span>
                                    </div>
                                )}
                                <div className="text-xs mt-1 text-gray-600 truncate max-w-full">
                                    {badge.name}
                                </div>
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
