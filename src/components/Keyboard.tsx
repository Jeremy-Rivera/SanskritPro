import { useState } from 'react'
import { DEVANAGARI_SECTIONS, IAST_SECTIONS, type KeySection } from '../data/keyboard'

type Mode = 'devanagari' | 'iast'

/**
 * Presentational on-screen keyboard: a Devanagari / IAST toggle plus the key
 * grids. It owns no text — every key press is reported through `onInsert`, and
 * ⌫/␣ through `onBackspace`/`onInsert(' ')` — so the same keyboard can drive any
 * text field (currently the Write workspace's shared input).
 */
export default function Keyboard({
  onInsert,
  onBackspace,
  onClear,
}: {
  onInsert: (ch: string) => void
  onBackspace: () => void
  onClear: () => void
}) {
  const [mode, setMode] = useState<Mode>('devanagari')
  const sections: KeySection[] = mode === 'devanagari' ? DEVANAGARI_SECTIONS : IAST_SECTIONS

  return (
    <div className="keyboard">
      <div className="chip-row" style={{ margin: '0 0 4px' }}>
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
        <div className="kb-tools" style={{ marginLeft: 'auto', marginTop: 0 }}>
          <button className="btn" onClick={onBackspace}>⌫ Backspace</button>
          <button className="btn" onClick={() => onInsert(' ')}>␣ Space</button>
          <button className="btn ghost" onClick={onClear}>Clear</button>
        </div>
      </div>

      {sections.map((section) => (
        <div className="kb-section" key={section.title}>
          <h3>{section.title}</h3>
          <div className="kb-keys">
            {section.keys.map((k) => (
              <button
                key={k.char}
                className={'kb-key' + (mode === 'iast' ? ' iast' : '')}
                onClick={() => onInsert(k.char)}
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
  )
}
