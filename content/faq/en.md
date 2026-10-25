---
title: typeSirkel FAQ
description: Answers about typeSirkel, the free markdown editor: where notes are stored, which AI you can use, how sharing stays private, and how to help.
kicker: FAQ
---

## Is typeSirkel free? {#free}
Yes. typeSirkel is free and open source under the MIT license. There is no paid plan, no account and no trial. If you use AI inside it, you pay your AI provider directly with your own key.

## Where are my notes stored? {#storage}
On your own disk. When you open a folder, every note is a plain `.md` file in that folder, readable by any other app. Notes in Scratch live in your browser's storage until you move them into a folder, so they stay on that one browser.

## Do I need an account? {#account}
No. Open the editor and start writing. Nothing asks you to sign up or sign in.

## Does it work offline? {#offline}
The desktop app works fully offline. The web editor needs a connection to load, then keeps working on your files. AI needs the internet, unless you run a local model with Ollama.

## Which AI can I use? {#ai}
Claude through Anthropic, ChatGPT through OpenAI, hundreds of models including Gemini through OpenRouter, local models through Ollama, and any service that speaks the OpenAI chat format. The [docs](/docs/#quill) walk through each one.

## Is my API key safe? {#keys}
Your key stays on your device. The desktop app keeps it in your system keychain. In the browser it lasts until you close the tab, unless you tick **Remember on this device**. Requests go straight to your provider, with no typeSirkel server in between.

## Is writing together private? {#sharing}
Yes. Shared drafts are end-to-end encrypted. The key lives in the part of the link after the `#`, which browsers never send to a server, so the relay only passes along bytes it cannot read. Up to 24 people can join one link, and a room nobody touches for 30 days is deleted.

## Which browsers can open a folder? {#browsers}
Chromium-based browsers such as Chrome, Edge, Brave and Arc can open a whole folder. Safari and Firefox open one file at a time. The desktop app opens folders everywhere.

## Can I use it on my phone? {#phone}
Yes, in the browser. On a phone you write in Scratch or open a single file, and the sidebar sits behind the menu button at the top.

## How can I help? {#help}
Star the project on [GitHub](https://github.com/aconymouse/typesirkel), report bugs, suggest a prompt, translate a page, or send a pull request. The [contributing guide](https://github.com/aconymouse/typesirkel/blob/main/CONTRIBUTING.md) explains how.

## Who makes typeSirkel? {#maker}
[Hafidz Nc](https://aconymous.com), also known as Aco. You can read why on the [about page](#top), or say hello at [aconymous.com/chat](https://aconymous.com/chat).
