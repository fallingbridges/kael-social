import React from 'react'
import ReactDOM from 'react-dom/client'
import { MotionGlobalConfig } from 'framer-motion'
if (window.__robo) MotionGlobalConfig.skipAnimations = true
import '@fontsource/baloo-2/500.css'
import '@fontsource/baloo-2/600.css'
import '@fontsource/baloo-2/700.css'
import '@fontsource/nunito/400.css'
import '@fontsource/nunito/700.css'
import '@fontsource/nunito/800.css'
import './styles/tokens.css'
import './styles/base.css'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
