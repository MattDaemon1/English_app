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
        'test@admin.com',
        'admin',        // Email de test
        // Ajoutez d'autres emails admin ici
    ]

    const ADMIN_ROLES = ['admin', 'super_admin', 'moderator']

    // Mode développement - forcer admin (à supprimer en production)
    const DEV_MODE = process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost'
    const FORCE_ADMIN_IN_DEV = true // Mettre à false en production

    // Debug des informations utilisateur
    console.log('🔍 DEBUG Admin - user:', user)
    console.log('🔍 DEBUG Admin - isAuthenticated:', isAuthenticated)
    console.log('🔍 DEBUG Admin - user.email:', user?.email)
    console.log('🔍 DEBUG Admin - user.username:', user?.username)
    console.log('🔍 DEBUG Admin - user.role:', user?.role)
    console.log('🔍 DEBUG Admin - user.isAdmin:', user?.isAdmin)
    console.log('🔍 DEBUG Admin - DEV_MODE:', DEV_MODE)
    console.log('🔍 DEBUG Admin - FORCE_ADMIN_IN_DEV:', FORCE_ADMIN_IN_DEV)

    const isAdmin = isAuthenticated && user && (
        ADMIN_EMAILS.includes(user.email?.toLowerCase()) ||
        user.username === 'admin' || // Compte admin par défaut
        user.username === 'matt4daemon' || // Votre compte personnel
        ADMIN_ROLES.includes(user.role?.toLowerCase()) ||
        user.isAdmin === true ||
        (DEV_MODE && FORCE_ADMIN_IN_DEV) // Force admin en développement
    )

    console.log('🔍 DEBUG Admin - isAdmin result:', isAdmin)

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
