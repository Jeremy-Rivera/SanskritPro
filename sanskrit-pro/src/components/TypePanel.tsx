import { useEffect, useMemo, useState } from 'react'
import { SCHEMES, TYPING_SCHEMES, toDevanagari, toIAST, type SchemeId } from '../lib/translit'
import { glossPhrase, type WordGloss } from '../lib/dictionary'
import OutputBlock from './OutputBlock'

const EXAMPLES: Record<string, string> = {
  optitrans: 'oM namaH shivAya',
  itrans: 'oM namaH shivAya',
  hk: 'oM namaH SivAya',
  slp1: 'oM namaH Sivvaya',
  iast: 'oṃ namaḥ śivāya',
}

/**
 * The flagship: type Sanskrit fast in a simple romanization and watch it
 * become correct Devanagari + IAST diacritics live — with English meanings
 * shown in parentheses as you go.
 */
export default function TypePanel() {
  const [input, setInput] = useState('dharmakSetre kurukSetre')
  const [scheme, setScheme] = useState<SchemeId>('optitrans')
  const [glosses, setGlosses] = useState<WordGloss[]>([])
  const [glossing, setGlossing] = useState(false)

  const deva = useMemo(() => toDevanagari(input, scheme), [input, scheme])
  const iast = useMemo(() => toIAST(input, scheme), [input, scheme])

  // Debounced English lookups for the parenthetical translations.
  useEffect(() => {
    const term = input.trim()
    if (!term) {
      setGlosses([])
      setGlossing(false)
      return
    }
    setGlossing(true)
    const id = setTimeout(async () => {
      const g = await glossPhrase(term, scheme)
      setGlosses(g)
      setGlossing(false)
    }, 450)
    return () => clearTimeout(id)
  }, [input, scheme])

  const schemeInfo = SCHEMES.find((s) => s.id === scheme)!
  const typingSchemes = SCHEMES.filter((s) => TYPING_SCHEMES.includes(s.id))
  const anyGloss = glosses.some((g) => g.gloss)

  return (
    <div className="panel">
      <div className="panel-intro">
        <h2>Type Sanskrit — fast</h2>
        <p>
          Type with ordinary letters and get flawless Devanagari and IAST diacritics as you go —
          no special keys, no diacritics to hunt for. English meanings appear in parentheses below.
          <strong> OPTITRANS</strong> is the most forgiving: write <code>aa ii uu RR sh</code> for
          ā ī ū ṛ ś.
        </p>
      </div>

      <div className="card">
        <div className="select-row" style={{ marginBottom: 16 }}>
          <div className="grow">
            <label className="field-label">Input style</label>
            <select value={scheme} onChange={(e) => setScheme(e.target.value as SchemeId)}>
              {typingSchemes.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <button
            className="btn ghost"
            onClick={() => setInput(EXAMPLES[scheme] ?? EXAMPLES.optitrans)}
            title="Load an example"
          >
            ↺ Example
          </button>
          <button className="btn ghost" onClick={() => setInput('')}>
            Clear
          </button>
        </div>

        <label className="field-label">You type ({schemeInfo.label})</label>
        <textarea
          rows={3}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Start typing… e.g. dharmakSetre kurukSetre"
          autoFocus
          style={scheme === 'iast' ? { fontSize: 20 } : undefined}
        />
        <div className="scheme-hint">{schemeInfo.hint}</div>

        <div className="grid-2" style={{ marginTop: 20 }}>
          <OutputBlock tag="Devanagari" value={deva} variant="deva" speakText={deva} />
          <OutputBlock tag="IAST · diacritics" value={iast} variant="iast" />
        </div>

        {input.trim() && (
          <div className="output-block" style={{ marginTop: 18 }}>
            <div className="out-head">
              <span className="out-tag">Meaning · word by word</span>
              {glossing && <span className="spinner" />}
            </div>
            {anyGloss ? (
              <div className="gloss-line">
                {glosses.map((g, i) => (
                  <span className="gloss-word" key={i}>
                    <span className="gw-iast">{g.iast}</span>
                    {g.gloss && <span className="gw-en"> ({g.gloss})</span>}
                  </span>
                ))}
              </div>
            ) : (
              <div className="out-empty">
                {glossing ? 'Looking up meanings…' : 'No dictionary matches for these words.'}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="notice">
        <span className="ni">ⓘ</span>
        <span>
          Meanings are short glosses from Monier-Williams (Cologne). Sanskrit compounds may need
          splitting — use the <strong>Dictionary</strong> tab for full entries.
        </span>
      </div>
    </div>
  )
}
