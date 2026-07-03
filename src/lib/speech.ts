/**
 * Pronunciation audio.
 *
 * Primary source: a hosted, cloud TTS voice (Google Translate's tw-ob endpoint,
 * Hindi `hi` — Sanskrit shares the Devanagari script). This gives the SAME voice
 * on every machine, independent of whatever the user's OS happens to have
 * installed. It returns an MP3 we play through an <audio> element; media playback
 * is not subject to CORS, so no API key or backend is needed.
 *
 * Fallback: the browser's built-in speechSynthesis, used only if the network
 * audio can't load (e.g. offline).
 */

const TTS_BASE = 'https://translate.google.com/translate_tts'

export interface SpeakOptions {
  /** 1 = normal, <1 = slower (good for learning individual sounds). */
  rate?: number
  onStart?: () => void
  onEnd?: () => void
}

let currentAudio: HTMLAudioElement | null = null

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && (typeof Audio !== 'undefined' || 'speechSynthesis' in window)
}

function ttsUrl(text: string): string {
  const q = encodeURIComponent(text)
  return `${TTS_BASE}?ie=UTF-8&tl=hi&client=tw-ob&q=${q}`
}

/** Split into <=180-char chunks on word boundaries (the TTS endpoint has a length cap). */
function chunk(text: string, max = 180): string[] {
  const words = text.trim().split(/\s+/)
  const chunks: string[] = []
  let cur = ''
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > max) {
      if (cur) chunks.push(cur)
      cur = w
    } else {
      cur = (cur + ' ' + w).trim()
    }
  }
  if (cur) chunks.push(cur)
  return chunks.length ? chunks : [text]
}

export function speak(text: string, opts: SpeakOptions = {}): void {
  const clean = text.trim()
  if (!clean) return
  stopSpeaking()

  if (typeof Audio === 'undefined') {
    browserSpeak(clean, opts)
    return
  }

  const parts = chunk(clean)
  let i = 0
  const audio = new Audio()
  audio.playbackRate = opts.rate ?? 1
  currentAudio = audio
  opts.onStart?.()

  const playNext = () => {
    if (audio !== currentAudio) return // superseded/stopped
    if (i >= parts.length) {
      currentAudio = null
      opts.onEnd?.()
      return
    }
    audio.src = ttsUrl(parts[i++])
    audio.play().catch(() => fallback())
  }

  let fellBack = false
  const fallback = () => {
    if (fellBack) return
    fellBack = true
    currentAudio = null
    browserSpeak(clean, opts) // onEnd fires from the browser path
  }

  audio.onended = playNext
  audio.onerror = fallback
  playNext()
}

export function stopSpeaking(): void {
  if (currentAudio) {
    currentAudio.pause()
    currentAudio.onended = null
    currentAudio.onerror = null
    currentAudio = null
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel()
  }
}

/** Offline fallback via the OS voice. */
function browserSpeak(text: string, opts: SpeakOptions): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    opts.onEnd?.()
    return
  }
  const utter = new SpeechSynthesisUtterance(text)
  const voices = window.speechSynthesis.getVoices()
  const hi = voices.find((v) => /^(sa|hi|mr|ne)/i.test(v.lang))
  if (hi) {
    utter.voice = hi
    utter.lang = hi.lang
  } else {
    utter.lang = 'hi-IN'
  }
  utter.rate = opts.rate ?? 0.9
  utter.onstart = () => opts.onStart?.()
  utter.onend = () => opts.onEnd?.()
  utter.onerror = () => opts.onEnd?.()
  window.speechSynthesis.speak(utter)
}
