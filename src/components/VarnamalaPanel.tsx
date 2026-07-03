import { useState } from 'react'
import { VARNAMALA } from '../data/varnamala'
import { speak, isSpeechSupported } from '../lib/speech'

/**
 * The Sanskrit alphabet arranged by place of articulation. Click any akṣara to
 * hear it — the classical way to learn the sounds.
 */
export default function VarnamalaPanel() {
  const [playing, setPlaying] = useState<string | null>(null)
  const supported = isSpeechSupported()

  const play = (deva: string) => {
    speak(deva, {
      rate: 0.8,
      onStart: () => setPlaying(deva),
      onEnd: () => setPlaying(null),
    })
  }

  return (
    <div className="panel">
      <div className="panel-intro">
        <h2>Varṇamālā — the sounds</h2>
        <p>
          The alphabet, ordered as the grammarians did: by where each sound is born in the mouth,
          from the throat to the lips. {supported ? 'Click any letter to hear it.' : ''}
        </p>
      </div>

      {!supported && (
        <div className="notice" style={{ marginBottom: 16 }}>
          <span className="ni">ⓘ</span>
          <span>Your browser doesn't support speech synthesis, so audio is unavailable here.</span>
        </div>
      )}

      <div className="card">
        {VARNAMALA.map((group) => (
          <div className="varna-group" key={group.title}>
            <h3>{group.title}</h3>
            <div className="sub">{group.subtitle}</div>
            <div className="varna-grid">
              {group.varnas.map((v) => (
                <button
                  key={v.deva + v.iast}
                  className={'varna' + (playing === v.deva ? ' playing' : '')}
                  onClick={() => play(v.deva)}
                  title={`Hear ${v.iast}`}
                >
                  <span className="vd">{v.deva}</span>
                  <span className="vi">{v.iast}</span>
                  {v.note && <span className="vn">{v.note}</span>}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
