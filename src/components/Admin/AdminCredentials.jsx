import React from 'react'

const AdminCredentials = () => {
    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            left: '20px',
            backgroundColor: '#7C3AED',
            color: 'white',
            padding: '15px',
            borderRadius: '12px',
            fontSize: '12px',
            boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)',
            zIndex: 1000,
            maxWidth: '280px'
        }}>
            <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '14px' }}>
                🛡️ Comptes Admin Disponibles
            </div>

            <div style={{ marginBottom: '10px' }}>
                <div style={{ fontWeight: '600', color: '#E0E7FF' }}>Admin par défaut:</div>
                <div>👤 Username: <code>admin</code></div>
                <div>📧 Email: <code>admin@englishmaster.com</code></div>
                <div>🔑 Password: <code>admin123</code></div>
            </div>

            <div>
                <div style={{ fontWeight: '600', color: '#E0E7FF' }}>Admin personnel:</div>
                <div>👤 Username: <code>matt4daemon</code></div>
                <div>📧 Email: <code>matt4daemon@gmail.com</code></div>
                <div>🔑 Password: <code>admin123</code></div>
            </div>

            <div style={{
                marginTop: '10px',
                padding: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '6px',
                fontSize: '11px'
            }}>
                💡 Utilisez l'email OU le username pour vous connecter
            </div>
        </div>
    )
}

export default AdminCredentials
