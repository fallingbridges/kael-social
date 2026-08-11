import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import RepPlayer from './components/RepPlayer.jsx'
import './styles.css'

// ?rep → standalone demo of the rep unit, isolated from the app
function RepDemo() {
  return (
    <div className="stage">
      <div className="stage-word top">KAEL</div>
      <div className="stage-word bottom">KAEL</div>
      <div className="stage-tag">
        <span className="dot" /> the rep · demo
      </div>
      <div className="phone">
        <div className="screen">
          <RepPlayer />
        </div>
      </div>
    </div>
  )
}

const demo = new URLSearchParams(location.search).has('rep')
createRoot(document.getElementById('root')).render(demo ? <RepDemo /> : <App />)
