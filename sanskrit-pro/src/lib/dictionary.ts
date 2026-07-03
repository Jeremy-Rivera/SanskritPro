import { transliterate, toSLP1, type SchemeId } from './translit'

/**
 * Sanskrit dictionary lookups via the Cologne C-SALT REST API
 * (University of Cologne — the canonical digital Sanskrit lexica).
 * CORS is open, so this works directly from the browser with no backend.
 *
 * Docs / Swagger:  https://api.c-salt.uni-koeln.de/dicts/mw/restful
 * Project:         https://cceh.github.io/c-salt_sanskrit_data/
 *
 * Headwords are stored in SLP1, so we transliterate the user's query to SLP1
 * before searching, and convert results back to Devanagari + IAST for display.
 *
 * Two wrinkles this module smooths over:
 *  1. Some common MW headwords (e.g. dharma) are only page-reference stubs;
 *     the real content lives in another dictionary or under an inflected
 *     headword (Apte indexes "dharmaḥ" with the visarga). So we search by
 *     prefix, rank close matches, and fall back across dictionaries.
 *  2. MW inlines its own digit-notation romanization next to the clean form
 *     ("Sanskr2it Sanskrit"); we strip the digit-notation tokens and collapse
 *     duplicates so definitions read cleanly.
 */

const API_BASE = 'https://api.c-salt.uni-koeln.de/dicts'

export interface DictSource {
  id: string
  label: string
  description: string
}

export const DICTIONARIES: DictSource[] = [
  { id: 'mw', label: 'Monier-Williams', description: 'Sanskrit→English, 1899 · 31,821 entries' },
  { id: 'ap90', label: 'Apte', description: 'Practical Sanskrit→English · 31,751 entries' },
  { id: 'bhs', label: 'Edgerton (BHS)', description: 'Buddhist Hybrid Sanskrit · 17,807 entries' },
]

const DICT_LABEL = Object.fromEntries(DICTIONARIES.map((d) => [d.id, d.label]))

export interface DictEntry {
  id: string
  headwordSLP1: string
  devanagari: string
  iast: string
  grammar: string
  definition: string
  senses: string[]
  source: string // dictionary id the entry actually came from
}

interface RawEntry {
  id: string
  xml: string
  headword_slp1: string
}

/** Convert SLP1 fragments embedded in the TEI to IAST so definitions read cleanly. */
function slp1ToIast(s: string): string {
  return transliterate(s, 'slp1', 'iast')
}

// Tags that carry editorial metadata (citation ids, page refs) rather than meaning.
const SKIP_TAGS = new Set(['note', 'bibl', 'idno', 'lbl'])

/**
 * Turn a TEI node into readable text. Sanskrit words tagged with an xml:lang
 * containing "SLP1" are transliterated to IAST; we insert spaces around them so
 * MW's adjacent digit-notation romanization doesn't glue onto the clean form.
 */
function teiToText(node: Node): string {
  let out = ''
  node.childNodes.forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE) {
      out += child.textContent ?? ''
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      const el = child as Element
      const tag = el.tagName.toLowerCase()
      if (SKIP_TAGS.has(tag)) return
      const lang = el.getAttribute('xml:lang') || el.getAttribute('lang') || ''
      if (/SLP1/i.test(lang)) {
        out += ' ' + slp1ToIast(el.textContent ?? '') + ' '
      } else {
        out += teiToText(el)
      }
    }
  })
  return out
}

function cleanText(s: string): string {
  let out = s.replace(/ /g, ' ').replace(/\s+/g, ' ')

  // Drop MW's digit-notation romanization tokens (a letter immediately followed
  // by a digit, e.g. "Sanskr2it", "Kr2ishn2a", "S3iva", "Page380,2"). Ordinals
  // like "20th"/"2nd" have no letter *before* the digit, so they survive.
  out = out
    .split(' ')
    .filter((w) => !/[A-Za-zĀ-ſ]\d/.test(w))
    .join(' ')

  // Collapse immediately-repeated words, case-insensitive ("indra indra" → "indra",
  // "gaṇa gaṇa" → "gaṇa").
  out = out.replace(/\b([\p{L}]+)(\s+)\1\b/giu, '$1')

  return out
    .replace(/\s+([;,.)\]])/g, '$1')
    .replace(/([(\[])\s+/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
}

function parseEntry(raw: RawEntry, source: string): DictEntry {
  const parser = new DOMParser()
  const doc = parser.parseFromString(raw.xml, 'application/xml')
  const entry = doc.documentElement

  const senseEls = Array.from(entry.getElementsByTagName('sense'))
  const grams = Array.from(entry.getElementsByTagName('gram'))
    .filter((g) => (g.getAttribute('ana') || '') === 'lex')
    .map((g) => g.textContent?.trim())
    .filter(Boolean)
  const grammar = Array.from(new Set(grams)).slice(0, 3).join(', ')

  const senses = (senseEls.length ? senseEls.map((s) => teiToText(s)) : [teiToText(entry)])
    .map(cleanText)
    .filter(Boolean)

  const definition = senses.join(' · ')
  const headwordSLP1 = raw.headword_slp1.replace(/[/\\^]/g, '') // strip accent marks

  return {
    id: raw.id,
    headwordSLP1,
    devanagari: transliterate(headwordSLP1, 'slp1', 'devanagari'),
    iast: transliterate(headwordSLP1, 'slp1', 'iast'),
    grammar,
    definition,
    senses,
    source,
  }
}

/* -------------------------------------------------------------------------- */
/*  Search core                                                               */
/* -------------------------------------------------------------------------- */

type QueryType = 'term' | 'prefix'

async function fetchRaw(
  dict: string,
  stem: string,
  queryType: QueryType,
  size: number,
): Promise<RawEntry[]> {
  const url = `${API_BASE}/${dict}/restful/entries?field=headword_slp1&query=${encodeURIComponent(
    stem,
  )}&query_type=${queryType}&size=${size}`
  const res = await fetch(url)
  if (!res.ok) return []
  const json = await res.json()
  return json?.data?.entries ?? []
}

/** True if a definition is essentially just a cross-reference, not a meaning. */
function isCrossRef(def: string): boolean {
  const s = def.trim()
  if (!s) return true
  // "See p. 510, col. 3" — often glued to "Seep." when the ref span has no space.
  if (/^see\b/i.test(s) || /^seep?\.?\s*\d/i.test(s) || /^cf\.|^=/i.test(s)) return true
  if (/^p\.?\s*\d+\s*,?\s*col/i.test(s)) return true
  return s.replace(/[^a-zā-ž]/gi, '').length < 3
}

/** Rank how well a headword matches the searched stem (lower = better). */
function matchScore(headwordSLP1: string, stem: string): number {
  const hw = headwordSLP1.toLowerCase()
  const st = stem.toLowerCase()
  if (hw === st) return 0
  if (hw.startsWith(st)) {
    const extra = hw.slice(st.length)
    // A single grammatical ending (visarga ḥ, anusvāra ṃ, m, n, ā …) is a very
    // close match — "dharmaḥ"/"dharman" for "dharma". Longer tails are unrelated
    // words that merely share a prefix ("dharmaṇa" = a kind of snake).
    if (/^[hmnas]$/i.test(extra)) return 0.5
    return 2 + extra.length * 0.1
  }
  return 100 + Math.abs(hw.length - st.length)
}

const CLOSE_THRESHOLD = 1.5

/**
 * Search one dictionary: exact term first, then prefix + ranking.
 * When `closeOnly`, only exact/grammatically-close headwords are returned, so a
 * dictionary that merely has prefix-neighbours (not the word) reports nothing
 * and the caller can fall back to another lexicon.
 */
async function searchDict(
  dict: string,
  stem: string,
  size: number,
  closeOnly: boolean,
): Promise<DictEntry[]> {
  // 1. Exact term match.
  let entries = (await fetchRaw(dict, stem, 'term', size))
    .map((r) => parseEntry(r, dict))
    .filter((e) => !isCrossRef(e.definition))

  // 2. If nothing substantive, widen to a prefix search and rank close matches.
  if (!entries.length) {
    const raw = await fetchRaw(dict, stem, 'prefix', Math.max(size, 20))
    entries = raw
      .map((r) => parseEntry(r, dict))
      .filter((e) => !isCrossRef(e.definition))
      .filter((e) => e.headwordSLP1.toLowerCase().startsWith(stem.toLowerCase()))
      .sort((a, b) => matchScore(a.headwordSLP1, stem) - matchScore(b.headwordSLP1, stem))
    if (closeOnly) {
      entries = entries.filter((e) => matchScore(e.headwordSLP1, stem) <= CLOSE_THRESHOLD)
    }
  }
  return entries
}

export interface LookupOptions {
  dict?: string
  fromScheme?: SchemeId
  size?: number
}

/**
 * Look up a word. `word` may be Devanagari, IAST, or any roman scheme. Searches
 * the chosen dictionary first, then falls back to the others so common words
 * that are only stubs in one lexicon still resolve.
 */
export async function lookup(word: string, opts: LookupOptions = {}): Promise<DictEntry[]> {
  const { dict = 'mw', size = 25 } = opts
  const trimmed = word.trim()
  if (!trimmed) return []

  const fromScheme: SchemeId = opts.fromScheme ?? guessScheme(trimmed)
  const stem = toSLP1(trimmed, fromScheme).replace(/[^a-zA-Z]/g, '')
  if (!stem) return []

  const order = [dict, ...DICTIONARIES.map((d) => d.id).filter((d) => d !== dict)]

  // Pass 1: require a close (exact or grammatically-inflected) match, trying the
  // chosen dictionary first, then the others. This is what makes "dharma" resolve
  // to Apte's "dharmaḥ" instead of MW's unrelated "dharmaṇa (a kind of snake)".
  for (const d of order) {
    try {
      const entries = await searchDict(d, stem, size, true)
      if (entries.length) return dedupe(entries).slice(0, size)
    } catch {
      /* try next dictionary */
    }
  }

  // Pass 2: nothing matched closely anywhere — return loose prefix suggestions
  // from the chosen dictionary so partial queries still surface something.
  try {
    const loose = await searchDict(dict, stem, size, false)
    if (loose.length) return dedupe(loose).slice(0, size)
  } catch {
    /* nothing */
  }
  return []
}

function dedupe(entries: DictEntry[]): DictEntry[] {
  const seen = new Set<string>()
  return entries.filter((e) => {
    const key = e.headwordSLP1 + '|' + e.definition.slice(0, 40)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

/**
 * Rough heuristic: Devanagari code points → devanagari, diacritics → iast,
 * otherwise OPTITRANS — the most forgiving roman scheme (handles aa/ii/uu/sh
 * the way people naturally type).
 */
export function guessScheme(text: string): SchemeId {
  if (/[ऀ-ॿ]/.test(text)) return 'devanagari'
  if (/[āīūṛṝḷṃḥśṣṭḍṇñṅ]/i.test(text)) return 'iast'
  return 'optitrans'
}

export function dictLabel(id: string): string {
  return DICT_LABEL[id] ?? id
}

/* -------------------------------------------------------------------------- */
/*  Inline short glosses — the parenthetical English shown while typing.       */
/* -------------------------------------------------------------------------- */

export interface WordGloss {
  word: string
  iast: string
  gloss: string
}

const glossCache = new Map<string, string>()

/** Condense a definition into a short parenthetical gloss. */
function shorten(def: string): string {
  if (!def) return ''
  const s = def
    .replace(/\([^)]*\)/g, ' ') // parenthetical notes
    .replace(/\[[^\]]*\]/g, ' ') // Apte etymology in square brackets
    .replace(/\bfr\.\s*/gi, ' ') // "fr." = "from" (etymology)
    .replace(/\s+/g, ' ')
    .trim()
  // Keep a leading part-of-speech marker (requires the dot, so "act" isn't eaten).
  const posMatch = s.match(/^((?:mfn?|mf|m|f|n|ind|cl|a)\.\s*)+/i)
  const rawPos = posMatch ? posMatch[0] : ''
  const pos = rawPos.trim() ? rawPos.trim() + ' ' : ''
  let body = s.slice(rawPos.length)
  // First real sense (stop at a separator or a sense number like "--2" / " 1 ").
  body = body
    .split(/[;·]|--?\d|\s\d\s/)[0]
    .replace(/^[\d.,\s]+/, '')
    .replace(/[,\s]+$/, '')
  const words = body.split(' ').filter(Boolean)
  if (words.length > 9) body = words.slice(0, 9).join(' ') + '…'
  return (pos + body).trim()
}

async function glossOne(word: string, fromScheme: SchemeId): Promise<string> {
  const stem = toSLP1(word, fromScheme).replace(/[^a-zA-Z]/g, '')
  if (!stem) return ''
  const cached = glossCache.get(stem)
  if (cached !== undefined) return cached

  let result = ''
  try {
    // Reuse the full search (term → prefix → cross-dictionary fallback).
    const entries = await lookup(word, { fromScheme, size: 4 })
    const best = entries.map((e) => e.definition).sort((a, b) => b.length - a.length)[0] ?? ''
    result = shorten(best)
  } catch {
    /* offline — leave empty */
  }
  glossCache.set(stem, result)
  return result
}

/**
 * Split a line of Sanskrit into words and fetch a short English gloss for each.
 * Used to show "word (meaning)" inline as you type.
 */
export async function glossPhrase(text: string, fromScheme: SchemeId): Promise<WordGloss[]> {
  const tokens = text
    .trim()
    .split(/[\s।॥,.|]+/)
    .filter((t) => t && /\S/.test(t))
    .slice(0, 10)

  return Promise.all(
    tokens.map(async (tok) => ({
      word: tok,
      iast: transliterate(tok, fromScheme, 'iast'),
      gloss: await glossOne(tok, fromScheme),
    })),
  )
}
