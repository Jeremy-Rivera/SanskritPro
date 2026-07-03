# Sanskrit Pro · ॐ

A modern, self-contained web app for learning and working with **Sanskrit** — type fast without
fighting diacritics, transliterate Devanagari in every direction, look words up in the great
lexica, browse a glossary, and hear the sounds. Runs entirely in your browser and deploys locally.

<br>

## What's inside

| Tab | What it does |
| --- | --- |
| **Type** | Type Sanskrit fast in a simple romanization (OPTITRANS/ITRANS/HK/SLP1/IAST) and get correct **Devanagari + IAST diacritics** live. No diacritic-hunting. |
| **Convert** | Full transliteration between Devanagari and every major romanization (IAST, ITRANS, Harvard-Kyoto, SLP1, Velthuis, WX…), with auto-detection and one-click swap. |
| **Keyboard** | A clickable on-screen keyboard — complete Devanagari (vowels, signs, consonants, marks) plus an IAST diacritics palette. |
| **Dictionary** | Live lookups in **Monier-Williams**, **Apte**, and **Edgerton** via the Cologne Digital Sanskrit Lexicon. Search in Devanagari, IAST, or plain roman. |
| **Glossary** | ~45 essential terms of Sanskrit thought and practice — always offline, filterable, searchable. |
| **Sounds** | The **varṇamālā** (alphabet) arranged by place of articulation. Click any letter to hear it. |

Every Devanagari result has a 🔊 button to hear it and a ⧉ button to copy it.

<br>

## Running locally

Requires [Node.js](https://nodejs.org/) 18+.

```bash
cd sanskrit-pro
npm install
npm run dev          # → http://localhost:5173  (opens automatically)
```

To build a static, production bundle you can host anywhere:

```bash
npm run build        # outputs to dist/
npm run preview      # serve the built bundle locally
```

<br>

## How it works & credits

- **Transliteration** is done client-side by [**Sanscript.js**](https://github.com/indic-transliteration/sanscript.js) — the JavaScript twin of the `indic_transliteration` engine. No network needed.
- **Dictionaries** are queried from the [**Cologne Digital Sanskrit Lexicon**](https://cceh.github.io/c-salt_sanskrit_data/) (C-SALT REST API, University of Cologne). Headwords are stored in SLP1, so the app transliterates your query to SLP1 and converts results back to Devanagari + IAST. CORS is open, so it works straight from the browser.
- **Audio** uses a **hosted cloud voice** (Google Translate's TTS, Hindi — Sanskrit shares the Devanagari script) played through an `<audio>` element, so the voice sounds the **same on every machine** and needs no API key. If the network is unavailable it falls back to the browser's built-in speech engine.
- The **inline "meaning in parentheses"** while typing, and the **Dictionary** tab, both draw on Monier-Williams + Apte — the very dictionaries [learnsanskrit.cc](https://www.learnsanskrit.cc/) is built on. (learnsanskrit.cc itself has no public CORS/JSON API, so the app uses Cologne's official API for the same data.)

Focused on Sanskrit only — no other Indic languages.

## Tech

Vite · React · TypeScript · hand-written CSS design system. No backend, no build-time API keys.
