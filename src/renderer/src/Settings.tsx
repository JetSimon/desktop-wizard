import { useContext } from 'react'
import './Settings.css'
import { BuddyContext, SettingsContext } from './App'

interface SettingsToggleProps {
  isOn: boolean
  setter: (b: boolean) => void
  label: string
}
function SettingsToggle(props: SettingsToggleProps): React.ReactNode {
  const { isOn, setter, label } = props

  return (
    <div className="SettingsToggle">
      <label>{label.toUpperCase()}</label>
      <button onClick={() => setter(true)} className={isOn ? 'SelectedOption' : ''}>
        ON
      </button>
      <button onClick={() => setter(false)} className={!isOn ? 'SelectedOption' : ''}>
        OFF
      </button>
    </div>
  )
}

function Settings(): React.ReactNode {
  const { setShowingSettings, useVoice, setUseVoice, showSubtitles, setShowSubtitles } =
    useContext(SettingsContext)

  const { orbs } = useContext(BuddyContext)

  function hideSettings(): void {
    setShowingSettings(false)
  }

  return (
    <div className="Settings">
      <header className="Header">
        <button onClick={hideSettings}>{'<'}</button>
        <h2>SETTINGS</h2>
      </header>
      <article className="Body">
        <SettingsToggle
          isOn={showSubtitles}
          setter={setShowSubtitles}
          label="Subtitles"
        ></SettingsToggle>
        <SettingsToggle isOn={useVoice} setter={setUseVoice} label="Voice"></SettingsToggle>
        <p>Orbs: {orbs}</p>
      </article>
      <footer className="Footer">Made by Jet Simon 2025</footer>
    </div>
  )
}

export default Settings
