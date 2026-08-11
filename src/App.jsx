import React, { useState } from 'react'
import { Blob, Splash, StatusBar } from './components/bits.jsx'
import ChatScreen from './components/ChatScreen.jsx'
import PlaybooksScreen from './components/PlaybooksScreen.jsx'
import GrowthScreen from './components/GrowthScreen.jsx'

const TABS = [
  {
    id: 'chat',
    label: 'Kael',
    icon: (
      <svg width="21" height="21" viewBox="0 0 21 21" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M18 10a7.5 7.5 0 0 1-11 6.6L3 18l1.5-3.7A7.5 7.5 0 1 1 18 10z" strokeLinejoin="round" />
        <path d="M10.5 6.8l.9 2.3 2.3.9-2.3.9-.9 2.3-.9-2.3-2.3-.9 2.3-.9z" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    id: 'playbooks',
    label: 'Playbooks',
    icon: (
      <svg width="21" height="21" viewBox="0 0 21 21" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="2.5" y="5.5" width="11" height="13" rx="2.5" strokeLinejoin="round" />
        <path d="M7 2.8h9a2.5 2.5 0 0 1 2.5 2.5V15" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'growth',
    label: 'Growth',
    icon: (
      <svg width="21" height="21" viewBox="0 0 21 21" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M3 18h15" />
        <path d="M4.5 14.5l4-4 3 3 5.5-6" />
        <path d="M13 7.5h4v4" strokeLinejoin="round" />
      </svg>
    ),
  },
]

export default function App() {
  const [tab, setTab] = useState('chat')
  const [pending, setPending] = useState(null)

  function runScenario(text) {
    setPending(text)
    setTab('chat')
  }

  return (
    <div className="stage">
      <div className="stage-word top">KAEL</div>
      <div className="stage-word bottom">KAEL</div>
      <div className="stage-tag">
        <span className="dot" /> ios prototype · v0.1
      </div>

      <div className="phone">
        <div className="screen">
          <Splash />
          <div className="island" />
          <StatusBar />

          <div className="tab-pane" style={{ display: tab === 'chat' ? 'flex' : 'none' }}>
            <div className="app-head">
              <Blob size={44} />
              <div className="who">
                <h2>Kael</h2>
                <p>online · judging lovingly</p>
              </div>
              <div className="streak-pill">🔥 12</div>
            </div>
            <ChatScreen pending={pending} clearPending={() => setPending(null)} />
          </div>
          <div className="tab-pane" style={{ display: tab === 'playbooks' ? 'flex' : 'none' }}>
            <PlaybooksScreen onRun={runScenario} />
          </div>
          {tab === 'growth' && (
            <div className="tab-pane">
              <GrowthScreen />
            </div>
          )}

          <div className="tabbar">
            <div className="tabbar-inner">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  className={'tab' + (tab === t.id ? ' active' : '')}
                  onClick={() => setTab(t.id)}
                >
                  {t.icon}
                  <span className="t-label">{t.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
