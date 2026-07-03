import { useEffect, useState } from 'react'
import ComposePanel from './components/ComposePanel'
import DictionaryPanel from './components/DictionaryPanel'
import VarnamalaPanel from './components/VarnamalaPanel'

type TabId = 'write' | 'dictionary' | 'sounds'

const TABS: { id: TabId; label: string; ico: string }[] = [
  { id: 'write', label: 'Write', ico: '✍' },
  { id: 'dictionary', label: 'Dictionary', ico: '📖' },
  { id: 'sounds', label: 'Sounds', ico: '🔊' },
]

// Old tabs (type/convert/keyboard/glossary) all fold into Write, so stale
// bookmarks and #hashes still land somewhere sensible.
const HASH_ALIASES: Record<string, TabId> = {
  type: 'write',
  convert: 'write',
  keyboard: 'write',
  glossary: 'write',
}

export default function App() {
  const [tab, setTab] = useState<TabId>(() => {
    const h = window.location.hash.replace('#', '')
    if (TABS.some((t) => t.id === h)) return h as TabId
    return HASH_ALIASES[h] ?? 'write'
  })

  useEffect(() => {
    window.location.hash = tab
  }, [tab])

  return (
    <div className="app">
      <header className="site-header">
        <span className="om">ॐ</span>
        <div className="brand">
          <h1>Sanskrit Pro</h1>
          <p>Type · transliterate · look up · listen — संस्कृतम्</p>
        </div>
      </header>

      <nav className="tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={'tab' + (tab === t.id ? ' active' : '')}
            onClick={() => setTab(t.id)}
          >
            <span className="ico">{t.ico}</span>
            {t.label}
          </button>
        ))}
      </nav>

      <main>
        {tab === 'write' && <ComposePanel />}
        {tab === 'dictionary' && <DictionaryPanel />}
        {tab === 'sounds' && <VarnamalaPanel />}
      </main>

      <footer className="site-footer">
        <p>
          Transliteration by{' '}
          <a href="https://github.com/indic-transliteration/sanscript.js" target="_blank" rel="noreferrer">
            Sanscript.js
          </a>{' '}
          · dictionaries via the{' '}
          <a href="https://cceh.github.io/c-salt_sanskrit_data/" target="_blank" rel="noreferrer">
            Cologne Digital Sanskrit Lexicon
          </a>{' '}
          · pronunciation via a hosted Hindi voice (offline fallback to your browser).
        </p>
      </footer>
    </div>
  )
}
