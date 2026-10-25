<p align="center"><img src="art/icon.png" width="96" alt=""></p>

<h1 align="center">typeSirkel</h1>

<p align="center">A quiet markdown editor for people who write in folders.</p>

---

typeSirkel opens a folder of `.md` files and gets out of the way. You write on the left, read on the right, and a small eye walks down the outline as you move through your headings. Files stay plain markdown on your own disk. There are no accounts, no sync service and nothing to migrate away from later.

It runs in the browser and as a desktop app for macOS and Windows. Both are the same code; only the way files are opened and saved changes.

## What it does

- Opens a whole folder and lists every markdown file in it, nested folders included
- Writes with a proper editor: syntax highlighting, fenced code in many languages, search, multiple cursors
- Shows a live preview side by side, or either one on its own
- Saves on its own a moment after you stop typing
- Follows you through the document with the lookout, an outline with an eye that travels to the heading you are in
- Exports a clean standalone HTML page, or prints to PDF
- Light and dark, following the system unless you say otherwise

## Shortcuts

| Keys | Does |
| --- | --- |
| Cmd/Ctrl + S | Save now |
| Cmd/Ctrl + O | Open a folder |
| Cmd/Ctrl + B / I / E | Bold, italic, inline code |
| Cmd/Ctrl + K | Link |
| Cmd/Ctrl + F | Find |
| Cmd/Ctrl + 1 / 2 / 3 | Write, split, read |
| Cmd/Ctrl + . | Quiet mode |
| Cmd/Ctrl + P | Print or save as PDF |

## Download

Builds for macOS and Windows show up on the [releases page](https://github.com/aconymouse/typesirkel/releases). The browser edition runs at [aconymouse.github.io/typesirkel](https://aconymouse.github.io/typesirkel/). Opening whole folders in the browser needs a Chromium based browser; elsewhere it opens one file at a time.

The macOS build is not notarized yet. The first time, right-click the app and choose Open.

## Building it yourself

You need Node.js 22 or newer with pnpm, and for the desktop app, Rust plus the [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/) for your system.

```bash
pnpm install
pnpm dev            # browser edition at http://localhost:1420
pnpm tauri dev      # desktop app with live reload
pnpm tauri build    # installers in src-tauri/target/release/bundle
```

## Finding your way around

The code is small and named after things on a writing desk.

| File | What lives there |
| --- | --- |
| `src/Desk.tsx` | The room everything sits in: open files, saving, modes, shortcuts |
| `src/Sheet.tsx`, `src/sheet.ts` | The editor, built on CodeMirror 6 |
| `src/Proof.tsx` | The rendered preview, like a printer's proof |
| `src/Shelf.tsx` | The file list on the left |
| `src/Lookout.tsx` | The outline on the right and the eye on its trail |
| `src/ink.ts` | Markdown to HTML, headings and word counts |
| `src/press.ts` | Exports |
| `src/drawer/` | Where files live: browser folders, single files, the desktop filesystem, or scratch |
| `src-tauri/` | The thin desktop shell |

## Contributing

Issues and pull requests are welcome. Keep changes small and the interface calm; if a feature needs a settings page to explain it, it probably wants to be simpler first.

## License

MIT
