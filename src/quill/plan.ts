import { plainName } from '../drawer/types'
import type { Turn } from './voices'

export type Piece = { name: string; title: string; covers: string }

export const planTurns = (brief: string): Turn[] => [
  {
    role: 'user',
    content: [
      'Plan a set of separate markdown files for this brief.',
      'Reply with JSON only, nothing before or after it, in this shape:',
      '{"files":[{"name":"01-short-kebab-case.md","title":"Title","covers":"One or two sentences on what this file covers"}]}',
      'Write titles and descriptions in the language of the brief. Use between 1 and 20 files. Number the names when the order matters.',
      '',
      `<brief>\n${brief}\n</brief>`,
    ].join('\n'),
  },
]

// Models wrap JSON in prose or fences now and then. We take the outermost
// object, keep only well formed entries, and make every name a safe file name.
export const readPlan = (text: string): Piece[] => {
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start < 0 || end <= start) throw new Error('The plan came back in a shape Quill could not read')
  const parsed = JSON.parse(text.slice(start, end + 1)) as { files?: Partial<Piece>[] }
  const pieces = (parsed.files ?? [])
    .filter((f) => typeof f.title === 'string' && f.title.trim())
    .slice(0, 20)
    .map((f, i) => ({
      name: plainName(typeof f.name === 'string' && f.name.trim() ? f.name : `${String(i + 1).padStart(2, '0')}-${f.title}`),
      title: String(f.title).trim(),
      covers: typeof f.covers === 'string' ? f.covers.trim() : '',
    }))
  if (!pieces.length) throw new Error('The plan was empty')
  return pieces
}

export const pieceTurns = (brief: string, pieces: Piece[], piece: Piece): Turn[] => [
  {
    role: 'user',
    content: [
      'Write the complete markdown document for one file in a series. Start with a level one heading using its title.',
      'Return only the document.',
      '',
      `<brief>\n${brief}\n</brief>`,
      '',
      `<series>\n${pieces.map((p) => `- ${p.name}: ${p.title}${p.covers ? ` (${p.covers})` : ''}`).join('\n')}\n</series>`,
      '',
      `<this-file>\n${piece.name}: ${piece.title}\n${piece.covers}\n</this-file>`,
    ].join('\n'),
  },
]
