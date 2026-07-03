/**
 * A curated, always-offline glossary of essential Sanskrit terms — the kind
 * you meet early and often in study of yoga, philosophy and the texts.
 * For exhaustive lookups, the Dictionary tab queries the full Monier-Williams.
 */

export interface GlossaryTerm {
  deva: string
  iast: string
  meaning: string
  category: 'Philosophy' | 'Yoga' | 'Practice' | 'Grammar' | 'Devotion' | 'Cosmos'
}

export const GLOSSARY: GlossaryTerm[] = [
  { deva: 'धर्म', iast: 'dharma', category: 'Philosophy', meaning: 'Cosmic order; duty, righteousness, the law that upholds existence.' },
  { deva: 'कर्म', iast: 'karma', category: 'Philosophy', meaning: 'Action, and the chain of cause and effect it sets in motion.' },
  { deva: 'योग', iast: 'yoga', category: 'Yoga', meaning: 'Union; the discipline of yoking body, mind and self.' },
  { deva: 'आत्मन्', iast: 'ātman', category: 'Philosophy', meaning: 'The self; the innermost essence of a being.' },
  { deva: 'ब्रह्मन्', iast: 'brahman', category: 'Philosophy', meaning: 'The absolute; the ground of all reality.' },
  { deva: 'मोक्ष', iast: 'mokṣa', category: 'Philosophy', meaning: 'Liberation; release from the cycle of rebirth.' },
  { deva: 'संसार', iast: 'saṃsāra', category: 'Philosophy', meaning: 'The wheel of birth, death and rebirth.' },
  { deva: 'माया', iast: 'māyā', category: 'Philosophy', meaning: 'Illusion; the appearance that veils the real.' },
  { deva: 'गुरु', iast: 'guru', category: 'Devotion', meaning: 'Teacher; one who dispels darkness (gu) with light (ru).' },
  { deva: 'मन्त्र', iast: 'mantra', category: 'Practice', meaning: 'A sacred sound or formula; an instrument of the mind.' },
  { deva: 'ॐ', iast: 'oṃ', category: 'Practice', meaning: 'The primordial syllable; the sound of the absolute.' },
  { deva: 'प्राण', iast: 'prāṇa', category: 'Yoga', meaning: 'Life-force; the vital breath animating the body.' },
  { deva: 'चक्र', iast: 'cakra', category: 'Yoga', meaning: 'Wheel; a centre of subtle energy along the spine.' },
  { deva: 'आसन', iast: 'āsana', category: 'Yoga', meaning: 'Seat, posture; the third limb of aṣṭāṅga yoga.' },
  { deva: 'ध्यान', iast: 'dhyāna', category: 'Yoga', meaning: 'Meditation; sustained, effortless absorption.' },
  { deva: 'समाधि', iast: 'samādhi', category: 'Yoga', meaning: 'Absorption; the union of meditator and object.' },
  { deva: 'शान्ति', iast: 'śānti', category: 'Devotion', meaning: 'Peace; often chanted three times to still the mind.' },
  { deva: 'सत्य', iast: 'satya', category: 'Philosophy', meaning: 'Truth; that which is real and unchanging.' },
  { deva: 'अहिंसा', iast: 'ahiṃsā', category: 'Practice', meaning: 'Non-violence; harmlessness in thought, word and deed.' },
  { deva: 'भक्ति', iast: 'bhakti', category: 'Devotion', meaning: 'Loving devotion to the divine.' },
  { deva: 'ज्ञान', iast: 'jñāna', category: 'Philosophy', meaning: 'Knowledge; the wisdom that liberates.' },
  { deva: 'गुण', iast: 'guṇa', category: 'Philosophy', meaning: 'Quality; the three strands (sattva, rajas, tamas) of nature.' },
  { deva: 'सत्त्व', iast: 'sattva', category: 'Philosophy', meaning: 'Purity, clarity, harmony — the luminous guṇa.' },
  { deva: 'रजस्', iast: 'rajas', category: 'Philosophy', meaning: 'Activity, passion, restlessness — the dynamic guṇa.' },
  { deva: 'तमस्', iast: 'tamas', category: 'Philosophy', meaning: 'Inertia, darkness, dullness — the heavy guṇa.' },
  { deva: 'शक्ति', iast: 'śakti', category: 'Cosmos', meaning: 'Power, energy; the creative feminine force.' },
  { deva: 'देव', iast: 'deva', category: 'Cosmos', meaning: 'A shining one; a god or celestial being.' },
  { deva: 'ऋषि', iast: 'ṛṣi', category: 'Cosmos', meaning: 'Seer; a sage who perceives the sacred hymns.' },
  { deva: 'वेद', iast: 'veda', category: 'Cosmos', meaning: 'Knowledge; the oldest layer of sacred texts.' },
  { deva: 'सूत्र', iast: 'sūtra', category: 'Grammar', meaning: 'Thread; a terse aphorism, the basic unit of a treatise.' },
  { deva: 'श्लोक', iast: 'śloka', category: 'Grammar', meaning: 'A verse, classically of 32 syllables in two lines.' },
  { deva: 'संधि', iast: 'sandhi', category: 'Grammar', meaning: 'Junction; the euphonic changes where sounds meet.' },
  { deva: 'धातु', iast: 'dhātu', category: 'Grammar', meaning: 'Verbal root; the seed from which words grow.' },
  { deva: 'नमस्', iast: 'namas', category: 'Devotion', meaning: 'Bow, reverence; "not-mine", the salutation of humility.' },
  { deva: 'गुरुदेव', iast: 'gurudeva', category: 'Devotion', meaning: 'Revered teacher addressed as divine.' },
  { deva: 'पुरुष', iast: 'puruṣa', category: 'Philosophy', meaning: 'Spirit, consciousness; the witnessing self.' },
  { deva: 'प्रकृति', iast: 'prakṛti', category: 'Philosophy', meaning: 'Nature, primordial matter; the field of change.' },
  { deva: 'विद्या', iast: 'vidyā', category: 'Philosophy', meaning: 'Knowledge, learning; higher spiritual insight.' },
  { deva: 'अविद्या', iast: 'avidyā', category: 'Philosophy', meaning: 'Ignorance; the root misperception of reality.' },
  { deva: 'तपस्', iast: 'tapas', category: 'Practice', meaning: 'Heat, austerity; disciplined spiritual effort.' },
  { deva: 'सेवा', iast: 'sevā', category: 'Practice', meaning: 'Selfless service offered without expectation.' },
  { deva: 'आनन्द', iast: 'ānanda', category: 'Philosophy', meaning: 'Bliss; the joy intrinsic to pure being.' },
  { deva: 'चित्त', iast: 'citta', category: 'Yoga', meaning: 'Mind-stuff; the field of mental activity yoga stills.' },
  { deva: 'बुद्धि', iast: 'buddhi', category: 'Philosophy', meaning: 'Intellect; the faculty of discernment.' },
  { deva: 'अहंकार', iast: 'ahaṃkāra', category: 'Philosophy', meaning: 'Ego; the "I-maker" that claims experience as its own.' },
]

export const GLOSSARY_CATEGORIES = Array.from(
  new Set(GLOSSARY.map((t) => t.category)),
).sort()
