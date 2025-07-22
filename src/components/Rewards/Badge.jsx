/**
 * 🏆 Composant Badge - Affichage des badges obtenus
 */

import React from 'react';
import { Card } from '../ui/card';

const Badge = ({ badge, isNew = false, size = 'normal' }) => {
    const sizeClasses = {
        small: 'w-12 h-12 text-lg',
        normal: 'w-16 h-16 text-2xl',
        large: 'w-20 h-20 text-3xl'
    };

    return (
        <div className={`relative ${isNew ? 'animate-bounce' : ''}`}>
            <div
                className={`
                    ${sizeClasses[size]} 
                    rounded-full border-3 border-yellow-400 bg-gradient-to-br from-yellow-100 to-yellow-200
                    flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300
                    ${isNew ? 'ring-4 ring-yellow-300 ring-opacity-50' : ''}
                `}
                title={`${badge.name}: ${badge.description}`}
            >
                <span className="filter drop-shadow-sm">
                    {badge.icon}
                </span>
            </div>

            {isNew && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">!</span>
                </div>
            )}
        </div>
    );
};

export default Badge;
