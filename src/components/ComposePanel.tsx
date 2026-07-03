import { useEffect, useMemo, useRef, useState } from 'react'
import {
  SCHEMES,
  TYPING_SCHEMES,
  toDevanagari,
  toIAST,
  transliterate,
  type SchemeId,
} from '../lib/translit'
import { glossPhrase, guessScheme, lookup, type DictEntry, type WordGloss } from '../lib/dictionary'
import OutputBlock from './OutputBlock'
import Keyboard from './Keyboard'

type FromChoice = SchemeId | 'auto'

const EXAMPLES: Record<string, string> = {
  optitrans: 'oM namaH shivAya',
  itrans: 'oM namaH shivAya',
  hk: 'oM namaH SivAya',
  slp1: 'oM namaH Sivvaya',
  iast: 'oṃ namaḥ śivāya',
  devanagari: 'धर्मक्षेत्रे कुरुक्षेत्रे',
}

const labelOf = (id: SchemeId) => SCHEMES.find((s) => s.id === id)?.label ?? id

/**
 * The single workspace: type Sanskrit in any romanization (or paste Devanagari,
 * or click it in on the keyboard) and see it live as Devanagari + IAST, convert
 * it to any other script, and read the English meaning of every word — all on
 * one page. Merges the old Type, Convert and Keyboard tabs.
 */
export default function ComposePanel() {
  const [input, setInput] = useState('dharmakSetre kurukSetre')
  const [from, setFrom] = useState<FromChoice>('auto')
  const [target, setTarget] = useState<SchemeId>('slp1')
  const [showMore, setShowMore] = useState(false)
  const [showKeyboard, setShowKeyboard] = useState(false)

  const [glosses, setGlosses] = useState<WordGloss[]>([])
  const [glossing, setGlossing] = useState(false)
  const [openWord, setOpenWord] = useState<string | null>(null)
  const [entry, setEntry] = useState<DictEntry | null>(null)
  const [entryLoading, setEntryLoading] = useState(false)

  const ref = useRef<HTMLTextAreaElement>(null)

  const effectiveFrom: SchemeId = from === 'auto' && input.trim() ? guessScheme(input) : from === 'auto' ? 'optitrans' : from
  const deva = useMemo(() => toDevanagari(input, effectiveFrom), [input, effectiveFrom])
  const iast = useMemo(() => toIAST(input, effectiveFrom), [input, effectiveFrom])
  const more = useMemo(
    () => transliterate(input, effectiveFrom, target),
    [input, effectiveFrom, target],
  )

  // Debounced word-by-word English meanings.
  useEffect(() => {
    const term = input.trim()
    if (!term) {
      setGlosses([])
      setGlossing(false)
      return
    }
    setGlossing(true)
    const id = setTimeout(async () => {
      const g = await glossPhrase(term, effectiveFrom)
      setGlosses(g)
      setGlossing(false)
    }, 450)
    return () => clearTimeout(id)
  }, [input, effectiveFrom])

  // When the input changes, any expanded full-definition no longer applies.
  useEffect(() => {
    setOpenWord(null)
    setEntry(null)
  }, [input])

  const openFull = async (g: WordGloss) => {
    if (openWord === g.word) {
      setOpenWord(null)
      setEntry(null)
      return
    }
    setOpenWord(g.word)
    setEntry(null)
    setEntryLoading(true)
    try {
      const results = await lookup(g.word, { fromScheme: effectiveFrom, size: 1 })
      setEntry(results[0] ?? null)
    } catch {
      setEntry(null)
    } finally {
      setEntryLoading(false)
    }
  }

  /* --- shared-input editing for the on-screen keyboard --- */
  const insert = (ch: string) => {
    const ta = ref.current
    if (!ta) return setInput((t) => t + ch)
    const start = ta.selectionStart ?? input.length
    const end = ta.selectionEnd ?? input.length
    setInput(input.slice(0, start) + ch + input.slice(end))
    requestAnimationFrame(() => {
      ta.focus()
      const pos = start + ch.length
      ta.setSelectionRange(pos, pos)
    })
  }
  const backspace = () => {
    const ta = ref.current
    if (!ta) return setInput((t) => t.slice(0, -1))
    const start = ta.selectionStart ?? input.length
    const end = ta.selectionEnd ?? input.length
    if (start !== end) {
      setInput(input.slice(0, start) + input.slice(end))
      requestAnimationFrame(() => ta.setSelectionRange(start, start))
    } else if (start > 0) {
      setInput(input.slice(0, start - 1) + input.slice(start))
      requestAnimationFrame(() => ta.setSelectionRange(start - 1, start - 1))
    }
  }

  const typingSchemes = SCHEMES.filter((s) => TYPING_SCHEMES.includes(s.id))
  const anyGloss = glosses.some((g) => g.gloss)
  const detected = from === 'auto' && input.trim() ? ` — ${labelOf(effectiveFrom)}` : ''
  const isDevaInput = effectiveFrom === 'devanagari'

  return (
    <div className="panel">
      <div className="panel-intro">
        <h2>Write Sanskrit</h2>
        <p>
          Type in any romanization, paste Devanagari, or click it in on the keyboard — and see it
          live as Devanagari and IAST, convert it to any other script, and read what every word
          means. <strong>OPTITRANS</strong> is the most forgiving: write <code>aa ii uu RR sh</code>{' '}
          for ā ī ū ṛ ś.
        </p>
      </div>

      <div className="card">
        <div className="select-row" style={{ marginBottom: 16 }}>
          <div className="grow">
            <label className="field-label">Input style</label>
            <select value={from} onChange={(e) => setFrom(e.target.value as FromChoice)}>
              <option value="auto">Auto-detect{detected}</option>
              {typingSchemes.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <button
            className={'btn ghost' + (showKeyboard ? ' on' : '')}
            onClick={() => setShowKeyboard((v) => !v)}
            title="Toggle the on-screen keyboard"
          >
            🖮 Keyboard
          </button>
          <button
            className="btn ghost"
            onClick={() => setInput(EXAMPLES[effectiveFrom] ?? EXAMPLES.optitrans)}
          >
            ↺ Example
          </button>
          <button className="btn ghost" onClick={() => setInput('')}>
            Clear
          </button>
        </div>

        <textarea
          ref={ref}
          className={isDevaInput ? 'input-deva' : ''}
          rows={3}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Start typing… e.g. dharmakSetre kurukSetre — or paste धर्म"
          autoFocus
          style={effectiveFrom === 'iast' ? { fontSize: 20 } : undefined}
        />

        {showKeyboard && (
          <div style={{ marginTop: 14 }}>
            <Keyboard onInsert={insert} onBackspace={backspace} onClear={() => setInput('')} />
          </div>
        )}

        <div className="grid-2" style={{ marginTop: 20 }}>
          <OutputBlock tag="Devanagari" value={deva} variant="deva" speakText={deva} />
          <OutputBlock tag="IAST · diacritics" value={iast} variant="iast" />
        </div>

        <button className="btn ghost small more-toggle" onClick={() => setShowMore((v) => !v)}>
          {showMore ? '− Hide other scripts' : '+ Convert to another script'}
        </button>
        {showMore && (
          <div className="select-row" style={{ marginTop: 12, alignItems: 'flex-end' }}>
            <div style={{ flex: '0 0 220px' }}>
              <label className="field-label">Convert to</label>
              <select value={target} onChange={(e) => setTarget(e.target.value as SchemeId)}>
                {SCHEMES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="grow">
              <OutputBlock
                tag={`Output · ${labelOf(target)}`}
                value={more}
                variant={target === 'devanagari' ? 'deva' : target === 'iast' ? 'iast' : 'plain'}
                speakText={target === 'devanagari' ? more : deva}
              />
            </div>
          </div>
        )}

        {input.trim() && (
          <div className="output-block" style={{ marginTop: 18 }}>
            <div className="out-head">
              <span className="out-tag">Meaning · word by word</span>
              {glossing && <span className="spinner" />}
            </div>
            {anyGloss ? (
              <>
                <div className="gloss-line">
                  {glosses.map((g, i) => (
                    <button
                      className={'gloss-word' + (openWord === g.word ? ' open' : '')}
                      key={i}
                      onClick={() => openFull(g)}
                      title="Show the full dictionary entry"
                    >
                      <span className="gw-iast">{g.iast}</span>
                      {g.gloss && <span className="gw-en"> ({g.gloss})</span>}
                    </button>
                  ))}
                </div>
                <div className="gloss-hint">Click any word for its full dictionary entry.</div>
                {openWord && (
                  <div className="inline-entry">
                    {entryLoading && (
                      <div className="status">
                        <span className="spinner" /> Looking up {openWord}…
                      </div>
                    )}
                    {!entryLoading && entry && (
                      <>
                        <div className="entry-head">
                          <span className="entry-deva">{entry.devanagari}</span>
                          <span className="entry-iast">{entry.iast}</span>
                          {entry.grammar && <span className="entry-gram">{entry.grammar}</span>}
                        </div>
                        <ol className="entry-senses">
                          {entry.senses.slice(0, 8).map((s, i) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ol>
                      </>
                    )}
                    {!entryLoading && !entry && (
                      <div className="out-empty">No dictionary entry found for “{openWord}”.</div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="out-empty">
                {glossing
                  ? 'Looking up meanings…'
                  : 'No dictionary matches — compounds may need splitting into their parts.'}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="notice">
        <span className="ni">ⓘ</span>
        <span>
          Meanings are short glosses from the Cologne lexica; click a word for its full entry, or
          open the <strong>Dictionary</strong> tab to search directly.
        </span>
      </div>
    </div>
  )
}
