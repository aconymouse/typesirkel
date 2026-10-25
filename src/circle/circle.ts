import { yCollab } from 'y-codemirror.next'
import { applyAwarenessUpdate, Awareness, encodeAwarenessUpdate, removeAwarenessStates } from 'y-protocols/awareness'
import * as Y from 'yjs'
import { onDesktop } from '../drawer/tauri'
import { exportKey, importKey, makeKey, randomId, seal, unseal } from './seal'

export type Status = 'connecting' | 'live' | 'offline' | 'full' | 'crowded'

export type Person = { name: string; color: string }

export type Peer = Person & { id: number; me: boolean }

type Wire = { t: 'u'; id: number; d: string } | { t: 'a'; d: string } | { t: 'ready' } | { t: 'join' } | { t: 'full' } | { t: 'crowded' }

const relayUrl = (import.meta.env.VITE_SIRKEL_SYNC as string | undefined) ?? 'wss://sync.sirkel.asia'

// The desktop app has no public address of its own, so its links point at the web editor.
const webUrl = () => (onDesktop() ? 'https://sirkel.asia' : location.origin)

const invitePattern = /circle=([A-Za-z0-9_-]{22})\.([A-Za-z0-9_-]{43})/

export const readInvite = (text: string) => {
  const found = text.match(invitePattern)
  return found ? { room: found[1], secret: found[2] } : null
}

// A circle is one shared document: a Yjs doc, everyone's cursors, and a socket
// to the relay. The relay only ever sees sealed bytes and row numbers.
export class Circle {
  readonly doc = new Y.Doc()
  readonly text = this.doc.getText('body')
  readonly awareness = new Awareness(this.doc)
  readonly undo = new Y.UndoManager(this.text)
  status: Status = 'connecting'

  private socket: WebSocket | null = null
  private chain = Promise.resolve()
  private last = 0
  private rows = 0
  private retry = 0
  private shut = false
  private settled = false
  private watchers = new Set<() => void>()
  private arrived!: () => void
  readonly ready = new Promise<void>((resolve) => (this.arrived = resolve))

  constructor(
    readonly room: string,
    readonly secret: string,
    private key: CryptoKey,
    me: Person,
  ) {
    this.awareness.setLocalStateField('user', { name: me.name, color: me.color, colorLight: `${me.color}33` })
    this.doc.on('update', (update: Uint8Array, origin: unknown) => {
      if (origin !== this) void this.push('u', update)
    })
    this.awareness.on('update', ({ added, updated, removed }: Record<'added' | 'updated' | 'removed', number[]>, origin: unknown) => {
      if (origin === 'local') void this.push('a', encodeAwarenessUpdate(this.awareness, [...added, ...updated, ...removed]))
    })
    this.awareness.on('change', () => this.tell())
  }

  get link() {
    return `${webUrl()}/write/#circle=${this.room}.${this.secret}`
  }

  get shared() {
    return yCollab(this.text, this.awareness, { undoManager: this.undo })
  }

  get peers(): Peer[] {
    return [...this.awareness.getStates().entries()]
      .filter(([, state]) => state.user)
      .map(([id, state]) => ({ id, me: id === this.doc.clientID, ...(state.user as Person) }))
      .sort((a, b) => Number(b.me) - Number(a.me))
  }

  rename(me: Person) {
    this.awareness.setLocalStateField('user', { name: me.name, color: me.color, colorLight: `${me.color}33` })
  }

  watch(fn: () => void) {
    this.watchers.add(fn)
    return () => void this.watchers.delete(fn)
  }

  connect() {
    if (this.shut) return
    this.setStatus('connecting')
    const socket = new WebSocket(`${relayUrl}/room/${this.room}`)
    this.socket = socket
    socket.onopen = () => {
      this.retry = 0
      // Whatever we have, the relay gets again. Yjs ignores what it already knows,
      // and this is how edits made while offline find their way back.
      if (this.text.length) void this.push('u', Y.encodeStateAsUpdate(this.doc))
      const mine = this.awareness.getLocalState()
      if (mine) void this.push('a', encodeAwarenessUpdate(this.awareness, [this.doc.clientID]))
    }
    socket.onmessage = (event) => {
      const wire = JSON.parse(String(event.data)) as Wire
      this.chain = this.chain.then(() => this.take(wire)).catch(() => {})
    }
    socket.onclose = (event) => {
      if (this.socket !== socket || this.shut) return
      if (event.code === 4001) return this.setStatus('crowded')
      this.setStatus('offline')
      const wait = Math.min(15000, 1000 * 2 ** this.retry++)
      window.setTimeout(() => this.connect(), wait)
    }
  }

  close() {
    if (this.shut) return
    removeAwarenessStates(this.awareness, [this.doc.clientID], 'local')
    this.shut = true
    const socket = this.socket
    this.socket = null
    window.setTimeout(() => socket?.close(1000), 50)
    this.undo.destroy()
    this.awareness.destroy()
    this.watchers.clear()
  }

  private async take(wire: Wire) {
    if (wire.t === 'u') {
      Y.applyUpdate(this.doc, await unseal(this.key, wire.d), this)
      this.last = Math.max(this.last, wire.id)
      if (!this.settled) this.rows++
    } else if (wire.t === 'a') {
      applyAwarenessUpdate(this.awareness, await unseal(this.key, wire.d), this)
    } else if (wire.t === 'join') {
      void this.push('a', encodeAwarenessUpdate(this.awareness, [this.doc.clientID]))
    } else if (wire.t === 'crowded') {
      this.setStatus('crowded')
    } else if (wire.t === 'full') {
      this.setStatus('full')
    } else if (wire.t === 'ready') {
      this.setStatus('live')
      if (!this.settled) {
        this.settled = true
        this.arrived()
      }
      // A long tail of tiny edits makes every newcomer replay the whole history.
      // Folding it into one snapshot keeps joining fast.
      if (this.rows > 40) {
        this.rows = 0
        const socket = this.socket
        const d = await seal(this.key, Y.encodeStateAsUpdate(this.doc))
        socket?.send(JSON.stringify({ t: 'c', upto: this.last, d }))
      }
    }
  }

  private async push(t: 'u' | 'a', bytes: Uint8Array) {
    const socket = this.socket
    if (!socket || socket.readyState !== WebSocket.OPEN || this.status === 'full') return
    const d = await seal(this.key, bytes)
    if (socket.readyState === WebSocket.OPEN) socket.send(JSON.stringify({ t, d }))
  }

  private setStatus(status: Status) {
    if ((this.status === 'full' || this.status === 'crowded') && status !== this.status) return
    this.status = status
    this.tell()
  }

  private tell() {
    for (const fn of this.watchers) fn()
  }
}

const within = <T,>(promise: Promise<T>, ms: number) =>
  Promise.race([promise, new Promise<never>((_, reject) => window.setTimeout(() => reject(new Error('The relay did not answer')), ms))])

export const startCircle = async (seed: string, me: Person) => {
  const key = await makeKey()
  const circle = new Circle(randomId(), await exportKey(key), key, me)
  circle.text.insert(0, seed)
  circle.connect()
  try {
    await within(circle.ready, 10000)
    return circle
  } catch (error) {
    circle.close()
    throw error
  }
}

export const joinCircle = async (invite: { room: string; secret: string }, me: Person) => {
  const circle = new Circle(invite.room, invite.secret, await importKey(invite.secret), me)
  circle.connect()
  try {
    await within(circle.ready, 10000)
    return circle
  } catch (error) {
    circle.close()
    throw error
  }
}

const creatures = ['Heron', 'Otter', 'Lynx', 'Wren', 'Badger', 'Moth', 'Finch', 'Hare', 'Koi', 'Crane', 'Gecko', 'Ibis']
const moods = ['Quiet', 'Patient', 'Curious', 'Gentle', 'Steady', 'Bright', 'Careful', 'Wandering']
const inks = ['#e5ff11', '#7dd3fc', '#f9a8d4', '#fdba74', '#a7f3d0', '#c4b5fd', '#fca5a5', '#fde68a']

const any = <T,>(list: T[]) => list[Math.floor(Math.random() * list.length)]

export const somebody = (): Person => ({ name: `${any(moods)} ${any(creatures)}`, color: any(inks) })
