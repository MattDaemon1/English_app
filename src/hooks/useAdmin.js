/**
 * Hook pour vérifier si l'utilisateur a des privilèges d'administrateur
 */
import { useAuth } from './useAuth.jsx'

const useAdmin = () => {
    const { user, isAuthenticated } = useAuth()

    // Liste des administrateurs (à adapter selon votre système)
    const ADMIN_EMAILS = [
        'admin@englishmaster.com',
        'matt@englishmaster.com',
        'matt4daemon@gmail.com', // Votre email principal
        'mattm@example.com',     // Email de test
        'test@admin.com',        // Email de test
        // Ajoutez d'autres emails admin ici
    ]

    const ADMIN_ROLES = ['admin', 'super_admin', 'moderator']
    
    // Mode développement - forcer admin (à supprimer en production)
    const DEV_MODE = process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost'
    const FORCE_ADMIN_IN_DEV = true // Mettre à false en production
    
    const isAdmin = isAuthenticated && user && (
        ADMIN_EMAILS.includes(user.email?.toLowerCase()) ||
        ADMIN_ROLES.includes(user.role?.toLowerCase()) ||
        user.isAdmin === true ||
        (DEV_MODE && FORCE_ADMIN_IN_DEV) // Force admin en développement
    )

    return {
        isAdmin,
        user,
        canManageUsers: isAdmin,
        canViewAnalytics: isAdmin,
        canModerateContent: isAdmin,
        canExportData: isAdmin,
        canManageSystem: user?.role === 'super_admin'
    }
}

export default useAdmin
