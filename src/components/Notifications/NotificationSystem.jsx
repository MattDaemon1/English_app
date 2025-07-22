import { useState, useEffect } from 'react'

const NotificationSystem = ({ notifications, onRemove }) => {
    const [animatingNotifications, setAnimatingNotifications] = useState(new Set())

    const handleRemove = (id) => {
        // Ajouter l'animation de sortie
        setAnimatingNotifications(prev => new Set([...prev, id]))

        // Supprimer après l'animation
        setTimeout(() => {
            onRemove(id)
            setAnimatingNotifications(prev => {
                const newSet = new Set(prev)
                newSet.delete(id)
                return newSet
            })
        }, 300)
    }

    // Auto-remove après 5 secondes
    useEffect(() => {
        const timers = notifications.map(notification => {
            return setTimeout(() => {
                handleRemove(notification.id)
            }, 5000)
        })

        return () => {
            timers.forEach(timer => clearTimeout(timer))
        }
    }, [notifications])

    if (!notifications || notifications.length === 0) return null

    return (
        <>
            {/* Injection du CSS global */}
            <style>{`
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }

                @keyframes progressBar {
                    from {
                        width: 100%;
                    }
                    to {
                        width: 0%;
                    }
                }

                .notification:hover {
                    transform: translateY(-2px) scale(1.02) !important;
                    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15) !important;
                }

                @media (max-width: 768px) {
                    .notification-container {
                        top: 10px !important;
                        right: 10px !important;
                        left: 10px !important;
                        max-width: none !important;
                    }
                }
            `}</style>

            <div className="notification-container" style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                zIndex: 10000,
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                maxWidth: '400px',
                width: '100%'
            }}>
                {notifications.map((notification, index) => {
                    const isAnimatingOut = animatingNotifications.has(notification.id)

                    return (
                        <div
                            key={notification.id}
                            className={`notification notification-${notification.type || 'info'}`}
                            style={{
                                background: getNotificationBackground(notification.type),
                                border: `1px solid ${getNotificationBorder(notification.type)}`,
                                borderRadius: '12px',
                                padding: '16px 20px',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                                backdropFilter: 'blur(10px)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                transform: isAnimatingOut
                                    ? 'translateX(100%) scale(0.95)'
                                    : `translateY(${index * -5}px)`,
                                opacity: isAnimatingOut ? 0 : 1,
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                animation: isAnimatingOut ? 'none' : 'slideInRight 0.4s ease-out',
                                cursor: 'pointer',
                                userSelect: 'none',
                                position: 'relative'
                            }}
                            onClick={() => handleRemove(notification.id)}
                        >
                            {/* Icône */}
                            <div style={{
                                fontSize: '24px',
                                flexShrink: 0
                            }}>
                                {getNotificationIcon(notification.type)}
                            </div>

                            {/* Contenu */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                {notification.title && (
                                    <div style={{
                                        fontWeight: '600',
                                        fontSize: '14px',
                                        color: getNotificationTextColor(notification.type),
                                        marginBottom: '4px',
                                        lineHeight: '1.2'
                                    }}>
                                        {notification.title}
                                    </div>
                                )}
                                <div style={{
                                    fontSize: '13px',
                                    color: getNotificationDescriptionColor(notification.type),
                                    lineHeight: '1.3',
                                    wordBreak: 'break-word'
                                }}>
                                    {notification.message || notification.description}
                                </div>
                            </div>

                            {/* Bouton fermer */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleRemove(notification.id)
                                }}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '18px',
                                    color: getNotificationTextColor(notification.type),
                                    cursor: 'pointer',
                                    opacity: 0.7,
                                    flexShrink: 0,
                                    transition: 'opacity 0.2s',
                                    padding: '4px',
                                    borderRadius: '4px'
                                }}
                                onMouseEnter={(e) => e.target.style.opacity = '1'}
                                onMouseLeave={(e) => e.target.style.opacity = '0.7'}
                            >
                                ×
                            </button>

                            {/* Barre de progression */}
                            <div style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                height: '3px',
                                backgroundColor: getNotificationBorder(notification.type),
                                borderRadius: '0 0 12px 12px',
                                animation: 'progressBar 5s linear forwards'
                            }} />
                        </div>
                    )
                })}
            </div>
        </>
    )
}

// Fonctions utilitaires pour les couleurs et icônes
const getNotificationBackground = (type) => {
    switch (type) {
        case 'success':
            return 'linear-gradient(135deg, rgba(16, 185, 129, 0.95) 0%, rgba(5, 150, 105, 0.95) 100%)'
        case 'error':
            return 'linear-gradient(135deg, rgba(239, 68, 68, 0.95) 0%, rgba(220, 38, 38, 0.95) 100%)'
        case 'warning':
            return 'linear-gradient(135deg, rgba(245, 158, 11, 0.95) 0%, rgba(217, 119, 6, 0.95) 100%)'
        case 'info':
        default:
            return 'linear-gradient(135deg, rgba(59, 130, 246, 0.95) 0%, rgba(37, 99, 235, 0.95) 100%)'
    }
}

const getNotificationBorder = (type) => {
    switch (type) {
        case 'success':
            return 'rgba(16, 185, 129, 0.3)'
        case 'error':
            return 'rgba(239, 68, 68, 0.3)'
        case 'warning':
            return 'rgba(245, 158, 11, 0.3)'
        case 'info':
        default:
            return 'rgba(59, 130, 246, 0.3)'
    }
}

const getNotificationTextColor = (type) => {
    return '#FFFFFF'
}

const getNotificationDescriptionColor = (type) => {
    return 'rgba(255, 255, 255, 0.9)'
}

const getNotificationIcon = (type) => {
    switch (type) {
        case 'success':
            return '✅'
        case 'error':
            return '❌'
        case 'warning':
            return '⚠️'
        case 'info':
        default:
            return 'ℹ️'
    }
}

export default NotificationSystem