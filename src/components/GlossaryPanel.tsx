import { useMemo, useState } from 'react'
import { GLOSSARY, GLOSSARY_CATEGORIES } from '../data/glossary'
import SpeakButton from './SpeakButton'

/** An always-offline glossary of essential terms, filterable and searchable. */
export default function GlossaryPanel() {
  const [cat, setCat] = useState<string>('All')
  const [q, setQ] = useState('')

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase()
    return GLOSSARY.filter((t) => {
      if (cat !== 'All' && t.category !== cat) return false
      if (!query) return true
      return (
        t.iast.toLowerCase().includes(query) ||
        t.deva.includes(q.trim()) ||
        t.meaning.toLowerCase().includes(query)
      )
    })
  }, [cat, q])

  return (
    <div className="panel">
      <div className="panel-intro">
        <h2>Glossary</h2>
        <p>
          The essential vocabulary of Sanskrit thought and practice — always available offline.
          Filter by theme or search across terms and meanings.
        </p>
      </div>

      <div className="search-bar" style={{ marginBottom: 16 }}>
        <input
          className="grow"
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search terms and meanings…"
        />
      </div>

      <div className="chip-row">
        <button className={'chip' + (cat === 'All' ? ' active' : '')} onClick={() => setCat('All')}>
          All
        </button>
        {GLOSSARY_CATEGORIES.map((c) => (
          <button key={c} className={'chip' + (cat === c ? ' active' : '')} onClick={() => setCat(c)}>
            {c}
          </button>
        ))}
      </div>

      <div className="gloss-grid">
        {filtered.map((t) => (
          <div className="gloss-card" key={t.iast}>
            <div className="gloss-top">
              <span className="gloss-deva">{t.deva}</span>
              <span className="gloss-iast">{t.iast}</span>
              <SpeakButton text={t.deva} />
            </div>
            <div className="gloss-cat">{t.category}</div>
            <div className="gloss-mean">{t.meaning}</div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && <div className="status">No terms match “{q}”.</div>}
    </div>
  )
}
