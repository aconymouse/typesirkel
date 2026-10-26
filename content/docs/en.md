---
title: typeSirkel documentation
description: How to use typeSirkel: open a folder, write in markdown, use the slash menu and shortcuts, connect your AI in Quill, share a draft and plug in MCP.
---

## Getting started {#start}

typeSirkel runs in two places, and both are the same app.

- **In the browser** at [sirkel.asia/write](/write/). Nothing to install.
- **On your desktop** for macOS 11 or newer, Windows 10 or newer and Linux (AppImage or .deb), from the [releases page](https://github.com/aconymouse/typesirkel/releases).

The first time you open it, you land in **Scratch**, a small notebook kept in your browser. It's fine for quick notes. For real work, press **Open folder** at the bottom of the sidebar and pick a folder on your disk. Every note in it becomes a plain `.md` file that any other app can read.

Opening a whole folder in the browser needs a Chromium-based browser such as Chrome, Edge, Brave or Arc. Safari and Firefox open one file at a time.

### Opening the desktop app {#first-open}

typeSirkel is a one-person open source project, and it isn't signed with a paid Apple Developer certificate yet. So the first time you open it on a Mac, macOS says it was "Not Opened" because Apple couldn't verify it. That's expected, and the full source code is on [GitHub](https://github.com/aconymouse/typesirkel) if you want to check it.

1. Open the `.dmg` and drag typeSirkel into Applications.
2. Open typeSirkel. When the warning appears, click **Done**.
3. Go to **System Settings → Privacy & Security** and scroll down to Security.
4. Next to "typeSirkel was blocked to protect your Mac", click **Open Anyway**.
5. Click **Open Anyway** again and confirm with Touch ID or your password.

You only do this once. After that it opens like any other app.

On Windows, if SmartScreen shows "Windows protected your PC", click **More info**, then **Run anyway**.

## Writing {#writing}

Write in plain markdown. typeSirkel saves on its own a moment after you stop typing, and the dot at the bottom left tells you when it's done.

At the bottom of the window you can switch between three views:

- **Write** shows only the editor.
- **Split** shows the editor and the preview side by side, scrolling together.
- **Read** shows only the preview.

**Quiet** hides everything except your words. Press it again, or **Cmd/Ctrl + .**, to bring the rest back.

Press **+** next to the file list to start a new note. Notes are listed by folder, and the one you're in is marked.

## The slash menu {#slash}

Type `/` at the start of a line, or after a space, to open a menu of formats. Keep typing to filter it, for example `/h2`, `/quote` or `/todo`, then press Enter. Each entry shows the markdown it writes, so you pick up the syntax as you go.

| Format | Markdown |
| --- | --- |
| Heading 1, 2, 3 | `#`, `##`, `###` |
| Bold, italic, strikethrough | `**text**`, `*text*`, `~~text~~` |
| Bulleted list, numbered list, task | `-`, `1.`, `- [ ]` |
| Quote | `>` |
| Link, image | `[text](url)`, `![alt](url)` |
| Inline code, code block | `` `code` ``, ```` ``` ```` |
| Table, divider | `| a | b |`, `---` |

When a format has a blank to fill in, like a link's text and address, press Tab to jump to the next one.

## Shortcuts {#shortcuts}

| Keys | Does |
| --- | --- |
| `/` | Format menu |
| Cmd/Ctrl + S | Save now |
| Cmd/Ctrl + O | Open a folder |
| Cmd/Ctrl + B, I, E | Bold, italic, inline code |
| Cmd/Ctrl + K | Link |
| Cmd/Ctrl + F | Find |
| Cmd/Ctrl + 1, 2, 3 | Write, Split, Read |
| Cmd/Ctrl + J | Quill |
| Cmd/Ctrl + Shift + D | Dictate |
| Cmd/Ctrl + . | Quiet mode |
| Cmd/Ctrl + P | Print or save as PDF |

## Dictation {#dictate}

Press the microphone at the bottom right, or **Cmd/Ctrl + Shift + D**, and start talking. Your words appear at the cursor as you speak, which is handy for catching the gist of a meeting and tidying it up later, by hand or with Quill. Pick the language you're speaking in the small bar at the bottom, and press **Stop** when you're done.

Dictation uses the speech recognition built into your browser, so it needs an internet connection, and your browser sends the audio to its own speech service. It works in Chrome, Edge and Safari. The microphone button only shows up where dictation is available.

## The outline {#outline}

Every heading in your note becomes a stop on the trail under **On this page** in the sidebar. As you write or scroll, the little marker walks to the section you're in. Click any stop to jump there.

You can drag the thin lines between the sidebar sections to give each one more or less room. Double-click a line to reset them.

## Quill, your AI {#quill}

Quill is the writing assistant inside typeSirkel. Open it with **Cmd/Ctrl + J**, or the **Quill** button at the bottom right. You bring your own key, and it never leaves your device except to reach your provider.

### Connecting a provider

- **Anthropic** for Claude. Create a key in the [Claude Console](https://platform.claude.com/settings/keys).
- **OpenAI** for ChatGPT. Create a key on the [OpenAI API keys page](https://platform.openai.com/api-keys).
- **OpenRouter** for hundreds of models, Gemini included. Create a key at [openrouter.ai/keys](https://openrouter.ai/keys).
- **Ollama** for models on your own machine, with no key at all. In the browser, start it with `OLLAMA_ORIGINS=https://sirkel.asia ollama serve`.
- **Other** for any service that speaks the OpenAI chat format. Paste its base URL and key.

Pick the provider, paste the key, and choose a model from the list. The desktop app keeps keys in your system keychain. In the browser a key lasts until you close the tab, unless you tick **Remember on this device**.

### Asking for help

Select a passage, or leave the cursor in a paragraph, and pick an action: continue, tighten, fix, summarize or translate. You see the answer first, then choose **Replace**, **Insert** or **Replace all**. You can also just ask, in your own words, and keep the conversation going.

### Writing many files at once

With a folder open, **Brief** lets you describe a piece of work, review the plan of files Quill suggests, remove the ones you don't want, and let it write them one by one. It never overwrites an existing file.

## Prompts {#prompts}

**Prompts** in the sidebar is a shelf of ready-made instructions: horror, fantasy, straight news, a rewrite that never touches quotes or names, SEO articles, tutorials and storyboards. The small tag beside the title switches the shelf between languages.

Click a prompt to read it. **Copy** puts it on your clipboard for any AI. **Use in Quill** pins it as the style for everything Quill writes, until you clear it.

## Writing together {#share}

Press **Share**, then **Start sharing**. Anyone with the link can edit the draft with you and see where everyone is typing. If the draft is a file from your folder, their changes land in your file as they type.

Shared drafts are end-to-end encrypted. The key sits after the `#` in the link, which browsers never send to a server, so the relay only passes along bytes it can't read. Up to 24 people can join one link. A room nobody touches for 30 days is deleted. Each time you share, you get a new link, and moving to another file ends the share.

## MCP for AI agents {#mcp}

typeSirkel comes with a small MCP server that lets Claude Desktop, Claude Code, Cursor or any other MCP client list, read, search, outline and write the notes in one folder, and nowhere else. The desktop app picks up their edits as they land.

Until the package is published, build it from the repository:

```bash
git clone https://github.com/aconymouse/typesirkel
cd typesirkel/mcp
pnpm install && pnpm build
```

Then point your client at it, for example in Claude Desktop's config:

```json
{
  "mcpServers": {
    "typesirkel": {
      "command": "node",
      "args": ["/path/to/typesirkel/mcp/dist/index.js", "/Users/you/Notes"]
    }
  }
}
```

## Export {#export}

**Export** at the bottom right gives you a clean standalone HTML page, a PDF through your print dialog, or a copy of the markdown. Your notes are already plain files, so there's nothing else to export.

## Still stuck? {#help}

Ask in [GitHub issues](https://github.com/aconymouse/typesirkel/issues), or ping Aco at [aconymous.com/chat](https://aconymous.com/chat).
