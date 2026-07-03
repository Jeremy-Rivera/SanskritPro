/**
 * The Sanskrit alphabet (वर्णमाला), arranged the traditional way — by place of
 * articulation. Each akṣara can be spoken aloud (via the Web Speech API) so you
 * can learn the sounds. Devanagari is the source of truth; IAST is shown as a guide.
 */

export interface Varna {
  deva: string
  iast: string
  note?: string
}

export interface VarnaGroup {
  title: string
  subtitle: string
  varnas: Varna[]
}

export const VARNAMALA: VarnaGroup[] = [
  {
    title: 'Vowels',
    subtitle: 'स्वर · svara',
    varnas: [
      { deva: 'अ', iast: 'a' }, { deva: 'आ', iast: 'ā' }, { deva: 'इ', iast: 'i' },
      { deva: 'ई', iast: 'ī' }, { deva: 'उ', iast: 'u' }, { deva: 'ऊ', iast: 'ū' },
      { deva: 'ऋ', iast: 'ṛ' }, { deva: 'ॠ', iast: 'ṝ' }, { deva: 'ऌ', iast: 'ḷ' },
      { deva: 'ए', iast: 'e' }, { deva: 'ऐ', iast: 'ai' }, { deva: 'ओ', iast: 'o' },
      { deva: 'औ', iast: 'au' },
    ],
  },
  {
    title: 'Anusvāra & Visarga',
    subtitle: 'अयोगवाह',
    varnas: [
      { deva: 'अं', iast: 'aṃ', note: 'anusvāra' },
      { deva: 'अः', iast: 'aḥ', note: 'visarga' },
    ],
  },
  {
    title: 'Gutturals',
    subtitle: 'कण्ठ्य · throat',
    varnas: [
      { deva: 'क', iast: 'ka' }, { deva: 'ख', iast: 'kha' }, { deva: 'ग', iast: 'ga' },
      { deva: 'घ', iast: 'gha' }, { deva: 'ङ', iast: 'ṅa' },
    ],
  },
  {
    title: 'Palatals',
    subtitle: 'तालव्य · palate',
    varnas: [
      { deva: 'च', iast: 'ca' }, { deva: 'छ', iast: 'cha' }, { deva: 'ज', iast: 'ja' },
      { deva: 'झ', iast: 'jha' }, { deva: 'ञ', iast: 'ña' },
    ],
  },
  {
    title: 'Retroflexes',
    subtitle: 'मूर्धन्य · roof',
    varnas: [
      { deva: 'ट', iast: 'ṭa' }, { deva: 'ठ', iast: 'ṭha' }, { deva: 'ड', iast: 'ḍa' },
      { deva: 'ढ', iast: 'ḍha' }, { deva: 'ण', iast: 'ṇa' },
    ],
  },
  {
    title: 'Dentals',
    subtitle: 'दन्त्य · teeth',
    varnas: [
      { deva: 'त', iast: 'ta' }, { deva: 'थ', iast: 'tha' }, { deva: 'द', iast: 'da' },
      { deva: 'ध', iast: 'dha' }, { deva: 'न', iast: 'na' },
    ],
  },
  {
    title: 'Labials',
    subtitle: 'ओष्ठ्य · lips',
    varnas: [
      { deva: 'प', iast: 'pa' }, { deva: 'फ', iast: 'pha' }, { deva: 'ब', iast: 'ba' },
      { deva: 'भ', iast: 'bha' }, { deva: 'म', iast: 'ma' },
    ],
  },
  {
    title: 'Semivowels',
    subtitle: 'अन्तःस्थ',
    varnas: [
      { deva: 'य', iast: 'ya' }, { deva: 'र', iast: 'ra' }, { deva: 'ल', iast: 'la' },
      { deva: 'व', iast: 'va' },
    ],
  },
  {
    title: 'Sibilants & Aspirate',
    subtitle: 'ऊष्म',
    varnas: [
      { deva: 'श', iast: 'śa' }, { deva: 'ष', iast: 'ṣa' }, { deva: 'स', iast: 'sa' },
      { deva: 'ह', iast: 'ha' },
    ],
  },
]
