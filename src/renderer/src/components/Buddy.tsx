import { BuddyState } from '@renderer/types'
import { useCallback, useContext, useEffect, useState } from 'react'
import idle from '../assets/idle.gif'
import talk from '../assets/talk.gif'
import look_around from '../assets/look_around.gif'
import { BuddyContext, SettingsContext } from '@renderer/App'
import { chooseRandom } from '@renderer/util'

function Buddy(): React.ReactNode {
  const { buddyState, setBuddyState, setSaying, saying, isTalking } = useContext(BuddyContext)
  const { setShowingSettings } = useContext(SettingsContext)
  const [img, setImage] = useState(idle)

  useEffect(() => {
    switch (buddyState) {
      case BuddyState.Idle:
        setImage(idle)
        break
      case BuddyState.LookingAround:
        setImage(look_around)
        break
      case BuddyState.Speaking:
        setImage(talk)
        break
    }
  }, [buddyState])

  // Handle idle state
  useEffect(() => {
    if (buddyState != BuddyState.Idle) {
      return
    }

    const handle = setTimeout(
      () => setBuddyState(BuddyState.LookingAround),
      Math.random() * 30 * 1000
    )

    return () => clearTimeout(handle)
  }, [buddyState, setBuddyState])

  // Handle looking around state
  useEffect(() => {
    if (buddyState != BuddyState.LookingAround) {
      return
    }

    const handle = setTimeout(() => setBuddyState(BuddyState.Idle), 8000)

    return () => clearTimeout(handle)
  }, [buddyState, setBuddyState])

  useEffect(() => {
    if (isTalking) {
      setBuddyState(BuddyState.Speaking)
    } else {
      setBuddyState(BuddyState.Idle)
    }
  }, [isTalking, setBuddyState])

  const saySomething = useCallback(() => {
    if (isTalking) {
      return
    }

    const newSaying = chooseRandom([
      'I want a bigger wand',
      "My kids magically don't talk to me anymore!",
      'I wish I never got divorced'
    ])
    if (newSaying != saying) {
      setSaying(newSaying)
    } else {
      saySomething()
    }
  }, [setSaying, saying, isTalking])

  function onClick(e: React.MouseEvent): void {
    if (e.button == 0) {
      saySomething()
    } else if (e.button == 2) {
      setShowingSettings(true)
    }
  }

  return <img className="WizardImage" onContextMenu={onClick} onClick={onClick} src={img}></img>
}

export default Buddy
