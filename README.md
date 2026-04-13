# Vaulty Ingest

An Obsidian plugin that watches a folder for new clippings and automatically triggers Claude Code's `/ingest` skill.

https://github.com/user-attachments/assets/90a5f6c5-6be5-4d86-a85c-ad9765efc7cc

## How It Works

1. The user will uses **Obsidian Web Clipper** to save an article to e.g `raw/clippings/`
2. Plugin detects the new file
3. Opens a new tmux window and runs `claude "/ingest <path>"`
4. Claude Code processes the source into your wiki knowledge graph

## Requirements

- [Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code) installed and in PATH
- tmux running in your terminal
- The `/ingest` skill defined at `.claude/skills/ingest/SKILL.md` in your vault

## Installation

1. Copy `main.js`, `manifest.json`, and `styles.css` to `.obsidian/plugins/vaulty-ingest/`
2. Enable "Vaulty Ingest" in Settings > Community Plugins
3. Configure the watch folder in plugin settings

## Settings

| Setting | Default | Description |
|---------|---------|-------------|
| Watch Folder | `raw/clippings` | Folder to monitor for new files |
| Auto-ingest | `true` | Automatically run `/ingest` when new files are detected |

## Development

```bash
npm install
npm run dev    # Watch mode
npm run build  # Production build
```
