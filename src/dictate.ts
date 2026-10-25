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
    r.onresult = (event) => {
      let draft = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        const text = result[0].transcript
        if (result.isFinal) ears.onHeard(text.trim())
        else draft += text
      }
      ears.onDraft(draft.trim())
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
