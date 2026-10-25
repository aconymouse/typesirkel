import { reach } from './reach'

export type VoiceId = 'anthropic' | 'openai' | 'openrouter' | 'ollama' | 'custom'

export type Voice = {
  id: VoiceId
  label: string
  base: string
  keyed: boolean
}

// Everything except Anthropic speaks the OpenAI chat format, which is why a
// local Ollama or any self-hosted gateway fits in as just another base URL.
export const voices: Voice[] = [
  { id: 'anthropic', label: 'Anthropic', base: 'https://api.anthropic.com/v1', keyed: true },
  { id: 'openai', label: 'OpenAI', base: 'https://api.openai.com/v1', keyed: true },
  { id: 'openrouter', label: 'OpenRouter', base: 'https://openrouter.ai/api/v1', keyed: true },
  { id: 'ollama', label: 'Ollama', base: 'http://localhost:11434/v1', keyed: false },
  { id: 'custom', label: 'Other', base: '', keyed: true },
]

export const voiceOf = (id: VoiceId) => voices.find((v) => v.id === id) ?? voices[0]

export type Tuning = {
  voice: VoiceId
  base: string
  key: string
  model: string
}

export type Turn = { role: 'user' | 'assistant'; content: string }

const trimBase = (base: string) => base.trim().replace(/\/+$/, '')

const headersFor = (t: Tuning): Record<string, string> => {
  if (t.voice === 'anthropic') {
    return {
      'x-api-key': t.key,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    }
  }
  return t.key ? { authorization: `Bearer ${t.key}` } : {}
}

// Providers put the useful part of an error in different places. We look in
// the usual ones and fall back to the status line.
const complain = async (response: Response) => {
  const raw = await response.text().catch(() => '')
  try {
    const body = JSON.parse(raw) as { error?: { message?: string } | string; message?: string }
    const message = typeof body.error === 'string' ? body.error : (body.error?.message ?? body.message)
    if (message) return new Error(message)
  } catch {}
  return new Error(raw.slice(0, 200) || `${response.status} ${response.statusText}`)
}

export const listModels = async (t: Tuning, signal?: AbortSignal): Promise<string[]> => {
  const response = await reach(`${trimBase(t.base)}/models`, { headers: headersFor(t), signal })
  if (!response.ok) throw await complain(response)
  const body = (await response.json()) as { data?: { id: string }[] }
  return (body.data ?? []).map((m) => m.id).sort((a, b) => a.localeCompare(b))
}

// Server-sent events arrive in arbitrary chunks. We keep the unfinished tail
// and only hand out complete `data:` lines.
async function* lines(response: Response) {
  if (!response.body) return
  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader()
  let tail = ''
  while (true) {
    const { value, done } = await reader.read()
    if (done) break
    tail += value
    const parts = tail.split(/\r?\n/)
    tail = parts.pop() ?? ''
    for (const line of parts) if (line.startsWith('data:')) yield line.slice(5).trim()
  }
  if (tail.startsWith('data:')) yield tail.slice(5).trim()
}

export async function* speak(t: Tuning, system: string, turns: Turn[], signal: AbortSignal): AsyncGenerator<string> {
  const anthropic = t.voice === 'anthropic'
  const url = `${trimBase(t.base)}/${anthropic ? 'messages' : 'chat/completions'}`
  const body = anthropic
    ? { model: t.model, max_tokens: 4096, system, messages: turns, stream: true }
    : { model: t.model, messages: [{ role: 'system', content: system }, ...turns], stream: true }

  const response = await reach(url, {
    method: 'POST',
    headers: { ...headersFor(t), 'content-type': 'application/json' },
    body: JSON.stringify(body),
    signal,
  })
  if (!response.ok) throw await complain(response)

  for await (const data of lines(response)) {
    if (!data || data === '[DONE]') continue
    const event = JSON.parse(data) as {
      type?: string
      delta?: { type?: string; text?: string }
      error?: { message?: string }
      choices?: { delta?: { content?: string } }[]
    }
    if (event.type === 'error') throw new Error(event.error?.message ?? 'The model stopped with an error')
    const piece = anthropic ? (event.delta?.type === 'text_delta' ? event.delta.text : undefined) : event.choices?.[0]?.delta?.content
    if (piece) yield piece
  }
}
