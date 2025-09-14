import { createContext, useCallback, useEffect, useState } from 'react'
import Subtitles from './components/Subtitles'

import { BuddyState } from './types'
import Buddy from './components/Buddy'
import Settings from './Settings'
import { chooseRandom, getLocalStorageBoolWithDefault, setLocalStorageBool } from './util'

const MAX_MS_BETWEEN_ORB = 10 * 60 * 1000

type BuddyContext = {
  buddyState: BuddyState
  setBuddyState: (s: BuddyState) => void
  saying: string
  setSaying: (s) => void
  isTalking: boolean
  setIsTalking: (b: boolean) => void
  orbs: number
  setOrbs: (n: number) => void
}

const BuddyContext = createContext<BuddyContext>({
  buddyState: BuddyState.Idle,
  setBuddyState: () => {},
  saying: '',
  setSaying: () => {},
  isTalking: false,
  setIsTalking: () => {},
  orbs: 0,
  setOrbs: () => {}
})

type SettingsContext = {
  setShowingSettings: (b: boolean) => void
  showSubtitles: boolean
  setShowSubtitles: (b: boolean) => void
  useVoice: boolean
  setUseVoice: (b: boolean) => void
  enableRandomOrbs: boolean
  setEnableRandomOrbs: (b: boolean) => void
}

const SettingsContext = createContext<SettingsContext>({
  setShowingSettings: () => {},
  showSubtitles: false,
  setShowSubtitles: () => {},
  useVoice: false,
  setUseVoice: () => {},
  enableRandomOrbs: false,
  setEnableRandomOrbs: () => {}
})

const localOrbs = localStorage.getItem('orbs') ? Number(localStorage.getItem('orbs')) : 0

const orbCollectPhrases = [
  'Sweet sweet orbs!',
  'Thanks for the orb',
  'Early worm gets the orb',
  'I hope these help with my low T'
]

function App(): React.JSX.Element {
  const [saying, setSayingInternal] = useState('')

  const [buddyState, setBuddyState] = useState(BuddyState.Idle)
  const [isTalking, setIsTalking] = useState(false)

  const [showingSettings, setShowingSettings] = useState(false)

  // Settings
  const [showSubtitles, setShowSubtitles] = useState(
    getLocalStorageBoolWithDefault('showSubtitles', true)
  )
  const [useVoice, setUseVoice] = useState(getLocalStorageBoolWithDefault('useVoice', true))
  const [enableRandomOrbs, setEnableRandomOrbs] = useState(
    getLocalStorageBoolWithDefault('enableRandomOrbs', true)
  )

  useEffect(() => setLocalStorageBool('showSubtitles', showSubtitles), [showSubtitles])
  useEffect(() => setLocalStorageBool('useVoice', useVoice), [useVoice])
  useEffect(() => setLocalStorageBool('enableRandomOrbs', enableRandomOrbs), [enableRandomOrbs])

  const [orbs, setOrbs] = useState(localOrbs ?? 0)

  const setSaying = useCallback(
    (newSaying: string) => {
      if (useVoice) {
        window.electron.ipcRenderer.send('speak', [newSaying])
      }

      setSayingInternal(newSaying)
    },
    [useVoice]
  )

  useEffect(() => {
    localStorage.setItem('orbs', orbs.toString())
  }, [orbs])

  const spawnOrb = useCallback(() => {
    if (enableRandomOrbs) {
      window.electron.ipcRenderer.send('spawnOrb')
    }
  }, [enableRandomOrbs])

  useEffect(() => {
    // @ts-ignore (define in dts)
    window.api.onOrbClaimed(() => {
      // On orb claimed
      setOrbs((x) => x + 1)
      setSaying(chooseRandom(orbCollectPhrases))
    })

    let lastOrbSpawnHandle: NodeJS.Timeout | null = null
    function orbSpawnRoutine(spawnNow: boolean): void {
      if (spawnNow) {
        spawnOrb()
      }
      lastOrbSpawnHandle = setTimeout(() => orbSpawnRoutine(true), MAX_MS_BETWEEN_ORB)
    }

    orbSpawnRoutine(false)

    return () => {
      if (lastOrbSpawnHandle) {
        clearTimeout(lastOrbSpawnHandle)
      }
    }
  }, [setOrbs, setSaying, spawnOrb])

  return (
    <SettingsContext.Provider
      value={{
        setShowingSettings: setShowingSettings,
        showSubtitles: showSubtitles,
        setShowSubtitles: setShowSubtitles,
        setEnableRandomOrbs: setEnableRandomOrbs,
        useVoice,
        setUseVoice,
        enableRandomOrbs: enableRandomOrbs
      }}
    >
      <BuddyContext.Provider
        value={{
          buddyState: buddyState,
          setBuddyState: setBuddyState,
          saying: saying,
          setSaying: setSaying,
          isTalking: isTalking,
          setIsTalking: setIsTalking,
          orbs: orbs,
          setOrbs: setOrbs
        }}
      >
        <div className="WizardDiv">
          <Subtitles msBetweenWord={300} />
          <Buddy />
        </div>

        {showingSettings && <Settings />}
      </BuddyContext.Provider>{' '}
    </SettingsContext.Provider>
  )
}

export { App, BuddyContext, SettingsContext }
