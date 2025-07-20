import CryptoJS from 'crypto-js';

// Clé de chiffrement pour les données sensibles
const ENCRYPTION_KEY = 'EnglishMaster_2025_SecureKey';
const USERS_STORAGE_KEY = 'englishmaster_users';
const CURRENT_USER_KEY = 'englishmaster_current_user';
const SESSION_KEY = 'englishmaster_session';

/**
 * Service de gestion des utilisateurs EnglishMaster v2.1.0
 * Gestion complète : authentification, profils, administration
 */
export class UserService {
    constructor() {
        this.initializeDefaultAdmin();
    }

    // =====================================================
    // GESTION DES DONNÉES UTILISATEURS
    // =====================================================

    /**
     * Chiffre une chaîne de caractères
     */
    encrypt(text) {
        return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
    }

    /**
     * Déchiffre une chaîne de caractères
     */
    decrypt(ciphertext) {
        const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY);
        return bytes.toString(CryptoJS.enc.Utf8);
    }

    /**
     * Hash un mot de passe
     */
    hashPassword(password) {
        return CryptoJS.SHA256(password + ENCRYPTION_KEY).toString();
    }

    /**
     * Génère un ID unique
     */
    generateUserId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Génère un token de session
     */
    generateSessionToken() {
        return CryptoJS.lib.WordArray.random(256 / 8).toString();
    }

    // =====================================================
    // STOCKAGE LOCAL
    // =====================================================

    /**
     * Récupère tous les utilisateurs
     */
    getAllUsers() {
        try {
            const encrypted = localStorage.getItem(USERS_STORAGE_KEY);
            if (!encrypted) return [];

            const decrypted = this.decrypt(encrypted);
            return JSON.parse(decrypted);
        } catch (error) {
            console.error('Erreur lors de la récupération des utilisateurs:', error);
            return [];
        }
    }

    /**
     * Sauvegarde tous les utilisateurs
     */
    saveAllUsers(users) {
        try {
            const encrypted = this.encrypt(JSON.stringify(users));
            localStorage.setItem(USERS_STORAGE_KEY, encrypted);
            return true;
        } catch (error) {
            console.error('Erreur lors de la sauvegarde des utilisateurs:', error);
            return false;
        }
    }

    /**
     * Récupère l'utilisateur connecté
     */
    getCurrentUser() {
        try {
            const encrypted = localStorage.getItem(CURRENT_USER_KEY);
            if (!encrypted) return null;

            const decrypted = this.decrypt(encrypted);
            return JSON.parse(decrypted);
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'utilisateur actuel:', error);
            return null;
        }
    }

    /**
     * Sauvegarde l'utilisateur connecté
     */
    setCurrentUser(user) {
        try {
            if (user) {
                const encrypted = this.encrypt(JSON.stringify(user));
                localStorage.setItem(CURRENT_USER_KEY, encrypted);
            } else {
                localStorage.removeItem(CURRENT_USER_KEY);
            }
            return true;
        } catch (error) {
            console.error('Erreur lors de la sauvegarde de l\'utilisateur actuel:', error);
            return false;
        }
    }

    // =====================================================
    // GESTION DES SESSIONS
    // =====================================================

    /**
     * Créé une session utilisateur
     */
    createSession(user) {
        const session = {
            userId: user.id,
            token: this.generateSessionToken(),
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 jours
        };

        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        return session;
    }

    /**
     * Vérifie si la session est valide
     */
    isSessionValid() {
        try {
            const session = localStorage.getItem(SESSION_KEY);
            if (!session) return false;

            const sessionData = JSON.parse(session);
            const now = new Date();
            const expiresAt = new Date(sessionData.expiresAt);

            return now < expiresAt;
        } catch (error) {
            return false;
        }
    }

    /**
     * Supprime la session
     */
    clearSession() {
        localStorage.removeItem(SESSION_KEY);
        localStorage.removeItem(CURRENT_USER_KEY);
    }

    // =====================================================
    // AUTHENTIFICATION
    // =====================================================

    /**
     * Connexion utilisateur
     */
    login(username, password) {
        const users = this.getAllUsers();
        const hashedPassword = this.hashPassword(password);

        const user = users.find(u =>
            u.username.toLowerCase() === username.toLowerCase() &&
            u.password === hashedPassword
        );

        if (user) {
            // Mise à jour de la dernière connexion
            user.lastConnectionDate = new Date().toISOString().split('T')[0];
            user.stats.totalSessions = (user.stats.totalSessions || 0) + 1;

            // Calcul des jours consécutifs
            this.updateStreak(user);

            // Sauvegarde des modifications
            this.updateUser(user);

            // Création de la session
            this.createSession(user);
            this.setCurrentUser(user);

            return { success: true, user: this.sanitizeUser(user) };
        }

        return { success: false, error: 'Nom d\'utilisateur ou mot de passe incorrect' };
    }

    /**
     * Déconnexion
     */
    logout() {
        this.clearSession();
        return { success: true };
    }

    /**
     * Vérifie si l'utilisateur est connecté
     */
    isLoggedIn() {
        return this.isSessionValid() && this.getCurrentUser() !== null;
    }

    // =====================================================
    // GESTION DES UTILISATEURS
    // =====================================================

    /**
     * Créé un nouvel utilisateur
     */
    createUser(userData) {
        const users = this.getAllUsers();

        // Vérification de l'unicité du nom d'utilisateur
        if (users.find(u => u.username.toLowerCase() === userData.username.toLowerCase())) {
            return { success: false, error: 'Ce nom d\'utilisateur existe déjà' };
        }

        // Vérification de l'unicité de l'email (si fourni)
        if (userData.email && users.find(u => u.email && u.email.toLowerCase() === userData.email.toLowerCase())) {
            return { success: false, error: 'Cette adresse email est déjà utilisée' };
        }

        const newUser = {
            id: this.generateUserId(),
            username: userData.username,
            email: userData.email || '',
            password: this.hashPassword(userData.password),
            role: userData.role || 'user',
            profile: {
                firstName: userData.firstName || '',
                lastName: userData.lastName || '',
                avatar: userData.avatar || this.generateAvatar(userData.username),
                level: userData.level || 'beginner',
                preferredTheme: userData.preferredTheme || 'classic',
                language: userData.language || 'fr'
            },
            stats: {
                wordsLearned: 0,
                totalPoints: 0,
                streakDays: 0,
                lastConnectionDate: new Date().toISOString().split('T')[0],
                totalSessions: 0,
                badges: []
            },
            settings: {
                notifications: true,
                autoPlaySound: true,
                dailyGoal: 10
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        users.push(newUser);
        this.saveAllUsers(users);

        return { success: true, user: this.sanitizeUser(newUser) };
    }

    /**
     * Met à jour un utilisateur
     */
    updateUser(updatedUser) {
        const users = this.getAllUsers();
        const index = users.findIndex(u => u.id === updatedUser.id);

        if (index === -1) {
            return { success: false, error: 'Utilisateur non trouvé' };
        }

        updatedUser.updatedAt = new Date().toISOString();
        users[index] = updatedUser;
        this.saveAllUsers(users);

        // Mise à jour de l'utilisateur connecté si c'est le même
        const currentUser = this.getCurrentUser();
        if (currentUser && currentUser.id === updatedUser.id) {
            this.setCurrentUser(updatedUser);
        }

        return { success: true, user: this.sanitizeUser(updatedUser) };
    }

    /**
     * Supprime un utilisateur
     */
    deleteUser(userId) {
        const users = this.getAllUsers();
        const index = users.findIndex(u => u.id === userId);

        if (index === -1) {
            return { success: false, error: 'Utilisateur non trouvé' };
        }

        // Empêcher la suppression du dernier admin
        const user = users[index];
        if (user.role === 'admin') {
            const adminCount = users.filter(u => u.role === 'admin').length;
            if (adminCount <= 1) {
                return { success: false, error: 'Impossible de supprimer le dernier administrateur' };
            }
        }

        users.splice(index, 1);
        this.saveAllUsers(users);

        return { success: true };
    }

    /**
     * Change le mot de passe d'un utilisateur
     */
    changePassword(userId, oldPassword, newPassword) {
        const users = this.getAllUsers();
        const user = users.find(u => u.id === userId);

        if (!user) {
            return { success: false, error: 'Utilisateur non trouvé' };
        }

        // Vérification de l'ancien mot de passe
        if (user.password !== this.hashPassword(oldPassword)) {
            return { success: false, error: 'Ancien mot de passe incorrect' };
        }

        user.password = this.hashPassword(newPassword);
        user.updatedAt = new Date().toISOString();

        return this.updateUser(user);
    }

    /**
     * Réinitialise le mot de passe (admin seulement)
     */
    resetPassword(userId, newPassword) {
        const users = this.getAllUsers();
        const user = users.find(u => u.id === userId);

        if (!user) {
            return { success: false, error: 'Utilisateur non trouvé' };
        }

        user.password = this.hashPassword(newPassword);
        user.updatedAt = new Date().toISOString();

        return this.updateUser(user);
    }

    // =====================================================
    // UTILITAIRES
    // =====================================================

    /**
     * Génère un avatar basé sur les initiales
     */
    generateAvatar(username) {
        const initials = username.substring(0, 2).toUpperCase();
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3', '#54A0FF'];
        const color = colors[username.length % colors.length];

        return {
            type: 'initials',
            initials: initials,
            backgroundColor: color
        };
    }

    /**
     * Nettoie les données utilisateur (supprime le mot de passe)
     */
    sanitizeUser(user) {
        const { password, ...sanitized } = user;
        return sanitized;
    }

    /**
     * Met à jour le streak de jours consécutifs
     */
    updateStreak(user) {
        const today = new Date().toISOString().split('T')[0];
        const lastConnection = user.lastConnectionDate;

        if (!lastConnection) {
            user.stats.streakDays = 1;
            return;
        }

        const lastDate = new Date(lastConnection);
        const currentDate = new Date(today);
        const diffTime = currentDate - lastDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            // Jour consécutif
            user.stats.streakDays = (user.stats.streakDays || 0) + 1;
        } else if (diffDays === 0) {
            // Même jour, ne rien faire
            return;
        } else {
            // Streak cassé
            user.stats.streakDays = 1;
        }
    }

    /**
     * Initialise l'administrateur par défaut
     */
    initializeDefaultAdmin() {
        const users = this.getAllUsers();

        // Si aucun admin n'existe, créer l'admin par défaut
        const hasAdmin = users.some(user => user.role === 'admin');

        if (!hasAdmin) {
            const defaultAdmin = {
                id: 'admin_default',
                username: 'admin',
                email: 'admin@englishmaster.com',
                password: this.hashPassword('admin123'), // Mot de passe par défaut
                role: 'admin',
                profile: {
                    firstName: 'Administrateur',
                    lastName: 'EnglishMaster',
                    avatar: this.generateAvatar('Admin'),
                    level: 'advanced',
                    preferredTheme: 'classic',
                    language: 'fr'
                },
                stats: {
                    wordsLearned: 0,
                    totalPoints: 0,
                    streakDays: 0,
                    lastConnectionDate: new Date().toISOString().split('T')[0],
                    totalSessions: 0,
                    badges: ['admin', 'founder']
                },
                settings: {
                    notifications: true,
                    autoPlaySound: true,
                    dailyGoal: 20
                },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            users.push(defaultAdmin);
            this.saveAllUsers(users);

            console.log('👑 Administrateur par défaut créé:');
            console.log('Username: admin');
            console.log('Password: admin123');
            console.log('Veuillez changer le mot de passe après la première connexion.');
        }
    }

    // =====================================================
    // STATISTIQUES ET BADGES
    // =====================================================

    /**
     * Ajoute des points à un utilisateur
     */
    addPoints(userId, points, reason = '') {
        const user = this.getAllUsers().find(u => u.id === userId);
        if (!user) return { success: false, error: 'Utilisateur non trouvé' };

        user.stats.totalPoints = (user.stats.totalPoints || 0) + points;
        user.updatedAt = new Date().toISOString();

        // Vérification des badges
        this.checkAndAwardBadges(user);

        return this.updateUser(user);
    }

    /**
     * Ajoute un mot appris
     */
    addWordLearned(userId) {
        const user = this.getAllUsers().find(u => u.id === userId);
        if (!user) return { success: false, error: 'Utilisateur non trouvé' };

        user.stats.wordsLearned = (user.stats.wordsLearned || 0) + 1;

        // Points automatiques : 10 points par mot appris
        user.stats.totalPoints = (user.stats.totalPoints || 0) + 10;

        user.updatedAt = new Date().toISOString();

        // Vérification des badges
        this.checkAndAwardBadges(user);

        return this.updateUser(user);
    }

    /**
     * Vérifie et attribue les badges
     */
    checkAndAwardBadges(user) {
        const badges = user.stats.badges || [];
        const newBadges = [];

        // Badge premiers pas
        if (user.stats.wordsLearned >= 1 && !badges.includes('first_word')) {
            newBadges.push('first_word');
        }

        // Badge apprenti
        if (user.stats.wordsLearned >= 10 && !badges.includes('apprentice')) {
            newBadges.push('apprentice');
        }

        // Badge expert
        if (user.stats.wordsLearned >= 100 && !badges.includes('expert')) {
            newBadges.push('expert');
        }

        // Badge streak
        if (user.stats.streakDays >= 7 && !badges.includes('week_streak')) {
            newBadges.push('week_streak');
        }

        // Badge points
        if (user.stats.totalPoints >= 1000 && !badges.includes('thousand_points')) {
            newBadges.push('thousand_points');
        }

        if (newBadges.length > 0) {
            user.stats.badges = [...badges, ...newBadges];
        }

        return newBadges;
    }

    /**
     * Récupère les statistiques globales
     */
    getGlobalStats() {
        const users = this.getAllUsers();

        return {
            totalUsers: users.length,
            totalAdmins: users.filter(u => u.role === 'admin').length,
            totalWords: users.reduce((sum, u) => sum + (u.stats.wordsLearned || 0), 0),
            totalPoints: users.reduce((sum, u) => sum + (u.stats.totalPoints || 0), 0),
            totalSessions: users.reduce((sum, u) => sum + (u.stats.totalSessions || 0), 0),
            activeUsers: users.filter(u => {
                const lastConnection = new Date(u.lastConnectionDate);
                const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                return lastConnection > oneWeekAgo;
            }).length
        };
    }
}

// Instance singleton
export const userService = new UserService();
