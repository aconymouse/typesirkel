import { welcome } from '../tour'
import { type Drawer, type Leaf, plainName } from './types'

const key = 'typesirkel:scratch'

// Scratch is a notebook for things that have no folder yet. Notes live in the
// app's own storage, kept as plain markdown text under their file names.
const notesKey = 'typesirkel:scratch-notes'

type Notes = Record<string, string>

const first = 'First note.md'

// Earlier versions called the starting note scratch.md, which said nothing to
// someone opening the app for the first time.
const renamed = (stored: Notes): Notes => {
  if (!('scratch.md' in stored) || first in stored) return stored
  const { 'scratch.md': body, ...rest } = stored
  return { [first]: body, ...rest }
}

let fresh = false

const readNotes = (): Notes => {
  try {
    const stored = localStorage.getItem(notesKey)
    if (stored) return renamed(JSON.parse(stored) as Notes)
    const older = localStorage.getItem(key)
    fresh = older === null
    return { [first]: older ?? welcome }
  } catch {
    return { [first]: welcome }
  }
}

let notes: Notes | null = null

const keep = () => {
  try {
    localStorage.setItem(notesKey, JSON.stringify(notes))
    localStorage.removeItem(key)
  } catch {
    // Private windows refuse storage. The notes still live in memory.
  }
}

const book = () => (notes ??= readNotes())

// True on a first visit, before anything has been written. The welcome tour
// only plays then.
export const firstVisit = () => {
  book()
  return fresh
}

const leafOf = (name: string): Leaf => ({ path: name, name, dir: '' })

export const scratchDrawer = (): Drawer => ({
  kind: 'scratch',
  label: 'Scratch',
  async list() {
    return Object.keys(book())
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
      .map(leafOf)
  },
  async read(path) {
    return book()[path] ?? ''
  },
  async write(path, text) {
    book()[path] = text
    keep()
  },
  async create(name) {
    const all = book()
    const wanted = plainName(name)
    const dot = wanted.lastIndexOf('.')
    let fileName = wanted
    for (let n = 2; fileName in all; n++) fileName = `${wanted.slice(0, dot)}-${n}${wanted.slice(dot)}`
    all[fileName] = ''
    keep()
    return leafOf(fileName)
  },
})
