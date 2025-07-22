import React from 'react';
import AuthButton from '../Auth/AuthButton.jsx';

/**
 * 🔐 Page de démonstration du bouton d'authentification
 */
const AuthDemo = () => {
    return (
        <div style={{
            padding: '40px',
            maxWidth: '1200px',
            margin: '0 auto'
        }}>
            <h1 style={{
                textAlign: 'center',
                color: '#1F2937',
                marginBottom: '30px'
            }}>
                🔐 Démonstration du Bouton d'Authentification
            </h1>

            <div style={{
                display: 'grid',
                gap: '30px',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
            }}>
                {/* Variant Default */}
                <div style={{
                    padding: '20px',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    backgroundColor: '#F9FAFB'
                }}>
                    <h3>🎯 Variant "default"</h3>
                    <p style={{ color: '#6B7280', fontSize: '14px' }}>
                        Style standard avec fond coloré
                    </p>
                    <AuthButton variant="default" size="md" showUserInfo={true} />
                </div>

                {/* Variant Outline */}
                <div style={{
                    padding: '20px',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    backgroundColor: '#F9FAFB'
                }}>
                    <h3>🎯 Variant "outline"</h3>
                    <p style={{ color: '#6B7280', fontSize: '14px' }}>
                        Style avec bordure uniquement
                    </p>
                    <AuthButton variant="outline" size="md" showUserInfo={true} />
                </div>

                {/* Variant Ghost */}
                <div style={{
                    padding: '20px',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    backgroundColor: '#F9FAFB'
                }}>
                    <h3>🎯 Variant "ghost"</h3>
                    <p style={{ color: '#6B7280', fontSize: '14px' }}>
                        Style minimal sans fond
                    </p>
                    <AuthButton variant="ghost" size="md" showUserInfo={true} />
                </div>

                {/* Tailles différentes */}
                <div style={{
                    padding: '20px',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    backgroundColor: '#F9FAFB'
                }}>
                    <h3>📏 Tailles</h3>
                    <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '15px' }}>
                        Différentes tailles disponibles
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <AuthButton variant="default" size="sm" showUserInfo={false} />
                        <AuthButton variant="default" size="md" showUserInfo={false} />
                        <AuthButton variant="default" size="lg" showUserInfo={false} />
                    </div>
                </div>

                {/* Sans info utilisateur */}
                <div style={{
                    padding: '20px',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    backgroundColor: '#F9FAFB'
                }}>
                    <h3>👤 Sans info utilisateur</h3>
                    <p style={{ color: '#6B7280', fontSize: '14px' }}>
                        Bouton uniquement sans affichage des infos
                    </p>
                    <AuthButton variant="default" size="md" showUserInfo={false} />
                </div>

                {/* Intégration dans une navbar */}
                <div style={{
                    padding: '20px',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    backgroundColor: '#F9FAFB'
                }}>
                    <h3>🧭 Dans une navbar</h3>
                    <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '15px' }}>
                        Exemple d'intégration dans une barre de navigation
                    </p>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '10px 20px',
                        backgroundColor: 'white',
                        borderRadius: '6px',
                        border: '1px solid #E5E7EB'
                    }}>
                        <div style={{ fontWeight: '600', color: '#1F2937' }}>
                            🎓 EnglishMaster
                        </div>
                        <AuthButton variant="ghost" size="sm" showUserInfo={true} />
                    </div>
                </div>
            </div>

            {/* Informations d'utilisation */}
            <div style={{
                marginTop: '40px',
                padding: '20px',
                backgroundColor: '#EFF6FF',
                border: '1px solid #DBEAFE',
                borderRadius: '8px'
            }}>
                <h3 style={{ color: '#1E40AF', marginBottom: '15px' }}>
                    📚 Guide d'utilisation
                </h3>
                <div style={{ color: '#1E40AF', fontSize: '14px' }}>
                    <p><strong>Props disponibles :</strong></p>
                    <ul>
                        <li><code>variant</code> : "default", "outline", "ghost" (défaut: "default")</li>
                        <li><code>size</code> : "sm", "md", "lg" (défaut: "md")</li>
                        <li><code>showUserInfo</code> : true/false (défaut: true)</li>
                    </ul>

                    <p style={{ marginTop: '15px' }}><strong>Comptes de test :</strong></p>
                    <ul>
                        <li><strong>admin</strong> / admin123 (Administrateur avec privilèges)</li>
                        <li><strong>user1</strong> / pass123 (Utilisateur standard)</li>
                    </ul>

                    <p style={{ marginTop: '15px' }}><strong>Fonctionnalités :</strong></p>
                    <ul>
                        <li>🔐 Connexion avec formulaire popup</li>
                        <li>👤 Affichage des informations utilisateur</li>
                        <li>🎯 Points XP en temps réel</li>
                        <li>🚪 Déconnexion avec confirmation</li>
                        <li>💾 Sauvegarde automatique de la session</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AuthDemo;
