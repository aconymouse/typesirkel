# typeSirkel relay

The server behind shared drafts. One Cloudflare Durable Object per room keeps an ordered list of sealed updates, hands them to whoever joins, and forwards new ones to everyone else in the room. It never receives the key, so it cannot read a draft.

## Run it locally

```bash
pnpm install
pnpm dev                                   # relay on ws://localhost:8787
VITE_SIRKEL_SYNC=ws://localhost:8787 pnpm dev   # from the repo root, in another terminal
```

## Deploy

```bash
pnpm install
pnpm wrangler login
pnpm run deploy
```

`wrangler.jsonc` attaches the Worker to `sync.sirkel.asia` as a custom domain, which needs the `sirkel.asia` zone in the same Cloudflare account. Change the route if you run your own relay, and point the editor at it with `VITE_SIRKEL_SYNC` at build time.

## Limits

A message can be up to 512 KB and a room up to 16 MB of sealed history. Clients fold long histories into a single snapshot when they join. A room nobody connects to for 30 days is deleted.
