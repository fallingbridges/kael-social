import { AnimatePresence, motion } from 'framer-motion'
import { StoreProvider, useStore } from './state/store.jsx'
import { TabBar } from './components/ui.jsx'
import Onboarding from './screens/onboarding/Onboarding.jsx'
import LearnScreen from './screens/LearnScreen.jsx'
import LessonScreen from './screens/LessonScreen.jsx'
import QuestsScreen from './screens/QuestsScreen.jsx'
import LeagueScreen from './screens/LeagueScreen.jsx'
import ProfileScreen from './screens/ProfileScreen.jsx'

function Shell() {
  const { state, dispatch } = useStore()

  return (
    <div className="phone">
      {state.phase === 'onboarding' ? (
        <Onboarding />
      ) : (
        <>
          <div className="grow scroll-y" style={{ display: 'flex', flexDirection: 'column' }}>
            {state.tab === 'learn' && <LearnScreen />}
            {state.tab === 'quests' && <QuestsScreen />}
            {state.tab === 'league' && <LeagueScreen />}
            {state.tab === 'profile' && <ProfileScreen />}
          </div>
          <TabBar
            tab={state.tab}
            onTab={(tab) => dispatch({ type: 'SET_TAB', tab })}
            questBadge={!!state.activeQuest}
          />
        </>
      )}

      <AnimatePresence>
        {state.lesson && (
          <motion.div
            key="lesson"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            style={{ position: 'absolute', inset: 0, background: 'var(--paper)', zIndex: 60, display: 'flex', flexDirection: 'column' }}
          >
            <LessonScreen key={state.lesson.nodeId} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  )
}
