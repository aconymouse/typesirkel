# typesirkel-mcp

An MCP server that gives an AI client one folder of markdown, the same folder you keep open in [typeSirkel](https://sirkel.asia).

```bash
npx -y typesirkel-mcp /path/to/your/notes
```

## Tools

| Tool | Does |
| --- | --- |
| `list_notes` | Every markdown file in the folder |
| `read_note` | One file |
| `outline_note` | A file's headings with line numbers |
| `search_notes` | Lines containing some words, across the folder |
| `write_note` | Create a file or replace its content |
| `append_to_note` | Add to the end of a file |

Paths are relative to the folder, and anything that would leave it is refused. Only `.md`, `.markdown`, `.mdx` and `.txt` files are touched.

## Claude Desktop

```json
{
  "mcpServers": {
    "typesirkel": {
      "command": "npx",
      "args": ["-y", "typesirkel-mcp", "/Users/you/Notes"]
    }
  }
}
```

## Claude Code

```bash
claude mcp add typesirkel -- npx -y typesirkel-mcp /Users/you/Notes
```
