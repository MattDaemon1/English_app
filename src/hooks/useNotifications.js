import { useState, useCallback } from 'react'

let notificationId = 0

const useNotifications = () => {
    const [notifications, setNotifications] = useState([])

    const addNotification = useCallback((notification) => {
        const id = ++notificationId
        const newNotification = {
            id,
            timestamp: Date.now(),
            ...notification
        }

        setNotifications(prev => [...prev, newNotification])

        // Auto-remove après 5 secondes si pas de durée spécifiée
        if (notification.autoRemove !== false) {
            setTimeout(() => {
                removeNotification(id)
            }, notification.duration || 5000)
        }

        return id
    }, [])

    const removeNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id))
    }, [])

    const clearAll = useCallback(() => {
        setNotifications([])
    }, [])

    // Méthodes de convenance
    const success = useCallback((title, message, options = {}) => {
        return addNotification({
            type: 'success',
            title,
            message,
            ...options
        })
    }, [addNotification])

    const error = useCallback((title, message, options = {}) => {
        return addNotification({
            type: 'error',
            title,
            message,
            autoRemove: false, // Les erreurs ne disparaissent pas automatiquement
            ...options
        })
    }, [addNotification])

    const warning = useCallback((title, message, options = {}) => {
        return addNotification({
            type: 'warning',
            title,
            message,
            ...options
        })
    }, [addNotification])

    const info = useCallback((title, message, options = {}) => {
        return addNotification({
            type: 'info',
            title,
            message,
            ...options
        })
    }, [addNotification])

    return {
        notifications,
        addNotification,
        removeNotification,
        clearAll,
        success,
        error,
        warning,
        info
    }
}

export default useNotifications
