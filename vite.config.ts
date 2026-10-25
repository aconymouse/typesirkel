import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Tauri serves the app from a fixed port during development and expects
// the dev server to stay quiet about the terminal it shares with cargo.
const host = process.env.TAURI_DEV_HOST

export default defineConfig({
  plugins: [react()],
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
    rolldownOptions: {
      input: {
        landing: fileURLToPath(new URL('./index.html', import.meta.url)),
        write: fileURLToPath(new URL('./write/index.html', import.meta.url)),
      },
    },
  },
})
