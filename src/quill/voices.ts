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

// Long articles need room. Every current model accepts at least this much output.
const longest = 8192

export async function* speak(t: Tuning, system: string, turns: Turn[], signal: AbortSignal): AsyncGenerator<string> {
  const anthropic = t.voice === 'anthropic'
  const url = `${trimBase(t.base)}/${anthropic ? 'messages' : 'chat/completions'}`
  const body = anthropic
    ? { model: t.model, max_tokens: longest, system, messages: turns, stream: true }
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

export type Tool = {
  name: string
  description: string
  schema: Record<string, unknown>
  run: (input: Record<string, unknown>) => Promise<string>
}

export type Happening = { kind: 'text'; text: string } | { kind: 'tool'; name: string; input: Record<string, unknown>; result: string; failed: boolean }

type Call = { id: string; name: string; json: string }

const parseInput = (json: string) => {
  try {
    return (json.trim() ? JSON.parse(json) : {}) as Record<string, unknown>
  } catch {
    return {}
  }
}

const runCalls = async (calls: Call[], tools: Tool[], onEvent: (e: Happening) => void) => {
  const out: { id: string; result: string; failed: boolean }[] = []
  for (const call of calls) {
    const input = parseInput(call.json)
    const tool = tools.find((t) => t.name === call.name)
    let result: string
    let failed = false
    try {
      if (!tool) throw new Error(`No tool called ${call.name}`)
      result = await tool.run(input)
    } catch (error) {
      failed = true
      result = error instanceof Error ? error.message : String(error)
    }
    onEvent({ kind: 'tool', name: call.name, input, result, failed })
    out.push({ id: call.id, result, failed })
  }
  return out
}

// One answer that may take several rounds: the model writes, asks for tools,
// reads their results, and carries on until it has nothing left to call.
export const converse = async (t: Tuning, system: string, turns: Turn[], tools: Tool[], signal: AbortSignal, onEvent: (e: Happening) => void) => {
  const anthropic = t.voice === 'anthropic'
  const url = `${trimBase(t.base)}/${anthropic ? 'messages' : 'chat/completions'}`
  const messages: unknown[] = anthropic ? [...turns] : [{ role: 'system', content: system }, ...turns]
  let offered = tools
  let said = ''

  for (let round = 0; round < 16; round++) {
    const body = anthropic
      ? { model: t.model, max_tokens: longest, system, messages, stream: true, ...(offered.length ? { tools: offered.map((x) => ({ name: x.name, description: x.description, input_schema: x.schema })) } : {}) }
      : { model: t.model, messages, stream: true, ...(offered.length ? { tools: offered.map((x) => ({ type: 'function', function: { name: x.name, description: x.description, parameters: x.schema } })) } : {}) }

    const response = await reach(url, { method: 'POST', headers: { ...headersFor(t), 'content-type': 'application/json' }, body: JSON.stringify(body), signal })
    if (!response.ok) {
      // Some local models refuse tools outright. They still get to answer, just without them.
      if (offered.length && response.status === 400 && round === 0) {
        offered = []
        round--
        continue
      }
      throw await complain(response)
    }

    let text = ''
    const calls: Call[] = []
    const byIndex = new Map<number, Call>()

    for await (const data of lines(response)) {
      if (!data || data === '[DONE]') continue
      const event = JSON.parse(data) as {
        type?: string
        index?: number
        content_block?: { type?: string; id?: string; name?: string }
        delta?: { type?: string; text?: string; partial_json?: string }
        error?: { message?: string }
        choices?: { delta?: { content?: string; tool_calls?: { index: number; id?: string; function?: { name?: string; arguments?: string } }[] } }[]
      }
      if (event.type === 'error') throw new Error(event.error?.message ?? 'The model stopped with an error')
      if (anthropic) {
        if (event.type === 'content_block_start' && event.content_block?.type === 'tool_use') {
          const call = { id: event.content_block.id ?? '', name: event.content_block.name ?? '', json: '' }
          byIndex.set(event.index ?? 0, call)
          calls.push(call)
        } else if (event.type === 'content_block_delta' && event.delta?.type === 'text_delta' && event.delta.text) {
          text += event.delta.text
          onEvent({ kind: 'text', text: event.delta.text })
        } else if (event.type === 'content_block_delta' && event.delta?.type === 'input_json_delta') {
          const call = byIndex.get(event.index ?? 0)
          if (call) call.json += event.delta.partial_json ?? ''
        }
      } else {
        const delta = event.choices?.[0]?.delta
        if (delta?.content) {
          text += delta.content
          onEvent({ kind: 'text', text: delta.content })
        }
        for (const piece of delta?.tool_calls ?? []) {
          let call = byIndex.get(piece.index)
          if (!call) {
            call = { id: piece.id ?? `call_${piece.index}`, name: '', json: '' }
            byIndex.set(piece.index, call)
            calls.push(call)
          }
          if (piece.id) call.id = piece.id
          if (piece.function?.name) call.name += piece.function.name
          if (piece.function?.arguments) call.json += piece.function.arguments
        }
      }
    }

    said += text
    if (!calls.length) return said

    if (anthropic) {
      messages.push({
        role: 'assistant',
        content: [...(text ? [{ type: 'text', text }] : []), ...calls.map((c) => ({ type: 'tool_use', id: c.id, name: c.name, input: parseInput(c.json) }))],
      })
      const results = await runCalls(calls, offered, onEvent)
      messages.push({ role: 'user', content: results.map((r) => ({ type: 'tool_result', tool_use_id: r.id, content: r.result, is_error: r.failed })) })
    } else {
      messages.push({ role: 'assistant', content: text || null, tool_calls: calls.map((c) => ({ id: c.id, type: 'function', function: { name: c.name, arguments: c.json || '{}' } })) })
      for (const r of await runCalls(calls, offered, onEvent)) messages.push({ role: 'tool', tool_call_id: r.id, content: r.result })
    }
    if (text) said += '\n\n'
  }
  return said
}
