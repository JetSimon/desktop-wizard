import { createContext, useCallback, useState } from 'react'
import Subtitles from './components/Subtitles'

import { BuddyState } from './types'
import Buddy from './components/Buddy'
import Settings from './Settings'

type BuddyContext = {
  buddyState: BuddyState
  setBuddyState: (s: BuddyState) => void
  saying: string
  setSaying: (s) => void
  isTalking: boolean
  setIsTalking: (b: boolean) => void
}

const BuddyContext = createContext<BuddyContext>({
  buddyState: BuddyState.Idle,
  setBuddyState: () => {},
  saying: '',
  setSaying: () => {},
  isTalking: false,
  setIsTalking: () => {}
})

type SettingsContext = {
  setShowingSettings: (b: boolean) => void
  showSubtitles: boolean
  setShowSubtitles: (b: boolean) => void
  useVoice: boolean
  setUseVoice: (b: boolean) => void
}

const SettingsContext = createContext<SettingsContext>({
  setShowingSettings: () => {},
  showSubtitles: false,
  setShowSubtitles: () => {},
  useVoice: false,
  setUseVoice: () => {}
})

function App(): React.JSX.Element {
  const [saying, setSayingInternal] = useState('')

  const [buddyState, setBuddyState] = useState(BuddyState.Idle)
  const [isTalking, setIsTalking] = useState(false)

  const [showingSettings, setShowingSettings] = useState(false)

  const [showSubtitles, setShowSubtitles] = useState(true)
  const [useVoice, setUseVoice] = useState(true)

  const setSaying = useCallback(
    (newSaying: string) => {
      if (useVoice) {
        window.electron.ipcRenderer.send('speak', [newSaying])
      }

      setSayingInternal(newSaying)
    },
    [useVoice]
  )

  return (
    <SettingsContext.Provider
      value={{
        setShowingSettings: setShowingSettings,
        showSubtitles: showSubtitles,
        setShowSubtitles: setShowSubtitles,
        useVoice,
        setUseVoice
      }}
    >
      <BuddyContext.Provider
        value={{
          buddyState: buddyState,
          setBuddyState: setBuddyState,
          saying: saying,
          setSaying: setSaying,
          isTalking: isTalking,
          setIsTalking: setIsTalking
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
