import { BuddyContext, SettingsContext } from '@renderer/App'
import { useContext, useEffect, useState } from 'react'

interface SubtitlesProps {
  msBetweenWord: number
}

function Subtitles(props: SubtitlesProps): React.ReactNode {
  const { msBetweenWord } = props

  const { saying, setIsTalking } = useContext(BuddyContext)

  const { showSubtitles } = useContext(SettingsContext)

  const [currentText, setCurrentText] = useState('')

  useEffect(() => {
    if (saying == '') {
      return
    }

    setIsTalking(true)
    setCurrentText('')

    const words = saying.split(' ').reverse()
    const wordsSoFar: string[] = []

    const handle = setInterval(() => {
      if (words.length == 0) {
        clearInterval(handle)
        setIsTalking(false)
        return
      }

      wordsSoFar.push(words.pop() ?? '')
      setCurrentText(wordsSoFar.join(' '))
    }, msBetweenWord)

    return () => {
      if (handle) {
        clearInterval(handle)
      }
    }
  }, [saying, msBetweenWord, setIsTalking])

  const doneSpeaking = currentText == saying

  return (
    <p
      style={showSubtitles ? {} : { visibility: 'hidden' }}
      className={'Subtitles' + (doneSpeaking ? ' Fade' : '')}
    >
      {currentText}
    </p>
  )
}

export default Subtitles
