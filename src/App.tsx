import { useEffect, useState } from 'react'
import TypePanel from './components/TypePanel'
import ConvertPanel from './components/ConvertPanel'
import KeyboardPanel from './components/KeyboardPanel'
import DictionaryPanel from './components/DictionaryPanel'
import GlossaryPanel from './components/GlossaryPanel'
import VarnamalaPanel from './components/VarnamalaPanel'

type TabId = 'type' | 'convert' | 'keyboard' | 'dictionary' | 'glossary' | 'sounds'

const TABS: { id: TabId; label: string; ico: string }[] = [
  { id: 'type', label: 'Type', ico: '⌨' },
  { id: 'convert', label: 'Convert', ico: '⇄' },
  { id: 'keyboard', label: 'Keyboard', ico: '🖮' },
  { id: 'dictionary', label: 'Dictionary', ico: '📖' },
  { id: 'glossary', label: 'Glossary', ico: '✦' },
  { id: 'sounds', label: 'Sounds', ico: '🔊' },
]

export default function App() {
  const [tab, setTab] = useState<TabId>(() => {
    const h = window.location.hash.replace('#', '') as TabId
    return TABS.some((t) => t.id === h) ? h : 'type'
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
        {tab === 'type' && <TypePanel />}
        {tab === 'convert' && <ConvertPanel />}
        {tab === 'keyboard' && <KeyboardPanel />}
        {tab === 'dictionary' && <DictionaryPanel />}
        {tab === 'glossary' && <GlossaryPanel />}
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
