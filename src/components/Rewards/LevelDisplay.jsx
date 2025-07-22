/**
 * 🎯 Composant Level Display - Affichage du niveau et progression XP
 */

import React from 'react';
import { Card } from '../ui/card';

const LevelDisplay = ({ level, stats, compact = false }) => {
    if (compact) {
        return (
            <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full shadow-md">
                <span className="text-sm">{level.icon}</span>
                <span className="text-sm font-bold">Niv. {level.level}</span>
                <div className="w-12 h-1 bg-white/30 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-white rounded-full transition-all duration-500"
                        style={{ width: `${level.progress.percentage}%` }}
                    />
                </div>
            </div>
        );
    }

    return (
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl shadow-lg">
                        {level.icon}
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-gray-800">
                            Niveau {level.level}
                        </h3>
                        <p className="text-blue-600 font-medium">
                            {level.title}
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-purple-600">
                        {stats.totalXP} XP
                    </div>
                    <div className="text-xs text-gray-500">
                        Total
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">
                        Progrès vers le niveau {level.level + 1}
                    </span>
                    <span className="font-medium text-gray-700">
                        {level.progress.current} / {level.progress.required} XP
                    </span>
                </div>

                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${level.progress.percentage}%` }}
                    />
                </div>

                <div className="text-center text-sm text-gray-600">
                    {level.progress.percentage}% vers {level.progress.nextLevel?.title}
                </div>
            </div>
        </Card>
    );
};

export default LevelDisplay;
