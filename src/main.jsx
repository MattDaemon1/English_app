import React from 'react'
import ReactDOM from 'react-dom/client'
import AppComponent from './AppComponent.jsx'
import './App.css'

console.log('main.jsx: AppComponent imported:', AppComponent)

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AppComponent />
    </React.StrictMode>,
)
