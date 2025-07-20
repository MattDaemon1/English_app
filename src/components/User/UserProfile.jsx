import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card.jsx';
import { Badge } from '../ui/badge.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { getThemeClasses } from '../../themes/index.js';

export const UserProfile = ({ theme, onClose }) => {
    const { currentUser, updateProfile, changePassword } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // États pour les formulaires
    const [profileData, setProfileData] = useState({
        firstName: currentUser?.profile?.firstName || '',
        lastName: currentUser?.profile?.lastName || '',
        email: currentUser?.email || '',
        level: currentUser?.profile?.level || 'beginner',
        preferredTheme: currentUser?.profile?.preferredTheme || 'classic',
        language: currentUser?.profile?.language || 'fr'
    });

    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [settingsData, setSettingsData] = useState({
        notifications: currentUser?.settings?.notifications || true,
        autoPlaySound: currentUser?.settings?.autoPlaySound || true,
        dailyGoal: currentUser?.settings?.dailyGoal || 10
    });

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = updateProfile({
                profile: { ...currentUser.profile, ...profileData },
                email: profileData.email
            });

            if (result.success) {
                setSuccess('Profil mis à jour avec succès');
            } else {
                setError(result.error);
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour du profil:', error);
            setError('Erreur technique lors de la mise à jour');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('Les nouveaux mots de passe ne correspondent pas');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setError('Le nouveau mot de passe doit contenir au moins 6 caractères');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const result = changePassword(passwordData.oldPassword, passwordData.newPassword);

            if (result.success) {
                setSuccess('Mot de passe modifié avec succès');
                setPasswordData({
                    oldPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
            } else {
                setError(result.error);
            }
        } catch (error) {
            console.error('Erreur lors du changement de mot de passe:', error);
            setError('Erreur technique lors du changement de mot de passe');
        } finally {
            setLoading(false);
        }
    };

    const handleSettingsUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = updateProfile({
                settings: settingsData
            });

            if (result.success) {
                setSuccess('Paramètres mis à jour avec succès');
            } else {
                setError(result.error);
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour des paramètres:', error);
            setError('Erreur technique lors de la mise à jour');
        } finally {
            setLoading(false);
        }
    };

    const getBadgeInfo = (badgeId) => {
        const badges = {
            'admin': { name: 'Administrateur', icon: '👑', color: 'bg-purple-500' },
            'founder': { name: 'Fondateur', icon: '🌟', color: 'bg-yellow-500' },
            'first_word': { name: 'Premier mot', icon: '🎯', color: 'bg-green-500' },
            'apprentice': { name: 'Apprenti', icon: '📚', color: 'bg-blue-500' },
            'expert': { name: 'Expert', icon: '🎓', color: 'bg-indigo-500' },
            'week_streak': { name: 'Série de 7 jours', icon: '🔥', color: 'bg-red-500' },
            'thousand_points': { name: '1000 points', icon: '⭐', color: 'bg-orange-500' }
        };

        return badges[badgeId] || { name: badgeId, icon: '🏆', color: 'bg-gray-500' };
    };

    const calculateProgress = () => {
        const points = currentUser?.stats?.totalPoints || 0;
        const level = Math.floor(points / 100) + 1;
        const nextLevelPoints = level * 100;
        const progress = ((points % 100) / 100) * 100;

        return { level, progress, nextLevelPoints, currentPoints: points };
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Efface les messages après 5 secondes
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => setSuccess(''), 5000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(''), 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    const progressInfo = calculateProgress();

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className={`w-full max-w-4xl ${theme.cardBackground} rounded-lg shadow-2xl my-4`}>
                {/* Header */}
                <div className={`p-4 border-b ${theme.border} flex justify-between items-center`}>
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                            {currentUser?.profile?.avatar?.initials || currentUser?.username?.[0]?.toUpperCase()}
                        </div>
                        <div>
                            <h2 className={`text-2xl font-bold ${theme.text}`}>
                                {currentUser?.profile?.firstName} {currentUser?.profile?.lastName}
                                {(!currentUser?.profile?.firstName && !currentUser?.profile?.lastName) && currentUser?.username}
                            </h2>
                            <p className={`${theme.textSecondary} text-sm flex items-center gap-2`}>
                                {currentUser?.role === 'admin' ? '👑 Administrateur' : '👤 Utilisateur'}
                                • Membre depuis le {formatDate(currentUser?.createdAt)}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className={`px-4 py-2 ${getThemeClasses(theme, 'button-secondary')} text-sm`}
                    >
                        ❌ Fermer
                    </button>
                </div>

                {/* Messages */}
                {error && (
                    <div className={`m-4 p-3 rounded-lg ${theme.error} text-sm font-medium animate-fadeIn`}>
                        {error}
                    </div>
                )}

                {success && (
                    <div className={`m-4 p-3 rounded-lg ${theme.success} text-sm font-medium animate-fadeIn`}>
                        {success}
                    </div>
                )}

                {/* Navigation */}
                <div className={`p-4 border-b ${theme.border}`}>
                    <div className="flex flex-wrap gap-2">
                        {[
                            { key: 'profile', label: '👤 Profil', icon: '👤' },
                            { key: 'stats', label: '📊 Statistiques', icon: '📊' },
                            { key: 'settings', label: '⚙️ Paramètres', icon: '⚙️' },
                            { key: 'security', label: '🔒 Sécurité', icon: '🔒' }
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.key
                                        ? getThemeClasses(theme, 'button-primary-solid')
                                        : getThemeClasses(theme, 'button-secondary')
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Contenu */}
                <div className="p-4 max-h-[60vh] overflow-y-auto">
                    {/* Profil */}
                    {activeTab === 'profile' && (
                        <div className="space-y-6">
                            <Card className={theme.cardBackground}>
                                <CardHeader>
                                    <CardTitle className={`${theme.text} text-lg`}>
                                        ✏️ Informations personnelles
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className={`block text-sm font-medium ${theme.text} mb-1`}>
                                                Prénom
                                            </label>
                                            <input
                                                type="text"
                                                value={profileData.firstName}
                                                onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                                                className={getThemeClasses(theme, 'input')}
                                                placeholder="Votre prénom"
                                            />
                                        </div>

                                        <div>
                                            <label className={`block text-sm font-medium ${theme.text} mb-1`}>
                                                Nom
                                            </label>
                                            <input
                                                type="text"
                                                value={profileData.lastName}
                                                onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                                                className={getThemeClasses(theme, 'input')}
                                                placeholder="Votre nom"
                                            />
                                        </div>

                                        <div>
                                            <label className={`block text-sm font-medium ${theme.text} mb-1`}>
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                value={profileData.email}
                                                onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                                                className={getThemeClasses(theme, 'input')}
                                                placeholder="votre@email.com"
                                            />
                                        </div>

                                        <div>
                                            <label className={`block text-sm font-medium ${theme.text} mb-1`}>
                                                Niveau d'anglais
                                            </label>
                                            <select
                                                value={profileData.level}
                                                onChange={(e) => setProfileData(prev => ({ ...prev, level: e.target.value }))}
                                                className={getThemeClasses(theme, 'input')}
                                            >
                                                <option value="beginner">🌱 Débutant</option>
                                                <option value="intermediate">🌿 Intermédiaire</option>
                                                <option value="advanced">🌳 Avancé</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className={`block text-sm font-medium ${theme.text} mb-1`}>
                                                Thème préféré
                                            </label>
                                            <select
                                                value={profileData.preferredTheme}
                                                onChange={(e) => setProfileData(prev => ({ ...prev, preferredTheme: e.target.value }))}
                                                className={getThemeClasses(theme, 'input')}
                                            >
                                                <option value="classic">🌟 Classic</option>
                                                <option value="ocean">🌊 Océan</option>
                                                <option value="forest">🌲 Forêt</option>
                                                <option value="sunset">🌅 Coucher</option>
                                                <option value="purple">💜 Mystique</option>
                                                <option value="dark">🌙 Sombre</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className={`block text-sm font-medium ${theme.text} mb-1`}>
                                                Langue
                                            </label>
                                            <select
                                                value={profileData.language}
                                                onChange={(e) => setProfileData(prev => ({ ...prev, language: e.target.value }))}
                                                className={getThemeClasses(theme, 'input')}
                                            >
                                                <option value="fr">🇫🇷 Français</option>
                                                <option value="en">🇬🇧 English</option>
                                            </select>
                                        </div>

                                        <div className="md:col-span-2">
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className={`${getThemeClasses(theme, 'button-primary-solid')} disabled:opacity-50`}
                                            >
                                                {loading ? '⏳ Mise à jour...' : '✅ Mettre à jour le profil'}
                                            </button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Statistiques */}
                    {activeTab === 'stats' && (
                        <div className="space-y-6">
                            {/* Progression */}
                            <Card className={theme.cardBackground}>
                                <CardHeader>
                                    <CardTitle className={`${theme.text} text-lg`}>
                                        📈 Votre progression
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="text-center">
                                        <div className={`text-3xl font-bold ${theme.text} mb-2`}>
                                            Niveau {progressInfo.level}
                                        </div>
                                        <div className={`w-full bg-gray-200 rounded-full h-3 mb-2`}>
                                            <div
                                                className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                                                style={{ width: `${progressInfo.progress}%` }}
                                            ></div>
                                        </div>
                                        <div className={`text-sm ${theme.textSecondary}`}>
                                            {progressInfo.currentPoints} / {progressInfo.nextLevelPoints} points pour le niveau suivant
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Statistiques détaillées */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Card className={theme.cardBackground}>
                                    <CardContent className="p-4 text-center">
                                        <div className="text-3xl mb-2">📚</div>
                                        <div className={`text-2xl font-bold ${theme.text}`}>
                                            {currentUser?.stats?.wordsLearned || 0}
                                        </div>
                                        <div className={`text-sm ${theme.textSecondary}`}>
                                            Mots appris
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className={theme.cardBackground}>
                                    <CardContent className="p-4 text-center">
                                        <div className="text-3xl mb-2">⭐</div>
                                        <div className={`text-2xl font-bold ${theme.text}`}>
                                            {currentUser?.stats?.totalPoints || 0}
                                        </div>
                                        <div className={`text-sm ${theme.textSecondary}`}>
                                            Points totaux
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className={theme.cardBackground}>
                                    <CardContent className="p-4 text-center">
                                        <div className="text-3xl mb-2">🔥</div>
                                        <div className={`text-2xl font-bold ${theme.text}`}>
                                            {currentUser?.stats?.streakDays || 0}
                                        </div>
                                        <div className={`text-sm ${theme.textSecondary}`}>
                                            Jours consécutifs
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Badges */}
                            <Card className={theme.cardBackground}>
                                <CardHeader>
                                    <CardTitle className={`${theme.text} text-lg`}>
                                        🏆 Vos badges
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {currentUser?.stats?.badges?.length > 0 ? (
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            {currentUser.stats.badges.map((badgeId) => {
                                                const badge = getBadgeInfo(badgeId);
                                                return (
                                                    <div key={badgeId} className={`p-3 rounded-lg ${badge.color} text-white text-center`}>
                                                        <div className="text-2xl mb-1">{badge.icon}</div>
                                                        <div className="text-xs font-medium">{badge.name}</div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className={`text-center py-8 ${theme.textSecondary}`}>
                                            <div className="text-4xl mb-2">🎯</div>
                                            <div>Aucun badge encore ! Continuez à apprendre pour en débloquer.</div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Paramètres */}
                    {activeTab === 'settings' && (
                        <div className="space-y-6">
                            <Card className={theme.cardBackground}>
                                <CardHeader>
                                    <CardTitle className={`${theme.text} text-lg`}>
                                        ⚙️ Préférences
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSettingsUpdate} className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className={`font-medium ${theme.text}`}>
                                                    🔔 Notifications
                                                </div>
                                                <div className={`text-sm ${theme.textSecondary}`}>
                                                    Recevoir des notifications d'encouragement
                                                </div>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={settingsData.notifications}
                                                    onChange={(e) => setSettingsData(prev => ({ ...prev, notifications: e.target.checked }))}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            </label>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className={`font-medium ${theme.text}`}>
                                                    🔊 Son automatique
                                                </div>
                                                <div className={`text-sm ${theme.textSecondary}`}>
                                                    Lire automatiquement la prononciation des mots
                                                </div>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={settingsData.autoPlaySound}
                                                    onChange={(e) => setSettingsData(prev => ({ ...prev, autoPlaySound: e.target.checked }))}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            </label>
                                        </div>

                                        <div>
                                            <label className={`block text-sm font-medium ${theme.text} mb-2`}>
                                                🎯 Objectif quotidien (mots à apprendre)
                                            </label>
                                            <input
                                                type="number"
                                                min="1"
                                                max="100"
                                                value={settingsData.dailyGoal}
                                                onChange={(e) => setSettingsData(prev => ({ ...prev, dailyGoal: parseInt(e.target.value) || 10 }))}
                                                className={getThemeClasses(theme, 'input')}
                                            />
                                        </div>

                                        <div className="pt-4">
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className={`${getThemeClasses(theme, 'button-primary-solid')} disabled:opacity-50`}
                                            >
                                                {loading ? '⏳ Sauvegarde...' : '✅ Sauvegarder les paramètres'}
                                            </button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Sécurité */}
                    {activeTab === 'security' && (
                        <div className="space-y-6">
                            <Card className={theme.cardBackground}>
                                <CardHeader>
                                    <CardTitle className={`${theme.text} text-lg`}>
                                        🔒 Changer le mot de passe
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handlePasswordChange} className="space-y-4">
                                        <div>
                                            <label className={`block text-sm font-medium ${theme.text} mb-1`}>
                                                Mot de passe actuel
                                            </label>
                                            <input
                                                type="password"
                                                value={passwordData.oldPassword}
                                                onChange={(e) => setPasswordData(prev => ({ ...prev, oldPassword: e.target.value }))}
                                                className={getThemeClasses(theme, 'input')}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className={`block text-sm font-medium ${theme.text} mb-1`}>
                                                Nouveau mot de passe
                                            </label>
                                            <input
                                                type="password"
                                                value={passwordData.newPassword}
                                                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                                                className={getThemeClasses(theme, 'input')}
                                                required
                                                minLength={6}
                                            />
                                        </div>

                                        <div>
                                            <label className={`block text-sm font-medium ${theme.text} mb-1`}>
                                                Confirmer le nouveau mot de passe
                                            </label>
                                            <input
                                                type="password"
                                                value={passwordData.confirmPassword}
                                                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                                className={getThemeClasses(theme, 'input')}
                                                required
                                                minLength={6}
                                            />
                                        </div>

                                        <div className="pt-4">
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className={`${getThemeClasses(theme, 'button-primary-solid')} disabled:opacity-50`}
                                            >
                                                {loading ? '⏳ Modification...' : '🔒 Changer le mot de passe'}
                                            </button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>

                            {/* Informations de compte */}
                            <Card className={theme.cardBackground}>
                                <CardHeader>
                                    <CardTitle className={`${theme.text} text-lg`}>
                                        ℹ️ Informations de compte
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className={theme.textSecondary}>Nom d'utilisateur:</span>
                                        <span className={`font-medium ${theme.text}`}>
                                            {currentUser?.username}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className={theme.textSecondary}>Membre depuis:</span>
                                        <span className={`font-medium ${theme.text}`}>
                                            {formatDate(currentUser?.createdAt)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className={theme.textSecondary}>Dernière connexion:</span>
                                        <span className={`font-medium ${theme.text}`}>
                                            {currentUser?.lastConnectionDate}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className={theme.textSecondary}>Sessions totales:</span>
                                        <span className={`font-medium ${theme.text}`}>
                                            {currentUser?.stats?.totalSessions || 0}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
