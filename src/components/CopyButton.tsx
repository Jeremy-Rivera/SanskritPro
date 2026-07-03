import { useState } from 'react'

interface Props {
  text: string
  title?: string
}

/** Copies text to the clipboard and briefly shows a checkmark. */
export default function CopyButton({ text, title = 'Copy' }: Props) {
  const [done, setDone] = useState(false)

  const onClick = async () => {
    if (!text.trim()) return
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // Fallback for non-secure contexts.
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setDone(true)
    setTimeout(() => setDone(false), 1200)
  }

  return (
    <button
      className="icon-btn"
      onClick={onClick}
      title={title}
      aria-label={title}
      disabled={!text.trim()}
      style={done ? { color: 'var(--teal)', borderColor: 'rgba(52,211,187,0.5)' } : undefined}
    >
      {done ? '✓' : '⧉'}
    </button>
  )
}
