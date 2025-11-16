// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 关键是这里加 basename="/p18" */}
    <BrowserRouter basename="/p18">
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
