import { useCallback, useEffect, useState } from 'react'
import Subtitles from './components/Subtitles'
import { chooseRandom } from './util'

import idle from './assets/idle.gif'
import talk from './assets/talk.gif'
import look_around from './assets/look_around.gif'

enum WizardState {
  Idle,
  LookingAround,
  Speaking
}

function App(): React.JSX.Element {
  const [text, setText] = useState('')
  const [img, setImage] = useState(idle)

  const [wizardState, setWizardState] = useState(WizardState.Idle)

  function saySomething(): void {
    const saying = chooseRandom([
      'I want a bigger wand',
      "My kids magically don't talk to me anymore!",
      'I wish I never got divorced'
    ])

    if (text != saying) {
      window.electron.ipcRenderer.send('speak', [saying])
      setText(saying)
    } else {
      saySomething()
    }
  }

  useEffect(() => {
    switch (wizardState) {
      case WizardState.Idle:
        setImage(idle)
        break
      case WizardState.LookingAround:
        setImage(look_around)
        break
      case WizardState.Speaking:
        setImage(talk)
        break
    }
  }, [wizardState])

  const onStartTalking = useCallback(() => {
    setWizardState(WizardState.Speaking)
  }, [])

  const onDoneTalking = useCallback(() => {
    setWizardState(WizardState.Idle)
  }, [])

  useEffect(() => {
    if (wizardState != WizardState.Idle) {
      return
    }

    const handle = setTimeout(
      () => setWizardState(WizardState.LookingAround),
      Math.random() * 30 * 1000
    )

    return () => clearTimeout(handle)
  }, [wizardState])

  useEffect(() => {
    if (wizardState != WizardState.LookingAround) {
      return
    }

    const handle = setTimeout(() => setWizardState(WizardState.Idle), 8000)

    return () => clearTimeout(handle)
  }, [wizardState])

  return (
    <div className="WizardDiv">
      <Subtitles
        onStartTalking={onStartTalking}
        onDoneTalking={onDoneTalking}
        msBetweenWord={300}
        text={text}
      ></Subtitles>
      <img className="WizardImage" onClick={saySomething} src={img}></img>
    </div>
  )
}

export default App
