import { createContext, useContext, useReducer, useEffect } from 'react'
import { updateSkillScore } from '../engine/lessonEngine.js'
import { questForSkill, FIELD_QUESTS } from '../content/quests.js'
import { UNITS, UNIT_NODES, nodeId } from '../content/units.js'

const ALL_QUESTS = Object.values(FIELD_QUESTS).flat()

const KEY = 'rapport-state-v1'

export const initialState = {
  phase: 'onboarding', // 'onboarding' | 'main'
  tab: 'learn',
  profile: null, // { name, goal, diagnosis: { scores, order, archetype, blurb, weakest, strongest } }
  xp: 0,
  xpToday: 0,
  dailyGoal: 30,
  gems: 0,
  hearts: 5,
  streak: 0,
  lastActiveDay: null, // 'YYYY-MM-DD'
  dayOffset: 0, // dev control: pretend days passed
  completed: {}, // nodeId -> { accuracy, xp, perfect }
  skills: null, // live skill scores (start = diagnosis)
  baseline: null, // diagnosis snapshot for "then vs now"
  activeQuest: null, // quest id currently assigned
  questLog: [], // [{ id, felt, note, day }]
  questStreak: 0,
  realWorld: { score: 0, history: [] }, // history: [{ day, score }]
  leagueJoinedAt: null,
  lesson: null, // { nodeId } — full-screen overlay when set
  celebration: null, // transient: 'streak' | null
}

export function today(state) {
  const d = new Date()
  d.setDate(d.getDate() + (state?.dayOffset || 0))
  return d.toISOString().slice(0, 10)
}

function reducer(state, action) {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, ...action.saved, lesson: null, celebration: null }

    case 'COMPLETE_ONBOARDING': {
      const { name, diagnosis } = action
      return {
        ...state,
        phase: 'main',
        profile: { name, diagnosis },
        skills: { ...diagnosis.scores },
        baseline: { ...diagnosis.scores },
        leagueJoinedAt: Date.now(),
      }
    }

    case 'SET_TAB':
      return { ...state, tab: action.tab, celebration: null }

    case 'START_LESSON':
      return { ...state, lesson: { nodeId: action.nodeId, kind: action.kind, unitId: action.unitId, situationId: action.situationId || null } }

    case 'QUIT_LESSON':
      return { ...state, lesson: null }

    case 'FINISH_LESSON': {
      if (!state.lesson) return state // already finished (double-tap guard)
      const { nodeId: nid, unitId, rewards, heartsLeft, skillScores, kind, testOut, questSkillOverride } = action
      const day = today(state)
      const firstToday = state.lastActiveDay !== day
      const yesterday = (() => {
        const d = new Date(day); d.setDate(d.getDate() - 1)
        return d.toISOString().slice(0, 10)
      })()
      const streak = firstToday
        ? (state.lastActiveDay === yesterday ? state.streak + 1 : 1)
        : state.streak

      const skills = { ...state.skills }
      for (const [skill, score] of Object.entries(skillScores)) {
        skills[skill] = updateSkillScore(skills[skill] ?? 0.5, score)
      }

      // Completion bookkeeping: situational lessons don't touch the path;
      // a passed test-out completes the whole unit (chest included).
      const entry = { accuracy: rewards.accuracy, xp: rewards.xp, perfect: rewards.perfect }
      let completed = state.completed
      let bonusGems = 0
      if (kind === 'situation' || testOut === 'failed') {
        // practice only
      } else if (testOut === 'passed') {
        completed = { ...completed }
        UNIT_NODES.forEach((tpl, i) => {
          const id = nodeId(unitId, i)
          if (!completed[id]) {
            if (tpl.kind === 'chest') { completed[id] = { chest: true }; bonusGems += 25 }
            else completed[id] = id === nid ? entry : { accuracy: rewards.accuracy, xp: 0, skipped: true }
          }
        })
      } else {
        completed = { ...completed, [nid]: entry }
      }

      // Field quest: situational lessons always re-target the quest to tonight's
      // need; path lessons assign one only when none is active.
      const doneQuests = state.questLog.map((q) => q.id)
      const questSkill = questSkillOverride || UNITS[unitId]?.skill
      const activeQuest = kind === 'situation'
        ? (questForSkill(questSkill, doneQuests)?.id || state.activeQuest)
        : (state.activeQuest || questForSkill(questSkill, doneQuests)?.id || null)

      return {
        ...state,
        lesson: null,
        completed,
        xp: state.xp + rewards.xp,
        xpToday: (firstToday ? 0 : state.xpToday) + rewards.xp,
        gems: state.gems + rewards.gems + bonusGems,
        hearts: heartsLeft,
        streak,
        lastActiveDay: day,
        skills,
        activeQuest,
        celebration: firstToday ? 'streak' : null,
      }
    }

    case 'OPEN_CHEST':
      return {
        ...state,
        gems: state.gems + 25,
        completed: { ...state.completed, [action.nodeId]: { chest: true } },
      }

    case 'REFILL_HEARTS':
      if (state.gems < 50) return state
      return { ...state, gems: state.gems - 50, hearts: 5 }

    case 'CHECK_IN_QUEST': {
      if (!state.activeQuest) return state // double-tap guard
      const { felt, note, skipped } = action
      const day = today(state)
      if (skipped) {
        // honest "didn't do it" — keep the quest, tiny encouragement, no score move
        return { ...state, questLog: [...state.questLog, { id: state.activeQuest, felt: 0, note, day, skipped: true }], activeQuest: null }
      }
      // Real-World Score: +8 for doing it at all, + up to +7 by felt score. Only quests move it.
      const gain = 8 + felt * 1.4
      const score = Math.min(100, Math.round((state.realWorld.score + gain) * 10) / 10)
      // Reflections re-tune the path: a rough real-world outing pulls that skill
      // forward (lower score sorts earlier); a great one eases it back.
      const quest = ALL_QUESTS.find((q) => q.id === state.activeQuest)
      const skills = { ...state.skills }
      if (quest && quest.skill !== 'mixed' && skills[quest.skill] != null) {
        skills[quest.skill] = Math.min(1, Math.max(0, skills[quest.skill] + (felt - 3) * 0.02))
      }
      return {
        ...state,
        questLog: [...state.questLog, { id: state.activeQuest, felt, note, day }],
        activeQuest: null,
        questStreak: state.questStreak + 1,
        gems: state.gems + 15,
        skills,
        realWorld: { score, history: [...state.realWorld.history, { day, score }] },
      }
    }

    case 'ADVANCE_DAY':
      return { ...state, dayOffset: state.dayOffset + 1, xpToday: 0 }

    case 'RESET':
      localStorage.removeItem(KEY)
      return { ...initialState }

    default:
      return state
  }
}

// ===== Path helpers =====
// The path is a recommendation, not a cage: units you've started keep their
// place (in diagnosis order); untouched units re-sort by your LIVE skill
// scores (weakest first), so lessons and quest reflections keep re-tuning
// what comes next. "Deep Connections" always caps the path.
export function pathUnits(state) {
  const base = state.profile?.diagnosis?.order || ['icebreaking', 'listening', 'confidence', 'storytelling', 'empathy', 'connection']
  const hasProgress = (uid) => UNIT_NODES.some((_, i) => state.completed[nodeId(uid, i)])
  const started = base.filter((uid) => hasProgress(uid))
  const untouched = base
    .filter((uid) => !hasProgress(uid) && uid !== 'connection')
    .sort((a, b) => (state.skills?.[UNITS[a].skill] ?? 0.5) - (state.skills?.[UNITS[b].skill] ?? 0.5))
  const order = [...started, ...untouched]
  if (!order.includes('connection')) order.push('connection')
  return order
}

export function unitComplete(state, uid) {
  return UNIT_NODES.every((_, i) => state.completed[nodeId(uid, i)])
}

// The unit Kai recommends next: first in the (adaptive) path with work left.
export function recommendedUnit(state) {
  return pathUnits(state).find((uid) => !unitComplete(state, uid))
}

// Within a unit: linear. Across units: open — every unit's next node is
// tappable. Checkpoints are additionally always open as a "test out".
export function unitNodeStatus(state, uid, index) {
  const nid = nodeId(uid, index)
  if (state.completed[nid]) return 'done'
  const firstIncomplete = UNIT_NODES.findIndex((_, i) => !state.completed[nodeId(uid, i)])
  if (index === firstIncomplete) return 'available'
  if (UNIT_NODES[index].kind === 'checkpoint') return 'testout'
  return 'locked'
}

const StoreCtx = createContext(null)

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || 'null')
      return saved ? { ...init, ...saved, lesson: null, celebration: null } : init
    } catch { return init }
  })

  useEffect(() => {
    const { lesson, celebration, ...persist } = state
    localStorage.setItem(KEY, JSON.stringify(persist))
  }, [state])

  return <StoreCtx.Provider value={{ state, dispatch }}>{children}</StoreCtx.Provider>
}

export function useStore() {
  return useContext(StoreCtx)
}
