/** On-screen keyboard layouts for clicking Devanagari and IAST characters. */

export interface KeyDef {
  char: string
  label?: string // small caption shown under the key (e.g. transliteration)
}

export interface KeySection {
  title: string
  keys: KeyDef[]
}

export const DEVANAGARI_SECTIONS: KeySection[] = [
  {
    title: 'Vowels · स्वर',
    keys: [
      { char: 'अ', label: 'a' }, { char: 'आ', label: 'ā' }, { char: 'इ', label: 'i' },
      { char: 'ई', label: 'ī' }, { char: 'उ', label: 'u' }, { char: 'ऊ', label: 'ū' },
      { char: 'ऋ', label: 'ṛ' }, { char: 'ॠ', label: 'ṝ' }, { char: 'ऌ', label: 'ḷ' },
      { char: 'ए', label: 'e' }, { char: 'ऐ', label: 'ai' }, { char: 'ओ', label: 'o' },
      { char: 'औ', label: 'au' },
    ],
  },
  {
    title: 'Vowel signs · मात्रा',
    keys: [
      { char: 'ा', label: 'ā' }, { char: 'ि', label: 'i' }, { char: 'ी', label: 'ī' },
      { char: 'ु', label: 'u' }, { char: 'ू', label: 'ū' }, { char: 'ृ', label: 'ṛ' },
      { char: 'ॄ', label: 'ṝ' }, { char: 'े', label: 'e' }, { char: 'ै', label: 'ai' },
      { char: 'ो', label: 'o' }, { char: 'ौ', label: 'au' }, { char: '्', label: 'virāma' },
    ],
  },
  {
    title: 'Consonants · व्यञ्जन',
    keys: [
      { char: 'क', label: 'ka' }, { char: 'ख', label: 'kha' }, { char: 'ग', label: 'ga' },
      { char: 'घ', label: 'gha' }, { char: 'ङ', label: 'ṅa' },
      { char: 'च', label: 'ca' }, { char: 'छ', label: 'cha' }, { char: 'ज', label: 'ja' },
      { char: 'झ', label: 'jha' }, { char: 'ञ', label: 'ña' },
      { char: 'ट', label: 'ṭa' }, { char: 'ठ', label: 'ṭha' }, { char: 'ड', label: 'ḍa' },
      { char: 'ढ', label: 'ḍha' }, { char: 'ण', label: 'ṇa' },
      { char: 'त', label: 'ta' }, { char: 'थ', label: 'tha' }, { char: 'द', label: 'da' },
      { char: 'ध', label: 'dha' }, { char: 'न', label: 'na' },
      { char: 'प', label: 'pa' }, { char: 'फ', label: 'pha' }, { char: 'ब', label: 'ba' },
      { char: 'भ', label: 'bha' }, { char: 'म', label: 'ma' },
      { char: 'य', label: 'ya' }, { char: 'र', label: 'ra' }, { char: 'ल', label: 'la' },
      { char: 'व', label: 'va' }, { char: 'श', label: 'śa' }, { char: 'ष', label: 'ṣa' },
      { char: 'स', label: 'sa' }, { char: 'ह', label: 'ha' }, { char: 'ळ', label: 'ḷa' },
    ],
  },
  {
    title: 'Marks & digits · चिह्न',
    keys: [
      { char: 'ं', label: 'anusvāra' }, { char: 'ः', label: 'visarga' },
      { char: 'ँ', label: 'candra' }, { char: 'ऽ', label: 'avagraha' },
      { char: 'ॐ', label: 'oṃ' }, { char: '।', label: 'daṇḍa' }, { char: '॥', label: 'double' },
      { char: '०', label: '0' }, { char: '१', label: '1' }, { char: '२', label: '2' },
      { char: '३', label: '3' }, { char: '४', label: '4' }, { char: '५', label: '5' },
      { char: '६', label: '6' }, { char: '७', label: '7' }, { char: '८', label: '8' },
      { char: '९', label: '9' },
    ],
  },
]

export const IAST_SECTIONS: KeySection[] = [
  {
    title: 'Long vowels',
    keys: [
      { char: 'ā' }, { char: 'ī' }, { char: 'ū' }, { char: 'ṝ' }, { char: 'ḹ' },
    ],
  },
  {
    title: 'Vocalic & nasals',
    keys: [
      { char: 'ṛ' }, { char: 'ḷ' }, { char: 'ṃ' }, { char: 'ḥ' }, { char: 'ṅ' }, { char: 'ñ' },
    ],
  },
  {
    title: 'Retroflex & sibilants',
    keys: [
      { char: 'ṭ' }, { char: 'ḍ' }, { char: 'ṇ' }, { char: 'ś' }, { char: 'ṣ' }, { char: 'ḻ' },
    ],
  },
  {
    title: 'Capitals (for names)',
    keys: [
      { char: 'Ā' }, { char: 'Ī' }, { char: 'Ū' }, { char: 'Ṛ' }, { char: 'Ṃ' },
      { char: 'Ḥ' }, { char: 'Ś' }, { char: 'Ṣ' }, { char: 'Ṇ' }, { char: 'Ṭ' }, { char: 'Ḍ' },
    ],
  },
]
