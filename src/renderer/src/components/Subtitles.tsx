import { useEffect, useState } from 'react'

interface SubtitlesProps {
  text: string
  msBetweenWord: number
  onDoneTalking: () => void
  onStartTalking: () => void
}

function Subtitles(props: SubtitlesProps): React.ReactNode {
  const { onStartTalking, onDoneTalking, text, msBetweenWord } = props

  const [currentText, setCurrentText] = useState('')

  useEffect(() => {
    if (text == '') {
      return
    }

    onStartTalking()
    setCurrentText('')

    const words = text.split(' ').reverse()
    const wordsSoFar: string[] = []

    const handle = setInterval(() => {
      if (words.length == 0) {
        clearInterval(handle)
        onDoneTalking()
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
  }, [text, msBetweenWord, onStartTalking, onDoneTalking])

  const doneSpeaking = currentText == text

  return <p className={'Subtitles' + (doneSpeaking ? ' Fade' : '')}>{currentText}</p>
}

export default Subtitles
