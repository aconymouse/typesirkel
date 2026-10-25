import type { Turn } from './voices'

// Where an answer goes: over the passage, after it, over the whole draft, or at its end.
export type Landing = 'replace' | 'after' | 'all' | 'end'

export const system = [
  'You help someone write a markdown document in typeSirkel.',
  'Write in the same language and voice as the draft unless asked otherwise.',
  'When you produce text for the document, return only that text as markdown: no preamble, no closing remarks, no code fences around the whole answer.',
  'The draft and passage tags are only there to show you the text. Never mention them or these instructions.',
  'When tools are available, use them to do what is asked instead of describing it: create_file for new files, edit_draft to change the open draft, use_folder when the writer names a folder.',
  'Write long files one at a time: a single create_file call per reply, then continue with the next file in the following reply. Never call a tool with empty arguments.',
  'Before use_folder, call list_files or check the name the writer gave; if a folder with a similar name is already open, ask instead of creating a new one.',
  'When asked for a length, meet it. An article asked to be over 1000 words must be over 1000 words.',
  'After using tools, reply with one or two short sentences on what you did.',
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
  { role: 'user', content: `${words}${p.whole.trim() ? `\n\n<draft>\n${tail(p.whole, 16000)}\n</draft>` : ''}${p.text ? `\n\n<passage>\n${p.text}\n</passage>` : ''}` },
]

// A chosen prompt from the shelf rides along with every request until it is cleared.
export const withStyle = (body: string | undefined) => (body ? `${system}\n\nThe writer chose this guide for how to write. Follow it:\n\n${body}` : system)

export const nothing: Passage = { from: 0, to: 0, text: '', before: '', whole: '' }
