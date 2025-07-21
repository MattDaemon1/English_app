import { useState } from 'react'
import { Badge } from './components/ui/badge.jsx'
import './App.css'

function AppContent() {
    return (
        <div>
            <h1>EnglishMaster Debug</h1>
            <p>Version simplifiée pour identifier le problème</p>
        </div>
    )
}

export default function App() {
    return (
        <div>
            <AppContent />
        </div>
    )
}
