// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import 'leaflet/dist/leaflet.css'

// Determine basename dynamically to match Vite config
// Normalize to remove trailing slash for BrowserRouter (it handles it internally)
let basename = import.meta.env.BASE_URL || '/p18/'
// Remove trailing slash - BrowserRouter expects it without
basename = basename.replace(/\/$/, '') || '/p18'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)

