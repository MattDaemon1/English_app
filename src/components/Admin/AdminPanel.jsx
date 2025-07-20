import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card.jsx';
import { Badge } from '../ui/badge.jsx';
import { useAuth, useAdmin } from '../../hooks/useAuth.jsx';
import { getThemeClasses } from '../../themes/index.js';

export const AdminPanel = ({ theme, onClose }) => {
    const { currentUser } = useAuth();
    const { getAllUsers, createUser, updateUser, deleteUser, resetUserPassword, getGlobalStats } = useAdmin();

    const [activeTab, setActiveTab] = useState('dashboard');
    const [users, setUsers] = useState([]);
    const [globalStats, setGlobalStats] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // États pour les formulaires
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [newUserData, setNewUserData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        role: 'user',
        level: 'beginner'
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const usersResult = getAllUsers();
            const statsResult = getGlobalStats();

            if (usersResult.success) {
                setUsers(usersResult.users);
            } else {
                setError(usersResult.error);
            }

            if (statsResult.success) {
                setGlobalStats(statsResult.stats);
            }
        } catch (error) {
            console.error('Erreur lors du chargement des données:', error);
            setError('Erreur lors du chargement des données');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();

        if (newUserData.password !== newUserData.confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }

        if (newUserData.password.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const result = createUser(newUserData);

            if (result.success) {
                setSuccess('Utilisateur créé avec succès');
                setShowCreateForm(false);
                setNewUserData({
                    username: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                    firstName: '',
                    lastName: '',
                    role: 'user',
                    level: 'beginner'
                });
                loadData();
            } else {
                setError(result.error);
            }
        } catch (error) {
            console.error('Erreur lors de la création de l\'utilisateur:', error);
            setError('Erreur technique lors de la création');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId, username) => {
        if (!confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${username}" ? Cette action est irréversible.`)) {
            return;
        }

        setLoading(true);
        setError('');

        try {
            const result = deleteUser(userId);

            if (result.success) {
                setSuccess('Utilisateur supprimé avec succès');
                loadData();
            } else {
                setError(result.error);
            }
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            setError('Erreur technique lors de la suppression');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (userId, username) => {
        const newPassword = prompt(`Nouveau mot de passe pour "${username}" :`);

        if (!newPassword) return;

        if (newPassword.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const result = resetUserPassword(userId, newPassword);

            if (result.success) {
                setSuccess(`Mot de passe réinitialisé pour ${username}`);
            } else {
                setError(result.error);
            }
        } catch (error) {
            console.error('Erreur lors de la réinitialisation:', error);
            setError('Erreur technique lors de la réinitialisation');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getRoleIcon = (role) => {
        return role === 'admin' ? '👑' : '👤';
    };

    const getLevelIcon = (level) => {
        switch (level) {
            case 'beginner': return '🌱';
            case 'intermediate': return '🌿';
            case 'advanced': return '🌳';
            default: return '📚';
        }
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

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className={`w-full max-w-6xl ${theme.cardBackground} rounded-lg shadow-2xl my-4`}>
                {/* Header */}
                <div className={`p-4 border-b ${theme.border} flex justify-between items-center`}>
                    <div>
                        <h2 className={`text-2xl font-bold ${theme.text} flex items-center gap-2`}>
                            👑 Panneau d'Administration
                        </h2>
                        <p className={`${theme.textSecondary} text-sm`}>
                            Bienvenue {currentUser?.profile?.firstName || currentUser?.username}
                        </p>
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
                            { key: 'dashboard', label: '📊 Tableau de bord', icon: '📊' },
                            { key: 'users', label: '👥 Utilisateurs', icon: '👥' },
                            { key: 'stats', label: '📈 Statistiques', icon: '📈' }
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
                <div className="p-4 max-h-[70vh] overflow-y-auto">
                    {/* Tableau de bord */}
                    {activeTab === 'dashboard' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <Card className={theme.cardBackground}>
                                    <CardContent className="p-4 text-center">
                                        <div className="text-2xl mb-2">👥</div>
                                        <div className={`text-2xl font-bold ${theme.text}`}>
                                            {globalStats.totalUsers || 0}
                                        </div>
                                        <div className={`text-sm ${theme.textSecondary}`}>
                                            Utilisateurs totaux
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className={theme.cardBackground}>
                                    <CardContent className="p-4 text-center">
                                        <div className="text-2xl mb-2">📚</div>
                                        <div className={`text-2xl font-bold ${theme.text}`}>
                                            {globalStats.totalWords || 0}
                                        </div>
                                        <div className={`text-sm ${theme.textSecondary}`}>
                                            Mots appris
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className={theme.cardBackground}>
                                    <CardContent className="p-4 text-center">
                                        <div className="text-2xl mb-2">⭐</div>
                                        <div className={`text-2xl font-bold ${theme.text}`}>
                                            {globalStats.totalPoints || 0}
                                        </div>
                                        <div className={`text-sm ${theme.textSecondary}`}>
                                            Points totaux
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className={theme.cardBackground}>
                                    <CardContent className="p-4 text-center">
                                        <div className="text-2xl mb-2">🔥</div>
                                        <div className={`text-2xl font-bold ${theme.text}`}>
                                            {globalStats.activeUsers || 0}
                                        </div>
                                        <div className={`text-sm ${theme.textSecondary}`}>
                                            Actifs (7j)
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Actions rapides */}
                            <Card className={theme.cardBackground}>
                                <CardHeader>
                                    <CardTitle className={`${theme.text} text-lg`}>
                                        🚀 Actions rapides
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <button
                                        onClick={() => {
                                            setActiveTab('users');
                                            setShowCreateForm(true);
                                        }}
                                        className={`w-full ${getThemeClasses(theme, 'button-primary-solid')}`}
                                    >
                                        ➕ Créer un nouvel utilisateur
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('stats')}
                                        className={`w-full ${getThemeClasses(theme, 'button-secondary')}`}
                                    >
                                        📊 Voir les statistiques détaillées
                                    </button>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Gestion des utilisateurs */}
                    {activeTab === 'users' && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className={`text-xl font-bold ${theme.text}`}>
                                    👥 Gestion des utilisateurs
                                </h3>
                                <button
                                    onClick={() => setShowCreateForm(!showCreateForm)}
                                    className={getThemeClasses(theme, 'button-primary-solid')}
                                >
                                    {showCreateForm ? '❌ Annuler' : '➕ Nouvel utilisateur'}
                                </button>
                            </div>

                            {/* Formulaire de création */}
                            {showCreateForm && (
                                <Card className={theme.cardBackground}>
                                    <CardHeader>
                                        <CardTitle className={`${theme.text} text-lg`}>
                                            ➕ Créer un nouvel utilisateur
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className={`block text-sm font-medium ${theme.text} mb-1`}>
                                                    Nom d'utilisateur *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={newUserData.username}
                                                    onChange={(e) => setNewUserData(prev => ({ ...prev, username: e.target.value }))}
                                                    className={getThemeClasses(theme, 'input')}
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className={`block text-sm font-medium ${theme.text} mb-1`}>
                                                    Email
                                                </label>
                                                <input
                                                    type="email"
                                                    value={newUserData.email}
                                                    onChange={(e) => setNewUserData(prev => ({ ...prev, email: e.target.value }))}
                                                    className={getThemeClasses(theme, 'input')}
                                                />
                                            </div>

                                            <div>
                                                <label className={`block text-sm font-medium ${theme.text} mb-1`}>
                                                    Prénom
                                                </label>
                                                <input
                                                    type="text"
                                                    value={newUserData.firstName}
                                                    onChange={(e) => setNewUserData(prev => ({ ...prev, firstName: e.target.value }))}
                                                    className={getThemeClasses(theme, 'input')}
                                                />
                                            </div>

                                            <div>
                                                <label className={`block text-sm font-medium ${theme.text} mb-1`}>
                                                    Nom
                                                </label>
                                                <input
                                                    type="text"
                                                    value={newUserData.lastName}
                                                    onChange={(e) => setNewUserData(prev => ({ ...prev, lastName: e.target.value }))}
                                                    className={getThemeClasses(theme, 'input')}
                                                />
                                            </div>

                                            <div>
                                                <label className={`block text-sm font-medium ${theme.text} mb-1`}>
                                                    Mot de passe *
                                                </label>
                                                <input
                                                    type="password"
                                                    value={newUserData.password}
                                                    onChange={(e) => setNewUserData(prev => ({ ...prev, password: e.target.value }))}
                                                    className={getThemeClasses(theme, 'input')}
                                                    required
                                                    minLength={6}
                                                />
                                            </div>

                                            <div>
                                                <label className={`block text-sm font-medium ${theme.text} mb-1`}>
                                                    Confirmer le mot de passe *
                                                </label>
                                                <input
                                                    type="password"
                                                    value={newUserData.confirmPassword}
                                                    onChange={(e) => setNewUserData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                                    className={getThemeClasses(theme, 'input')}
                                                    required
                                                    minLength={6}
                                                />
                                            </div>

                                            <div>
                                                <label className={`block text-sm font-medium ${theme.text} mb-1`}>
                                                    Rôle
                                                </label>
                                                <select
                                                    value={newUserData.role}
                                                    onChange={(e) => setNewUserData(prev => ({ ...prev, role: e.target.value }))}
                                                    className={getThemeClasses(theme, 'input')}
                                                >
                                                    <option value="user">👤 Utilisateur</option>
                                                    <option value="admin">👑 Administrateur</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className={`block text-sm font-medium ${theme.text} mb-1`}>
                                                    Niveau
                                                </label>
                                                <select
                                                    value={newUserData.level}
                                                    onChange={(e) => setNewUserData(prev => ({ ...prev, level: e.target.value }))}
                                                    className={getThemeClasses(theme, 'input')}
                                                >
                                                    <option value="beginner">🌱 Débutant</option>
                                                    <option value="intermediate">🌿 Intermédiaire</option>
                                                    <option value="advanced">🌳 Avancé</option>
                                                </select>
                                            </div>

                                            <div className="md:col-span-2 flex gap-3">
                                                <button
                                                    type="submit"
                                                    disabled={loading}
                                                    className={`${getThemeClasses(theme, 'button-primary-solid')} disabled:opacity-50`}
                                                >
                                                    {loading ? '⏳ Création...' : '✅ Créer l\'utilisateur'}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowCreateForm(false)}
                                                    className={getThemeClasses(theme, 'button-secondary')}
                                                >
                                                    ❌ Annuler
                                                </button>
                                            </div>
                                        </form>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Liste des utilisateurs */}
                            <div className="space-y-3">
                                {users.map((user) => (
                                    <Card key={user.id} className={theme.cardBackground}>
                                        <CardContent className="p-4">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg">
                                                            {user.profile?.avatar?.initials || user.username[0].toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className={`font-semibold ${theme.text} flex items-center gap-2`}>
                                                                {getRoleIcon(user.role)} {user.username}
                                                                {user.role === 'admin' && (
                                                                    <Badge className={theme.badgeWarning}>Admin</Badge>
                                                                )}
                                                            </div>
                                                            <div className={`text-sm ${theme.textSecondary}`}>
                                                                {user.profile?.firstName} {user.profile?.lastName}
                                                                {user.email && ` • ${user.email}`}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-wrap gap-4 text-sm">
                                                        <span className={theme.textSecondary}>
                                                            {getLevelIcon(user.profile?.level)} {user.profile?.level}
                                                        </span>
                                                        <span className={theme.textSecondary}>
                                                            📚 {user.stats?.wordsLearned || 0} mots
                                                        </span>
                                                        <span className={theme.textSecondary}>
                                                            ⭐ {user.stats?.totalPoints || 0} points
                                                        </span>
                                                        <span className={theme.textSecondary}>
                                                            🔥 {user.stats?.streakDays || 0} jours
                                                        </span>
                                                        <span className={theme.textSecondary}>
                                                            📅 {user.lastConnectionDate}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap gap-2">
                                                    <button
                                                        onClick={() => handleResetPassword(user.id, user.username)}
                                                        className={`text-xs px-3 py-1 ${getThemeClasses(theme, 'button-secondary')}`}
                                                        disabled={loading}
                                                    >
                                                        🔑 Reset MDP
                                                    </button>

                                                    {user.id !== currentUser?.id && user.role !== 'admin' && (
                                                        <button
                                                            onClick={() => handleDeleteUser(user.id, user.username)}
                                                            className={`text-xs px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors`}
                                                            disabled={loading}
                                                        >
                                                            🗑️ Supprimer
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Statistiques détaillées */}
                    {activeTab === 'stats' && (
                        <div className="space-y-6">
                            <h3 className={`text-xl font-bold ${theme.text}`}>
                                📈 Statistiques détaillées
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Card className={theme.cardBackground}>
                                    <CardHeader>
                                        <CardTitle className={`${theme.text} text-lg`}>
                                            👥 Répartition des utilisateurs
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className={theme.textSecondary}>Administrateurs:</span>
                                            <span className={`font-bold ${theme.text}`}>
                                                {globalStats.totalAdmins || 0}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className={theme.textSecondary}>Utilisateurs:</span>
                                            <span className={`font-bold ${theme.text}`}>
                                                {(globalStats.totalUsers || 0) - (globalStats.totalAdmins || 0)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className={theme.textSecondary}>Actifs (7 jours):</span>
                                            <span className={`font-bold ${theme.text}`}>
                                                {globalStats.activeUsers || 0}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className={theme.cardBackground}>
                                    <CardHeader>
                                        <CardTitle className={`${theme.text} text-lg`}>
                                            📊 Activité globale
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className={theme.textSecondary}>Sessions totales:</span>
                                            <span className={`font-bold ${theme.text}`}>
                                                {globalStats.totalSessions || 0}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className={theme.textSecondary}>Mots appris:</span>
                                            <span className={`font-bold ${theme.text}`}>
                                                {globalStats.totalWords || 0}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className={theme.textSecondary}>Points totaux:</span>
                                            <span className={`font-bold ${theme.text}`}>
                                                {globalStats.totalPoints || 0}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Top utilisateurs */}
                            <Card className={theme.cardBackground}>
                                <CardHeader>
                                    <CardTitle className={`${theme.text} text-lg`}>
                                        🏆 Top utilisateurs
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {users
                                            .sort((a, b) => (b.stats?.totalPoints || 0) - (a.stats?.totalPoints || 0))
                                            .slice(0, 5)
                                            .map((user, index) => (
                                                <div key={user.id} className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-lg">
                                                            {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                                                        </span>
                                                        <span className={theme.text}>
                                                            {user.username}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-sm">
                                                        <span className={theme.textSecondary}>
                                                            📚 {user.stats?.wordsLearned || 0}
                                                        </span>
                                                        <span className={`font-bold ${theme.text}`}>
                                                            ⭐ {user.stats?.totalPoints || 0}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
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
