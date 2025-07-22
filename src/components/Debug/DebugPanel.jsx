/**
 * 🐛 Composant Debug - Affichage des informations de debug
 */

import React from 'react';

const DebugPanel = ({
    allWords,
    shuffledWords,
    wordIndex,
    currentWord,
    displayWord,
    loading,
    isAutoPlay,
    showTranslation
}) => {
    const debugInfo = {
        'All Words': allWords?.length || 0,
        'Shuffled Words': shuffledWords?.length || 0,
        'Current Index': wordIndex,
        'Loading': loading,
        'Auto Play': isAutoPlay,
        'Show Translation': showTranslation,
        'Display Word': displayWord?.word || 'none'
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: '10px',
            right: '10px',
            backgroundColor: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '10px',
            borderRadius: '8px',
            fontSize: '12px',
            fontFamily: 'monospace',
            zIndex: 1000,
            maxWidth: '300px'
        }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#ff6b6b' }}>🐛 Debug Panel</h4>
            {Object.entries(debugInfo).map(([key, value]) => (
                <div key={key} style={{ marginBottom: '2px' }}>
                    <span style={{ color: '#74c0fc' }}>{key}:</span>{' '}
                    <span style={{ color: '#69db7c' }}>{String(value)}</span>
                </div>
            ))}
        </div>
    );
};

export default DebugPanel;
