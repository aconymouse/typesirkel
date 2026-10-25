# Security

typeSirkel handles things people care about: their writing, their API keys and their shared drafts. If you find a way any of these could leak or be tampered with, thank you for telling us privately first.

## How to report

Use GitHub's [private vulnerability reporting](https://github.com/aconymouse/typesirkel/security/advisories/new) for this repository, or reach the maintainer at [aconymous.com/chat](https://aconymous.com/chat). Please don't open a public issue.

Include what you found, the steps to reproduce it, and the version or commit you tested. You'll get a reply within a few days, and credit in the release notes if you'd like it.

## What's in scope

- API keys leaving the device for anything other than the provider the writer chose.
- Shared drafts readable by the relay or by anyone without the link, and anything that weakens the encryption in `src/circle/`.
- The relay in `sync/` accepting more than it should.
- The MCP server in `mcp/` reading or writing outside the folder it was given.
- The desktop app reaching files or commands outside what its Tauri capabilities allow.
- Script injection through markdown in the preview or in exported HTML.

## Supported versions

Fixes land on `main` and ship in the next release. Please test against the latest commit when you can.
