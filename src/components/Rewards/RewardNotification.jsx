/**
 * 🎉 Composant Reward Notification - Notifications des récompenses
 */

import React, { useState, useEffect } from 'react';

const RewardNotification = ({ reward, onClose }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setVisible(true);

        const timer = setTimeout(() => {
            setVisible(false);
            setTimeout(onClose, 300); // Délai pour l'animation
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    if (reward.newBadges?.length > 0) {
        return (
            <div className={`
                fixed top-4 right-4 z-50 transform transition-all duration-500
                ${visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
            `}>
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 rounded-lg shadow-2xl max-w-sm">
                    <div className="flex items-center space-x-3 mb-2">
                        <div className="text-2xl">🏆</div>
                        <div>
                            <h3 className="font-bold text-lg">Nouveau Badge !</h3>
                            <p className="text-yellow-100 text-sm">
                                Félicitations !
                            </p>
                        </div>
                    </div>

                    {reward.newBadges.map((badge, index) => (
                        <div key={badge.id} className="flex items-center space-x-2 bg-white/20 rounded-lg p-2 mb-2">
                            <span className="text-xl">{badge.icon}</span>
                            <div>
                                <div className="font-medium">{badge.name}</div>
                                <div className="text-xs text-yellow-100">{badge.description}</div>
                                <div className="text-xs font-bold">+{badge.xp} XP</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Notification XP simple
    return (
        <div className={`
            fixed top-4 right-4 z-50 transform transition-all duration-500
            ${visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        `}>
            <div className="bg-green-500 text-white p-3 rounded-lg shadow-xl">
                <div className="flex items-center space-x-2">
                    <span className="text-xl">⭐</span>
                    <span className="font-medium">+{reward.xpGained || 0} XP</span>
                </div>
            </div>
        </div>
    );
};

export default RewardNotification;
