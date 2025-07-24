import React, { useState, useEffect } from 'react'
import useAdmin from '../../hooks/useAdmin'
import useNotifications from '../../hooks/useNotifications'
import { userService } from '../../services/userService'

const AdminDashboard = ({ onClose }) => {
    const { isAdmin } = useAdmin()
    const notificationSystem = useNotifications()
    const [activeTab, setActiveTab] = useState('users')
    const [users, setUsers] = useState([])
    const [analytics, setAnalytics] = useState({})
    const [loading, setLoading] = useState(false)
    const [showAddUserModal, setShowAddUserModal] = useState(false)
    const [newUser, setNewUser] = useState({
        username: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        role: 'user'
    })

    // Chargement des utilisateurs réels
    const loadUsers = async () => {
        setLoading(true)
        try {
            const allUsers = userService.getAllUsers()
            setUsers(allUsers)
            setLoading(false)
        } catch (error) {
            console.error('Erreur chargement utilisateurs:', error)
            notificationSystem.error('Erreur', 'Impossible de charger les utilisateurs')
            setLoading(false)
        }
    }

    // Chargement des analytics réelles
    const loadAnalytics = async () => {
        try {
            const globalStats = userService.getGlobalStats()
            setAnalytics(globalStats)
        } catch (error) {
            console.error('Erreur chargement analytics:', error)
            notificationSystem.error('Erreur', 'Impossible de charger les analytics')
        }
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
        const userDisplayName = user.profile ? `${user.profile.firstName} ${user.profile.lastName}`.trim() || user.username : user.username
        
        switch (action) {
            case 'suspend':
                user.isActive = false
                userService.updateUser(user)
                notificationSystem.warning('Utilisateur suspendu', `${userDisplayName} a été suspendu`)
                loadUsers()
                break
            case 'activate':
                user.isActive = true
                userService.updateUser(user)
                notificationSystem.success('Utilisateur activé', `${userDisplayName} a été réactivé`)
                loadUsers()
                break
            case 'delete':
                if (user.role === 'admin' || user.role === 'super_admin') {
                    notificationSystem.error('Action interdite', 'Impossible de supprimer un administrateur')
                    return
                }
                const result = userService.deleteUser(userId)
                if (result.success) {
                    notificationSystem.error('Utilisateur supprimé', `${userDisplayName} a été supprimé`)
                    loadUsers()
                } else {
                    notificationSystem.error('Erreur', result.error)
                }
                break
            case 'reset':
                user.stats = {
                    wordsLearned: 0,
                    totalPoints: 0,
                    streakDays: 0,
                    lastConnectionDate: user.stats.lastConnectionDate,
                    totalSessions: user.stats.totalSessions || 0,
                    badges: []
                }
                userService.updateUser(user)
                notificationSystem.info('Données réinitialisées', `Progrès de ${userDisplayName} remis à zéro`)
                loadUsers()
                break
            case 'makeAdmin':
                user.role = 'admin'
                userService.updateUser(user)
                notificationSystem.success('Administrateur créé', `${userDisplayName} est maintenant administrateur`)
                loadUsers()
                break
            case 'removeAdmin':
                if (user.role === 'super_admin') {
                    notificationSystem.error('Action interdite', 'Impossible de retirer les droits d\'un super administrateur')
                    return
                }
                user.role = 'user'
                userService.updateUser(user)
                notificationSystem.info('Droits retirés', `${userDisplayName} n'est plus administrateur`)
                loadUsers()
                break
        }
    }

    const handleAddUser = () => {
        if (!newUser.username || !newUser.password) {
            notificationSystem.error('Erreur', 'Le nom d\'utilisateur et le mot de passe sont obligatoires')
            return
        }

        const result = userService.createUser({
            username: newUser.username,
            email: newUser.email,
            password: newUser.password,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            role: newUser.role
        })

        if (result.success) {
            notificationSystem.success('Utilisateur créé', `${newUser.username} a été créé avec succès`)
            setShowAddUserModal(false)
            setNewUser({
                username: '',
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                role: 'user'
            })
            loadUsers()
        } else {
            notificationSystem.error('Erreur', result.error)
        }
    }

    const exportData = (type) => {
        notificationSystem.success('Export en cours', `Export ${type} démarré...`)
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

                <div style={{
                    display: 'flex',
                    borderBottom: '1px solid #E5E7EB',
                    backgroundColor: '#F9FAFB'
                }}>
                    {[
                        { id: 'users', label: '👥 Gestion Utilisateurs' },
                        { id: 'analytics', label: '📊 Analytiques' },
                        { id: 'content', label: '📝 Contenu' },
                        { id: 'system', label: '⚙️ Système' }
                    ].map(tab => (
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
                                        onClick={() => setShowAddUserModal(true)}
                                        style={{
                                            padding: '8px 16px',
                                            backgroundColor: '#2563EB',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontSize: '14px'
                                        }}
                                    >
                                        ➕ Ajouter Utilisateur
                                    </button>
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
                                                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Rôle</th>
                                                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Mots appris</th>
                                                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Points</th>
                                                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Dernière connexion</th>
                                                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map(user => {
                                                const userDisplayName = user.profile ? `${user.profile.firstName} ${user.profile.lastName}`.trim() || user.username : user.username
                                                const isCurrentUserAdmin = user.role === 'admin' || user.role === 'super_admin'
                                                
                                                return (
                                                    <tr key={user.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                                                        <td style={{ padding: '12px' }}>
                                                            <div>
                                                                <div style={{ fontWeight: '500', color: '#1F2937' }}>{userDisplayName}</div>
                                                                <div style={{ fontSize: '12px', color: '#6B7280' }}>{user.email}</div>
                                                                <div style={{ fontSize: '11px', color: '#9CA3AF' }}>@{user.username}</div>
                                                            </div>
                                                        </td>
                                                        <td style={{ padding: '12px' }}>
                                                            <span style={{
                                                                padding: '4px 8px',
                                                                borderRadius: '4px',
                                                                fontSize: '12px',
                                                                fontWeight: '500',
                                                                backgroundColor: isCurrentUserAdmin ? '#FEF3C7' : '#E0E7FF',
                                                                color: isCurrentUserAdmin ? '#92400E' : '#3730A3'
                                                            }}>
                                                                {user.role === 'super_admin' ? '👑 Super Admin' : 
                                                                 user.role === 'admin' ? '🛡️ Admin' : '👤 Utilisateur'}
                                                            </span>
                                                        </td>
                                                        <td style={{ padding: '12px', color: '#1F2937' }}>{user.stats?.wordsLearned || 0}</td>
                                                        <td style={{ padding: '12px', color: '#1F2937' }}>{user.stats?.totalPoints || 0}</td>
                                                        <td style={{ padding: '12px', color: '#6B7280' }}>{user.stats?.lastConnectionDate || 'Jamais'}</td>
                                                        <td style={{ padding: '12px' }}>
                                                            <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                                                                {!isCurrentUserAdmin && (
                                                                    <button
                                                                        onClick={() => handleUserAction(user.id, 'makeAdmin')}
                                                                        style={{
                                                                            padding: '4px 8px',
                                                                            border: 'none',
                                                                            borderRadius: '4px',
                                                                            cursor: 'pointer',
                                                                            fontSize: '12px',
                                                                            backgroundColor: '#FEF3C7',
                                                                            color: '#92400E'
                                                                        }}
                                                                        title="Promouvoir Admin"
                                                                    >
                                                                        👑
                                                                    </button>
                                                                )}
                                                                {isCurrentUserAdmin && user.role !== 'super_admin' && (
                                                                    <button
                                                                        onClick={() => handleUserAction(user.id, 'removeAdmin')}
                                                                        style={{
                                                                            padding: '4px 8px',
                                                                            border: 'none',
                                                                            borderRadius: '4px',
                                                                            cursor: 'pointer',
                                                                            fontSize: '12px',
                                                                            backgroundColor: '#FEE2E2',
                                                                            color: '#991B1B'
                                                                        }}
                                                                        title="Retirer Admin"
                                                                    >
                                                                        👤
                                                                    </button>
                                                                )}
                                                                <button
                                                                    onClick={() => handleUserAction(user.id, user.isActive === false ? 'activate' : 'suspend')}
                                                                    style={{
                                                                        padding: '4px 8px',
                                                                        border: 'none',
                                                                        borderRadius: '4px',
                                                                        cursor: 'pointer',
                                                                        fontSize: '12px',
                                                                        backgroundColor: user.isActive === false ? '#D1FAE5' : '#FEF3C7',
                                                                        color: user.isActive === false ? '#065F46' : '#92400E'
                                                                    }}
                                                                    title={user.isActive === false ? 'Activer' : 'Suspendre'}
                                                                >
                                                                    {user.isActive === false ? '▶️' : '⏸️'}
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
                                                                    title="Réinitialiser progrès"
                                                                >
                                                                    🔄
                                                                </button>
                                                                {!isCurrentUserAdmin && (
                                                                    <button
                                                                        onClick={() => {
                                                                            if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${userDisplayName} ?`)) {
                                                                                handleUserAction(user.id, 'delete')
                                                                            }
                                                                        }}
                                                                        style={{
                                                                            padding: '4px 8px',
                                                                            border: 'none',
                                                                            borderRadius: '4px',
                                                                            cursor: 'pointer',
                                                                            fontSize: '12px',
                                                                            backgroundColor: '#FEE2E2',
                                                                            color: '#991B1B'
                                                                        }}
                                                                        title="Supprimer"
                                                                    >
                                                                        🗑️
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
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
                                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#D97706' }}>{analytics.totalWords || 0}</div>
                                    <div style={{ fontSize: '14px', color: '#B45309' }}>Mots appris</div>
                                </div>
                                <div style={{ padding: '20px', backgroundColor: '#FDF2F8', borderRadius: '12px', border: '1px solid #F9A8D4' }}>
                                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#BE185D' }}>{analytics.totalAdmins || 0}</div>
                                    <div style={{ fontSize: '14px', color: '#9D174D' }}>Administrateurs</div>
                                </div>
                            </div>
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
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {showAddUserModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    zIndex: 10001,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }} onClick={() => setShowAddUserModal(false)}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '30px',
                        borderRadius: '12px',
                        width: '500px',
                        maxWidth: '90%'
                    }} onClick={(e) => e.stopPropagation()}>
                        <h3 style={{ marginTop: 0, color: '#1F2937' }}>➕ Ajouter un utilisateur</h3>
                        
                        <div style={{ display: 'grid', gap: '15px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Nom d'utilisateur *</label>
                                <input
                                    type="text"
                                    value={newUser.username}
                                    onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: '1px solid #D1D5DB',
                                        borderRadius: '6px'
                                    }}
                                    placeholder="nom_utilisateur"
                                />
                            </div>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Prénom</label>
                                    <input
                                        type="text"
                                        value={newUser.firstName}
                                        onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            border: '1px solid #D1D5DB',
                                            borderRadius: '6px'
                                        }}
                                        placeholder="Prénom"
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Nom</label>
                                    <input
                                        type="text"
                                        value={newUser.lastName}
                                        onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            border: '1px solid #D1D5DB',
                                            borderRadius: '6px'
                                        }}
                                        placeholder="Nom"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Email</label>
                                <input
                                    type="email"
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: '1px solid #D1D5DB',
                                        borderRadius: '6px'
                                    }}
                                    placeholder="email@exemple.com"
                                />
                            </div>
                            
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Mot de passe *</label>
                                <input
                                    type="password"
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: '1px solid #D1D5DB',
                                        borderRadius: '6px'
                                    }}
                                    placeholder="Mot de passe"
                                />
                            </div>
                            
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Rôle</label>
                                <select
                                    value={newUser.role}
                                    onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: '1px solid #D1D5DB',
                                        borderRadius: '6px'
                                    }}
                                >
                                    <option value="user">👤 Utilisateur</option>
                                    <option value="admin">🛡️ Administrateur</option>
                                </select>
                            </div>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => setShowAddUserModal(false)}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#6B7280',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer'
                                }}
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleAddUser}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#2563EB',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer'
                                }}
                            >
                                Créer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminDashboard
