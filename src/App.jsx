import React, { useRef, useState } from 'react'
import { Splash, StatusBar } from './components/bits.jsx'
import HomeScreen from './components/HomeScreen.jsx'
import SituationScreen from './components/SituationScreen.jsx'
import SituationsScreen from './components/SituationsScreen.jsx'
import LearnScreen from './components/LearnScreen.jsx'
import YouScreen from './components/YouScreen.jsx'
import OnboardingFlow from './components/OnboardingFlow.jsx'
import { FLOWS, SEED_SITUATIONS, routeFlow } from './data.js'

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
    id: 'situations',
    label: 'Situations',
    icon: (
      <svg width="21" height="21" viewBox="0 0 21 21" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="10.5" cy="10.5" r="7.5" />
        <path d="M10.5 6.5v4l2.8 2" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'learn',
    label: 'Learn',
    icon: (
      <svg width="21" height="21" viewBox="0 0 21 21" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M4 10.5h13" />
        <path d="M5.5 7v7M15.5 7v7" />
        <path d="M2.8 8.5v4M18.2 8.5v4" />
      </svg>
    ),
  },
  {
    id: 'you',
    label: 'You',
    icon: (
      <svg width="21" height="21" viewBox="0 0 21 21" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="10.5" cy="7" r="3.5" />
        <path d="M4 18c.8-3.2 3.4-5 6.5-5s5.7 1.8 6.5 5" />
      </svg>
    ),
  },
]

let nextId = 1

export default function App() {
  const [onboarded, setOnboarded] = useState(false)
  const [tab, setTab] = useState('home')
  const [activeId, setActiveId] = useState(null)
  const [situations, setSituations] = useState(SEED_SITUATIONS)
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

  function newSituation(text, flowIdOverride) {
    const flowId = flowIdOverride || routeFlow(text)
    const flow = FLOWS[flowId]
    const id = 'sit-' + nextId++
    const sit = {
      id,
      title: flow.title || (text.length > 34 ? text.slice(0, 34) + '…' : text),
      emoji: flow.emoji,
      when: 'now',
      flowId,
      nodeId: 'start',
      tags: flow.tags || [],
      messages: [{ from: 'user', blocks: [{ type: 'text', text }] }],
    }
    setSituations((all) => [sit, ...all])
    setActiveId(id)
    kaelSays(id, flow.nodes.start.blocks, 'start')
  }

  function chip(id, c) {
    const sit = situations.find((s) => s.id === id)
    const next = FLOWS[sit.flowId].nodes[c.next]
    patch(id, (s) => ({ ...s, messages: [...s.messages, { from: 'user', blocks: [{ type: 'text', text: c.label }] }] }))
    kaelSays(id, next.blocks, c.next)
  }

  function free(id, text) {
    const sit = situations.find((s) => s.id === id)
    const flow = FLOWS[sit.flowId]
    const node = flow.nodes[sit.nodeId]
    patch(id, (s) => ({ ...s, messages: [...s.messages, { from: 'user', blocks: [{ type: 'text', text }] }] }))
    if (node.onFree) {
      kaelSays(id, flow.nodes[node.onFree].blocks, node.onFree)
    } else {
      kaelSays(id, [{ type: 'text', text: 'noted — that helps me read it better. pick where you want to take this:' }])
    }
  }

  // "🙏 That helps" → Kael shares what it noticed, remembers it
  function wrap(id) {
    const sit = situations.find((s) => s.id === id)
    const obs = FLOWS[sit.flowId].observation
    patch(id, (s) => ({
      ...s,
      wrapped: true,
      messages: [...s.messages, { from: 'user', blocks: [{ type: 'text', text: 'that helps, thank you 🙏' }] }],
    }))
    kaelSays(id, [
      { type: 'text', text: 'anytime. one thing before you go —' },
      { type: 'observe', text: obs },
    ])
  }

  // answering a follow-up card on the home screen
  function followUp(id, option) {
    const sit = situations.find((s) => s.id === id)
    const next = FLOWS[sit.flowId].nodes[option.next]
    patch(id, (s) => ({
      ...s,
      followUp: null,
      messages: [...s.messages, { from: 'user', blocks: [{ type: 'text', text: option.label }] }],
    }))
    setActiveId(id)
    kaelSays(id, next.blocks, option.next)
  }

  // photo from the home screen → new situation (decode or caption flow)
  function newPhotoSituation(flowId, src) {
    const flow = FLOWS[flowId]
    const id = 'sit-' + nextId++
    const ask = flowId === 'photo-caption' ? 'caption this for me' : 'decode this for me'
    setSituations((all) => [
      {
        id,
        title: flow.title,
        emoji: flow.emoji,
        when: 'now',
        flowId,
        nodeId: 'start',
        tags: flow.tags || [],
        messages: [{ from: 'user', blocks: [{ type: 'photo', src }, { type: 'text', text: ask }] }],
      },
      ...all,
    ])
    setActiveId(id)
    kaelSays(id, flow.nodes.start.blocks, 'start')
  }

  // photo attached inside an existing thread → Kael reads it in place
  function photoInThread(id, src) {
    patch(id, (s) => ({
      ...s,
      messages: [...s.messages, { from: 'user', blocks: [{ type: 'photo', src }] }],
    }))
    kaelSays(id, FLOWS['photo-decode'].nodes.start.blocks)
  }

  // start (or resume) a drill from the Learn tab — drills open with Kael talking
  function startDrill(drill) {
    const existing = situations.find((s) => s.flowId === drill.id)
    if (existing) {
      setActiveId(existing.id)
      return
    }
    const flow = FLOWS[drill.id]
    const id = 'sit-' + nextId++
    setSituations((all) => [
      { id, title: flow.title, emoji: flow.emoji, when: 'practice', kind: 'drill', flowId: drill.id, nodeId: 'start', messages: [] },
      ...all,
    ])
    setActiveId(id)
    kaelSays(id, flow.nodes.start.blocks, 'start')
  }

  return (
    <div className="stage">
      <div className="stage-word top">KAEL</div>
      <div className="stage-word bottom">KAEL</div>
      <div className="stage-tag">
        <span className="dot" /> ios prototype · v0.3
      </div>

      <div className="phone">
        <div className="screen">
          {!onboarded && (
            <>
              <div className="island" />
              <StatusBar />
              <OnboardingFlow onDone={() => setOnboarded(true)} />
            </>
          )}
          {onboarded && <AppShell />}
        </div>
      </div>
    </div>
  )

  function AppShell() {
    return (
      <>
          <Splash />
          <div className="island" />
          <StatusBar />

          {active ? (
            <SituationScreen
              situation={active}
              onBack={() => setActiveId(null)}
              onChip={chip}
              onFree={free}
              onWrap={wrap}
              onPhoto={photoInThread}
            />
          ) : tab === 'home' ? (
            <HomeScreen
              situations={situations.filter((s) => s.kind !== 'drill')}
              onNew={newSituation}
              onOpen={setActiveId}
              onFollowUp={followUp}
              onSeeAll={() => setTab('situations')}
              onDrill={startDrill}
              onLearn={() => setTab('learn')}
              onPhoto={newPhotoSituation}
            />
          ) : tab === 'situations' ? (
            <div className="tab-pane">
              <SituationsScreen situations={situations.filter((s) => s.kind !== 'drill')} onOpen={setActiveId} />
            </div>
          ) : tab === 'learn' ? (
            <div className="tab-pane">
              <LearnScreen onDrill={startDrill} />
            </div>
          ) : (
            <div className="tab-pane">
              <YouScreen />
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
      </>
    )
  }
}
