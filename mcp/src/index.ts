#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import { Folder, outline } from './folder.js'

const root = process.argv[2] ?? process.env.TYPESIRKEL_FOLDER
if (!root) {
  console.error('Usage: typesirkel-mcp <folder>')
  process.exit(1)
}

const folder = new Folder(root)
const server = new McpServer({ name: 'typesirkel', version: '0.1.0' })

const say = (text: string) => ({ content: [{ type: 'text' as const, text }] })

// Tools return plain text. Models read it well, and it keeps the writer's
// markdown exactly as it sits on disk.

server.registerTool(
  'list_notes',
  {
    title: 'List notes',
    description: 'List every markdown file in the typeSirkel folder, as paths relative to the folder.',
    annotations: { readOnlyHint: true },
  },
  async () => {
    const notes = await folder.list()
    return say(notes.length ? notes.join('\n') : 'The folder has no markdown files yet.')
  },
)

server.registerTool(
  'read_note',
  {
    title: 'Read a note',
    description: 'Read one markdown file from the folder.',
    inputSchema: { path: z.string().describe('Path relative to the folder, for example drafts/essay.md') },
    annotations: { readOnlyHint: true },
  },
  async ({ path }) => say(await folder.read(path)),
)

server.registerTool(
  'outline_note',
  {
    title: 'Outline a note',
    description: 'List the headings of a markdown file with their levels and line numbers.',
    inputSchema: { path: z.string() },
    annotations: { readOnlyHint: true },
  },
  async ({ path }) => {
    const headings = outline(await folder.read(path))
    return say(headings.length ? headings.map((h) => `${'  '.repeat(h.level - 1)}${h.text}  (line ${h.line})`).join('\n') : 'No headings.')
  },
)

server.registerTool(
  'search_notes',
  {
    title: 'Search notes',
    description: 'Find lines containing the given words across every markdown file. Case-insensitive.',
    inputSchema: { query: z.string().min(1), limit: z.number().int().min(1).max(200).default(50) },
    annotations: { readOnlyHint: true },
  },
  async ({ query, limit }) => {
    const needle = query.toLowerCase()
    const hits: string[] = []
    for (const path of await folder.list()) {
      const lines = (await folder.read(path)).split(/\r?\n/)
      lines.forEach((line, i) => {
        if (hits.length < limit && line.toLowerCase().includes(needle)) hits.push(`${path}:${i + 1}: ${line.trim()}`)
      })
      if (hits.length >= limit) break
    }
    return say(hits.length ? hits.join('\n') : `Nothing matches "${query}".`)
  },
)

server.registerTool(
  'write_note',
  {
    title: 'Write a note',
    description: 'Create a markdown file, or replace the whole content of an existing one. typeSirkel picks up the change on its own.',
    inputSchema: { path: z.string(), content: z.string() },
    annotations: { destructiveHint: true },
  },
  async ({ path, content }) => {
    const existed = await folder.exists(path)
    await folder.write(path, content)
    return say(`${existed ? 'Replaced' : 'Created'} ${path}.`)
  },
)

server.registerTool(
  'append_to_note',
  {
    title: 'Append to a note',
    description: 'Add markdown to the end of a file, separated by a blank line. Creates the file if it does not exist.',
    inputSchema: { path: z.string(), content: z.string() },
  },
  async ({ path, content }) => {
    const before = (await folder.exists(path)) ? await folder.read(path) : ''
    const joined = before.trim() ? `${before.replace(/\s+$/, '')}\n\n${content.trim()}\n` : `${content.trim()}\n`
    await folder.write(path, joined)
    return say(`Appended to ${path}.`)
  },
)

await server.connect(new StdioServerTransport())
