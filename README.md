# Ingester

An Obsidian plugin that watches a folder for new clippings and automatically triggers Claude Code's `/ingest` skill.

https://github.com/user-attachments/assets/90a5f6c5-6be5-4d86-a85c-ad9765efc7cc

## How It Works

1. **Obsidian Web Clipper** is used to save an article to e.g `raw/clippings/`
2. Plugin detects the new file
3. Opens a new tmux window and runs `claude "/ingest <path>"`
4. Claude Code processes the source into your wiki knowledge graph

## Requirements

- [Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code) installed and in PATH
- tmux running in your terminal
- zsh shell (macOS default; Linux users may need to install)
- The `/ingest` skill defined at `.claude/skills/ingest/SKILL.md` in your vault (see `skills/` folder in this repo)

## Installation

1. Copy `main.js`, `manifest.json`, and `styles.css` to `.obsidian/plugins/ingester/`
2. Enable "Ingester" in Settings > Community Plugins
3. Configure the watch folder in plugin settings
4. Copy `skills/ingest/SKILL.md` to `.claude/skills/ingest/SKILL.md` in your vault

## Settings

| Setting | Default | Description |
|---------|---------|-------------|
| Watch Folder | `raw/clippings` | Folder to monitor for new files |
| Auto-ingest | `true` | Automatically run `/ingest` when new files are detected |

> **Note:** The included `/ingest` skill expects sources in `raw/clippings/`. If you change the watch folder, update the path references in `SKILL.md` to match.

## Disclosures

**Account required**: This plugin requires [Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code), which requires an Anthropic account and API access.

**Network use**: The plugin itself makes no network requests. However, when it invokes Claude Code, Claude Code connects to Anthropic's API servers to process your content. See [Anthropic's Privacy Policy](https://www.anthropic.com/privacy) for details on data handling.

**External program execution**: This plugin executes external programs (`tmux` and `claude`) via Node.js `child_process`. It does not access files outside your Obsidian vault directly, but the invoked Claude Code session operates within your vault directory.

**Desktop only**: Requires desktop Obsidian due to dependency on system shell commands.

## Development

```bash
npm install
npm run dev    # Watch mode
npm run build  # Production build
```
