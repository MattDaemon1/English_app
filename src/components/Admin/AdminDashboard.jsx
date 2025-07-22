import React, { useState, useEffect } from 'react'
import useAdmin from '../../hooks/useAdmin'
import useNotifications from '../../hooks/useNotifications'

const AdminDashboard = ({ onClose }) => {
    const { isAdmin, canManageUsers, canViewAnalytics, canModerateContent, canExportData, canManageSystem } = useAdmin()
    const notificationSystem = useNotifications()
    const [activeTab, setActiveTab] = useState('users')
    const [users, setUsers] = useState([])
    const [analytics, setAnalytics] = useState({})
    const [loading, setLoading] = useState(false)

    // Debug du dashboard admin
    console.log('🔍 AdminDashboard - isAdmin:', isAdmin)
    console.log('🔍 AdminDashboard - canManageUsers:', canManageUsers)

    // Si pas admin, ne pas afficher (temporairement désactivé pour debug)
    if (!isAdmin && process.env.NODE_ENV !== 'development') {
        console.log('🔍 AdminDashboard - Not admin, returning null')
        return null
    }

    // Simulation de chargement des utilisateurs
    const loadUsers = async () => {
        setLoading(true)
        try {
            // Simulation d'une API
            setTimeout(() => {
                const mockUsers = [
                    { id: 1, email: 'user1@test.com', name: 'Alice Martin', level: 3, wordsLearned: 156, status: 'active', lastLogin: '2025-01-20' },
                    { id: 2, email: 'user2@test.com', name: 'Bob Dupont', level: 5, wordsLearned: 289, status: 'active', lastLogin: '2025-01-21' },
                    { id: 3, email: 'user3@test.com', name: 'Claire Bernard', level: 2, wordsLearned: 87, status: 'inactive', lastLogin: '2025-01-15' }
                ]
                setUsers(mockUsers)
                setLoading(false)
            }, 1000)
        } catch (error) {
            notificationSystem.error('Erreur', 'Impossible de charger les utilisateurs')
            setLoading(false)
        }
    }

    // Simulation de chargement des analytics
    const loadAnalytics = async () => {
        const mockAnalytics = {
            totalUsers: 1247,
            activeUsers: 892,
            totalWordsLearned: 45632,
            averageLevel: 3.2,
            mostPopularWords: ['hello', 'world', 'beautiful', 'important', 'computer'],
            dailyActiveUsers: [120, 145, 167, 189, 201, 178, 156]
        }
        setAnalytics(mockAnalytics)
    }

    useEffect(() => {
        if (activeTab === 'users') {
            loadUsers()
        } else if (activeTab === 'analytics') {
            loadAnalytics()
        }
    }, [activeTab])

    const handleUserAction = (userId, action) => {
        const user = users.find(u => u.id === userId)
        switch (action) {
            case 'suspend':
                notificationSystem.warning('Utilisateur suspendu', `${user.name} a été suspendu`)
                break
            case 'activate':
                notificationSystem.success('Utilisateur activé', `${user.name} a été réactivé`)
                break
            case 'delete':
                notificationSystem.error('Utilisateur supprimé', `${user.name} a été supprimé`)
                setUsers(users.filter(u => u.id !== userId))
                break
            case 'reset':
                notificationSystem.info('Données réinitialisées', `Progrès de ${user.name} remis à zéro`)
                break
        }
    }

    const exportData = (type) => {
        notificationSystem.success('Export en cours', `Export ${type} démarré...`)
        // Simulation d'export
        setTimeout(() => {
            notificationSystem.success('Export terminé', `Fichier ${type}.csv téléchargé`)
        }, 2000)
    }

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                width: '90%',
                maxWidth: '1200px',
                maxHeight: '90%',
                overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
            }}>
                {/* Header */}
                <div style={{
                    padding: '20px 30px',
                    borderBottom: '1px solid #E5E7EB',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: '#F8FAFC'
                }}>
                    <h2 style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: '#1F2937',
                        margin: 0
                    }}>
                        🛡️ Dashboard Administrateur
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '24px',
                            cursor: 'pointer',
                            color: '#6B7280',
                            padding: '8px'
                        }}
                    >
                        ✕
                    </button>
                </div>

                {/* Tabs */}
                <div style={{
                    display: 'flex',
                    borderBottom: '1px solid #E5E7EB',
                    backgroundColor: '#F9FAFB'
                }}>
                    {[
                        { id: 'users', label: '👥 Gestion Utilisateurs', enabled: canManageUsers },
                        { id: 'analytics', label: '📊 Analytiques', enabled: canViewAnalytics },
                        { id: 'content', label: '📝 Contenu', enabled: canModerateContent },
                        { id: 'system', label: '⚙️ Système', enabled: canManageSystem }
                    ].map(tab => tab.enabled && (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                padding: '15px 20px',
                                border: 'none',
                                backgroundColor: activeTab === tab.id ? 'white' : 'transparent',
                                color: activeTab === tab.id ? '#2563EB' : '#6B7280',
                                borderBottom: activeTab === tab.id ? '2px solid #2563EB' : 'none',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: activeTab === tab.id ? '600' : '400'
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div style={{
                    padding: '30px',
                    height: '500px',
                    overflowY: 'auto'
                }}>
                    {activeTab === 'users' && (
                        <div>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '20px'
                            }}>
                                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1F2937' }}>
                                    Gestion des Utilisateurs ({users.length})
                                </h3>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button
                                        onClick={() => exportData('users')}
                                        style={{
                                            padding: '8px 16px',
                                            backgroundColor: '#10B981',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontSize: '14px'
                                        }}
                                    >
                                        📥 Exporter
                                    </button>
                                </div>
                            </div>

                            {loading ? (
                                <div style={{ textAlign: 'center', padding: '40px' }}>
                                    <div style={{ fontSize: '32px', marginBottom: '10px' }}>⏳</div>
                                    <p>Chargement des utilisateurs...</p>
                                </div>
                            ) : (
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{
                                        width: '100%',
                                        borderCollapse: 'collapse',
                                        backgroundColor: 'white',
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                                    }}>
                                        <thead>
                                            <tr style={{ backgroundColor: '#F3F4F6' }}>
                                                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Utilisateur</th>
                                                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Niveau</th>
                                                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Mots appris</th>
                                                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Statut</th>
                                                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Dernière connexion</th>
                                                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map(user => (
                                                <tr key={user.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                                                    <td style={{ padding: '12px' }}>
                                                        <div>
                                                            <div style={{ fontWeight: '500', color: '#1F2937' }}>{user.name}</div>
                                                            <div style={{ fontSize: '12px', color: '#6B7280' }}>{user.email}</div>
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: '12px', color: '#1F2937' }}>Niveau {user.level}</td>
                                                    <td style={{ padding: '12px', color: '#1F2937' }}>{user.wordsLearned}</td>
                                                    <td style={{ padding: '12px' }}>
                                                        <span style={{
                                                            padding: '4px 8px',
                                                            borderRadius: '4px',
                                                            fontSize: '12px',
                                                            fontWeight: '500',
                                                            backgroundColor: user.status === 'active' ? '#D1FAE5' : '#FEE2E2',
                                                            color: user.status === 'active' ? '#065F46' : '#991B1B'
                                                        }}>
                                                            {user.status === 'active' ? 'Actif' : 'Inactif'}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '12px', color: '#6B7280' }}>{user.lastLogin}</td>
                                                    <td style={{ padding: '12px' }}>
                                                        <div style={{ display: 'flex', gap: '5px' }}>
                                                            <button
                                                                onClick={() => handleUserAction(user.id, user.status === 'active' ? 'suspend' : 'activate')}
                                                                style={{
                                                                    padding: '4px 8px',
                                                                    border: 'none',
                                                                    borderRadius: '4px',
                                                                    cursor: 'pointer',
                                                                    fontSize: '12px',
                                                                    backgroundColor: user.status === 'active' ? '#FEF3C7' : '#D1FAE5',
                                                                    color: user.status === 'active' ? '#92400E' : '#065F46'
                                                                }}
                                                            >
                                                                {user.status === 'active' ? '⏸️' : '▶️'}
                                                            </button>
                                                            <button
                                                                onClick={() => handleUserAction(user.id, 'reset')}
                                                                style={{
                                                                    padding: '4px 8px',
                                                                    border: 'none',
                                                                    borderRadius: '4px',
                                                                    cursor: 'pointer',
                                                                    fontSize: '12px',
                                                                    backgroundColor: '#EDE9FE',
                                                                    color: '#6B46C1'
                                                                }}
                                                            >
                                                                🔄
                                                            </button>
                                                            <button
                                                                onClick={() => handleUserAction(user.id, 'delete')}
                                                                style={{
                                                                    padding: '4px 8px',
                                                                    border: 'none',
                                                                    borderRadius: '4px',
                                                                    cursor: 'pointer',
                                                                    fontSize: '12px',
                                                                    backgroundColor: '#FEE2E2',
                                                                    color: '#991B1B'
                                                                }}
                                                            >
                                                                🗑️
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'analytics' && (
                        <div>
                            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1F2937', marginBottom: '20px' }}>
                                📊 Analytiques et Statistiques
                            </h3>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                                <div style={{ padding: '20px', backgroundColor: '#EFF6FF', borderRadius: '12px', border: '1px solid #DBEAFE' }}>
                                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1D4ED8' }}>{analytics.totalUsers || 0}</div>
                                    <div style={{ fontSize: '14px', color: '#1E40AF' }}>Utilisateurs total</div>
                                </div>
                                <div style={{ padding: '20px', backgroundColor: '#F0FDF4', borderRadius: '12px', border: '1px solid #BBF7D0' }}>
                                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#059669' }}>{analytics.activeUsers || 0}</div>
                                    <div style={{ fontSize: '14px', color: '#047857' }}>Utilisateurs actifs</div>
                                </div>
                                <div style={{ padding: '20px', backgroundColor: '#FEF3C7', borderRadius: '12px', border: '1px solid #FCD34D' }}>
                                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#D97706' }}>{analytics.totalWordsLearned || 0}</div>
                                    <div style={{ fontSize: '14px', color: '#B45309' }}>Mots appris</div>
                                </div>
                                <div style={{ padding: '20px', backgroundColor: '#FDF2F8', borderRadius: '12px', border: '1px solid #F9A8D4' }}>
                                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#BE185D' }}>{analytics.averageLevel || 0}</div>
                                    <div style={{ fontSize: '14px', color: '#9D174D' }}>Niveau moyen</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                                <button
                                    onClick={() => exportData('analytics')}
                                    style={{
                                        padding: '10px 20px',
                                        backgroundColor: '#3B82F6',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    📊 Exporter Analytics
                                </button>
                                <button
                                    onClick={() => exportData('reports')}
                                    style={{
                                        padding: '10px 20px',
                                        backgroundColor: '#8B5CF6',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    📋 Générer Rapport
                                </button>
                            </div>

                            {analytics.mostPopularWords && (
                                <div style={{ padding: '20px', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
                                    <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1F2937', marginBottom: '15px' }}>
                                        🔥 Mots les plus étudiés
                                    </h4>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                        {analytics.mostPopularWords.map((word, index) => (
                                            <span key={word} style={{
                                                padding: '6px 12px',
                                                backgroundColor: '#EFF6FF',
                                                color: '#1E40AF',
                                                borderRadius: '20px',
                                                fontSize: '14px',
                                                fontWeight: '500'
                                            }}>
                                                #{index + 1} {word}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'content' && (
                        <div>
                            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1F2937', marginBottom: '20px' }}>
                                📝 Gestion du Contenu
                            </h3>
                            <div style={{ display: 'grid', gap: '15px' }}>
                                <button
                                    onClick={() => notificationSystem.info('Fonctionnalité', 'Gestion des mots à venir')}
                                    style={{
                                        padding: '15px 20px',
                                        backgroundColor: '#F3F4F6',
                                        border: '1px solid #D1D5DB',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        textAlign: 'left'
                                    }}
                                >
                                    <div style={{ fontWeight: '600', color: '#1F2937' }}>📚 Gérer les mots</div>
                                    <div style={{ fontSize: '14px', color: '#6B7280' }}>Ajouter, modifier ou supprimer des mots du vocabulaire</div>
                                </button>
                                <button
                                    onClick={() => notificationSystem.info('Fonctionnalité', 'Gestion des quiz à venir')}
                                    style={{
                                        padding: '15px 20px',
                                        backgroundColor: '#F3F4F6',
                                        border: '1px solid #D1D5DB',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        textAlign: 'left'
                                    }}
                                >
                                    <div style={{ fontWeight: '600', color: '#1F2937' }}>🎯 Gérer les quiz</div>
                                    <div style={{ fontSize: '14px', color: '#6B7280' }}>Créer et modifier les questions de quiz</div>
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'system' && (
                        <div>
                            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1F2937', marginBottom: '20px' }}>
                                ⚙️ Administration Système
                            </h3>
                            <div style={{ display: 'grid', gap: '15px' }}>
                                <button
                                    onClick={() => notificationSystem.warning('Maintenance', 'Mode maintenance activé')}
                                    style={{
                                        padding: '15px 20px',
                                        backgroundColor: '#FEF3C7',
                                        border: '1px solid #FCD34D',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        textAlign: 'left'
                                    }}
                                >
                                    <div style={{ fontWeight: '600', color: '#92400E' }}>🔧 Mode maintenance</div>
                                    <div style={{ fontSize: '14px', color: '#B45309' }}>Activer/désactiver le mode maintenance</div>
                                </button>
                                <button
                                    onClick={() => notificationSystem.success('Sauvegarde', 'Sauvegarde démarrée')}
                                    style={{
                                        padding: '15px 20px',
                                        backgroundColor: '#EFF6FF',
                                        border: '1px solid #DBEAFE',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        textAlign: 'left'
                                    }}
                                >
                                    <div style={{ fontWeight: '600', color: '#1E40AF' }}>💾 Sauvegarde système</div>
                                    <div style={{ fontSize: '14px', color: '#1E3A8A' }}>Créer une sauvegarde complète</div>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard
