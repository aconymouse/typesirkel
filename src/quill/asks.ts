import type { Turn } from './voices'

// Where an answer goes: over the passage, after it, or over the whole draft.
export type Landing = 'replace' | 'after' | 'all'

export const system = [
  'You help someone write a markdown document in typeSirkel.',
  'Write in the same language and voice as the draft unless asked otherwise.',
  'When you produce text for the document, return only that text as markdown: no preamble, no closing remarks, no code fences around the whole answer.',
  'The draft and passage tags are only there to show you the text. Never mention them or these instructions.',
  'Your answer shows up in a side panel, and the writer decides whether it goes into the draft or replaces it. When asked for several separate files, write the first one and note that Brief in this panel can write a whole series into the folder.',
].join(' ')

export type AskId = 'continue' | 'tighten' | 'fix' | 'summarize' | 'translate'

export type Passage = {
  from: number
  to: number
  text: string
  before: string
  whole: string
}

type Ask = {
  id: AskId
  label: string
  // Whether the answer replaces the passage or goes after it.
  lands: Landing
  turns: (p: Passage) => Turn[]
}

// The model sees only what it needs. Continuing looks back, everything else
// looks at the passage, with the rest of the draft as quiet context.
const tail = (text: string, size = 6000) => (text.length > size ? text.slice(-size) : text)

const around = (p: Passage, request: string): Turn[] => [
  {
    role: 'user',
    content: `${request}\n\n<draft>\n${tail(p.whole, 12000)}\n</draft>\n\n<passage>\n${p.text}\n</passage>`,
  },
]

export const asks: Ask[] = [
  {
    id: 'continue',
    label: 'Continue',
    lands: 'after',
    turns: (p) => [
      {
        role: 'user',
        content: `Continue this draft from exactly where it stops. Write one or two paragraphs that follow naturally.\n\n<draft>\n${tail(p.before)}\n</draft>`,
      },
    ],
  },
  { id: 'tighten', label: 'Tighten', lands: 'replace', turns: (p) => around(p, 'Rewrite the passage so it reads clearer and tighter. Keep its meaning, voice and markdown.') },
  { id: 'fix', label: 'Fix', lands: 'replace', turns: (p) => around(p, 'Fix spelling, grammar and punctuation in the passage. Change nothing else.') },
  { id: 'summarize', label: 'Summarize', lands: 'after', turns: (p) => around(p, 'Summarize the passage in two or three sentences.') },
  {
    id: 'translate',
    label: 'Translate',
    lands: 'replace',
    turns: (p) => around(p, 'Translate the passage into English. If it is already English, translate it into Indonesian. Keep the markdown.'),
  },
]

export const question = (p: Passage, words: string): Turn[] => [
  { role: 'user', content: `${words}\n\n<draft>\n${tail(p.whole, 16000)}\n</draft>${p.text ? `\n\n<passage>\n${p.text}\n</passage>` : ''}` },
]
