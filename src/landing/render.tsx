import { renderToString } from 'react-dom/server'
import { type Lang, langs } from '../lang'
import { copies } from './copy'
import { Landing } from './Landing'

// Used only at build time: each language gets a page whose markup and head are
// already in place, so crawlers read the right words without running scripts.
export const render = (lang: Lang) => renderToString(<Landing lang={lang} />)

export { copies, langs }
