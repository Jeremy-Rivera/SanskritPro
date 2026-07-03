import Sanscript from '@indic-transliteration/sanscript'

/**
 * Thin wrapper around Sanscript.js (the JS twin of indic_transliteration).
 * Everything here is 100% client-side — no network, works offline.
 */

export type SchemeId =
  | 'devanagari'
  | 'iast'
  | 'itrans'
  | 'optitrans'
  | 'hk'
  | 'slp1'
  | 'velthuis'
  | 'wx'
  | 'kolkata'

export interface SchemeInfo {
  id: SchemeId
  label: string
  kind: 'brahmic' | 'roman'
  hint: string
}

export const SCHEMES: SchemeInfo[] = [
  { id: 'devanagari', label: 'Devanagari', kind: 'brahmic', hint: 'देवनागरी script' },
  { id: 'iast', label: 'IAST (diacritics)', kind: 'roman', hint: 'ā ī ū ṛ ṃ ḥ ś ṣ …' },
  { id: 'itrans', label: 'ITRANS', kind: 'roman', hint: 'aa ii uu RRi M H sh Sh — type fast' },
  { id: 'optitrans', label: 'OPTITRANS', kind: 'roman', hint: 'aa ii uu RR sh — most forgiving' },
  { id: 'hk', label: 'Harvard-Kyoto', kind: 'roman', hint: 'A I U R M H z S — case-based' },
  { id: 'slp1', label: 'SLP1', kind: 'roman', hint: 'compact 1-char encoding' },
  { id: 'velthuis', label: 'Velthuis', kind: 'roman', hint: 'aa ii .r .m .h "s .s' },
  { id: 'wx', label: 'WX', kind: 'roman', hint: 'computational notation' },
]

/** Fast, forgiving schemes recommended for casual typing. */
export const TYPING_SCHEMES: SchemeId[] = ['optitrans', 'itrans', 'hk', 'slp1', 'iast']

export function transliterate(text: string, from: SchemeId, to: SchemeId): string {
  if (!text) return ''
  try {
    return Sanscript.t(text, from, to)
  } catch (err) {
    console.error('transliterate failed', err)
    return text
  }
}

/** Convenience: any input scheme → Devanagari. */
export const toDevanagari = (text: string, from: SchemeId) =>
  transliterate(text, from, 'devanagari')

/** Convenience: any input scheme → IAST (proper diacritics). */
export const toIAST = (text: string, from: SchemeId) => transliterate(text, from, 'iast')

/** Sanskrit word (any scheme) → SLP1, used for dictionary lookups. */
export const toSLP1 = (text: string, from: SchemeId) => transliterate(text, from, 'slp1')

const schemeLabels = Object.fromEntries(SCHEMES.map((s) => [s.id, s.label]))
export const labelFor = (id: SchemeId) => schemeLabels[id] ?? id
