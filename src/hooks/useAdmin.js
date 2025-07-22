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
        // Ajoutez d'autres emails admin ici
    ]
    
    const ADMIN_ROLES = ['admin', 'super_admin', 'moderator']
    
    const isAdmin = isAuthenticated && user && (
        ADMIN_EMAILS.includes(user.email?.toLowerCase()) ||
        ADMIN_ROLES.includes(user.role?.toLowerCase()) ||
        user.isAdmin === true
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
