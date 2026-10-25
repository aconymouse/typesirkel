import type { Lang } from './lang'

// Dictation rides on the speech recognition the browser already has: Chrome,
// Edge and Safari ship one. Words arrive as they are heard, and a recognizer
// that stops on a long pause is quietly started again until you say stop.

type Alternative = { transcript: string }
type Result = { isFinal: boolean; 0: Alternative; length: number }
type ResultEvent = { resultIndex: number; results: { length: number; [i: number]: Result } }
type ErrorEvent = { error: string }

type Recognizer = {
  lang: string
  continuous: boolean
  interimResults: boolean
  onresult: ((event: ResultEvent) => void) | null
  onerror: ((event: ErrorEvent) => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
  abort: () => void
}

type RecognizerClass = new () => Recognizer

const recognizerClass = (): RecognizerClass | null => {
  if (typeof window === 'undefined') return null
  const w = window as unknown as { SpeechRecognition?: RecognizerClass; webkitSpeechRecognition?: RecognizerClass }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null
}

export const canDictate = () => recognizerClass() !== null

// The voices people dictate in, starting with the languages the app speaks.
export const voices = [
  { id: 'en-US', name: 'English' },
  { id: 'id-ID', name: 'Bahasa Indonesia' },
  { id: 'pt-BR', name: 'Português (Brasil)' },
  { id: 'ko-KR', name: '한국어' },
  { id: 'th-TH', name: 'ไทย' },
  { id: 'zh-CN', name: '简体中文' },
  { id: 'ms-MY', name: 'Bahasa Melayu' },
  { id: 'ja-JP', name: '日本語' },
  { id: 'es-ES', name: 'Español' },
  { id: 'fr-FR', name: 'Français' },
  { id: 'de-DE', name: 'Deutsch' },
] as const

export type Voice = (typeof voices)[number]['id']

export const voiceFor = (lang: Lang): Voice => ({ en: 'en-US', id: 'id-ID', 'pt-BR': 'pt-BR', ko: 'ko-KR', th: 'th-TH', 'zh-Hans': 'zh-CN' } as const)[lang]

export type Hearing = {
  onHeard: (text: string) => void
  onDraft: (text: string) => void
  onStop: (reason: 'done' | 'blocked' | 'unavailable') => void
}

const keyOf = (text: string) => text.toLowerCase().replace(/[^\p{L}\p{M}\p{N}]/gu, '')

// Chrome on Android hands back the whole run so far with every final result,
// so a long pause-free stretch, like a podcast, would be written again and
// again. Each run remembers what it has already written, compared on letters
// and digits alone, and only the part past that is new. Elsewhere results
// arrive as separate pieces, so a run is only read this way once a final
// clearly repeats a long stretch of what came before it.
const chainsByDefault = () => typeof navigator !== 'undefined' && /android/i.test(navigator.userAgent)

const shared = (a: string, b: string) => {
  let n = 0
  while (n < a.length && n < b.length && a[n] === b[n]) n++
  return n
}

export const unheard = (said: string, text: string, chained: boolean) => {
  const key = keyOf(text)
  if (!key) return { fresh: '', heard: said, chained }
  const overlap = said ? shared(said, key) : 0
  const repeats = overlap === said.length && overlap > 0 && (chained || overlap >= 12)
  const revised = chained && !repeats && overlap > 0
  if (!repeats && !revised) return { fresh: text.trim(), heard: chained ? key : said + key, chained }
  let seen = 0
  let cut = 0
  for (const char of text) {
    const weight = keyOf(char).length
    if (seen === overlap && weight > 0) break
    cut += char.length
    seen += weight
  }
  const midWord = cut > 0 && /\S/.test(text[cut - 1] ?? '') && /[\p{L}\p{N}]/u.test(text[cut] ?? '')
  if (revised || (midWord && /\s/.test(text))) cut = Math.max(0, text.lastIndexOf(' ', cut) + 1)
  return { fresh: text.slice(cut).trim(), heard: key, chained: true }
}

export const listen = (voice: Voice, ears: Hearing) => {
  const Recognizer = recognizerClass()
  if (!Recognizer) {
    ears.onStop('unavailable')
    return () => {}
  }
  let live = true
  let current: Recognizer | null = null

  const begin = () => {
    const r = new Recognizer()
    current = r
    r.lang = voice
    r.continuous = true
    r.interimResults = true
    let said = ''
    let chained = chainsByDefault()
    r.onresult = (event) => {
      let draft = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        const text = result[0].transcript
        if (!result.isFinal) {
          draft += text
          continue
        }
        const next = unheard(said, text, chained)
        said = next.heard
        chained = next.chained
        if (next.fresh) ears.onHeard(next.fresh)
      }
      ears.onDraft(unheard(said, draft, chained).fresh)
    }
    r.onerror = (event) => {
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        live = false
        ears.onStop(event.error === 'not-allowed' ? 'blocked' : 'unavailable')
      } else if (event.error === 'network' || event.error === 'language-not-supported') {
        live = false
        ears.onStop('unavailable')
      }
    }
    r.onend = () => {
      if (live && current === r) begin()
    }
    try {
      r.start()
    } catch {
      live = false
      ears.onStop('unavailable')
    }
  }

  begin()

  return () => {
    live = false
    current?.stop()
    current = null
    ears.onDraft('')
    ears.onStop('done')
  }
}
