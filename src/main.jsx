import React from 'react'
import ReactDOM from 'react-dom/client'
// Base styles go first so that component styles can override them
import './styles/index.css'
import App from './App'
import { initMetrika } from './lib/metrika'

initMetrika()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
