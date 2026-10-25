import '@fontsource-variable/inter'
import '../tokens.css'
import './landing.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Landing } from './Landing'

const root = document.getElementById('root')
if (!root) throw new Error('The landing page needs a #root element')

createRoot(root).render(
  <StrictMode>
    <Landing />
  </StrictMode>,
)
