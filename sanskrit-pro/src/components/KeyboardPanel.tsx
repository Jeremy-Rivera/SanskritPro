import { useRef, useState } from 'react'
import { DEVANAGARI_SECTIONS, IAST_SECTIONS, type KeySection } from '../data/keyboard'
import { transliterate } from '../lib/translit'
import CopyButton from './CopyButton'
import SpeakButton from './SpeakButton'

type Mode = 'devanagari' | 'iast'

/**
 * A clickable online keyboard for people who'd rather point-and-click than
 * learn a transliteration scheme — full Devanagari, plus an IAST diacritics row.
 */
export default function KeyboardPanel() {
  const [mode, setMode] = useState<Mode>('devanagari')
  const [text, setText] = useState('')
  const ref = useRef<HTMLTextAreaElement>(null)

  const sections: KeySection[] = mode === 'devanagari' ? DEVANAGARI_SECTIONS : IAST_SECTIONS

  const insert = (ch: string) => {
    const ta = ref.current
    if (!ta) {
      setText((t) => t + ch)
      return
    }
    const start = ta.selectionStart ?? text.length
    const end = ta.selectionEnd ?? text.length
    const next = text.slice(0, start) + ch + text.slice(end)
    setText(next)
    // Restore caret just after the inserted character.
    requestAnimationFrame(() => {
      ta.focus()
      const pos = start + ch.length
      ta.setSelectionRange(pos, pos)
    })
  }

  const backspace = () => {
    const ta = ref.current
    if (!ta) {
      setText((t) => t.slice(0, -1))
      return
    }
    const start = ta.selectionStart ?? text.length
    const end = ta.selectionEnd ?? text.length
    if (start !== end) {
      setText(text.slice(0, start) + text.slice(end))
      requestAnimationFrame(() => ta.setSelectionRange(start, start))
    } else if (start > 0) {
      setText(text.slice(0, start - 1) + text.slice(start))
      requestAnimationFrame(() => ta.setSelectionRange(start - 1, start - 1))
    }
  }

  const iastReading =
    mode === 'devanagari' && text ? transliterate(text, 'devanagari', 'iast') : ''

  return (
    <div className="panel">
      <div className="panel-intro">
        <h2>Online keyboard</h2>
        <p>
          Prefer to click? Build text one character at a time — full Devanagari with vowel signs
          and conjunct marks, or an IAST diacritics palette. Click into the box first to place
          your cursor.
        </p>
      </div>

      <div className="card kb-target">
        <div className="select-row" style={{ marginBottom: 14 }}>
          <div className="chip-row" style={{ margin: 0 }}>
            <button
              className={'chip' + (mode === 'devanagari' ? ' active' : '')}
              onClick={() => setMode('devanagari')}
            >
              देवनागरी Devanagari
            </button>
            <button
              className={'chip' + (mode === 'iast' ? ' active' : '')}
              onClick={() => setMode('iast')}
            >
              ā ī ū IAST
            </button>
          </div>
        </div>

        <textarea
          ref={ref}
          className={mode === 'devanagari' ? 'input-deva' : ''}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Click the keys below, or type here directly…"
          style={mode === 'iast' ? { fontSize: 20 } : undefined}
        />

        <div className="kb-tools">
          <button className="btn" onClick={backspace}>⌫ Backspace</button>
          <button className="btn" onClick={() => insert(' ')}>␣ Space</button>
          <button className="btn ghost" onClick={() => setText('')}>Clear</button>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            {mode === 'devanagari' && <SpeakButton text={text} />}
            <CopyButton text={text} />
          </div>
        </div>

        {iastReading && (
          <div className="scheme-hint" style={{ marginTop: 12 }}>
            IAST reading: <span style={{ color: 'var(--text)' }}>{iastReading}</span>
          </div>
        )}

        {sections.map((section) => (
          <div className="kb-section" key={section.title}>
            <h3>{section.title}</h3>
            <div className="kb-keys">
              {section.keys.map((k) => (
                <button
                  key={k.char}
                  className={'kb-key' + (mode === 'iast' ? ' iast' : '')}
                  onClick={() => insert(k.char)}
                  title={k.label ?? k.char}
                >
                  <div className="kc">{k.char}</div>
                  {k.label && <div className="kl">{k.label}</div>}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
