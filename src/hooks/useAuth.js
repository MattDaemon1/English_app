import { useState, useEffect, useContext, createContext } from 'react';
import { userService } from '../services/userService.js';

// Contexte d'authentification
const AuthContext = createContext(null);

/**
 * Provider d'authentification pour EnglishMaster
 */
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);

    // Verification de l'authentification au demarrage
    useEffect(() => {
        checkAuthStatus();
    }, []);

    /**
     * Verifie le statut d'authentification
     */
    const checkAuthStatus = async () => {
        try {
            setIsLoading(true);
            const currentUser = userService.getCurrentUser();

            if (currentUser && userService.isSessionValid()) {
                setUser(currentUser);
            } else {
                setUser(null);
                userService.logout();
            }
        } catch (error) {
            console.error('Erreur lors de la verification de l\'authentification:', error);
            setUser(null);
        } finally {
            setIsLoading(false);
            setIsInitialized(true);
        }
    };

    /**
     * Connexion utilisateur
     */
    const login = async (username, password) => {
        try {
            setIsLoading(true);
            const result = await userService.login(username, password);

            if (result.success) {
                setUser(result.user);
                return { success: true };
            } else {
                return { success: false, error: result.error };
            }
        } catch (error) {
            console.error('Erreur lors de la connexion:', error);
            return { success: false, error: 'Erreur technique lors de la connexion' };
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Deconnexion utilisateur
     */
    const logout = async () => {
        try {
            setIsLoading(true);
            const result = userService.logout();

            if (result.success) {
                setUser(null);
                return { success: true };
            } else {
                return { success: false, error: result.error };
            }
        } catch (error) {
            console.error('Erreur lors de la deconnexion:', error);
            return { success: false, error: 'Erreur technique lors de la deconnexion' };
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Mise a jour du profil utilisateur
     */
    const updateProfile = async (profileData) => {
        try {
            if (!user) return { success: false, error: 'Aucun utilisateur connecte' };

            const result = userService.updateUser({ ...user, ...profileData });

            if (result.success) {
                const updatedUser = userService.getCurrentUser();
                setUser(updatedUser);
                return { success: true };
            } else {
                return { success: false, error: result.error };
            }
        } catch (error) {
            console.error('Erreur lors de la mise a jour du profil:', error);
            return { success: false, error: 'Erreur technique lors de la mise a jour' };
        }
    };

    /**
     * Changement de mot de passe
     */
    const changePassword = async (currentPassword, newPassword) => {
        try {
            if (!user) return { success: false, error: 'Aucun utilisateur connecte' };

            const result = userService.changePassword(user.id, currentPassword, newPassword);

            if (result.success) {
                return { success: true };
            } else {
                return { success: false, error: result.error };
            }
        } catch (error) {
            console.error('Erreur lors du changement de mot de passe:', error);
            return { success: false, error: 'Erreur technique lors du changement de mot de passe' };
        }
    };

    /**
     * Mise a jour des statistiques utilisateur
     */
    const updateUserStats = (statsUpdate) => {
        try {
            if (!user) return false;

            const result = userService.updateUserStats(user.id, statsUpdate);

            if (result.success) {
                const updatedUser = userService.getCurrentUser();
                setUser(updatedUser);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Erreur lors de la mise a jour des statistiques:', error);
            return false;
        }
    };

    const value = {
        user,
        isLoading,
        isInitialized,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        logout,
        updateProfile,
        changePassword,
        updateUserStats,
        refreshUser: checkAuthStatus
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

/**
 * Hook pour utiliser l'authentification
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth doit etre utilise dans un AuthProvider');
    }
    return context;
};

/**
 * Hook pour les fonctions administrateur
 */
export const useAdmin = () => {
    const { user, isAdmin } = useAuth();

    /**
     * Obtenir tous les utilisateurs (admin seulement)
     */
    const getAllUsers = () => {
        if (!isAdmin) return { success: false, error: 'Acces refuse' };
        return userService.getAllUsers();
    };

    /**
     * Creer un nouvel utilisateur (admin seulement)
     */
    const createUser = (userData) => {
        if (!isAdmin) return { success: false, error: 'Acces refuse' };
        return userService.createUser(userData);
    };

    /**
     * Mettre a jour un utilisateur (admin seulement)
     */
    const updateUser = (userId, userData) => {
        if (!isAdmin) return { success: false, error: 'Acces refuse' };
        return userService.updateUser(userId, userData);
    };

    /**
     * Supprimer un utilisateur (admin seulement)
     */
    const deleteUser = (userId) => {
        if (!isAdmin) return { success: false, error: 'Acces refuse' };
        if (userId === user.id) return { success: false, error: 'Impossible de supprimer son propre compte' };
        return userService.deleteUser(userId);
    };

    /**
     * Obtenir les statistiques globales (admin seulement)
     */
    const getGlobalStats = () => {
        if (!isAdmin) return { success: false, error: 'Acces refuse' };
        return userService.getGlobalStats();
    };

    /**
     * Reinitialiser le mot de passe d'un utilisateur (admin seulement)
     */
    const resetUserPassword = (userId, newPassword) => {
        if (!isAdmin) return { success: false, error: 'Acces refuse' };
        return userService.resetPassword(userId, newPassword);
    };

    /**
     * Changer le role d'un utilisateur (admin seulement)
     */
    const changeUserRole = (userId, newRole) => {
        if (!isAdmin) return { success: false, error: 'Acces refuse' };
        if (userId === user.id) return { success: false, error: 'Impossible de modifier son propre role' };
        return userService.changeUserRole(userId, newRole);
    };

    /**
     * Obtenir l'historique des activites (admin seulement)
     */
    const getActivityHistory = () => {
        if (!isAdmin) return { success: false, error: 'Acces refuse' };
        return userService.getActivityHistory();
    };

    return {
        isAdmin,
        getAllUsers,
        createUser,
        updateUser,
        deleteUser,
        getGlobalStats,
        resetUserPassword,
        changeUserRole,
        getActivityHistory
    };
};

export default AuthProvider;
