import '@fontsource-variable/inter'
import './tokens.css'
import './look.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Desk } from './Desk'
import { onDesktop } from './drawer/tauri'

// The macOS window draws its traffic lights over our sidebar, so we make room.
if (onDesktop()) document.documentElement.dataset.shell = navigator.userAgent.includes('Mac') ? 'mac' : 'desktop'

const root = document.getElementById('root')
if (!root) throw new Error('typeSirkel needs a #root element to live in')

createRoot(root).render(
  <StrictMode>
    <Desk />
  </StrictMode>,
)
