declare module '@indic-transliteration/sanscript' {
  interface Sanscript {
    t(data: string, from: string, to: string, options?: Record<string, unknown>): string
    transliterate(data: string, from: string, to: string, options?: Record<string, unknown>): string
    schemes: Record<string, unknown>
  }
  const Sanscript: Sanscript
  export default Sanscript
}
