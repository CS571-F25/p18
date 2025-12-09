// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import 'leaflet/dist/leaflet.css'

// Use HashRouter for GitHub Pages - more reliable than BrowserRouter
// HashRouter doesn't need basename and works with static hosting
ReactDOM.createRoot(document.getElementById('root')).render(
  <HashRouter>
    <App />
  </HashRouter>
)

