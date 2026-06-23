import '@fortawesome/fontawesome-free/css/all.min.css'
import React from 'react'
import ReactDOM from 'react-dom/client'

// ── Polices bundlées (zéro CDN externe) ──
// Doit être importé ici, PAS dans style.css?inline
import './fonts.css'

import RootApp from './RootApp.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RootApp />
  </React.StrictMode>
)
