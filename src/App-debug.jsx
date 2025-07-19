import { useState } from 'react'

function App() {
    return (
        <div style={{ padding: '20px', fontFamily: 'Arial' }}>
            <h1>🎓 EnglishMaster - Debug Version</h1>
            <p>Si vous voyez ceci, React fonctionne !</p>
            <button onClick={() => alert('Button works!')}>Test Button</button>
        </div>
    );
}

export default App
