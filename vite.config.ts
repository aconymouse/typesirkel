import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Tauri serves the app from a fixed port during development and expects
// the dev server to stay quiet about the terminal it shares with cargo.
const host = process.env.TAURI_DEV_HOST

// The download buttons point straight at the installers of the latest published
// release. If GitHub can't be reached, they fall back to the release page.
const releases = 'https://github.com/aconymouse/typesirkel/releases/latest'
const installers = { mac: /\.dmg$/, windows: /-setup\.exe$/, linux: /\.AppImage$/ }

const latestInstallers = async (live: boolean) => {
  const fallback = Object.fromEntries(Object.keys(installers).map((system) => [system, releases]))
  if (!live) return fallback
  try {
    const token = process.env.GITHUB_TOKEN
    const response = await fetch('https://api.github.com/repos/aconymouse/typesirkel/releases/latest', {
      headers: { accept: 'application/vnd.github+json', ...(token && { authorization: `Bearer ${token}` }) },
      signal: AbortSignal.timeout(8000),
    })
    if (!response.ok) return fallback
    const { assets } = (await response.json()) as { assets: { name: string; browser_download_url: string }[] }
    return Object.fromEntries(
      Object.entries(installers).map(([system, pattern]) => [system, assets.find((asset) => pattern.test(asset.name))?.browser_download_url ?? releases]),
    )
  } catch {
    return fallback
  }
}

export default defineConfig(async ({ command, isSsrBuild }) => ({
  plugins: [react()],
  define: { __DOWNLOADS__: JSON.stringify(await latestInstallers(command === 'build')) },
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host ? { protocol: 'ws', host, port: 1421 } : undefined,
    watch: { ignored: ['**/src-tauri/**'] },
  },
  envPrefix: ['VITE_', 'TAURI_ENV_'],
  build: {
    target: 'es2023',
    sourcemap: !!process.env.TAURI_ENV_DEBUG,
    // CodeMirror and highlight.js are most of the weight, and both are needed on first paint.
    chunkSizeWarningLimit: 1000,
    // Two doors into the same house: the landing page and the editor itself.
    // The server build only renders the landing page for scripts/locales.mjs.
    rolldownOptions: isSsrBuild
      ? undefined
      : {
          input: {
            landing: fileURLToPath(new URL('./index.html', import.meta.url)),
            write: fileURLToPath(new URL('./write/index.html', import.meta.url)),
          },
        },
  },
}))
