import '@fontsource-variable/inter'
import './tokens.css'
import './look.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Desk } from './Desk'
import { onDesktop } from './drawer/tauri'
import { chooseLang, langs } from './lang'

// The macOS window draws its traffic lights over our sidebar, so we make room.
if (onDesktop()) document.documentElement.dataset.shell = navigator.userAgent.includes('Mac') ? 'mac' : 'desktop'

// Arriving from a landing page in some language carries that language over,
// then the address is tidied so a reload does not keep forcing it.
const address = new URL(window.location.href)
const asked = langs.find((l) => l.id.toLowerCase() === address.searchParams.get('lang')?.toLowerCase())
if (asked) {
  chooseLang(asked.id)
  address.searchParams.delete('lang')
  history.replaceState(null, '', address.pathname + address.search + address.hash)
}

const root = document.getElementById('root')
if (!root) throw new Error('typeSirkel needs a #root element to live in')

createRoot(root).render(
  <StrictMode>
    <Desk />
  </StrictMode>,
)
