import { DurableObject } from 'cloudflare:workers'

// The relay is deliberately dull. Every message is sealed in the browser with a
// key the relay never receives, so all it can do is keep rows in order, hand
// them to whoever joins, and pass new ones along.

const roomPattern = /^\/room\/([A-Za-z0-9_-]{22})$/

const origins = new Set([
  'https://sirkel.asia',
  'https://www.sirkel.asia',
  'tauri://localhost',
  'http://tauri.localhost',
  'http://localhost:1420',
  'http://localhost:4300',
])

// Big enough for a long book chapter, small enough that nobody turns a room into storage.
const largestMessage = 512 * 1024
const largestRoom = 16 * 1024 * 1024
const forgetAfter = 30 * 24 * 60 * 60 * 1000

type Incoming = { t: 'u'; d: string } | { t: 'a'; d: string } | { t: 'c'; upto: number; d: string }

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const room = url.pathname.match(roomPattern)?.[1]
    if (!room) return new Response('typeSirkel relay', { status: url.pathname === '/' ? 200 : 404 })
    if (request.headers.get('upgrade') !== 'websocket') return new Response('Expected a WebSocket', { status: 426 })
    if (!origins.has(request.headers.get('origin') ?? '')) return new Response('Unknown origin', { status: 403 })
    return env.ROOMS.get(env.ROOMS.idFromName(room)).fetch(request)
  },
} satisfies ExportedHandler<Env>

export class Room extends DurableObject<Env> {
  private sql: SqlStorage

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env)
    this.sql = ctx.storage.sql
    this.sql.exec('CREATE TABLE IF NOT EXISTS rows (id INTEGER PRIMARY KEY AUTOINCREMENT, data TEXT NOT NULL)')
  }

  async fetch() {
    const { 0: client, 1: server } = new WebSocketPair()
    this.ctx.acceptWebSocket(server)
    for (const row of this.sql.exec<{ id: number; data: string }>('SELECT id, data FROM rows ORDER BY id')) {
      server.send(JSON.stringify({ t: 'u', id: row.id, d: row.data }))
    }
    server.send(JSON.stringify({ t: 'ready' }))
    this.others(server, JSON.stringify({ t: 'join' }))
    await this.ctx.storage.setAlarm(Date.now() + forgetAfter)
    return new Response(null, { status: 101, webSocket: client })
  }

  async webSocketMessage(socket: WebSocket, raw: string | ArrayBuffer) {
    if (typeof raw !== 'string' || raw.length > largestMessage) return socket.close(1009, 'Message too large')
    let message: Incoming
    try {
      message = JSON.parse(raw) as Incoming
    } catch {
      return socket.close(1003, 'Unreadable message')
    }
    if (typeof message.d !== 'string') return

    if (message.t === 'a') return this.others(socket, JSON.stringify({ t: 'a', d: message.d }))

    if (message.t === 'u') {
      if (this.size() + message.d.length > largestRoom) return socket.send(JSON.stringify({ t: 'full' }))
      const id = this.sql.exec<{ id: number }>('INSERT INTO rows (data) VALUES (?) RETURNING id', message.d).one().id
      this.others(socket, JSON.stringify({ t: 'u', id, d: message.d }))
      await this.ctx.storage.setAlarm(Date.now() + forgetAfter)
      return
    }

    // A client that has replayed the whole history may fold it into one snapshot.
    // Rows newer than what it saw stay, so nothing typed in the meantime is lost.
    if (message.t === 'c' && Number.isInteger(message.upto)) {
      this.ctx.storage.transactionSync(() => {
        this.sql.exec('DELETE FROM rows WHERE id <= ?', message.upto)
        this.sql.exec('INSERT INTO rows (data) VALUES (?)', message.d)
      })
    }
  }

  // 1005 and 1006 only describe how a socket died; they can't be sent back.
  async webSocketClose(socket: WebSocket, code: number) {
    try {
      socket.close(code === 1005 || code === 1006 ? 1000 : code, 'Bye')
    } catch {}
  }

  // A room nobody has touched for a month is forgotten. The draft still lives
  // on in whichever files its writers kept.
  async alarm() {
    if (this.ctx.getWebSockets().length) return this.ctx.storage.setAlarm(Date.now() + forgetAfter)
    await this.ctx.storage.deleteAll()
  }

  private others(sender: WebSocket, message: string) {
    for (const socket of this.ctx.getWebSockets()) {
      if (socket === sender) continue
      try {
        socket.send(message)
      } catch {}
    }
  }

  private size() {
    return this.sql.exec<{ total: number }>('SELECT COALESCE(SUM(LENGTH(data)), 0) AS total FROM rows').one().total
  }
}
