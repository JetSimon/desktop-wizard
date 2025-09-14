import { useContext } from 'react'
import './Settings.css'
import { BuddyContext, SettingsContext } from './App'
import wallImage from './assets/wall.jpg'

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
  const {
    setShowingSettings,
    useVoice,
    setUseVoice,
    showSubtitles,
    setShowSubtitles,
    enableRandomOrbs,
    setEnableRandomOrbs
  } = useContext(SettingsContext)

  const { orbs } = useContext(BuddyContext)

  function hideSettings(): void {
    setShowingSettings(false)
  }

  return (
    <div style={{ backgroundImage: `url('${wallImage}')` }} className="Settings">
      <header className="Header">
        <button onClick={hideSettings}>{'<'}</button>
        <h2>SETTINGS</h2>
      </header>

      <article className="Body">
        <div style={{ display: 'flex', placeItems: 'center', justifyContent: 'center' }}>
          <h3>Orbs: {orbs}</h3>
        </div>
        <SettingsToggle
          isOn={showSubtitles}
          setter={setShowSubtitles}
          label="Subtitles"
        ></SettingsToggle>
        <SettingsToggle isOn={useVoice} setter={setUseVoice} label="Voice"></SettingsToggle>
        <SettingsToggle
          isOn={enableRandomOrbs}
          setter={setEnableRandomOrbs}
          label="Random Orbs"
        ></SettingsToggle>
      </article>
      <footer className="Footer">Made by Jet Simon 2025</footer>
    </div>
  )
}

export default Settings
