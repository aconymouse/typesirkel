import { hand } from './drawer'

// A standalone page that reads well with no app around it.
const sheetStyle = `
:root{color-scheme:light dark;--ink:#16161a;--paper:#fdfdfc;--muted:#5d5d66;--line:#e4e4e0;--code-bg:#f3f3f0}
@media (prefers-color-scheme:dark){:root{--ink:#ececea;--paper:#141416;--muted:#a1a1a8;--line:#2a2a2e;--code-bg:#1d1d20}}
*{box-sizing:border-box}
body{margin:0;background:var(--paper);color:var(--ink);font:17px/1.75 Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif}
main{max-width:68ch;margin:0 auto;padding:64px 24px 96px}
h1,h2,h3,h4{line-height:1.25;margin:2em 0 .6em}
h1{font-size:2em;margin-top:0}
a{color:inherit;text-underline-offset:3px}
blockquote{margin:1.5em 0;padding-left:1em;border-left:2px solid var(--line);color:var(--muted)}
code{font:.9em ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;background:var(--code-bg);padding:.1em .35em;border-radius:3px}
pre{background:var(--code-bg);padding:16px;overflow:auto}
pre code{background:none;padding:0}
table{border-collapse:collapse;width:100%}
th,td{border-bottom:1px solid var(--line);padding:6px 8px;text-align:left}
img{max-width:100%}
hr{border:0;border-top:1px solid var(--line);margin:2.5em 0}
`

const escape = (text: string) => text.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c] ?? c)

export const pressHtml = (title: string, body: string, fileName: string) => {
  const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="generator" content="typeSirkel">
<title>${escape(title)}</title>
<style>${sheetStyle}</style>
</head>
<body>
<main>
${body}
</main>
</body>
</html>
`
  return hand(fileName.replace(/\.[^.]+$/, '') + '.html', page, 'text/html', 'HTML', ['html'])
}

export const pressMarkdown = (text: string, fileName: string) => hand(fileName, text, 'text/markdown', 'Markdown', ['md'])

// The print stylesheet hides everything except the proof, so the system
// print dialog doubles as "save as PDF" on every platform.
export const pressPdf = () => window.print()
