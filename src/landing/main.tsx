import '@fontsource-variable/inter'
import '../tokens.css'
import './landing.css'
import '../site/site.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { SitePage } from '../site/SitePage'
import { whereAt } from '../site/pages'

const root = document.getElementById('root')
if (!root) throw new Error('The landing page needs a #root element')

const { lang, page } = whereAt(window.location.pathname)

createRoot(root).render(
  <StrictMode>
    <SitePage lang={lang} page={page} />
  </StrictMode>,
)
