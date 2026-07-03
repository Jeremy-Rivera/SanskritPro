import { useMemo, useState } from 'react'
import { SCHEMES, transliterate, type SchemeId } from '../lib/translit'
import { guessScheme } from '../lib/dictionary'
import OutputBlock from './OutputBlock'

/**
 * A full converter between any two schemes — paste Devanagari and read it in
 * IAST, or turn roman transliteration back into Devanagari, and everything between.
 */
export default function ConvertPanel() {
  const [input, setInput] = useState('धर्मक्षेत्रे कुरुक्षेत्रे')
  const [auto, setAuto] = useState(true)
  const [from, setFrom] = useState<SchemeId>('devanagari')
  const [to, setTo] = useState<SchemeId>('iast')

  const effectiveFrom: SchemeId = auto && input.trim() ? guessScheme(input) : from
  const output = useMemo(
    () => transliterate(input, effectiveFrom, to),
    [input, effectiveFrom, to],
  )

  const outVariant = to === 'devanagari' ? 'deva' : to === 'iast' ? 'iast' : 'plain'
  const speakText =
    to === 'devanagari' ? output : transliterate(input, effectiveFrom, 'devanagari')

  const swap = () => {
    setAuto(false)
    setFrom(to)
    setTo(effectiveFrom)
    setInput(output)
  }

  return (
    <div className="panel">
      <div className="panel-intro">
        <h2>Transliterate &amp; convert</h2>
        <p>
          Convert between Devanagari and every major romanization — IAST, ITRANS, Harvard-Kyoto,
          SLP1 and more. Paste Devanagari to read it in diacritics, or turn roman text back into
          script. Detection is automatic; override it any time.
        </p>
      </div>

      <div className="card">
        <div className="select-row" style={{ marginBottom: 16 }}>
          <div className="grow">
            <label className="field-label">From</label>
            <select
              value={auto ? 'auto' : from}
              onChange={(e) => {
                if (e.target.value === 'auto') setAuto(true)
                else {
                  setAuto(false)
                  setFrom(e.target.value as SchemeId)
                }
              }}
            >
              <option value="auto">
                Auto-detect{auto && input.trim() ? ` — ${labelOf(effectiveFrom)}` : ''}
              </option>
              {SCHEMES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <button className="btn ghost" onClick={swap} title="Swap direction" style={{ marginTop: 22 }}>
            ⇄
          </button>
          <div className="grow">
            <label className="field-label">To</label>
            <select value={to} onChange={(e) => setTo(e.target.value as SchemeId)}>
              {SCHEMES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <label className="field-label">Input</label>
        <textarea
          className={effectiveFrom === 'devanagari' ? 'input-deva' : ''}
          rows={4}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste or type Sanskrit here…"
        />

        <div style={{ marginTop: 18 }}>
          <OutputBlock
            tag={`Output · ${labelOf(to)}`}
            value={output}
            variant={outVariant}
            speakText={speakText}
          />
        </div>
      </div>
    </div>
  )
}

const labelOf = (id: SchemeId) => SCHEMES.find((s) => s.id === id)?.label ?? id
