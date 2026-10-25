import { onDesktop } from '../drawer/tauri'

// On the desktop, requests leave through Rust instead of the webview, so a
// provider that refuses browser origins still answers. In the browser we use
// plain fetch and let the provider's CORS policy decide.
export const reach = async (input: string, init: RequestInit): Promise<Response> => {
  if (onDesktop()) {
    const { fetch } = await import('@tauri-apps/plugin-http')
    return fetch(input, init)
  }
  return fetch(input, init)
}
