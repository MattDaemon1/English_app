import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth.jsx';

/**
 * 🔐 Bouton de Connexion/Déconnexion avec interface complète
 */
const AuthButton = ({ variant = 'default', size = 'md', showUserInfo = true }) => {
    const { currentUser, isAuthenticated, login, logout, loading } = useAuth();
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [loginData, setLoginData] = useState({ username: '', password: '' });
    const [loginError, setLoginError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Styles selon les variants
    const variants = {
        default: {
            backgroundColor: isAuthenticated ? '#EF4444' : '#2563EB',
            color: 'white',
            hoverColor: isAuthenticated ? '#DC2626' : '#1D4ED8'
        },
        outline: {
            backgroundColor: 'transparent',
            color: isAuthenticated ? '#EF4444' : '#2563EB',
            border: `2px solid ${isAuthenticated ? '#EF4444' : '#2563EB'}`,
            hoverColor: isAuthenticated ? '#DC2626' : '#1D4ED8'
        },
        ghost: {
            backgroundColor: 'transparent',
            color: isAuthenticated ? '#EF4444' : '#2563EB',
            hoverBackground: isAuthenticated ? '#FEF2F2' : '#EFF6FF'
        }
    };

    // Tailles
    const sizes = {
        sm: { padding: '6px 12px', fontSize: '14px' },
        md: { padding: '8px 16px', fontSize: '16px' },
        lg: { padding: '10px 20px', fontSize: '18px' }
    };

    const currentVariant = variants[variant] || variants.default;
    const currentSize = sizes[size] || sizes.md;

    // Gestion de la connexion
    const handleLogin = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setLoginError('');

        if (!loginData.username.trim() || !loginData.password.trim()) {
            setLoginError('Veuillez remplir tous les champs');
            setIsSubmitting(false);
            return;
        }

        try {
            const result = await login(loginData.username, loginData.password);

            if (result.success) {
                setShowLoginForm(false);
                setLoginData({ username: '', password: '' });
                setLoginError('');
            } else {
                setLoginError(result.error || 'Identifiants incorrects');
            }
        } catch (error) {
            setLoginError('Erreur de connexion');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Gestion de la déconnexion
    const handleLogout = () => {
        logout();
        setShowLoginForm(false);
        setLoginData({ username: '', password: '' });
        setLoginError('');
    };

    // Toggle du formulaire de connexion
    const toggleLoginForm = () => {
        setShowLoginForm(!showLoginForm);
        setLoginError('');
        setLoginData({ username: '', password: '' });
    };

    if (loading) {
        return (
            <button
                disabled
                style={{
                    ...currentSize,
                    backgroundColor: '#9CA3AF',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'not-allowed'
                }}
            >
                ⏳ Chargement...
            </button>
        );
    }

    return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            {/* Bouton principal */}
            {isAuthenticated ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {/* Informations utilisateur */}
                    {showUserInfo && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '6px 12px',
                            backgroundColor: '#F3F4F6',
                            borderRadius: '6px',
                            fontSize: '14px',
                            color: '#374151'
                        }}>
                            <span style={{ color: '#10B981', fontSize: '16px' }}>👤</span>
                            <span style={{ fontWeight: '500' }}>{currentUser?.username}</span>
                            {currentUser?.points && (
                                <span style={{
                                    backgroundColor: '#DBEAFE',
                                    color: '#1D4ED8',
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    fontSize: '12px',
                                    fontWeight: '600'
                                }}>
                                    {currentUser.points} XP
                                </span>
                            )}
                        </div>
                    )}

                    {/* Bouton de déconnexion */}
                    <button
                        onClick={handleLogout}
                        style={{
                            ...currentSize,
                            backgroundColor: currentVariant.backgroundColor,
                            color: currentVariant.color,
                            border: currentVariant.border || 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            fontWeight: '500'
                        }}
                        onMouseEnter={(e) => {
                            if (variant === 'ghost') {
                                e.target.style.backgroundColor = currentVariant.hoverBackground;
                            } else {
                                e.target.style.backgroundColor = currentVariant.hoverColor;
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = variant === 'ghost' ? 'transparent' : currentVariant.backgroundColor;
                        }}
                    >
                        🚪 Se déconnecter
                    </button>
                </div>
            ) : (
                <button
                    onClick={toggleLoginForm}
                    style={{
                        ...currentSize,
                        backgroundColor: currentVariant.backgroundColor,
                        color: currentVariant.color,
                        border: currentVariant.border || 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        fontWeight: '500'
                    }}
                    onMouseEnter={(e) => {
                        if (variant === 'ghost') {
                            e.target.style.backgroundColor = currentVariant.hoverBackground;
                        } else {
                            e.target.style.backgroundColor = currentVariant.hoverColor;
                        }
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.backgroundColor = variant === 'ghost' ? 'transparent' : currentVariant.backgroundColor;
                    }}
                >
                    🔐 Se connecter
                </button>
            )}

            {/* Formulaire de connexion en popup */}
            {showLoginForm && !isAuthenticated && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: '0',
                    marginTop: '8px',
                    backgroundColor: 'white',
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    padding: '20px',
                    minWidth: '300px',
                    zIndex: 1000
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '16px'
                    }}>
                        <h3 style={{
                            margin: '0',
                            color: '#1F2937',
                            fontSize: '18px',
                            fontWeight: '600'
                        }}>
                            🔐 Connexion
                        </h3>
                        <button
                            onClick={toggleLoginForm}
                            style={{
                                background: 'none',
                                border: 'none',
                                fontSize: '20px',
                                cursor: 'pointer',
                                color: '#9CA3AF'
                            }}
                        >
                            ✕
                        </button>
                    </div>

                    <form onSubmit={handleLogin}>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '6px',
                                color: '#374151',
                                fontSize: '14px',
                                fontWeight: '500'
                            }}>
                                Nom d'utilisateur
                            </label>
                            <input
                                type="text"
                                value={loginData.username}
                                onChange={(e) => setLoginData(prev => ({
                                    ...prev,
                                    username: e.target.value
                                }))}
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    border: '1px solid #D1D5DB',
                                    borderRadius: '6px',
                                    fontSize: '14px',
                                    outline: 'none',
                                    transition: 'border-color 0.2s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#2563EB'}
                                onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
                                placeholder="Votre nom d'utilisateur"
                                disabled={isSubmitting}
                            />
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '6px',
                                color: '#374151',
                                fontSize: '14px',
                                fontWeight: '500'
                            }}>
                                Mot de passe
                            </label>
                            <input
                                type="password"
                                value={loginData.password}
                                onChange={(e) => setLoginData(prev => ({
                                    ...prev,
                                    password: e.target.value
                                }))}
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    border: '1px solid #D1D5DB',
                                    borderRadius: '6px',
                                    fontSize: '14px',
                                    outline: 'none',
                                    transition: 'border-color 0.2s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#2563EB'}
                                onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
                                placeholder="Votre mot de passe"
                                disabled={isSubmitting}
                            />
                        </div>

                        {loginError && (
                            <div style={{
                                backgroundColor: '#FEF2F2',
                                border: '1px solid #FECACA',
                                color: '#DC2626',
                                padding: '10px 12px',
                                borderRadius: '6px',
                                fontSize: '14px',
                                marginBottom: '16px'
                            }}>
                                ❌ {loginError}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            style={{
                                width: '100%',
                                padding: '10px 16px',
                                backgroundColor: isSubmitting ? '#9CA3AF' : '#2563EB',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '16px',
                                fontWeight: '500',
                                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                transition: 'background-color 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                if (!isSubmitting) {
                                    e.target.style.backgroundColor = '#1D4ED8';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isSubmitting) {
                                    e.target.style.backgroundColor = '#2563EB';
                                }
                            }}
                        >
                            {isSubmitting ? '⏳ Connexion...' : '🔐 Se connecter'}
                        </button>
                    </form>

                    <div style={{
                        marginTop: '16px',
                        padding: '12px',
                        backgroundColor: '#F9FAFB',
                        borderRadius: '6px',
                        fontSize: '12px',
                        color: '#6B7280'
                    }}>
                        <strong>💡 Comptes de test :</strong><br />
                        • admin / admin123 (Administrateur)<br />
                        • user1 / pass123 (Utilisateur)
                    </div>
                </div>
            )}

            {/* Overlay pour fermer le popup en cliquant à l'extérieur */}
            {showLoginForm && (
                <div
                    onClick={toggleLoginForm}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.1)',
                        zIndex: 999
                    }}
                />
            )}
        </div>
    );
};

export default AuthButton;
