# Contributing to typeSirkel

Thanks for wanting to help. typeSirkel is a small, calm markdown editor, and it stays that way because every change is weighed against one question: does this make writing feel better, or just busier?

## Ways to help

- **Report a bug.** Open an [issue](https://github.com/aconymouse/typesirkel/issues/new/choose) with what you did, what you expected and what happened instead.
- **Suggest an idea.** Describe the problem you ran into before the feature you have in mind. The best ideas often turn out smaller than they first looked.
- **Add or improve a prompt.** Prompts live in [`prompts/`](prompts/). See [Prompts](#prompts) below.
- **Translate.** The site, the welcome tour and the prompt shelf speak six languages, and more are welcome. See [Translations](#translations).
- **Write code.** Fix a bug, polish a corner, or pick up an issue labelled `good first issue`.

For anything bigger than a small fix, open an issue first so we can agree on the shape before you spend an evening on it.

## Setting up

You need Node.js 22 or newer and pnpm. For the desktop app you also need Rust and the [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/) for your system.

```bash
git clone https://github.com/aconymouse/typesirkel
cd typesirkel
pnpm install
pnpm dev            # browser edition at http://localhost:1420
pnpm tauri dev      # desktop app with live reload
```

The README has a map of the code. Files are named after things on a writing desk: `Desk`, `Sheet`, `Proof`, `Shelf`, `Lookout`, `Quill`.

## What we care about

- **Plain files.** Notes are `.md` files on the writer's own disk. Nothing should lock them in.
- **No accounts, no tracking.** typeSirkel has no sign-in and sends no analytics. API keys stay on the device and go only to the provider the writer chose.
- **A quiet interface.** No helper text that lectures, no settings page to explain a feature. If something needs a manual, it probably wants to be simpler first.
- **Small and readable code.** Someone new should understand a file in one sitting.

## Code style

- TypeScript in strict mode, React function components, CodeMirror 6 for the editor.
- Use current, non-deprecated APIs. Don't add a dependency without talking about it in an issue first.
- Comments explain why, not what. Leave out comments that repeat the code.
- Colors, radii and fonts come from the tokens in `src/tokens.css`. Lime is for hover and active states.
- The editor's interface is in English. Words people read on the site, in the tour and in prompts are translated.

## Before you open a pull request

1. `pnpm check` passes with no type errors.
2. `pnpm build` passes.
3. You tried the change in the browser, and in the desktop app if you touched `src-tauri/` or anything file-related. For Rust changes, run `cargo check` in `src-tauri/`.
4. Interface changes come with a screenshot or a short clip, in light and dark.
5. The pull request does one thing. Two unrelated fixes are two pull requests.

## Pull requests

- Branch from `main` and keep the branch up to date by rebasing.
- Fill in the template: what changed, why, and how you tested it. Link the issue it closes.
- Commit messages are short and in the imperative, in English: `fix outline jump on the last heading`, `add Korean storyboard prompt`. No need for prefixes or long bodies; the pull request carries the story.
- If an AI helped you write the change, that's fine. Read and understand every line before you submit it; you're the one answering review questions.
- Pull requests are usually squashed when merged.

## Prompts

Each prompt is a markdown file in `prompts/` with front matter:

```markdown
---
title: Straight news
category: News
description: One line on what it does and when to use it.
---

The instructions themselves, written for the model.
```

The English file is the original, `straight-news.md`. Translations sit next to it as `straight-news.<lang>.md`, for example `straight-news.ko.md`. Keep instructions concrete, and end with the line that tells the model to write in the language of the draft.

## Translations

The languages are listed in `src/lang.ts`: English, Indonesian, Brazilian Portuguese, Korean, Thai and Simplified Chinese. To improve a translation, edit the file and open a pull request. To add a language, these are the places it lives:

| File | What it holds |
| --- | --- |
| `src/lang.ts` | The language list, its route and its short label |
| `src/landing/copy.ts` | Every word on the home page and the site navigation |
| `content/about/<lang>.md`, `content/faq/<lang>.md`, `content/docs/<lang>.md` | The about, FAQ and docs pages |
| `src/guides.ts` | The welcome tour and the two guides that type themselves in the editor |
| `prompts/<id>.<lang>.md` | The prompt shelf |
| `scripts/locales.mjs` | The `og:locale` for the new language |

A few rules keep translations working:

- Keep heading ids such as `{#quill}` exactly as they are, so links to a section work in every language.
- Keep the editor's own button names in English and in bold, like **Open folder** or **Use in Quill**, because that's what people see on screen.
- Point internal links at the same language, for example `/ko/docs/` in the Korean files.
- Keep the page `description` under 160 characters.
- Write the way a person from that language would say it. Natural beats literal.

## Reporting security issues

Please don't open a public issue for a security problem. See [SECURITY.md](SECURITY.md).

## Code of conduct

Be kind and assume good intent. The full text is in [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## License

By contributing, you agree that your contributions are released under the [MIT License](LICENSE).
