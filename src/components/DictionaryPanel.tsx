import { useState } from 'react'
import { DICTIONARIES, dictLabel, lookup, type DictEntry } from '../lib/dictionary'
import SpeakButton from './SpeakButton'
import CopyButton from './CopyButton'

function EntryCard({ en, selectedDict }: { en: DictEntry; selectedDict: string }) {
  const [expanded, setExpanded] = useState(false)
  const long = en.definition.length > 420
  const senses = long && !expanded ? [en.definition.slice(0, 420).trim() + '…'] : en.senses

  return (
    <div className="entry">
      <div className="entry-head">
        <span className="entry-deva">{en.devanagari}</span>
        <span className="entry-iast">{en.iast}</span>
        {en.grammar && <span className="entry-gram">{en.grammar}</span>}
        {en.source !== selectedDict && (
          <span className="entry-src">from {dictLabel(en.source)}</span>
        )}
        <SpeakButton text={en.devanagari} />
        <CopyButton text={`${en.devanagari} (${en.iast}) — ${en.definition}`} />
      </div>
      <ol className="entry-senses">
        {senses.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ol>
      {long && (
        <button className="btn ghost small" onClick={() => setExpanded((v) => !v)}>
          {expanded ? '− Show less' : '+ Show full definition'}
        </button>
      )}
    </div>
  )
}

/**
 * Full dictionary lookups against the Cologne Digital Sanskrit Lexicon
 * (Monier-Williams, Apte, Edgerton). Runs straight from the browser.
 */
export default function DictionaryPanel() {
  const [query, setQuery] = useState('')
  const [dict, setDict] = useState('mw')
  const [entries, setEntries] = useState<DictEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(false)

  const run = async (q: string) => {
    const term = q.trim()
    if (!term) return
    setLoading(true)
    setError('')
    setSearched(true)
    try {
      const results = await lookup(term, { dict, size: 25 })
      setEntries(results)
    } catch (e) {
      console.error(e)
      setError('Could not reach the dictionary service. Check your connection and try again.')
      setEntries([])
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    run(query)
  }

  const dictInfo = DICTIONARIES.find((d) => d.id === dict)!

  return (
    <div className="panel">
      <div className="panel-intro">
        <h2>Dictionary</h2>
        <p>
          Search the great Sanskrit lexica. Type in Devanagari (<span className="input-deva">धर्म</span>),
          IAST (dharma), or plain roman — it's matched automatically. Powered by the Cologne Digital
          Sanskrit Dictionaries.
        </p>
      </div>

      <div className="card">
        <form onSubmit={onSubmit}>
          <div className="search-bar">
            <input
              className="grow"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Look up a word — e.g. dharma, योग, mokṣa"
              autoFocus
            />
            <button className="btn primary" type="submit" disabled={loading || !query.trim()}>
              Search
            </button>
          </div>
          <div className="dict-meta">
            <select value={dict} onChange={(e) => setDict(e.target.value)} style={{ maxWidth: 260 }}>
              {DICTIONARIES.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.label}
                </option>
              ))}
            </select>
            <span className="scheme-hint">{dictInfo.description}</span>
          </div>
        </form>

        {loading && (
          <div className="status">
            <span className="spinner" /> Searching {dictInfo.label}…
          </div>
        )}
        {error && <div className="status error">⚠ {error}</div>}
        {!loading && !error && searched && entries.length === 0 && (
          <div className="status">No entries found. Try a different spelling or dictionary.</div>
        )}

        {entries.map((en) => (
          <EntryCard key={en.id} en={en} selectedDict={dict} />
        ))}
      </div>

      <div className="notice">
        <span className="ni">ⓘ</span>
        <span>
          Definitions come from the Monier-Williams (1899), Apte, and Edgerton dictionaries via the
          University of Cologne's open API. Embedded Sanskrit words are shown in IAST.
        </span>
      </div>
    </div>
  )
}
