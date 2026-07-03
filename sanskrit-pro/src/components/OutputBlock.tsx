import CopyButton from './CopyButton'
import SpeakButton from './SpeakButton'

interface Props {
  tag: string
  value: string
  variant: 'deva' | 'iast' | 'plain'
  placeholder?: string
  /** Text to pronounce — should be Devanagari. Omit to hide the speaker. */
  speakText?: string
}

export default function OutputBlock({ tag, value, variant, placeholder, speakText }: Props) {
  const cls = variant === 'deva' ? 'out-deva' : variant === 'iast' ? 'out-iast' : 'out-plain'
  return (
    <div className="output-block">
      <div className="out-head">
        <span className="out-tag">{tag}</span>
        <div className="btn-row">
          {speakText !== undefined && <SpeakButton text={speakText} />}
          <CopyButton text={value} />
        </div>
      </div>
      {value ? (
        <div className={cls}>{value}</div>
      ) : (
        <div className="out-empty">{placeholder ?? '—'}</div>
      )}
    </div>
  )
}
