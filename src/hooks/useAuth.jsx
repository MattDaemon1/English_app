import React, { useState, useEffect, useContext, createContext } from 'react';
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
            console.error('Erreur lors de la verification de l authentification:', error);
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
                return { success: true, user: result.user };
            } else {
                return { success: false, error: result.error };
            }
        } catch (error) {
            console.error('Erreur lors de la connexion:', error);
            return { success: false, error: 'Erreur de connexion' };
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Deconnexion utilisateur
     */
    const logout = () => {
        userService.logout();
        setUser(null);
    };

    /**
     * Mise a jour du profil utilisateur
     */
    const updateProfile = async (updates) => {
        try {
            const success = await userService.updateProfile(user.id, updates);
            if (success) {
                const updatedUser = userService.getCurrentUser();
                setUser(updatedUser);
                return { success: true };
            }
            return { success: false, error: 'Impossible de mettre a jour le profil' };
        } catch (error) {
            console.error('Erreur lors de la mise a jour du profil:', error);
            return { success: false, error: error.message };
        }
    };

    /**
     * Changement de mot de passe
     */
    const changePassword = async (currentPassword, newPassword) => {
        try {
            const success = await userService.changePassword(user.id, currentPassword, newPassword);
            if (success) {
                return { success: true };
            }
            return { success: false, error: 'Mot de passe actuel incorrect' };
        } catch (error) {
            console.error('Erreur lors du changement de mot de passe:', error);
            return { success: false, error: error.message };
        }
    };

    /**
     * Marquer un mot comme appris
     */
    const markWordAsLearned = async (wordId) => {
        if (!user) return;

        try {
            userService.markWordAsLearned(user.id, wordId);
            // Rafraichir les donnees utilisateur
            const updatedUser = userService.getCurrentUser();
            setUser(updatedUser);
        } catch (error) {
            console.error('Erreur lors du marquage du mot:', error);
        }
    };

    /**
     * Ajouter des points
     */
    const addPoints = async (points) => {
        if (!user) return;

        try {
            userService.addPoints(user.id, points);
            // Rafraichir les donnees utilisateur
            const updatedUser = userService.getCurrentUser();
            setUser(updatedUser);
        } catch (error) {
            console.error('Erreur lors de l ajout de points:', error);
        }
    };

    /**
     * Mettre a jour les statistiques utilisateur
     */
    const updateUserStats = async (stats) => {
        if (!user) return;

        try {
            userService.updateUserStats(user.id, stats);
            // Rafraichir les donnees utilisateur
            const updatedUser = userService.getCurrentUser();
            setUser(updatedUser);
        } catch (error) {
            console.error('Erreur lors de la mise a jour des stats:', error);
        }
    };

    const value = {
        currentUser: user,
        isAuthenticated: !!user,
        loading: isLoading,
        isInitialized,
        isAdmin: user?.role === 'admin',
        login,
        logout,
        updateProfile,
        changePassword,
        markWordAsLearned,
        addPoints,
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
 * Hook pour verifier si l'utilisateur est admin
 */
export const useAdmin = () => {
    const { currentUser } = useAuth();
    return currentUser?.role === 'admin';
};

/**
 * Hook pour obtenir les statistiques utilisateur
 */
export const useUserStats = () => {
    const { currentUser } = useAuth();
    return {
        points: currentUser?.points || 0,
        wordsLearned: currentUser?.wordsLearned?.length || 0,
        badges: currentUser?.badges || [],
        level: Math.floor((currentUser?.points || 0) / 100) + 1,
        nextLevelPoints: ((Math.floor((currentUser?.points || 0) / 100) + 1) * 100) - (currentUser?.points || 0)
    };
};