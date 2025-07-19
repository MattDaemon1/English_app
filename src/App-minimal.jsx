import { useState } from 'react'

function App() {
    const [count, setCount] = useState(0)

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1>🎓 EnglishMaster v1.0.0</h1>
            <p>Test minimal - Count: {count}</p>
            <button onClick={() => setCount(count + 1)}>
                Click me
            </button>
        </div>
    )
}

export default App
