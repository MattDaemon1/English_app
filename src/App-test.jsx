import { useState } from 'react'
import './App.css'

function App() {
    const [count, setCount] = useState(0)

    return (
        <div className="min-h-screen p-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-center mb-8">
                    🎯 EnglishMaster - Test Simple
                </h1>
                <div className="bg-card rounded-lg border shadow-sm p-6 text-center">
                    <h2 className="text-2xl mb-4">Application de test</h2>
                    <p className="text-gray-600 mb-4">
                        Si vous voyez ce message, React fonctionne !
                    </p>
                    <button
                        className="bg-primary text-white px-4 py-2 rounded-md"
                        onClick={() => setCount(count + 1)}
                    >
                        Cliquez-moi ! ({count})
                    </button>
                </div>
            </div>
        </div>
    )
}

export default App
