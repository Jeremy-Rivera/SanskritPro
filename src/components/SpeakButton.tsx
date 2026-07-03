import { useEffect, useState } from 'react'
import { isSpeechSupported, speak, stopSpeaking } from '../lib/speech'

interface Props {
  text: string
  title?: string
  rate?: number
}

/** A speaker button that pronounces Devanagari text with a hosted cloud voice. */
export default function SpeakButton({ text, title = 'Listen', rate = 1 }: Props) {
  const [speaking, setSpeaking] = useState(false)

  useEffect(() => () => stopSpeaking(), [])

  if (!isSpeechSupported()) return null

  const onClick = () => {
    if (speaking) {
      stopSpeaking()
      setSpeaking(false)
      return
    }
    speak(text, {
      rate,
      onStart: () => setSpeaking(true),
      onEnd: () => setSpeaking(false),
    })
  }

  return (
    <button
      className={'icon-btn' + (speaking ? ' speaking' : '')}
      onClick={onClick}
      title={title}
      aria-label={title}
      disabled={!text.trim()}
    >
      {speaking ? '◼' : '🔊'}
    </button>
  )
}
