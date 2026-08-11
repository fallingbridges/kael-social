import React, { useRef, useState } from 'react'
import { Splash, StatusBar } from './components/bits.jsx'
import HomeScreen from './components/HomeScreen.jsx'
import SituationScreen from './components/SituationScreen.jsx'
import GrowthScreen from './components/GrowthScreen.jsx'
import { FLOWS, INITIAL_SKILLS, NOTICED, SEED_SITUATIONS, routeFlow } from './data.js'

const TABS = [
  {
    id: 'home',
    label: 'Kael',
    icon: (
      <svg width="21" height="21" viewBox="0 0 21 21" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M18 10a7.5 7.5 0 0 1-11 6.6L3 18l1.5-3.7A7.5 7.5 0 1 1 18 10z" strokeLinejoin="round" />
        <path d="M10.5 6.8l.9 2.3 2.3.9-2.3.9-.9 2.3-.9-2.3-2.3-.9 2.3-.9z" fill="currentColor" stroke="none" />
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

let nextId = 1

export default function App() {
  const [tab, setTab] = useState('home')
  const [activeId, setActiveId] = useState(null)
  const [situations, setSituations] = useState(SEED_SITUATIONS)
  const [skills, setSkills] = useState(INITIAL_SKILLS)
  const timers = useRef([])

  const active = situations.find((s) => s.id === activeId)

  function patch(id, fn) {
    setSituations((all) => all.map((s) => (s.id === id ? fn(s) : s)))
  }

  function kaelSays(id, blocks, nodeId) {
    patch(id, (s) => ({ ...s, typing: true }))
    timers.current.push(
      setTimeout(() => {
        patch(id, (s) => ({
          ...s,
          typing: false,
          nodeId: nodeId ?? s.nodeId,
          messages: [...s.messages, { from: 'kael', blocks }],
        }))
      }, 1000 + Math.random() * 500),
    )
  }

  // new situation from the home screen
  function newSituation(text) {
    const flowId = routeFlow(text)
    const flow = FLOWS[flowId]
    const id = 'sit-' + nextId++
    const sit = {
      id,
      title: flow.title || (text.length > 34 ? text.slice(0, 34) + '…' : text),
      emoji: flow.emoji,
      status: 'open',
      when: 'now',
      flowId,
      nodeId: 'start',
      messages: [{ from: 'user', blocks: [{ type: 'text', text }] }],
    }
    setSituations((all) => [sit, ...all])
    setActiveId(id)
    kaelSays(id, flow.nodes.start.blocks, 'start')
  }

  // clarifying option or action chip tapped
  function chip(id, c) {
    const sit = situations.find((s) => s.id === id)
    const flow = FLOWS[sit.flowId]
    const next = flow.nodes[c.next]
    patch(id, (s) => ({ ...s, messages: [...s.messages, { from: 'user', blocks: [{ type: 'text', text: c.label }] }] }))
    kaelSays(id, next.blocks, c.next)
  }

  // free-typed text inside a situation
  function free(id, text) {
    const sit = situations.find((s) => s.id === id)
    const flow = FLOWS[sit.flowId]
    const node = flow.nodes[sit.nodeId]
    patch(id, (s) => ({ ...s, messages: [...s.messages, { from: 'user', blocks: [{ type: 'text', text }] }] }))
    if (node.onFree) {
      kaelSays(id, flow.nodes[node.onFree].blocks, node.onFree)
    } else {
      kaelSays(id, [
        { type: 'text', text: 'noted — that detail helps. pick where you want to take this:' },
      ])
    }
  }

  // resolve → reflection card + XP
  function resolve(id) {
    const sit = situations.find((s) => s.id === id)
    const r = FLOWS[sit.flowId].reflection
    patch(id, (s) => ({ ...s, status: 'resolved' }))
    kaelSays(id, [{ type: 'reflection', ...r }])
    setSkills((all) => all.map((s) => (s.key === r.skillKey ? { ...s, value: Math.min(100, s.value + r.xp) } : s)))
  }

  // "Teach me →" from the Growth tab
  function teach() {
    const flow = FLOWS[NOTICED.flowId]
    const id = 'sit-' + nextId++
    const sit = {
      id,
      title: flow.title,
      emoji: flow.emoji,
      status: 'open',
      when: 'now',
      flowId: NOTICED.flowId,
      nodeId: 'start',
      messages: [{ from: 'user', blocks: [{ type: 'text', text: NOTICED.cta }] }],
    }
    setSituations((all) => [sit, ...all])
    setTab('home')
    setActiveId(id)
    kaelSays(id, flow.nodes.start.blocks, 'start')
  }

  return (
    <div className="stage">
      <div className="stage-word top">KAEL</div>
      <div className="stage-word bottom">KAEL</div>
      <div className="stage-tag">
        <span className="dot" /> ios prototype · v0.2
      </div>

      <div className="phone">
        <div className="screen">
          <Splash />
          <div className="island" />
          <StatusBar />

          {active ? (
            <SituationScreen
              situation={active}
              onBack={() => setActiveId(null)}
              onChip={chip}
              onFree={free}
              onResolve={resolve}
            />
          ) : tab === 'home' ? (
            <HomeScreen
              situations={situations}
              skills={skills}
              onNew={newSituation}
              onOpen={setActiveId}
              onSeeSkills={() => setTab('growth')}
            />
          ) : (
            <div className="tab-pane">
              <GrowthScreen
                skills={skills}
                resolvedCount={situations.filter((s) => s.status === 'resolved').length}
                onTeach={teach}
              />
            </div>
          )}

          {!active && (
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
          )}
        </div>
      </div>
    </div>
  )
}
